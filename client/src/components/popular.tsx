import { Link } from "react-router-dom";
import { getRandomHospitals } from "@/services/api";
import { Hospital } from "@/services/hospitalTypes";
import { Avatar } from "@/components/avatar";
import HospitalPic from "@/assets/images/hospital.png";
import style from "./style/popular.module.css";
import { useEffect, useState } from "react";

const PopularHospitals = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchRandomHospitals = async () => {
      try {
        const response = await getRandomHospitals();
        setHospitals(response);
      } catch (err: any) {
        if (err.data) {
          setError(err.message);
        } else if (err.request) {
          setError("Server did not respond");
        } else {
          setError(err.message);
        }
      }
    };

    fetchRandomHospitals();
  }, []);

  return (
    <div className={style.container}>
      <h1 className={style.heading}>Popular Hospitals</h1>
      <div className={style.wrapper}>
        {hospitals.map((hospital, id) => (
          <div className={style.card} key={id}>
            <div className={style.img}>
              <Avatar
                image={HospitalPic}
                alt="Hospital Photo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div className={style.details}>
              <h3 className={style.name}>{hospital.name}</h3>
              <p className={style.address}>{hospital.address.street}</p>
              <Link to={`${hospital.name}`} className={style.btn}>
                View Hospital
              </Link>
            </div>
          </div>
        ))
        }
        {error && <p className={style.error}>{error}</p>}
      </div >
    </div >
  );
}

export default PopularHospitals;
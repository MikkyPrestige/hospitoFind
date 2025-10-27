import { Link } from "react-router-dom";
import { getRandomHospitals } from "@/services/api";
import { Hospital } from "@/services/hospital";
import { Avatar } from "@/components/avatar";
import HospitalPic from "@/assets/images/hospital-logo.jpg";
import style from "./style/popular.module.css";
import { useEffect, useState } from "react";
import Motion from "@/components/motion";
import { fadeUp, sectionReveal } from "@/hooks/animations";

const PopularHospitals = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchRandomHospitals = async () => {
      try {
        const response = await getRandomHospitals();
        setHospitals(response);
      } catch (err: any) {
        if (err.data) setError(err.message);
        else if (err.request) setError("We couldn’t connect to the server. Please try again later.");
        else setError(err.message);
      }
    };
    fetchRandomHospitals();
  }, []);

  return (
    <Motion
      variants={sectionReveal}
      className={style.container}
      initial="hidden"
      animate="visible"
    >
      <Motion variants={fadeUp}>
        <h1 className={style.heading}>Discover Top Hospitals on HospitoFind</h1>
        <p className={style.subtitle}>
          Explore trusted hospitals near you, view their details, and find quality care faster.
        </p>
      </Motion>

      <Motion variants={sectionReveal} className={style.wrapper}>
        {hospitals.map((hospital, id) => (
          <Motion key={id} variants={fadeUp} className={style.card}>
            <div className={style.img}>
              <Avatar
                image={hospital.photoUrl || HospitalPic}
                alt="hospital"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "1.2rem",
                  objectFit: "cover",
                }}
              />
            </div>
            <div className={style.details}>
              <h3 className={style.name}>{hospital.name}</h3>
              <p className={style.address}>
                {hospital.address?.street}, {hospital.address?.city}
              </p>
              <Link to={`${hospital._id}`} className={style.btn}>
                Explore Hospital
              </Link>
            </div>
          </Motion>
        ))}
        {error && <p className={style.error}>{error}</p>}
      </Motion>
    </Motion>
  );
};

export default PopularHospitals;
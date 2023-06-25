import { Hospital } from "@/services/hospitalTypes";
import { Avatar } from "../avatar";
import HospitalPic from "../../../public/images/hospital.png";
import style from "./style/hospitalInfo/info.module.scss";
import { MdSavedSearch } from "react-icons/md";
import { Button } from "../button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHospitalByName } from "@/services/api";
import { Link } from "react-router-dom";

const HospitalInfo = () => {
  const { name } = useParams();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        const response = await getHospitalByName(name);
        setHospital(response);
      } catch (err) {
        setError("Error fetching hospital details:", err.message);
      }
    };

    fetchHospitalDetails();
  }, [name]);

  if (!hospital) {
    return <p>Loading hospital details...</p>;
  }

  return (
    <div className={style.hospital}>
      <div className={style.image}>
        <Avatar image={HospitalPic} alt="hospital" />
      </div>
      <div>
        <div className={style.details}>
          <h2 className={style.name}>{hospital.name}</h2>
          <h3>{hospital.address.street}</h3>
          <h3>{hospital.address.city}</h3>
          <h3>{hospital.address.state}</h3>
          <h4>{hospital.phoneNumber}</h4>
          <h4>{hospital.website}</h4>
          <h4>{hospital.email}</h4>
          <h4>{hospital.type}</h4>
          <div>
            <h5>Services:</h5>
            <ul>{hospital.services.map((service: string, id: number) => (
              <li key={id}> <span>{service}</span></li>
            ))}</ul>
          </div>
          <div>
            <h5>Comments:</h5>
            <ul>{hospital.comments.map((comment: string, id: number) => (
              <li key={id}><span>{comment}</span></li>
            ))}</ul>
          </div>
          <ul>{hospital.hours.map((hour: any, id: number) => (
            <li key={id}>
              <h6>{hour.day}:</h6> <span>{hour.open}</span>
            </li>
          ))}</ul>
        </div>
        <Button children={<>Save <MdSavedSearch /></>} />
      </div>
      {error && <p>{error}</p>}
      <Link to="/dashboard">Back</Link>
    </div>
  );
}

export default HospitalInfo;
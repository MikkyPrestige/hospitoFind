import { Hospital } from "@/services/hospitalTypes";
import { Avatar } from "@/components/avatar";
import HospitalPic from "@/assets/images/hospital-logo.jpg";
import style from "./style/info/info.module.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHospitalByName } from "@/services/api";
import { useNavigate } from "react-router-dom";

const HospitalInfo = () => {
  const { name } = useParams();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      if (name) {
        try {
          const response = await getHospitalByName(name);
          setHospital(response);
        } catch (err: any) {
          if (err.data) {
            setError(err.message);
          } else if (err.request) {
            setError('Server did not respond');
          } else {
            setError(err.message);
          }
        } finally {
          console.log("done");
        }
      }
    };

    fetchHospitalDetails();
  }, [name]);

  if (!hospital) {
    return <p>Loading hospital details...</p>;
  }

  return (
    <div className={style.hospital}>
      <h1 className={style.heading}>More about <span className={style.heading_span}>{hospital.name}</span></h1>
      <div className={style.wrapper}>
        <div className={style.img}>
          {hospital?.photoUrl ? (
            <Avatar image={hospital.photoUrl} alt="hospital" style={{ width: "100%", height: "100%", borderRadius: "1.2rem", objectFit: "cover" }} />
          ) : (
            <Avatar image={HospitalPic} alt="hospital" style={{ width: "100%", height: "100%", borderRadius: "1.2rem", objectFit: "cover" }} />)}
        </div>
        <div className={style.details}>
          <h2 className={style.title}>{hospital.name}</h2>

          {hospital.address.street && (
            <h3 className={style.title}>{hospital.address.street}</h3>
          )}
          {hospital.address.city && (
            <h3 className={style.title}>{hospital.address.city}</h3>
          )}

          {hospital.address.state && (
            <h3 className={style.title}>{hospital.address.state}</h3>
          )}

          {hospital.phoneNumber && (
            <h4 className={style.title}><a
              href={`tel:${hospital.phoneNumber}`}
              target="_blank"
              rel="noreferrer"
            >{hospital.phoneNumber}</a></h4>
          )}
          {hospital.website && (
            <h4 className={style.title}><a href={hospital.website} target="_blank" rel="noreferrer">{hospital.website}</a></h4>
          )}
          {hospital.email && (
            <h4 className={style.title}><a
              href={`mailto:${hospital.email}?subject=Hello ${hospital.name}!`}
              target="_blank"
              rel="noreferrer"
            >{hospital.email}</a></h4>
          )}
          {hospital.type && (
            <h4 className={style.title}>{hospital.type}</h4>
          )}
          {hospital.services && (
            <div className={style.service}>
              <h5 className={style.service_title}>Services:</h5>
              <ul className={style.list}>{hospital.services.map((service: string, id: number) => (
                <li key={id} className={style.item}>{service}</li>
              ))}</ul>
            </div>
          )}
          {hospital.comments && (
            <div className={style.service}>
              <h5 className={style.service_title}>Comments:</h5>
              <ul className={style.list}>{hospital.comments.map((comment: string, id: number) => (
                <li key={id} className={style.item}>{comment}</li>
              ))}</ul>
            </div>
          )}
          <div className={style.service}>
            <h5 className={style.service_title}>Opening Hours:</h5>
            <ul className={style.time_list}>{hospital.hours.map((hour: any, id: number) => (
              <li key={id} className={style.time_list__item}>
                <span>{hour.day}:</span> <span>{hour.open}</span>
              </li>
            ))}
            </ul>
          </div>
          {error && <p>{error}</p>}
        </div>
      </div>
      <button onClick={() => navigate(-1)} className={style.link}>Back</button>
    </div>
  );
}

export default HospitalInfo;
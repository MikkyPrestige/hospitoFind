import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getHospitalByName } from "@/services/api";
import { Hospital } from "@/services/hospital";
import { Avatar } from "@/components/avatar";
import HospitalPic from "@/assets/images/hospital-logo.jpg";
import Loading from "@/assets/images/loading.gif";
import style from "./style/info/info.module.css";
import { FaPhone, FaGlobe, FaEnvelope } from "react-icons/fa";
import Footer from "@/layouts/footer/footer";

const HospitalInfo = () => {
  const { name } = useParams();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      if (!name) return;
      try {
        const response = await getHospitalByName(name);
        setHospital(response);
      } catch (err: any) {
        if (err.data) setError(err.message);
        else if (err.request) setError("Server did not respond");
        else setError(err.message);
      }
    };
    fetchHospitalDetails();
  }, [name]);

  if (!hospital) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <img src={Loading} alt="Loading gif" />
      </div>
    )
  }

  return (
  <>
      <div className={style.hospital}>
        <Helmet>
          <title>{hospital.name}</title>
          <meta name="description" content={hospital.name} />
        </Helmet>

        <nav className={style.breadcrumb}>
          <Link to="/">Home</Link> / <Link to="/find">Hospitals</Link> /{" "}
          <span>{hospital.name}</span>
        </nav>

        <h1 className={style.heading}>
          Welcome to {hospital.name}
        </h1>

        <div className={style.wrapper}>
          <div className={style.img}>
            <Avatar
              image={hospital.photoUrl || HospitalPic}
              alt={hospital.name}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "1.2rem",
                objectFit: "cover",
              }}
            />
          </div>

          <div className={style.details}>
            <div className={style.section}>
              <h3 className={style.section_title}>📍Address</h3>
              <p>{hospital.address.street}, {hospital.address.city}, {hospital.address.state}</p>
            </div>

            <div className={style.section}>
              <h3 className={style.section_title}>Contact</h3>
              {hospital.phoneNumber && (
                <a href={`tel:${hospital.phoneNumber}`} className={style.contact}>
                  <FaPhone /> Call us: {hospital.phoneNumber}
                </a>
              )}
              {hospital.website && (
                <a href={hospital.website} target="_blank" rel="noreferrer" className={style.contact}>
                  <FaGlobe /> Visit Website:
                </a>
              )}
              {hospital.email && (
                <a
                  href={`mailto:${hospital.email}?subject=Hello ${hospital.name}!`}
                  target="_blank"
                  rel="noreferrer"
                  className={style.contact}
                >
                  <FaEnvelope /> Email: {hospital.email}
                </a>
              )}
            </div>

            {hospital.type && (
              <div className={style.section}>
                <h3 className={style.section_title}>🏢 Hospital Type</h3>
                <p className={style.type}>{hospital.type}</p>
              </div>
            )}

            {hospital.services && (
              <div className={style.section}>
                <h3 className={style.section_title}>💉 Our Key Services</h3>
                <ul className={style.list}>
                  {hospital.services.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {hospital.hours && (
              <div className={style.section}>
                <h3 className={style.section_title}>🕓 Opening Hours</h3>
                <ul className={style.hours}>
                  {hospital.hours.map((hour, i) => (
                    <li key={i}>
                      <span>{hour.day}</span> <span>{hour.open}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {hospital.comments && (
              <div className={style.section}>
                <h3 className={style.section_title}>💬 Additional Information</h3>
                <ul className={style.list}>
                  {hospital.comments.map((comment, i) => (
                    <li key={i}>{comment}</li>
                  ))}
                </ul>
              </div>
            )}

            {error && <p className={style.error}>{error}</p>}
          </div>
        </div>

        <button onClick={() => navigate(-1)} className={style.backBtn}>
          Return to Search
        </button>
      </div>
      <Footer />
</>
      );
};

      export default HospitalInfo;
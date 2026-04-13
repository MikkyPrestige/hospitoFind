import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRandomHospitals } from "@/services/api";
import { Hospital } from "@/src/types/hospital";
import { Avatar } from "@/components/ui/Avatar";
import Motion from "@/components/ui/Motion";
import { fadeUp, sectionReveal } from "@/utils/animations";
import HospitalPic from "@/assets/images/hospital-logo.jpg";
import style from "./styles/popular.module.css";

const PopularHospitals = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    const fetchRandomHospitals = async () => {
      try {
        const response = await getRandomHospitals();
        if (mounted) setHospitals(response);
      } catch (err: any) {
        if (mounted) {
          if (err.data) setError(err.message);
          else if (err.request) setError("Unable to load recommended hospitals at this time.");
          else setError(err.message);
        }
      }
    };

    fetchRandomHospitals();

    return () => { mounted = false; };
  }, []);

  if (hospitals.length === 0 && !error) return null;

  return (
    <Motion
      variants={sectionReveal}
      className={style.container}
      initial="hidden"
      animate="visible"
    >
      <Motion variants={fadeUp}>
        <h2 className={style.heading}>Verified Healthcare Providers</h2>
        <p className={style.subtitle}>
          Explore top-rated hospitals and clinics verified for quality standards and patient care.
        </p>
      </Motion>

      {error && <p className={style.error}>{error}</p>}

      {hospitals.length > 0 && (
        <Motion variants={sectionReveal} className={style.wrapper}>
          {hospitals.map((hospital) => (
            <Motion
              key={hospital.slug || hospital.name}
              variants={fadeUp}
              className={style.card}
            >
              <div className={style.imgContainer}>
                <Avatar
                  image={hospital.photoUrl || HospitalPic}
                  alt={`${hospital.name} facility`}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "0",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className={style.details}>
                <h3 className={style.name}>{hospital.name}</h3>
                <p className={style.address}>
                  {hospital.address?.street}, {hospital.address?.city}
                </p>
                <Link
                  to={`/hospital/${hospital.address?.state}/${hospital.address?.city}/${hospital.slug}`}
                  className={style.btn}
                >
                  View Profile <span className={style.srOnly}>for {hospital.name}</span>
                </Link>
              </div>
            </Motion>
          ))}
        </Motion>
      )}
    </Motion>
  );
};

export default PopularHospitals;
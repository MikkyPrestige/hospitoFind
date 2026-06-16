import { useEffect, useState } from "react";
import { getRandomHospitals } from "@/services/api";
import { Hospital } from "@/types/hospital";
import { useGeolocation } from "@/hooks/useGeolocation";
import HospitalCard from "@/components/hospital/HospitalCard";
import Motion from "@/components/ui/Motion";
import { fadeUp, sectionReveal } from "@/utils/animations";
import style from "./styles/popular.module.css";

const PopularHospitals = () => {
  const userCoords = useGeolocation();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [error, setError] = useState<string>("");

  const loadHospitals = async () => {
    try {
      const response = await getRandomHospitals();
      setHospitals(response);
      setError("");
    } catch (err: any) {
      if (err.response) setError(err.response.data?.message || "Server error");
      else if (err.request) setError("Unable to load recommended hospitals at this time.");
      else setError(err.message);
    }
  };

  useEffect(() => {
    loadHospitals();
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

      {error && (
        <div className={style.errorContainer}>
          <p className={style.error}>{error}</p>
          <button onClick={loadHospitals} className={style.retryBtn}>Try Again</button>
        </div>
      )}

      {hospitals.length > 0 && (
        <Motion variants={sectionReveal} className={style.wrapper}>
          {hospitals.map((hospital) => (
            <Motion key={hospital._id} variants={fadeUp}>
              <HospitalCard hospital={hospital} userCoords={userCoords} />
            </Motion>
          ))}
        </Motion>
      )}
    </Motion>
  );
};

export default PopularHospitals;
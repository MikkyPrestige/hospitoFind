import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import { Hospital } from "@/src/types/hospital";
import HospitalPic from "@/assets/images/hospital-logo.jpg";
import { Avatar } from "@/components/ui/Avatar";
import style from "./styles/popular.module.css";
import AnimatedLoader from "@/components/ui/AnimatedLoader";
import { BASE_URL } from "@/context/UserProvider";

const ShareHospitalList = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const [error, setError] = useState<string>("");
  const [hospitalList, setHospitalList] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getHospitalList = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/hospitals/share/${linkId}`);
      setHospitalList(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    getHospitalList();
  }, []);


  return (
    <>
      <div className={style.sharePage}>
        {error && <div>{error}</div>}
        {loading ? (
          <AnimatedLoader message="Loading shared hospital list..." variant="card" count={3} />
        ) : (
          <div className={`${style.shareContent} ${style.wrapper}`}>
            {hospitalList.map((hospital, id) => (
              <li key={id} className={style.card}>
                <div className={style.shareImg}>
                  {hospital?.photoUrl ? <Avatar image={hospital.photoUrl} alt={`Photo of ${hospital.name} in ${hospital.address.city}`} style={{ width: "100%", height: "100%", borderRadius: "1.2rem", objectFit: "cover" }} /> : <Avatar image={HospitalPic} alt="Photo of an hospital" style={{ width: "100%", height: "100%", borderRadius: "1.2rem", objectFit: "cover" }} />}
                </div>
                <div className={style.details}>
                  <h3 className={style.name}>{hospital.name}</h3>
                  <h3 className={style.address}>{hospital?.address.street}</h3>
                  <NavLink
                    to={`/hospital/${hospital.address.state}/${hospital.address.city}/${hospital.slug}`}
                    className={style.btn}
                  >
                    View Hospital
                  </NavLink>
                </div>
              </li>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ShareHospitalList;

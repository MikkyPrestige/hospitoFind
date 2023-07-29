import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Hospital } from "@/services/hospitalTypes";
import { NavLink } from "react-router-dom";
import HospitalPic from "@/assets/images/hospital-logo.jpg";
import { Avatar } from "@/components/avatar";
import style2 from "@/components/style/popular.module.css";
import Loading from "@/assets/images/loading.gif";

const BASE_URL = "https://strange-blue-battledress.cyclic.app";

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
    <div className={style2.sharePage}>
      {error && <div>{error}</div>}
      {loading ? (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh"
        }}>
          <img src={Loading} alt="Loading gif" /></div>
      ) : (
        <div className={`${style2.shareContent} ${style2.wrapper}`}>
          {hospitalList.map((hospital, id) => (
            <li key={id} className={style2.card}>
              <div className={style2.img}>
                {hospital?.photoUrl ? (
                  <Avatar image={hospital.photoUrl} alt="hospital" style={{ width: "100%", height: "100%", borderRadius: "1.2rem", objectFit: "cover" }} />
                ) : (
                  <Avatar image={HospitalPic} alt="hospital" style={{ width: "100%", height: "100%", borderRadius: "1.2rem", objectFit: "cover" }} />)}
              </div>
              <div className={style2.details}>
                <h3 className={style2.name}>{hospital.name}</h3>
                <h3 className={style2.address}>{hospital?.address.street}</h3>
                <NavLink to={`${hospital.name}`} className={style2.btn}>See more</NavLink>
              </div>
            </li>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShareHospitalList;

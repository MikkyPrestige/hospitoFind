import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import Header from "@/layouts/header/nav";
import Footer from "@/layouts/footer/footer";
import { Hospital } from "@/services/hospital";
import HospitalPic from "@/assets/images/hospital-logo.jpg";
import { Avatar } from "@/components/avatar";
import style from "../components/style/popular.module.css";
import Loading from "@/assets/images/loading.gif";

const BASE_URL = "https://hospitofind-server.onrender.com";

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
    <div className={style.sharePage}>
      <div style={{ width: "100%" }}>
        <Header />
      </div>
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
        <div className={`${style.shareContent} ${style.wrapper}`}>
          {hospitalList.map((hospital, id) => (
            <li key={id} className={style.card}>
              <div className={style.img}>
                {hospital?.photoUrl ? <Avatar image={hospital.photoUrl} alt="hospital" style={{ width: "100%", height: "100%", borderRadius: "1.2rem", objectFit: "cover" }} /> : <Avatar image={HospitalPic} alt="hospital" style={{ width: "100%", height: "100%", borderRadius: "1.2rem", objectFit: "cover" }} />}
              </div>
              <div className={style.details}>
                <h3 className={style.name}>{hospital.name}</h3>
                <h3 className={style.address}>{hospital?.address.street}</h3>
                <NavLink to={`${hospital.name}`} className={style.btn}>See more</NavLink>
              </div>
            </li>
          ))}
        </div>
      )}
      <div style={{ width: "100%" }}>
        <Footer />
      </div>
    </div>
  );
}

export default ShareHospitalList;

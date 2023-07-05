import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { findHospitals } from "@/services/api";
import { FindInput, Hospital } from "@/services/hospitalTypes";
import ShareButton from "@/hospitalsConfig/share";
import ExportButton from "@/hospitalsConfig/export";
import { Avatar } from "@/components/avatar";
import User from "@/assets/images/pharmicon.png";
import HospitalPic from "@/assets/images/hospital.png";
import { AiOutlineSearch } from "react-icons/ai"
import mapboxgl from "mapbox-gl";
import { accessToken } from "@/authConfig/mapbox";
import 'mapbox-gl/dist/mapbox-gl.css';
import style from "./style/find.module.css";
import style2 from "../../components/style/popular.module.css";
import Header from "@/layouts/header/nav";
import PopularHospitals from "@/components/popular";

const FindHospital = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [error, setError] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const [location, setLocation] = useState<FindInput>({
    street: "",
    cityState: "",
    name: ""
  });
  const [map, setMap] = useState<null | mapboxgl.Map>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      zoom: 2,
      center: [9.081999, 8.675277],
      accessToken
    });

    setMap(map);
  }, []);


  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocation({ ...location, [name]: value });
  };


  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      zoom: 2,
      center: [9.081999, 8.675277],
      accessToken
    })

    setMap(map);
  }, [])

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearching(true);
    if (!location.street && !location.cityState && !location.name) {
      setError('Please enter a Hospital Address or Name');
      setHospitals([]);
      setSearching(false);
      return;
    }
    const query = `street=${location.street}&cityState=${location.cityState}&name=${location.name}`;
    console.log(query)
    try {
      const data = await findHospitals(query);
      if (data.length === 0) {
        setError('Sorry! We could not find any results matching your criteria.');
        setHospitals([]);
      } else {
        setHospitals(data);
        setError('');
      }
    } catch (err: any) {
      if (err.data) {
        setError(err.message);
        setHospitals([]);
      } else if (err.request) {
        setError('Server did not respond');
        setHospitals([]);
      } else {
        setError(err.message);
        setHospitals([]);
      }
    } finally {
      setSearching(false);
    };
  };

  return (
    <>
      <Header />
      <section className={style.findSection}>
        <h1 className={style.title}>Find Hospital</h1>
        <div className={style.search}>
          <div className={style.map}>
            <div
              ref={mapContainer}
              style={{ width: "100%", height: "100%", borderRadius: "1rem" }}
            ></div>
          </div>
          <div className={style.container}>
            <form onSubmit={handleSearch} className={style.form}>
              <input
                type="text"
                name="street"
                placeholder="Enter hospital Street Address"
                onChange={handleInput}
                className={style.input}
                value={location.street}
              />
              <input
                type="text"
                name="cityState"
                placeholder=" Enter City or State"
                onChange={handleInput}
                className={style.input}
                value={location.cityState}
              />
              <input
                type="text"
                name="name"
                placeholder="Hospital Name"
                onChange={handleInput}
                className={style.input}
                value={location.name}
              />
              <button type="submit" disabled={searching} className={style.cta}>
                <AiOutlineSearch className={style.icon} />
              </button>
            </form>
            <div className={style.user}>
              <Avatar image={User} alt="User Photo" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            </div>
          </div>
          {error && <p className={style.error}>{error}</p>}
        </div>
        <div className={style.hospitals}>
          {hospitals.length > 0 ? (
            <div className={style.found}>
              <h2 className={style2.heading}>{hospitals.length} Hospitals found</h2>
              <ul className={style2.wrapper}>
                {hospitals.length > 0 && hospitals.map((hospital, id) => (
                  <li key={id} className={style2.card}>
                    <div className={style2.img}>
                      <Avatar image={HospitalPic} alt="hospital" style={{ width: "100%", height: "100%", borderRadius: "1.2rem", objectFit: "cover" }} />
                    </div>
                    <div className={style2.details}>
                      <p className={style2.name}>{hospital.name}</p>
                      <p>{hospital.address.street}</p>
                      <NavLink to={`${hospital.name}`} className={style2.btn}>See more</NavLink>
                    </div>
                  </li>
                ))}
              </ul>
              {hospitals.length > 0 && <div className={style.cta_btn}>
                <ShareButton searchParams={location} />
                <ExportButton searchParams={location} />
              </div>}
            </div>
          ) : (
            <PopularHospitals />
          )
          }
        </div>
      </section >
    </>
  )
}


export default FindHospital;
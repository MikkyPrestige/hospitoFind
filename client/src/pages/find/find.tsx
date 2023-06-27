import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { searchHospitals } from "@/services/api";
import { FindInput, Hospital } from "@/services/hospitalTypes";
import ShareButton from "@/hospitalsConfig/share";
import ExportButton from "@/hospitalsConfig/export";
import { Avatar } from "@/components/avatar";
import User from "@/assets/images/user.jpg";
import HospitalPic from "@/assets/images/hospital.png";
import { AiOutlineSearch } from "react-icons/ai"
import mapboxgl from "mapbox-gl";
import { accessToken } from "@/authConfig/mapbox";
import 'mapbox-gl/dist/mapbox-gl.css';
import style from "./style/find.module.css";

const FindHospital = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [error, setError] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const [location, setLocation] = useState<FindInput>({
    address: "",
    name: ""
  });
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocation({ ...location, [name]: value });
  }

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
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
    if (!location.address && !location.name) {
      setError('Please enter a Hospital Address or Name');
      setHospitals([]);
      setSearching(false);
      return;
    }
    const query = `address=${location.address}&name=${location.name}`;
    // const query = `address=${location.address.street}&city=${location.address.city}&state=${location.address.state}&name=${location.name}`;
    try {
      const data = await searchHospitals(query);
      if (data.length === 0) {
        setError('Sorry! We could not find any results matching your criteria.');
        setHospitals([]);
      } else {
        setHospitals(data);
        setError('');
      }
    } catch (err) {
      setHospitals([]);
      setError('An error occurred while searching for hospitals', err.response.data.message);
    }
    setSearching(false);
  }

  return (
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
              name="address"
              placeholder="Hospital Address"
              onChange={handleInput}
              className={style.input}
            />
            <input
              type="text"
              name="name"
              placeholder="Hospital Name"
              onChange={handleInput}
              className={style.input}
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
      <div className={style.found}>
        {hospitals.length > 0 && <div>
          {location.address &&
            <h2 className={style.found_title}>{hospitals.length} Hospitals found in
              <span className={style.found_title_span}> {location.address}</span>
            </h2>
          }
          {location.name &&
            <h2>{hospitals.length} Hospitals found with
              <span className={style.found_title_span}> {location.name}</span>
            </h2>
          }
        </div>}
        <ul className={style.list}>
          {hospitals.length > 0 && hospitals.map((hospital, id) => (
            <li key={id} className={style.item}>
              <div className={style.img}>
                <Avatar image={HospitalPic} alt="hospital" style={{ width: "100%", height: "100%", borderRadius: "1.2rem", objectFit: "cover" }} />
              </div>
              <div className={style.result}>
                <p className={style.hospital}>{hospital.name}</p>
                <p className={style.hospital}>{hospital.address.street}</p>
              </div>
              <NavLink to={`${hospital.name}`} className={style.link}>See more</NavLink>
            </li>
          ))}
        </ul>
        {hospitals.length > 0 && <div className={style.cta_btns}>
          <ShareButton searchParams={location} />
          <ExportButton searchParams={location} />
        </div>}
      </div>
    </section>
  )
}

export default FindHospital;
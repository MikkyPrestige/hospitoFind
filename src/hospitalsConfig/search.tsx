import React, { useState } from 'react';
import { LocationInput, Hospital } from '@/services/hospitalTypes';
import { statesAndCities } from '@/services/location';
import { searchHospitals } from '@/services/api';
import ExportButton from '@/hospitalsConfig/export';
import ShareButton from '@/hospitalsConfig/share';
import { NavLink, Outlet } from 'react-router-dom';
import { AiOutlineSearch } from "react-icons/ai";
import style from "./style/search/search.module.css";
import { Avatar } from '@/components/avatar';
import HospitalPic from "@/assets/images/hospital-logo.jpg";
import PopularHospitals from '@/components/popular';
import style2 from "../components/style/popular.module.css";

const Search = () => {
  const [location, setLocation] = useState<LocationInput>({
    address: '',
    city: '',
    state: ''
  });

  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [error, setError] = useState<string>('');
  const [searching, setSearching] = useState<boolean>(false);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [city, state] = e.target.value.split(',');
    setLocation({ ...location, city, state });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocation({ ...location, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearching(true);
    if (!location.address && !location.city && !location.state) {
      setError('Please enter/select a Hospital Address or Name');
      setHospitals([]);
      setSearching(false);
      return;
    }
    const query = `address=${location.address}&city=${location.city}&state=${location.state}`;
    try {
      const data = await searchHospitals(query);
      if (data.length === 0) {
        setError('Sorry! We could not find any results matching your criteria.\nPlease try again with different parameters');
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
    <section className={style.search}>
      <section className={style.wrapper}>
        <form onSubmit={handleSubmit} className={style.form}>
          <input
            type="text"
            name="address"
            value={location.address}
            onChange={handleInput}
            placeholder="Address / Hospital Name"
            className={style.input}
          />
          <select onChange={handleSelect} className={style.select}>
            <option value="">City & State</option>
            {statesAndCities.map((name) => (
              <option key={`${name.city},${name.state}`} value={`${name.city},${name.state}`}>
                {`${name.city}, ${name.state}`}
              </option>
            ))}
          </select>
          <button type="submit" disabled={searching} className={
            style.cta
          }>
            {searching ? <div></div> : <AiOutlineSearch className={style.icon} />}
          </button>
        </form>
        {error && <p className={style.error}>{error}</p>}
      </section>
      <ul className={style.hospitals}>
        <h1 className={style.title}>
          {hospitals.length > 0 ? `Showing ${hospitals.length} hospitals found` : <PopularHospitals />}
        </h1>
        <div className={style2.wrapper}>
          {hospitals.length > 0 && hospitals.map((hospital, id) => (
            <li key={id} className={style2.card}>
              <div className={style2.img}>
                {hospital?.photoUrl ? <Avatar image={hospital.photoUrl} alt="hospital" style={{ width: "100%", height: "100%", borderRadius: "1.2rem", objectFit: "cover" }} /> : <Avatar image={HospitalPic} alt="hospital" style={{ width: "100%", height: "100%", borderRadius: "1.2rem", objectFit: "cover" }} />}
              </div>
              <div className={style2.details}>
                <h3 className={style2.name}>{hospital.name}</h3>
                <h3 className={style2.address}>{hospital?.address.street}</h3>
                <NavLink to={`${hospital.name}`} className={style2.btn}>See more</NavLink>
              </div>
            </li>
          ))}
        </div>
        {hospitals.length > 0 && <div className={style.container}>
          <ShareButton searchParams={location} />
          <ExportButton searchParams={location} />
        </div>}
      </ul>
      <Outlet />
    </section>
  )
}

export default Search;
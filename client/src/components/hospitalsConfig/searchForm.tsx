import React, { useState } from 'react';
import { LocationInput, Hospital, statesAndCities } from '@/services/hospitalTypes';
import { searchHospitals } from '@/services/api';
import ExportButton from './exportHospital';
import ShareButton from './shareHospitals';
import { NavLink, Outlet } from 'react-router-dom';
import { AiOutlineSearch } from "react-icons/ai";
import style from "@/components/style/searchForm.module.css";
import { Avatar } from '../avatar';
import HospitalPic from "../../../public/images/hospital.png";

const SearchForm = () => {
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
    } catch (err) {
      setHospitals([]);
      setError('An error occurred while searching for hospitals', err.response.data.message);
    }
    setSearching(false);
  };

  return (
    <>
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
          <button type="submit" disabled={searching} className={style.cta}>
            {searching ? "Searching..." : <AiOutlineSearch className={style.icon} />}
          </button>
        </form>
        {error && <p className={style.error}>{error}</p>}
      </section>
      <ul className={style.hospitals}>
        {hospitals.length > 0 && hospitals.map((hospital, id) => (
          <li key={id} className={style.hospital}>
            <div className={style.img}>
              <Avatar image={HospitalPic} alt="hospital" style={{ width: "100%", height: "100%", borderRadius: "1.2rem", objectFit: "cover" }} />
            </div>
            <div className={style.addressContainer}>
              <h3 className={style.address}>{hospital.name}</h3>
              <h3 className={style.address}>{hospital.address.street}</h3>
            </div>
            <NavLink to={`${hospital.name}`} className={style.link}>See more</NavLink>
          </li>
        ))}
        {hospitals.length > 0 && <div className={style.container}>
          <ShareButton searchParams={location} />
          <ExportButton searchParams={location} />
        </div>}
      </ul>
      <Outlet />
    </>
  )
}

export default SearchForm;
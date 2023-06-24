import React, { useState } from 'react';
import { LocationInput, Hospital, statesAndCities } from '@/services/hospitalTypes';
import { searchHospitals } from '@/services/api';
import ExportButton from './exportHospital';
import ShareButton from './shareHospitals';
import { NavLink } from 'react-router-dom';
import { AiOutlineSearch } from "react-icons/ai";
import style from "./style/searchForm.module.css";
import { Avatar } from './avatar';
import HospitalPic from "../../public/images/hospital.png";
import { Button } from './button';

const SearchForm = () => {
  const [location, setLocation] = useState<LocationInput>({
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
    const query = location.city ? `city=${location.city}` : `state=${location.state}`;
    const data = await searchHospitals(query);
    if (!location.city && !location.state) {
      setError('Please enter a city or state');
      setSearching(false)
      return
    } else if (location.city && !statesAndCities.find(
      (name) => name.city === location.city)) {
      setError('Please enter a valid city');
      setSearching(false)
      return
    } else if (location.state && !statesAndCities.find(
      (name) => name.state === location.state)) {
      setError('Please enter a valid state');
      setSearching(false)
      return
    } else if (location.city && location.state && !statesAndCities.find(
      (name) => name.city === location.city && name.state === location.state)) {
      setError('Please enter a valid city and state');
      setSearching(false)
      return
    }
    setHospitals(data);
    setSearching(false);
    setError('');
  };

  return (
    <>
      <section className={style.wrappper}>
        <form onSubmit={handleSubmit} className={style.form}>
          <input
            type="text"
            name="address"
            value={location.city || location.state}
            onChange={handleInput}
            placeholder="Address"
            className={style.input}
          />
          {/* <div> */}
          {/* <label htmlFor="state">State</label>
          <input
            type="text"
            name="state"
            value={location.state}
            onChange={handleInput}
          /> */}
          {/*
          <label htmlFor="city">City</label>
          <input
            type="text"
            name="city"
            value={location.city}
            onChange={handleInput}
          /> */}
          {/* </div> */}
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
            <NavLink to="/" className={style.link}>See more</NavLink>
            {/* <p>City: {hospital.address.city}</p>
          <p>State: {hospital.address.state}</p>
          <p>Phone: {hospital.phoneNumber}</p>
          <p>Website: {hospital.website}</p>
          <p>Email: {hospital.email}</p>
          <p>Type: {hospital.type}</p>
          <ul>Services: {hospital.services.map((service: string, id: number) => (
            <li key={id}>{service}</li>
          ))}</ul>
          <ul>Comments: {hospital.comments.map((comment: string, id: number) => (
            <li key={id}>{comment}</li>
          ))}</ul>
          <ul>Hours: {hospital.hours.map((hour: any, id: number) => (
            <li key={id}>
              <span>{hour.day}</span>: <span>{hour.open}</span>
            </li>
          ))} */}
            {/* </ul> */}
          </li>
        ))}
        {hospitals.length > 0 && <div className={style.container}>
          <ShareButton searchParams={location} />
          <ExportButton searchParams={location} />
        </div>}
      </ul>
    </>
  )
}

export default SearchForm;
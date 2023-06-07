import React, { useState } from 'react';
import { LocationInput, Hospital, statesAndCities } from '@/services/types';
import { searchHospitals } from '@/services/api';
import ExportButton from './exportHospital';

const SearchForm = () => {
  const [location, setLocation] = useState<LocationInput>({
    city: '',
    state: ''
  });
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [error, setError] = useState<string>('');

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
    const query = location.city ? `city=${location.city}` : `state=${location.state}`;
    const data = await searchHospitals(query);
    if (!location.city && !location.state) {
      setError('Please enter a city or state');
      return
    } else if (location.city && !statesAndCities.find(
      (name) => name.city === location.city)) {
      setError('Please enter a valid city');
      return
    } else if (location.state && !statesAndCities.find(
      (name) => name.state === location.state)) {
      setError('Please enter a valid state');
      return
    } else if (location.city && location.state && !statesAndCities.find(
      (name) => name.city === location.city && name.state === location.state)) {
      setError('Please enter a valid city and state');
      return
    }
    setHospitals(data);
    setError('');
  };

  return (
    <div>
      <h1>Search Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="statesAndCapitals">States & Capitals</label>
        <select onChange={handleSelect}>
          <option value="">Select a city & state</option>
          {statesAndCities.map((name) => (
            <option key={`${name.city},${name.state}`} value={`${name.city},${name.state}`}>
              {`${name.city}, ${name.state}`}
            </option>
          ))}
        </select>
        <label htmlFor="state">State</label>
        <input
          type="text"
          name="state"
          value={location.state}
          onChange={handleInput}
        />

        <label htmlFor="city">City</label>
        <input
          type="text"
          name="city"
          value={location.city}
          onChange={handleInput}
        />
        <button type="submit">Search</button>
        <ExportButton searchParams={location} />
      </form>
      {error && <p>{error}</p>}
      {hospitals.length > 0 && hospitals.map((hospital, id) => (
        <div key={id}>
          <h3>Hospital: {hospital.name}</h3>
          <p>Street: {hospital.address.street}</p>
          <p>City: {hospital.address.city}</p>
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
          ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default SearchForm;
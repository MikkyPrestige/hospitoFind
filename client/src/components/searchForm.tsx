import React, { useState } from 'react';
import { LocationInput, Hospital, cities } from '@/services/types';
import { searchHospitals } from '@/services/api';

const SearchForm = () => {
  const [location, setLocation] = useState<LocationInput>({
    city: '',
    state: '',
    zip: '',
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
    try {
      const query = location.city ? `city=${location.city}` : `state=${location.state}`;
      const data = await searchHospitals(query);
      setHospitals(data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Search Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="city">City</label>
        <select onChange={handleSelect}>
          <option value="">Select a city</option>
          {cities.map((city) => (
            <option key={`${city.name},${city.state}`} value={`${city.name},${city.state}`}>
              {`${city.name}, ${city.state}`}
            </option>
          ))}
        </select>
        <label htmlFor="zip">ZIP</label>
        <input
          type="text"
          name="zip"
          id="zip"
          onChange={handleInput}
          value={location.zip}
        />
        <button type="submit">Search</button>
      </form>
      {error && <p>{error}</p>}
      {hospitals.map((hospital, id) => (
        <div key={id}>
          <h3>Hospital: {hospital.name}</h3>
          <p>Street: {hospital.address.street}</p>
          <p>City: {hospital.address.city}</p>
          <p>State: {hospital.address.state}</p>
          <p>ZIP: {hospital.address.zip}</p>
          <p>Phone: {hospital.phoneNumber}</p>
          <p>Email: {hospital.email}
          </p>
          <p>Website: {hospital.website}</p>
          <ul>Services: {hospital.services.map((service: string) => (
            <li key={service}>{service}</li>
          ))}</ul>
          <ul>Hours: {hospital.hours.map((hour: any) => (
            <li key={hour.day}>
              <span>{hour.day}</span>{" "}
              <span>{hour.open}</span>{" - "}
              <span>{hour.close}</span>
            </li>
          ))}
          </ul>
          <p>Rating: {hospital.ratings}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchForm;
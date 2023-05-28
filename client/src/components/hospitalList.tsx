import React, { useEffect, useState } from 'react';
import { getHospitals } from '@/services/api';
import { Hospital, Hours } from '@/services/types';

const HospitalList: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const data = await getHospitals();
      setHospitals(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Hospital List</h1>
      {hospitals.map((hospital, id) => (
        <div key={id}>
          <h3>Hospital: {hospital.name}</h3>
          <p>Street: {hospital.address.street}</p>
          <p>City: {hospital.address.city}</p>
          <p>State: {hospital.address.state}</p>
          <p>ZIP: {hospital.address.zip}</p>
          <p>Phone: {hospital.phoneNumber}</p>
          <p>Email: {hospital.email}</p>
          <p>Website: {hospital.website}</p>
          <ul>Services: {hospital.services.map((service: string) => (
            <li key={service}>{service}</li>
          ))}</ul>
          <ul>Hours: {hospital.hours.map((hour: Hours) => (
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

export default HospitalList;

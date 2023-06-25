import { Hospital } from "./hospitalTypes";
import axios from "axios";

const BASE_URL = 'http://localhost:5000/hospitals';

// get all hospitals
export async function getHospitals() {
  try {
    const response = await axios.get(`${BASE_URL}`);
    const hospitals = response.data
    return hospitals;
  } catch (error) {
    console.log(error);
  }
}

// get hospital by name
export async function getHospitalByName(name: string) {
  try {
    const response = await axios.get(`${BASE_URL}/${name}`);
    const hospital = response.data;
    return hospital;
  } catch (error) {
    console.log(error);
  }
}

// get hospital by state or city
export async function searchHospitals(query: string) {
  try {
    const response = await axios.get(`${BASE_URL}/search?${query}`);
    const searchedHospitals = response.data;
    return searchedHospitals;
  } catch (error) {
    console.log(error);
  }
}

// add new hospital
export async function addHospital(hospital: Hospital) {
  try {
    const response = await axios.post(`${BASE_URL}`, hospital);
    const newHospital = response.data;
    return newHospital;
  } catch (error) {
    console.log(error);
  }
}

// update hospital
export async function updateHospital(hospital: Hospital, id: number) {
  try {
    const response = await axios.patch(`${BASE_URL}/${id}`, hospital);
    const updatedHospital = response.data;
    return updatedHospital;
  } catch (error) {
    console.log(error);
  }
}

// delete hospital
export async function deleteHospital(id: number) {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    const deletedHospital = response.data;
    return deletedHospital;
  } catch (error) {
    console.log(error);
  }
}
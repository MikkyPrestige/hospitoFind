import { Hospital } from "./hospitalTypes";
import axios from "axios";
import { BASE_URL } from "@/contexts/userContext";

// get all hospitals
export async function getHospitals() {
  try {
    const response = await axios.get(`${BASE_URL}/hospitals`);
    const hospitals = response.data
    return hospitals;
  } catch (error) {
    console.log(error);
    return error
  }
}

// get hospital randomly
export async function getRandomHospitals() {
  try {
    const response = await axios.get(`${BASE_URL}/hospitals/random`);
    const randomHospital = response.data;
    return randomHospital;
  } catch (error) {
    console.log(error);
    return error
  }
}

// get hospital by name
export async function getHospitalByName(name: string) {
  try {
    const response = await axios.get(`${BASE_URL}/hospitals/${name}`);
    const hospital = response.data;
    return hospital;
  } catch (error) {
    console.log(error);
    return error
  }
}

// find hospital by name or address
export async function findHospitals(query: string) {
  try {
    const response = await axios.get(`${BASE_URL}/hospitals/find?${query}`);
    const foundHospital = response.data;
    return foundHospital;
  } catch (error) {
    console.log(error);
    return error
  }
}

// get hospital by state or city
export async function searchHospitals(query: string) {
  try {
    const response = await axios.get(`${BASE_URL}/hospitals/search?${query}`);
    const searchedHospitals = response.data;
    return searchedHospitals;
  } catch (error) {
    console.log(error);
    return error
  }
}

// add new hospital
export async function addHospital(hospital: Hospital) {
  try {
    const response = await axios.post(`${BASE_URL}/hospitals`, hospital);
    const newHospital = response.data;
    return newHospital;
  } catch (error) {
    console.log(error);
    return error
  }
}

// update hospital
export async function updateHospital(hospital: Hospital, id: number) {
  try {
    const response = await axios.patch(`${BASE_URL}/hospitals/${id}`, hospital);
    const updatedHospital = response.data;
    return updatedHospital;
  } catch (error) {
    console.log(error);
    return error
  }
}

// delete hospital
export async function deleteHospital(id: number) {
  try {
    const response = await axios.delete(`${BASE_URL}/hospitals/${id}`);
    const deletedHospital = response.data;
    return deletedHospital;
  } catch (error) {
    console.log(error);
    return error
  }
}

// save hospital
// export async function saveHospitalToLibrary(hospital: Hospital) {
//   try {
//     const response = await axios.post("http://localhost:5000/user/library", hospital);
//     const savedHospital = response.data;
//     // console.log(savedHospital)
//     return savedHospital;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || "Failed to save hospital details");
//   }
// }

// get saved hospitals
// export async function getSavedHospitals() {
//   try {
//     const response = await axios.get("http://localhost:5000/user/library")
//     const savedHospitals = response.data;
//     return savedHospitals;
//   } catch (error) {
//     console.log(error);
//     return error
//   }
// }
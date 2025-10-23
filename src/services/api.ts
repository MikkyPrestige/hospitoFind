import { Hospital } from "./hospital";
import axios from "axios";

// const BASE_URL = "https://hospitofind-server.onrender.com";
const BASE_URL = "http://localhost:5000";

// get all hospitals
export async function getHospitals() {
  try {
    const response = await axios.get(`${BASE_URL}/hospitals`);
    const hospitals = response.data
    return hospitals;
  } catch (error) {
    throw error
  }
}

// get hospital randomly
export async function getRandomHospitals() {
  try {
    const response = await axios.get(`${BASE_URL}/hospitals/random`);
    const randomHospital = response.data;
    return randomHospital;
  } catch (error) {
    throw error
  }
}

// get hospital by name
export async function getHospitalByName(name: string) {
  try {
    const response = await axios.get(`${BASE_URL}/hospitals/${name}`);
    const hospital = response.data;
    return hospital;
  } catch (error) {
    throw error
  }
}

// find hospital by name or address
export async function findHospitals(query: string) {
  try {
    const response = await axios.get(`${BASE_URL}/hospitals/find?${query}`);
    // console.log("🌍 Calling URL:", URL);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// get hospital by state or city
export async function searchHospitals(query: string) {
  try {
    const response = await axios.get(`${BASE_URL}/hospitals/search?${query}`);
    const searchedHospitals = response.data;
    return searchedHospitals;
  } catch (error) {
    throw error
  }
}

// share hospital
export async function shareHospital(searchParams: any) {
  try {
    const response = await axios.post(`${BASE_URL}/hospitals/share`, {
      searchParams: {
        address: searchParams.address,
        city: searchParams.city,
        state: searchParams.state
      }
    });
    const shareLink = response.data.shareableLink;
    return shareLink;
  } catch (error) {
    throw error
  }
}

// export hospital in csv download format
export async function exportHospital(searchParams: any) {
  try {
    const { data } = await axios.get(`${BASE_URL}/hospitals/export`, {
      responseType: "blob",
      params: searchParams
    });
    console.log(searchParams)
    const exportedData = data;
    console.log(data)
    return exportedData;
  } catch (error) {
    throw error
  }
}

// add new hospital
export async function addHospital(hospital: Hospital) {
  try {
    const response = await axios.post(`${BASE_URL}/hospitals`, hospital);
    const newHospital = response.data;
    return newHospital;
  } catch (error) {
    throw error
  }
}

// update hospital
export async function updateHospital(hospital: Hospital, id: number) {
  try {
    const response = await axios.patch(`${BASE_URL}/hospitals/${id}`, hospital);
    const updatedHospital = response.data;
    return updatedHospital;
  } catch (error) {
    throw error
  }
}

// delete hospital
export async function deleteHospital(id: number) {
  try {
    const response = await axios.delete(`${BASE_URL}/hospitals/${id}`);
    const deletedHospital = response.data;
    return deletedHospital;
  } catch (error) {
    throw error
  }
}
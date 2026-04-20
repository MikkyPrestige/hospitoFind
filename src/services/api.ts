import { Hospital } from "../types/hospital";
import axios from "axios";
import { BASE_URL } from "@/context/UserProvider"

export async function getHospitals() {
  try {
    const response = await axios.get(`${BASE_URL}/hospitals`);
    const hospitals = response.data
    return hospitals;
  } catch (error) {
    throw error
  }
}

// get hospital details by id or slug
export async function getHospitalDetails(params: any) {
  try {
    if (params.slug) {
      const response = await axios.get(
        `${BASE_URL}/hospitals/${params.country}/${params.city}/${params.slug}`
      );
      return response.data;
    }

    const response = await axios.get(`${BASE_URL}/hospitals/${params.id}`);
    return response.data;

  } catch (error) {
    throw error;
  }
}

export async function getRandomHospitals() {
  try {
    const response = await axios.get(`${BASE_URL}/hospitals/random`);
    const randomHospital = response.data;
    return randomHospital;
  } catch (error) {
    throw error
  }
}

export async function getHospitalByName(name: string) {
  try {
    const response = await axios.get(`${BASE_URL}/hospitals/${name}`);
    const hospital = response.data;
    return hospital;
  } catch (error) {
    throw error
  }
}

export async function findHospitals(query: string) {
  try {
    const response = await axios.get(`${BASE_URL}/hospitals/find?${query}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const shareHospital = async (searchParams: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/hospitals/share`, { searchParams });

    if (response.data && response.data.linkId) {
        return response.data.linkId;
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export async function exportHospital(searchParams: any) {
  try {
    const { data } = await axios.get(`${BASE_URL}/hospitals/export`, {
      responseType: "blob",
      params: searchParams
    });
    console.log(searchParams)
    const exportedData = data;
    return exportedData;
  } catch (error) {
    throw error
  }
}

export async function addHospital(hospital: Hospital) {
  try {
    const response = await axios.post(`${BASE_URL}/hospitals`, hospital);
    const newHospital = response.data;
    return newHospital;
  } catch (error) {
    throw error
  }
}

export async function updateHospital(hospital: Hospital, id: number) {
  try {
    const response = await axios.patch(`${BASE_URL}/hospitals/${id}`, hospital);
    const updatedHospital = response.data;
    return updatedHospital;
  } catch (error) {
    throw error
  }
}

export async function deleteHospital(id: number) {
  try {
    const response = await axios.delete(`${BASE_URL}/hospitals/${id}`);
    const deletedHospital = response.data;
    return deletedHospital;
  } catch (error) {
    throw error
  }
}

// axios api
let activeRequests = 0;
const showLoader = () => {
  const loader = document.getElementById("global-loader");
  if (loader) {
    activeRequests++;
    loader.style.display = "flex";
  }
};

const hideLoader = () => {
  const loader = document.getElementById("global-loader");
  if (loader) {
    activeRequests--;
    if (activeRequests <= 0) {
      activeRequests = 0;
      loader.style.display = "none";
    }
  }
};

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
    const isAgentRequest = config.url?.includes('/agent/');
    if (!isAgentRequest) showLoader();
    return config;
}, (error) => {
    hideLoader();
    return Promise.reject(error);
});

api.interceptors.response.use((response) => {
    hideLoader();
    return response;
}, (error) => {
    hideLoader();
    return Promise.reject(error);
});
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "@/context/UserProvider";
import { Hospital } from "@/types/hospital";

const getErrorMessage = (error: any): string => {
  // Zod validation errors from backend
  if (error?.response?.data?.errors?.length > 0) {
    return error.response.data.errors[0].message;
  }
  // Standard backend message
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  // Network error (no response)
  if (error.code === "ERR_NETWORK" || !error.response) {
    return "Network error. Please check your connection.";
  }
  // Timeout
  if (error.code === "ECONNABORTED") {
    return "Request timed out. Please try again.";
  }
  // Fallback
  return "Something went wrong. Please try again.";
};

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
      // Show error toast unless the request explicitly opts out
    if (!error.config?.skipErrorToast) {
      toast.error(getErrorMessage(error));
    }
    return Promise.reject(error);
});

export async function getHospitals() {
  try {
    const response = await api.get("/hospitals", { skipErrorToast: true } as any);
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
      const response = await api.get(
        `/hospitals/${params.country}/${params.city}/${params.slug}`,
        { skipErrorToast: true } as any
      );
      return response.data;
    }

    const response = await api.get(`/hospitals/${params.id}`, { skipErrorToast: true } as any);
    return response.data;

  } catch (error) {
    throw error;
  }
}

export async function getRandomHospitals() {
  try {
    const response = await api.get("/hospitals/random", { skipErrorToast: true } as any);
    const randomHospital = response.data;
    return randomHospital;
  } catch (error) {
    throw error
  }
}

export async function getHospitalByName(name: string) {
  try {
    const response = await api.get(`/hospitals/${name}`, { skipErrorToast: true } as any);
    const hospital = response.data;
    return hospital;
  } catch (error) {
    throw error
  }
}

export const shareHospital = async (searchParams: any) => {
  try {
    const response = await api.post(`/hospitals/share`, { searchParams }, { skipErrorToast: true } as any);

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
    const { data } = await api.get(`/hospitals/export`, {
      responseType: "blob",
      params: searchParams,
      skipErrorToast: true,
      } as any)

    const exportedData = data;
    return exportedData;
  } catch (error) {
    throw error
  }
}

export async function addHospital(hospital: Hospital) {
  try {
    const response = await api.post("/hospitals", hospital, { skipErrorToast: true } as any);
    const newHospital = response.data;
    return newHospital;
  } catch (error) {
    throw error
  }
}

export async function updateHospital(hospital: Hospital, id: number) {
  try {
    const response = await api.patch(`/hospitals/${id}`, hospital, { skipErrorToast: true } as any);
    const updatedHospital = response.data;
    return updatedHospital;
  } catch (error) {
    throw error
  }
}

export async function deleteHospital(id: number) {
  try {
    const response = await api.delete(`/hospitals/${id}`, { skipErrorToast: true } as any);
    const deletedHospital = response.data;
    return deletedHospital;
  } catch (error) {
    throw error
  }
}
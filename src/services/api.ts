import { Hospital } from "./hospital";
import axios from "axios";

const BASE_URL =  import.meta.env.VITE_BASE_URL;
// const BASE_URL =  import.meta.env.VITE_BASE_URLLocal;

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

// get hospital details by id or slug
export async function getHospitalDetails(params: any) {
  try {
    if (params.slug) {
      const response = await axios.get(
        `${BASE_URL}/hospital/${params.country}/${params.city}/${params.slug}`
      );
      return response.data;
    }

    const response = await axios.get(`${BASE_URL}/hospitals/${params.id}`);
    return response.data;

  } catch (error) {
    throw error;
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
    return response.data;
  } catch (error) {
    throw error;
  }
}

// // get hospital by state or city
// export async function searchHospitals(query: string) {
//   try {
//     const response = await axios.get(`${BASE_URL}/hospitals/search?${query}`);
//     const searchedHospitals = response.data;
//     return searchedHospitals;
//   } catch (error) {
//     throw error
//   }
// }

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

// axios api
// helper to manage the loading state outside of React components
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

// 🛡️ Create the custom instance
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

/**
 * REQUEST INTERCEPTOR
 */
api.interceptors.request.use(
  (config) => {
    showLoader();

    const token = localStorage.getItem("accessToken");
    if (token && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    hideLoader();
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 */
/**
 * RESPONSE INTERCEPTOR (Update this section in api.ts)
 */
api.interceptors.response.use(
  (response) => {
    hideLoader();
    return response;
  },
  async (error) => {
    const prevRequest = error?.config;
    const tokenInStorage = localStorage.getItem("accessToken");

    const isAuthError = error?.response?.status === 401 || error?.response?.status === 403;

    if (isAuthError && !prevRequest?._retry && tokenInStorage) {
      prevRequest._retry = true;

      try {
        const response = await axios.get(`${BASE_URL}/auth/refresh`, {
            withCredentials: true,
        });

        const newAuthData = response.data;
        const { accessToken } = newAuthData;

        localStorage.setItem("accessToken", accessToken);

        Object.entries(newAuthData).forEach(([key, value]) => {
            if (value && key !== 'accessToken') localStorage.setItem(key, value.toString());
        });

        prevRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return api(prevRequest);

      } catch (refreshError) {
        console.error("Refresh failed:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("id");
        localStorage.removeItem("email");
        localStorage.removeItem("auth0.is_authenticated");

        if (!window.location.pathname.includes('/login')) {
             window.location.href = "/login?expired=true";
        }
        return Promise.reject(refreshError);
      } finally {
        hideLoader();
      }
    }

    hideLoader();
    return Promise.reject(error);
  }
);
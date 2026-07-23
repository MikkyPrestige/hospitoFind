import axios from 'axios'
import { toast } from 'react-toastify'
import { BASE_URL } from '@/config/api'
import { Hospital } from '@/types/hospital'

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const response = error.response
    if (response) {
      // Zod validation errors from backend
      if (response.data?.errors?.length > 0) {
        return response.data.errors[0].message
      }
      // Standard backend message
      if (response.data?.message) {
        return response.data.message
      }
    }
    // Network error (no response)
    if (!response || error.code === 'ERR_NETWORK') {
      return 'Network error. Please check your connection.'
    }
    // Timeout
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.'
    }
  }
  // Fallback
  return 'Something went wrong. Please try again.'
}

// axios api
let activeRequests = 0
const showLoader = () => {
  const loader = document.getElementById('global-loader')
  if (loader) {
    activeRequests++
    loader.style.display = 'flex'
  }
}

const hideLoader = () => {
  const loader = document.getElementById('global-loader')
  if (loader) {
    activeRequests--
    if (activeRequests <= 0) {
      activeRequests = 0
      loader.style.display = 'none'
    }
  }
}

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    const isAgentRequest = config.url?.includes('/agent/')
    if (!isAgentRequest) showLoader()
    return config
  },
  (error) => {
    hideLoader()
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    hideLoader()
    return response
  },
  (error) => {
    hideLoader()
    // Show error toast unless the request explicitly opts out
    if (!error.config?.skipErrorToast) {
      toast.error(getErrorMessage(error))
    }
    return Promise.reject(error)
  }
)

export async function getHospitals() {
  try {
    const response = await api.get('/hospitals', {
      skipErrorToast: true,
    })
    const hospitals = response.data
    return hospitals
  } catch (error) {
    throw error
  }
}

// get hospital details by id or slug
export async function getHospitalDetails(params: {
  id?: string
  country?: string
  city?: string
  slug?: string
}) {
  try {
    if (params.slug) {
      const response = await api.get(
        `/hospitals/${params.country}/${params.city}/${params.slug}`,
        { skipErrorToast: true }
      )
      return response.data
    }

    const response = await api.get(`/hospitals/${params.id}`, {
      skipErrorToast: true,
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export async function getRandomHospitals() {
  try {
    const response = await api.get('/hospitals/random', {
      skipErrorToast: true,
    })
    const randomHospital = response.data
    return randomHospital
  } catch (error) {
    throw error
  }
}

export async function getHospitalByName(name: string) {
  try {
    const response = await api.get(`/hospitals/${name}`, {
      skipErrorToast: true,
    })
    const hospital = response.data
    return hospital
  } catch (error) {
    throw error
  }
}

export async function shareHospital(searchParams: {
  address?: string
  city?: string
  state?: string
}) {
  try {
    const response = await api.post(
      `/hospitals/share`,
      { searchParams },
      {
        skipErrorToast: true,
      }
    )

    return response.data
  } catch (error) {
    throw error
  }
}

export async function exportHospital(searchParams: {
  address?: string
  city?: string
  state?: string
}) {
  try {
    const response = await api.get(`/hospitals/export`, {
      responseType: 'blob',
      params: searchParams,
      skipErrorToast: true,
    })

    return {
      blob: response.data,
      truncated: response.headers['x-export-truncated'] === 'true',
      totalFound: response.headers['x-export-total-found']
        ? parseInt(response.headers['x-export-total-found'], 10)
        : undefined,
    }
  } catch (error) {
    throw error
  }
}

export async function addHospital(hospital: Hospital) {
  try {
    const response = await api.post('/hospitals', hospital, {
      skipErrorToast: true,
    })
    const newHospital = response.data
    return newHospital
  } catch (error) {
    throw error
  }
}

export async function updateHospital(hospital: Hospital, id: number) {
  try {
    const response = await api.patch(`/hospitals/${id}`, hospital, {
      skipErrorToast: true,
    })
    const updatedHospital = response.data
    return updatedHospital
  } catch (error) {
    throw error
  }
}

export async function deleteHospital(id: number) {
  try {
    const response = await api.delete(`/hospitals/${id}`, {
      skipErrorToast: true,
    })
    const deletedHospital = response.data
    return deletedHospital
  } catch (error) {
    throw error
  }
}

export async function autocompleteHospitals(query: string) {
  const { data } = await api.get('/hospitals/autocomplete', {
    params: { q: query },
    skipErrorToast: true,
  })
  return data
}

// TOTP
export async function setupTotp() {
  const { data } = await api.post(
    '/user/totp/setup',
    {},
    {
      skipErrorToast: true,
    }
  )
  return data
}

export async function verifyTotpSetup(setupToken: string, code: string) {
  const { data } = await api.post(
    '/user/totp/verify',
    { setupToken, code },
    {
      skipErrorToast: true,
    }
  )
  return data
}

export async function disableTotp(passwordOrCode: {
  password?: string
  code?: string
}) {
  const { data } = await api.post('/user/totp/disable', passwordOrCode, {
    skipErrorToast: true,
  })
  return data
}

export async function regenerateRecoveryCodes(passwordOrCode: {
  password?: string
  code?: string
}) {
  const { data } = await api.post('/user/totp/recovery-codes', passwordOrCode, {
    skipErrorToast: true,
  })
  return data
}

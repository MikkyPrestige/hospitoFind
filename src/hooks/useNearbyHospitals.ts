import { useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'
import { api } from '@/services/api'
import { NearbyHospital, UseNearbyHospitalsProps } from '@/types/hospital'

export const useNearbyHospitals = ({
  triggerLocation = 0,
}: UseNearbyHospitalsProps) => {
  const [hospitals, setHospitals] = useState<NearbyHospital[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [message, setMessage] = useState<string>('Locating nearby services...')
  const [error, setError] = useState(false)
  const latRef = useRef<number | undefined>()
  const lonRef = useRef<number | undefined>()

  const fetchHospitals = useCallback(async (lat?: number, lon?: number) => {
    setLoading(true)
    setError(false)
    latRef.current = lat
    lonRef.current = lon
    try {
      const params = new URLSearchParams({ limit: '3' })

      if (typeof lat === 'number' && typeof lon === 'number') {
        params.append('lat', lat.toString())
        params.append('lon', lon.toString())
      }

      const response = await api.get(`/hospitals/nearby?${params.toString()}`, {
        skipErrorToast: true,
      })
      const data = response.data
      const results = Array.isArray(data) ? data : data.results || []

      setHospitals(results)

      if (data.message) setMessage(data.message)
      else if (results.length === 0) setMessage('No hospitals found.')
    } catch (err) {
      console.error('Proximity Fetch Error:', err)
      let message =
        'Could not load hospitals. Please check your secure connection.'
      if (axios.isAxiosError(err) && err.response?.status === 429) {
        message = 'Too many requests. Please wait a moment and try again.'
      }
      setMessage(message)
      setHospitals([])
      setError(true)
    }
  }, [])

  // Geolocation Handler
  useEffect(() => {
    if (triggerLocation > 0) {
      if (!navigator.geolocation) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMessage('Geolocation not supported.')
        fetchHospitals()
        return
      }

      setMessage('Acquiring location...')

      navigator.geolocation.getCurrentPosition(
        (pos) => fetchHospitals(pos.coords.latitude, pos.coords.longitude),
        () => {
          setMessage('Location denied. Showing popular hospitals.')
          fetchHospitals()
        },
        { timeout: 10000 }
      )
    } else {
      fetchHospitals()
    }
  }, [triggerLocation, fetchHospitals])

  const retry = useCallback(() => {
    fetchHospitals(latRef.current, lonRef.current)
  }, [fetchHospitals])

  return { hospitals, loading, message, error, retry }
}

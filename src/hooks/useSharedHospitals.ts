import axios from 'axios'
import { useState, useEffect } from 'react'
import { Hospital, RawSharedItem } from '@/types/hospital'
import { api } from '@/services/api'

export const useSharedHospitals = (linkId: string | undefined) => {
  const [hospitalList, setHospitalList] = useState<Hospital[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!linkId) {
      setError('Invalid or missing share link.')
      setLoading(false)
      return
    }

    const fetchSharedList = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await api.get(
          `/hospitals/share/${encodeURIComponent(linkId)}`,
          { skipErrorToast: true }
        )
        const data = response.data
        const normalized = (Array.isArray(data) ? data : []).map(
          (item: RawSharedItem) => ({
            ...item,
            _id: item.hospitalId,
            phoneNumber: item.phoneNumber || item.phone || undefined,
            latitude: item.latitude ?? undefined,
            longitude: item.longitude ?? undefined,
          })
        )
        setHospitalList(normalized as unknown as Hospital[])
      } catch (err: unknown) {
        console.error('Shared List Fetch Error:', err)
        const errorMsg =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : 'Unable to retrieve the shared facility list. The link may be invalid or expired.'
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    fetchSharedList()
  }, [linkId])

  return { hospitalList, loading, error }
}

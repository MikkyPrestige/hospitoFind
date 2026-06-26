import axios from 'axios'
import { useState, useCallback } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Hospital } from '@/types/hospital'
import { toast } from 'react-toastify'
import { HospitalFormData } from '@/types/hospital'

export const useAdminHospitals = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const axiosPrivate = useAxiosPrivate()

  const fetchHospitals = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await axiosPrivate.get('/admin/hospitals', {
        skipErrorToast: true,
      })
      setHospitals(response.data)
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Failed to securely load the hospital directory.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [axiosPrivate])

  const submitHospital = async (
    isEditing: boolean,
    selectedId: string | null,
    formData: HospitalFormData
  ) => {
    try {
      if (isEditing && selectedId) {
        await axiosPrivate.patch(`/hospitals/${selectedId}`, formData, {
          skipErrorToast: true,
        })
        toast.success('Hospital record securely updated.')
      } else {
        await axiosPrivate.post('/hospitals', formData, {
          skipErrorToast: true,
        })
        toast.success('New hospital securely added to the directory.')
      }
      await fetchHospitals()
      return true
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Failed to securely load the hospital directory.'
      toast.error(message)
    }
  }

  const toggleStatus = async (id: string) => {
    try {
      await axiosPrivate.patch(
        `/admin/hospitals/${id}/toggle-status`,
        {},
        {
          skipErrorToast: true,
        }
      )
      toast.success('Hospital verification status updated.')
      await fetchHospitals()
    } catch {
      toast.error(
        'Status update failed. Please verify your connection and try again.'
      )
    }
  }

  const removeHospital = async (id: string) => {
    try {
      await axiosPrivate.delete(`/hospitals/${id}`, {
        skipErrorToast: true,
      })
      toast.success('Hospital record permanently removed.')
      await fetchHospitals()
    } catch {
      toast.error(
        'Deletion failed. Ensure you have the correct administrative permissions.'
      )
    }
  }

  return {
    hospitals,
    isLoading,
    fetchHospitals,
    submitHospital,
    toggleStatus,
    removeHospital,
  }
}

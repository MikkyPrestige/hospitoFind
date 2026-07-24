import axios from 'axios'
import { useState, useCallback } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Hospital, HospitalFormData } from '@/types/hospital'
import { toast } from 'react-toastify'

export const useAdminHospitals = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const axiosPrivate = useAxiosPrivate()

  const fetchHospitals = useCallback(
    async (requestedPage?: number) => {
      const currentPage = requestedPage || page
      try {
        setIsLoading(true)
        const response = await axiosPrivate.get('/admin/hospitals', {
          params: { page: currentPage },
          skipErrorToast: true,
        })
        const data = response.data
        setHospitals(data.hospitals || [])
        setPage(data.page || currentPage)
        setTotalPages(data.totalPages || 1)
        setTotal(data.total || 0)
      } catch (err: unknown) {
        const message =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : 'Failed to securely load the hospital directory.'
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    },
    [axiosPrivate, page]
  )

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
      await fetchHospitals(page)
      return true
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Failed to securely load the hospital directory.'
      toast.error(message)
      return false
    }
  }

  const toggleStatus = async (id: string) => {
    try {
      await axiosPrivate.patch(
        `/admin/hospitals/${id}/toggle-status`,
        {},
        { skipErrorToast: true }
      )
      toast.success('Hospital verification status updated.')
      await fetchHospitals(page)
    } catch {
      toast.error(
        'Status update failed. Please verify your connection and try again.'
      )
    }
  }

  const removeHospital = async (id: string) => {
    try {
      await axiosPrivate.delete(`/admin/hospitals/${id}`, {
        skipErrorToast: true,
      })
      toast.success('Hospital record permanently removed.')
      await fetchHospitals(page)
    } catch {
      toast.error(
        'Deletion failed. Ensure you have the correct administrative permissions.'
      )
    }
  }

  return {
    hospitals,
    isLoading,
    page,
    totalPages,
    total,
    setPage,
    fetchHospitals,
    submitHospital,
    toggleStatus,
    removeHospital,
  }
}

import axios from 'axios'
import { useState, useCallback } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { toast } from 'react-toastify'
import { Hospital } from '@/types/hospital'

export const useAdminPending = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const axiosPrivate = useAxiosPrivate()

  const getPendingHospitals = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await axiosPrivate.get(`/admin/hospitals/pending`, {
        skipErrorToast: true,
      })
      setHospitals(response.data)
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Failed to load pending queue'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [axiosPrivate])

  const approveHospital = async (id: string) => {
    try {
      await axiosPrivate.patch(
        `/admin/hospitals/approve/${id}`,
        {},
        {
          skipErrorToast: true,
        }
      )
      setHospitals((prev) => prev.filter((h) => h._id !== id))
      toast.success('Hospital approved and is now live!')
      return true
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Approval failed'
      toast.error(message)
      return false
    }
  }

  const updateAndApprove = async (hospital: Hospital) => {
    try {
      await axiosPrivate.patch(
        `/admin/hospitals/approve/${hospital._id}`,
        hospital,
        { skipErrorToast: true }
      )
      setHospitals((prev) => prev.filter((h) => h._id !== hospital._id))
      toast.success('Entry corrected and published live!')
      return true
    } catch {
      toast.error('Failed to update and approve')
      return false
    }
  }

  const batchApprove = async (ids: string[]) => {
    try {
      const { data } = await axiosPrivate.patch(
        '/admin/hospitals/approve-batch',
        { ids },
        { skipErrorToast: true }
      )
      setHospitals((prev) => prev.filter((h) => !ids.includes(h._id)))
      toast.success(data.message || 'Hospitals approved!')
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Batch approval failed'
      toast.error(message)
    }
  }

  const deleteSubmission = async (id: string) => {
    try {
      await axiosPrivate.delete(`/admin/hospitals/${id}`, {
        skipErrorToast: true,
      })
      setHospitals((prev) => prev.filter((h) => h._id !== id))
      toast.info('Submission rejected and removed.')
      return true
    } catch {
      toast.error('Failed to reject submission.')
      return false
    }
  }

  return {
    hospitals,
    setHospitals,
    isLoading,
    getPendingHospitals,
    approveHospital,
    updateAndApprove,
    batchApprove,
    deleteSubmission,
  }
}

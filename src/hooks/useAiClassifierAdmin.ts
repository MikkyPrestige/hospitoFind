import axios from 'axios'
import { useState } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { toast } from 'react-toastify'

export const useAiClassifierAdmin = () => {
  const axiosPrivate = useAxiosPrivate()
  const [refreshing, setRefreshing] = useState(false)
  const [clearing, setClearing] = useState(false)

  const refreshAllowedServices = async () => {
    setRefreshing(true)
    try {
      const { data } = await axiosPrivate.post(
        '/admin/ai-classifier/refresh-allowed-services'
      )
      toast.success(data.message || 'Allowed services refreshed.')
      return data
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Failed to refresh allowed services.'
      toast.error(msg)
      throw err
    } finally {
      setRefreshing(false)
    }
  }

  const clearClassifierCache = async () => {
    setClearing(true)
    try {
      const { data } = await axiosPrivate.post(
        '/admin/ai-classifier/clear-cache'
      )
      toast.success(data.message || 'Classifier cache cleared.')
      return data
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Failed to clear classifier cache.'
      toast.error(msg)
      throw err
    } finally {
      setClearing(false)
    }
  }

  return { refreshAllowedServices, clearClassifierCache, refreshing, clearing }
}

import axios from 'axios'
import { useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { SymptomMapping } from '@/types/admin'

export const useSymptomMappings = () => {
  const axiosPrivate = useAxiosPrivate()
  const [mappings, setMappings] = useState<SymptomMapping[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchMappings = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data } = await axiosPrivate.get('/admin/symptoms', {
        skipErrorToast: true,
      })
      setMappings(data)
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Failed to load symptom mappings.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [axiosPrivate])

  const createMapping = useCallback(
    async (keywords: string[], services: string[]) => {
      try {
        const { data } = await axiosPrivate.post(
          '/admin/symptoms',
          { symptomKeywords: keywords, services },
          { skipErrorToast: true }
        )
        setMappings((prev) => [...prev, data])
        toast.success('Symptom mapping created.')
      } catch (err: unknown) {
        const message =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : 'Failed to create mapping.'
        toast.error(message)
        throw err
      }
    },
    [axiosPrivate]
  )

  const updateMapping = useCallback(
    async (id: string, keywords: string[], services: string[]) => {
      try {
        const { data } = await axiosPrivate.put(
          `/admin/symptoms/${id}`,
          { symptomKeywords: keywords, services },
          { skipErrorToast: true }
        )
        setMappings((prev) => prev.map((m) => (m._id === id ? data : m)))
        toast.success('Mapping updated.')
      } catch (err: unknown) {
        const message =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : 'Failed to update mapping.'
        toast.error(message)
        throw err
      }
    },
    [axiosPrivate]
  )

  const deleteMapping = useCallback(
    async (id: string) => {
      try {
        await axiosPrivate.delete(`/admin/symptoms/${id}`, {
          skipErrorToast: true,
        })
        setMappings((prev) => prev.filter((m) => m._id !== id))
        toast.success('Mapping deleted.')
      } catch {
        toast.error('Failed to delete mapping.')
      }
    },
    [axiosPrivate]
  )

  return {
    mappings,
    isLoading,
    fetchMappings,
    createMapping,
    updateMapping,
    deleteMapping,
  }
}

import axios from 'axios'
import { useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { SymptomMapping } from '@/types/admin'

export const useSymptomMappings = () => {
  const axiosPrivate = useAxiosPrivate()
  const [mappings, setMappings] = useState<SymptomMapping[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchMappings = useCallback(
    async (requestedPage?: number) => {
      const currentPage = requestedPage || page
      setIsLoading(true)
      try {
        const { data } = await axiosPrivate.get('/admin/symptoms', {
          params: { page: currentPage },
          skipErrorToast: true,
        })
        setMappings(data.mappings || [])
        setPage(data.page || currentPage)
        setTotalPages(data.totalPages || 1)
        setTotal(data.total || 0)
      } catch (err: unknown) {
        const message =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : 'Failed to load symptom mappings.'
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    },
    [axiosPrivate, page]
  )

  const createMapping = useCallback(
    async (keywords: string[], services: string[]) => {
      try {
        await axiosPrivate.post(
          '/admin/symptoms',
          { symptomKeywords: keywords, services },
          { skipErrorToast: true }
        )
        toast.success('Symptom mapping created.')
        await fetchMappings(page) // refetch current page
      } catch (err: unknown) {
        const message =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : 'Failed to create mapping.'
        toast.error(message)
        throw err
      }
    },
    [axiosPrivate, fetchMappings, page]
  )

  const updateMapping = useCallback(
    async (id: string, keywords: string[], services: string[]) => {
      try {
        await axiosPrivate.put(
          `/admin/symptoms/${id}`,
          { symptomKeywords: keywords, services },
          { skipErrorToast: true }
        )
        toast.success('Mapping updated.')
        await fetchMappings(page)
      } catch (err: unknown) {
        const message =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : 'Failed to update mapping.'
        toast.error(message)
        throw err
      }
    },
    [axiosPrivate, fetchMappings, page]
  )

  const deleteMapping = useCallback(
    async (id: string) => {
      try {
        await axiosPrivate.delete(`/admin/symptoms/${id}`, {
          skipErrorToast: true,
        })
        toast.success('Mapping deleted.')
        await fetchMappings(page)
      } catch {
        toast.error('Failed to delete mapping.')
      }
    },
    [axiosPrivate, fetchMappings, page]
  )

  return {
    mappings,
    isLoading,
    page,
    totalPages,
    total,
    setPage,
    fetchMappings,
    createMapping,
    updateMapping,
    deleteMapping,
  }
}

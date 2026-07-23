import axios from 'axios'
import { useState, useCallback, useEffect } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useAuthContext } from '@/hooks/useAuthContext'
import { Hospital } from '@/types/hospital'
import { toast } from 'react-toastify'

export const useUserSubmissions = () => {
  const [submissions, setSubmissions] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const axiosPrivate = useAxiosPrivate()
  const { state } = useAuthContext()

  const fetchSubmissions = useCallback(
    async (requestedPage?: number) => {
      if (!state?.id && !state?.accessToken) return
      const currentPage = requestedPage || page

      try {
        setLoading(true)
        setError(false)

        const { data } = await axiosPrivate.get('/hospitals/submissions', {
          params: { page: currentPage },
          skipErrorToast: true,
        })

        setSubmissions(data.hospitals || [])
        setPage(data.page || currentPage)
        setTotalPages(data.totalPages || 1)
        setTotal(data.total || 0)
      } catch (err: unknown) {
        console.error('Submissions Fetch Error:', err)
        setError(true)

        if (axios.isAxiosError(err) && err.response?.status !== 401) {
          toast.error('Could not load your submissions. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    },
    [state?.id, state?.accessToken, axiosPrivate, page]
  )

  useEffect(() => {
    fetchSubmissions()
  }, [fetchSubmissions])

  return {
    submissions,
    loading,
    error,
    page,
    totalPages,
    total,
    setPage,
    refetch: fetchSubmissions, // alias for manual refresh
  }
}

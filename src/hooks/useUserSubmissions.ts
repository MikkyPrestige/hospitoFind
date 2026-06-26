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

  const axiosPrivate = useAxiosPrivate()
  const { state } = useAuthContext()

  const fetchSubmissions = useCallback(async () => {
    if (!state?.id && !state?.accessToken) return

    try {
      setLoading(true)
      setError(false)

      const { data } = await axiosPrivate.get('/hospitals/submissions', {
        skipErrorToast: true,
      })
      const validData = Array.isArray(data) ? data : []

      setSubmissions(validData)
    } catch (err: unknown) {
      console.error('Submissions Fetch Error:', err)
      setError(true)

      if (axios.isAxiosError(err) && err.response?.status !== 401) {
        toast.error('Could not load your submissions. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }, [state?.id, state?.accessToken, axiosPrivate])

  useEffect(() => {
    fetchSubmissions()
  }, [fetchSubmissions])

  return { submissions, loading, error, refetch: fetchSubmissions }
}

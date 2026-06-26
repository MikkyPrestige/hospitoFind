import { useState, useCallback, useEffect } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { UserStats } from '@/types/user'

export const useStats = () => {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const axiosPrivate = useAxiosPrivate()

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await axiosPrivate.get('/user/stats', {
        skipErrorToast: true,
      })
      setStats(data)
      setError(false)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [axiosPrivate])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return { stats, loading, error, refresh: fetchStats }
}

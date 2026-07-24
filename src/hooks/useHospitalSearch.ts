import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Hospital, SearchParams } from '@/types/hospital'
import { api } from '@/services/api'

export function useHospitalSearch() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [countries, setCountries] = useState<
    { country: string; hospitals: Hospital[] }[]
  >([])
  const [loadingCountries, setLoadingCountries] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [lastParams, setLastParams] = useState<SearchParams | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const response = await api.get('/hospitals/explore/top', {
          skipErrorToast: true,
        })
        if (mounted)
          setCountries(Array.isArray(response.data) ? response.data : [])
      } catch (err: unknown) {
        if (mounted) setCountries([])
        if (axios.isAxiosError(err) && err.response?.status === 429) {
          toast.error('Too many requests. Please wait a moment and try again.')
        }
      } finally {
        if (mounted) setLoadingCountries(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const performSearch = useCallback(
    async (
      params: SearchParams,
      onSearchResultsChange?: (hasResults: boolean) => void,
      pageToFetch: number = 1
    ) => {
      setLoading(true)
      setError('')
      if (pageToFetch === 1) setHospitals([])
      setLastParams(params)

      try {
        let url = ''
        const trimmedCity = params.city?.trim()
        const trimmedCountry = params.country?.trim()

        if (trimmedCity && trimmedCountry) {
          url = `city=${encodeURIComponent(trimmedCity)}&state=${encodeURIComponent(trimmedCountry)}`
        } else if (params.typedQuery && params.typedQuery.trim().length >= 2) {
          url = `term=${encodeURIComponent(params.typedQuery.trim())}`
        }

        if (url) {
          const response = await api.get(
            `/hospitals/find?${url}&page=${pageToFetch}&limit=15`,
            {
              skipErrorToast: true,
            }
          )
          const data = response.data

          const results = data.results || []
          const total = data.total || 0
          const totalPages = data.totalPages || 1
          const currentPage = data.page || pageToFetch

          if (results.length > 0) {
            setHospitals((prev) =>
              pageToFetch === 1 ? results : [...prev, ...results]
            )
            setTotal(total)
            setTotalPages(totalPages)
            setPage(currentPage)
            onSearchResultsChange?.(true)
          } else {
            if (pageToFetch === 1) {
              setHospitals([])
              setError(
                'We couldn’t find any hospitals matching your search. Please try adjusting your search terms or location.'
              )
              onSearchResultsChange?.(false)
            }
          }
        }
      } catch (err) {
        console.error(err)
        let message = 'Unable to process search request.'
        if (axios.isAxiosError(err) && err.response?.status === 429) {
          message =
            'Too many search requests. Please wait a moment and try again.'
        }
        setError(message)
        onSearchResultsChange?.(false)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const loadMore = useCallback(() => {
    if (lastParams && page < totalPages && !loading) {
      performSearch(lastParams, undefined, page + 1)
    }
  }, [lastParams, page, totalPages, loading, performSearch])

  const clearSearch = useCallback(() => {
    setHospitals([])
    setError('')
    setPage(1)
    setTotalPages(1)
    setTotal(0)
  }, [])

  return {
    hospitals,
    loading,
    error,
    countries,
    loadingCountries,
    page,
    totalPages,
    total,
    performSearch,
    loadMore,
    clearSearch,
  }
}

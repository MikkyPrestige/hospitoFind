import { useState, useCallback } from 'react'
import axios from 'axios'
import { api } from '@/services/api'
import { DiscoveryState } from '@/types/hospital'
import { accessToken } from '@/config/mapbox'

export const useHospitalDiscovery = () => {
  const [state, setState] = useState<DiscoveryState>({
    hospitals: [],
    searching: false,
    error: '',
    searchMode: '',
    locationName: null,
    emptyResultQuery: null,
    geocodedCenter: null,
    page: 1,
    totalPages: 1,
    total: 0,
    lastParams: null,
  })

  const performSearch = useCallback(
    async (
      params: { term?: string; city?: string; state?: string },
      pageToFetch = 1
    ) => {
      setState((prev) => ({
        ...prev,
        searching: true,
        error: '',
        emptyResultQuery: null,
        geocodedCenter: null,
        searchMode: 'term',
        page: pageToFetch,
        lastParams: params,
      }))

      try {
        let queryString = ''
        let displayString = ''

        if (params.city && params.state) {
          queryString = `city=${encodeURIComponent(params.city)}&state=${encodeURIComponent(params.state)}`
          displayString = `${params.city}, ${params.state}`
        } else if (params.term) {
          queryString = `term=${encodeURIComponent(params.term)}`
          displayString = params.term
        } else {
          setState((prev) => ({ ...prev, searching: false }))
          return { data: [], displayString: '' }
        }

        const response = await api.get(
          `/hospitals/find?${queryString}&page=${pageToFetch}&limit=15`,
          {
            skipErrorToast: true,
          }
        )
        const data = response.data

        if (!data || !data.results || data.results.length === 0) {
          let center: [number, number] | null = null
          if (pageToFetch === 1) {
            try {
              const geoRes = await axios.get(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(displayString)}.json?access_token=${accessToken}`
              )
              const feature = geoRes.data.features?.[0]
              if (feature) center = feature.center
            } catch (e) {
              console.error('Geocoding fallback failed', e)
            }
          }

          setState((prev) => ({
            ...prev,
            hospitals: pageToFetch === 1 ? [] : prev.hospitals,
            emptyResultQuery: displayString,
            geocodedCenter: center,
            searching: false,
            totalPages: data?.totalPages || 1,
            total: data?.total || 0,
          }))
          return { data: [], displayString }
        }

        setState((prev) => ({
          ...prev,
          hospitals:
            pageToFetch === 1
              ? data.results
              : [...prev.hospitals, ...data.results],
          searching: false,
          page: data.page,
          totalPages: data.totalPages,
          total: data.total,
        }))
        return { data, displayString }
      } catch (err) {
        console.error('Search Error:', err)
        let message =
          'We encountered an issue searching for hospitals. Please try again.'
        if (axios.isAxiosError(err) && err.response?.status === 429) {
          message =
            'Too many search requests. Please wait a moment and try again.'
        }
        setState((prev) => ({
          ...prev,
          error: message,
          searching: false,
        }))
        return { data: [], displayString: '' }
      }
    },
    []
  )

  const loadMore = useCallback(() => {
    if (state.lastParams && state.page < state.totalPages && !state.searching) {
      performSearch(state.lastParams, state.page + 1)
    }
  }, [
    state.lastParams,
    state.page,
    state.totalPages,
    state.searching,
    performSearch,
  ])

  const fetchNearby = useCallback(
    async (latitude: number, longitude: number) => {
      setState((prev) => ({
        ...prev,
        searching: true,
        error: '',
        emptyResultQuery: null,
      }))
      try {
        const response = await api.get(
          `/hospitals/nearby?lat=${latitude}&lng=${longitude}`,
          { skipErrorToast: true }
        )
        const data = response.data
        const results = data.results || []

        let locName = null
        if (results.length > 0) {
          const { city, state } = results[0].address
          locName = `${city}, ${state}`
        }

        setState((prev) => ({
          ...prev,
          hospitals: results,
          searchMode: 'nearby',
          locationName: locName,
          searching: false,
        }))
        return results
      } catch {
        setState((prev) => ({
          ...prev,
          error:
            'We could not determine your location. Please check your permissions.',
          searching: false,
        }))
        return []
      }
    },
    []
  )

  return { ...state, performSearch, loadMore, fetchNearby }
}

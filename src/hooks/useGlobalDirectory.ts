import { useState, useEffect, useMemo, useCallback } from 'react'
import { CountrySummary } from '@/types/hospital'
import { BASE_URL } from '@/config/api'
import { normalizeName } from '@/utils/formatters'
import { countries as countriesData } from 'countries-list'
import type { ICountryData } from 'countries-list'
import * as iso from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'

// ISO setup
// @ts-expect-error iso library default export handling
const isoLib = iso.default ? iso.default : iso
isoLib.registerLocale(enLocale)

const getContinent = (countryName: string) => {
  const cleanName = countryName.trim()
  if (cleanName === 'South Korea') return 'Asia'
  if (cleanName === 'UAE') return 'Asia'
  const code = isoLib.getAlpha2Code(cleanName, 'en')
  if (!code) return 'Other'
  const data = countriesData[code as keyof typeof countriesData] as
    | ICountryData
    | undefined
  const continentCode = data?.continent
  switch (continentCode) {
    case 'AF':
      return 'Africa'
    case 'NA':
    case 'SA':
      return 'Americas'
    case 'AS':
      return 'Asia'
    case 'EU':
      return 'Europe'
    case 'OC':
      return 'Oceania'
    default:
      return 'Other'
  }
}

export const useGlobalDirectory = () => {
  const [countries, setCountries] = useState<CountrySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCounter, setRetryCounter] = useState(0)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${BASE_URL}/hospitals/explore`)
        if (!res.ok) throw new Error('Network response was not ok')
        const data = await res.json()
        setCountries(data)
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to load directory.'
        console.error('Atlas fetch error:', err)
        setError(message)
      } finally {
        setLoading(false)
      }
    }
    fetchCountries()
  }, [retryCounter])

  // Unify duplicate country entries and add continent
  const unifiedCountries = useMemo(() => {
    const map = new Map<string, CountrySummary & { continent: string }>()
    countries.forEach((item) => {
      const key = normalizeName(item.country)
      if (map.has(key)) {
        const existing = map.get(key)!
        existing.totalHospitals += item.totalHospitals
      } else {
        map.set(key, {
          country: item.country,
          totalHospitals: item.totalHospitals,
          continent: getContinent(item.country),
        })
      }
    })
    return Array.from(map.values())
  }, [countries])

  const retry = useCallback(() => {
    setRetryCounter((c) => c + 1)
  }, [])

  return { unifiedCountries, loading, error, retry }
}

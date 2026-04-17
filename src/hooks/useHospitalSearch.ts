import { useState, useEffect, useCallback } from "react";
import { Hospital } from "@/src/types/hospital";
import { findHospitals } from "@/services/api";
import { BASE_URL } from "@/context/UserProvider";

export function useHospitalSearch() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [countries, setCountries] = useState<{ country: string; hospitals: Hospital[] }[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/hospitals/explore/top`);
        const data = await res.json();
        if (mounted) setCountries(Array.isArray(data) ? data : []);
      } catch {
        if (mounted) setCountries([]);
      } finally {
        if (mounted) setLoadingCountries(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const performSearch = useCallback(async (
    { typedQuery, city, country }: { typedQuery?: string; city?: string; country?: string },
    onSearchResultsChange?: (hasResults: boolean) => void
  ) => {
    setLoading(true);
    setError("");
    setHospitals([]);

    try {
      let url = "";
      if (city && country) {
        url = `city=${encodeURIComponent(city)}&state=${encodeURIComponent(country)}`;
      } else if (typedQuery && typedQuery.trim().length >= 2) {
        url = `term=${encodeURIComponent(typedQuery.trim())}`;
      }

      if (url) {
        const data = await findHospitals(url);

        if (data && data.length > 0) {
          setHospitals(data);
          onSearchResultsChange?.(true);
        } else {
          setHospitals([]);
          setError("No facilities found matching your criteria.");
          onSearchResultsChange?.(false);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Unable to process search request.");
      onSearchResultsChange?.(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setHospitals([]);
    setError("");
  }, []);

  return {
    hospitals,
    loading,
    error,
    countries,
    loadingCountries,
    performSearch,
    clearSearch
  };
}
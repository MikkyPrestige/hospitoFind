import { useState, useEffect, useCallback, useMemo } from "react";
import { HospitalResponse, Hospital } from "@/types/hospital";
import { BASE_URL } from "@/context/UserProvider";

export const useCountryHospitals = (country: string | undefined) => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [fetchingMore, setFetchingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const decodedCountry = useMemo(() => decodeURIComponent(country || ""), [country]);

  const fetchHospitals = useCallback(async () => {
    try {
      if (page === 1) setLoading(true);
      else setFetchingMore(true);
      setError(null);

      const endpoint = `${BASE_URL}/hospitals/country/${encodeURIComponent(decodedCountry)}?page=${page}&limit=9`;

      const res = await fetch(endpoint);

      if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);

      const data: HospitalResponse | Hospital[] = await res.json();
      const hospitalData = Array.isArray(data) ? data : data.hospitals || [];
      const total = Array.isArray(data) ? 1 : data.totalPages || 1;

      setHospitals((prev) => (page === 1 ? hospitalData : [...prev, ...hospitalData]));
      setTotalPages(total);
    } catch (err: any) {
      console.error("HospitoFind API Error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  }, [page, decodedCountry]);

  useEffect(() => {
    fetchHospitals();
  }, [fetchHospitals]);

  const loadMore = useCallback(() => {
    if (!loading && !fetchingMore && page < totalPages) {
      setPage((p) => p + 1);
    }
  }, [loading, fetchingMore, page, totalPages]);

  return {
    hospitals,
    loading,
    fetchingMore,
    totalPages,
    page,
    decodedCountry,
    error,
    loadMore
  };
};
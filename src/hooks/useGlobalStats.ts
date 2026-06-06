import { useState, useEffect, useCallback  } from "react";
import { api } from "@/services/api";
import { GlobalStats } from "@/types/app";

export const useGlobalStats = () => {
  const [stats, setStats] = useState<GlobalStats>({
    totalHospitals: null,
    totalCountries: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCounter, setRetryCounter] = useState(0);

const retry = useCallback(() => {
  setRetryCounter((c) => c + 1);
}, []);

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        setLoading(true);
        setError(false);

        const [countRes, countryRes] = await Promise.all([
          api.get("/hospitals/count", { skipErrorToast: true } as any),
          api.get("/hospitals/stats/countries", { skipErrorToast: true } as any)
        ]);

        setStats({
          totalHospitals: countRes.data.total,
          totalCountries: countryRes.data.length,
        });
      } catch (err) {
        console.error("Global Stats Sync Error:", err);
        setError(true);
        setStats({ totalHospitals: null, totalCountries: null });
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalStats();
  }, [retryCounter]);

  return { ...stats, loading, error, retry  };
};
import { useState, useEffect } from "react";
import { BASE_URL } from "@/context/UserProvider";
import {GlobalStats} from "@/types/app";

export const useGlobalStats = () => {
  const [stats, setStats] = useState<GlobalStats>({
    totalHospitals: null,
    totalCountries: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        setLoading(true);
        setError(false);

        const [countRes, countryRes] = await Promise.all([
          fetch(`${BASE_URL}/hospitals/count`),
          fetch(`${BASE_URL}/hospitals/stats/countries`)
        ]);

        if (!countRes.ok || !countryRes.ok) {
            throw new Error("Failed to securely fetch platform statistics.");
        }

        const countData = await countRes.json();
        const countryData = await countryRes.json();

        setStats({
          totalHospitals: countData.total,
          totalCountries: countryData.length,
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
  }, []);

  return { ...stats, loading, error };
};
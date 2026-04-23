import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {ImportResult} from "@/types/admin";

export const useGoogleImport = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Connecting to Google...");
  const [result, setResult] = useState<ImportResult | null>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const importHospitals = async (city: string, country: string) => {
    setLoading(true);
    setResult(null);
    setLoadingText("Searching for locations...");

    timersRef.current.forEach(clearTimeout);

    timersRef.current = [
      setTimeout(() => setLoadingText("Found locations. Fetching details..."), 2500),
      setTimeout(() => setLoadingText("Downloading photos & reviews..."), 5500),
      setTimeout(() => setLoadingText("Finalizing database entries..."), 9000),
    ];

    try {
      const { data } = await axiosPrivate.post("/admin/hospitals/import-google", {
        city: city.trim(),
        targetCountry: country.trim()
      });

      setResult(data);
      toast.success(`Success! Added ${data.imported} locations with rich data.`);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Import failed. Check your API limits.";
      toast.error(msg);
    } finally {
      timersRef.current.forEach(clearTimeout);
      setLoading(false);
    }
  };

  const resetImport = () => {
    setResult(null);
    setLoadingText("Connecting to Google...");
  };

  return { importHospitals, loading, loadingText, result, resetImport };
};
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { ImportResult } from "@/types/admin";

interface OsmImportResult extends ImportResult {
  preview?: any[];
}

export const useOsmImport = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Connecting to OpenStreetMap...");
  const [result, setResult] = useState<OsmImportResult | null>(null);
  const [dryRunResult, setDryRunResult] = useState<OsmImportResult | null>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const importHospitals = async (city: string, country: string, dryRun = false) => {
    setLoading(true);
    if (dryRun) {
      setDryRunResult(null);
      setLoadingText("Previewing OpenStreetMap data...");
    } else {
      setResult(null);
      setLoadingText("Searching OpenStreetMap...");
    }

    timersRef.current.forEach(clearTimeout);

    timersRef.current = [
      setTimeout(() => setLoadingText("Fetching hospital data..."), 2500),
      setTimeout(() => setLoadingText("Mapping fields and deduplicating..."), 5500),
    ];

    try {
      const url = `/admin/hospitals/import-osm?dryRun=${dryRun}`;
      const { data } = await axiosPrivate.post(url, {
        city: city.trim(),
        targetCountry: country.trim(),
      });

      if (dryRun) {
        setDryRunResult(data);
        toast.success(`Preview complete. ${data.imported} hospitals would be imported.`);
      } else {
        setResult(data);
        toast.success(`Imported ${data.imported} hospitals. Skipped ${data.skipped} duplicates.`);
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "OSM import failed";
      toast.error(msg);
    } finally {
      timersRef.current.forEach(clearTimeout);
      setLoading(false);
    }
  };

  const resetImport = () => {
    setResult(null);
    setDryRunResult(null);
    setLoadingText("Connecting to OpenStreetMap...");
  };

  return { importHospitals, loading, loadingText, result, dryRunResult, resetImport };
};
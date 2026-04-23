import { useState, useEffect, useCallback } from "react";
import { BASE_URL } from "@/context/UserProvider";
import { Alert, UseOutbreaksReturn} from "@/types/media";
import {continentData} from "@/components/constants/outbreakConstants"

export const useOutbreaks = (): UseOutbreaksReturn => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedContinent, setSelectedContinent] = useState("GLOBAL");

    const fetchAlerts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`${BASE_URL}/health/alerts`);

            if (!res.ok) throw new Error("Could not retrieve alerts.");

            const data = await res.json();
            const list = Array.isArray(data) ? data : (data.results || []);
            setAlerts(list);
        } catch (err) {
            setError("Unable to sync with global health registries. Please try again.");
            console.error("Alert Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const autoDetectRegion = useCallback(async () => {
        try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            if (data.continent_code && continentData[data.continent_code as keyof typeof continentData]) {
                setSelectedContinent(data.continent_code);
            }
        } catch (err) {
            console.warn("Region detection failed, defaulting to Global context.");
        }
    }, []);

    useEffect(() => {
        fetchAlerts();
        autoDetectRegion();
    }, [fetchAlerts, autoDetectRegion]);

    const activeData = continentData[selectedContinent as keyof typeof continentData] || continentData.GLOBAL;

    return {
        alerts,
        loading,
        error,
        selectedContinent,
        setSelectedContinent,
        activeData,
        refetch: fetchAlerts
    };
};
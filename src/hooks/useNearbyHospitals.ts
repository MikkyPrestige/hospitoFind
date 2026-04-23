import { useState, useEffect, useCallback } from "react";
import { BASE_URL } from "@/context/UserProvider";
import {NearbyHospital, UseNearbyHospitalsProps} from "@/types/hospital";

export const useNearbyHospitals = ({ triggerLocation = 0 }: UseNearbyHospitalsProps) => {
    const [hospitals, setHospitals] = useState<NearbyHospital[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string>("Locating nearby services...");

    const fetchHospitals = useCallback(async (lat?: number, lon?: number) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ limit: "3" });

            if (typeof lat === 'number' && typeof lon === 'number') {
                params.append("lat", lat.toString());
                params.append("lon", lon.toString());
            }

            const res = await fetch(`${BASE_URL}/hospitals/nearby?${params.toString()}`);

            if (!res.ok) throw new Error("API Request Failed");

            const data = await res.json();
            const results = Array.isArray(data) ? data : (data.results || []);

            setHospitals(results);

            if (data.message) setMessage(data.message);
            else if (results.length === 0) setMessage("No hospitals found.");

        } catch (err) {
            console.error("Proximity Fetch Error:", err);
            setMessage("Could not load hospitals. Please check your secure connection.");
            setHospitals([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Geolocation Handler
    useEffect(() => {
        if (triggerLocation > 0) {
            if (!navigator.geolocation) {
                setMessage("Geolocation not supported.");
                fetchHospitals();
                return;
            }

            setMessage("Acquiring location...");

            navigator.geolocation.getCurrentPosition(
                (pos) => fetchHospitals(pos.coords.latitude, pos.coords.longitude),
                () => {
                    setMessage("Location denied. Showing popular hospitals.");
                    fetchHospitals();
                },
                { timeout: 10000 }
            );
        } else {
            fetchHospitals();
        }
    }, [triggerLocation, fetchHospitals]);

    return { hospitals, loading, message };
};
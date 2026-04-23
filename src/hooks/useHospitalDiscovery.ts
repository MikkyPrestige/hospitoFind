import { useState, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "@/context/UserProvider";
import { findHospitals } from "@/services/api";
import { SearchState } from "@/types/hospital";
import { accessToken } from "@/config/mapbox";

export const useHospitalDiscovery = () => {
    const [state, setState] = useState<SearchState>({
        hospitals: [],
        searching: false,
        error: "",
        searchMode: "term",
        locationName: null,
        emptyResultQuery: null,
        geocodedCenter: null
    });

    const performSearch = useCallback(async (params: { term?: string, city?: string, state?: string }) => {
        setState(prev => ({ ...prev, searching: true, error: "", emptyResultQuery: null, geocodedCenter: null, searchMode: "term" }));

        try {
            let apiQuery = "";
            let displayString = "";

            if (params.city && params.state) {
                apiQuery = `city=${encodeURIComponent(params.city)}&state=${encodeURIComponent(params.state)}`;
                displayString = `${params.city}, ${params.state}`;
            } else if (params.term) {
                apiQuery = `term=${encodeURIComponent(params.term)}`;
                displayString = params.term;
            } else {
                setState(prev => ({ ...prev, searching: false }));
                return { data: [], displayString: "" };
            }

            const data = await findHospitals(apiQuery);

            if (!data || data.length === 0) {
                let center: [number, number] | null = null;
                try {
                    const geoRes = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(displayString)}.json?access_token=${accessToken}`);
                    const feature = geoRes.data.features?.[0];
                    if (feature) center = feature.center;
                } catch (e) {
                    console.error("Geocoding fallback failed", e);
                }

                setState(prev => ({
                    ...prev,
                    hospitals: [],
                    emptyResultQuery: displayString,
                    geocodedCenter: center,
                    searching: false
                }));
                return { data: [], displayString };
            }

            setState(prev => ({ ...prev, hospitals: data, searching: false }));
            return { data, displayString };

        } catch (err) {
            console.error("Search Error:", err);
            setState(prev => ({
                ...prev,
                error: "We encountered an issue searching for hospitals. Please try again.",
                searching: false
            }));
            return { data: [], displayString: "" };
        }
    }, []);

    const fetchNearby = useCallback(async (latitude: number, longitude: number) => {
        setState(prev => ({ ...prev, searching: true, error: "", emptyResultQuery: null }));
        try {
            const response = await fetch(`${BASE_URL}/hospitals/nearby?lat=${latitude}&lng=${longitude}`);
            const data = await response.json();
            const results = data.results || [];

            let locName = null;
            if (results.length > 0) {
                const { city, state } = results[0].address;
                locName = `${city}, ${state}`;
            }

            setState(prev => ({
                ...prev,
                hospitals: results,
                searchMode: "nearby",
                locationName: locName,
                searching: false
            }));
            return results;
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: "We could not determine your location. Please check your permissions.",
                searching: false
            }));
            return [];
        }
    }, []);

    return { ...state, performSearch, fetchNearby };
};
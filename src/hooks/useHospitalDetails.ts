import { useState, useEffect, useRef, useCallback } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { getHospitalDetails, getHospitalByName } from "@/services/api";
import {UseHospitalDetailsProps} from "@/types/hospital";
import { toast } from "react-toastify";

export const useHospitalDetails = ({
    id, country, city, slug, name, accessToken, username
}: UseHospitalDetailsProps) => {
    const [hospital, setHospital] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const lastRecordedId = useRef<string | null>(null);
    const axiosPrivate = useAxiosPrivate();
    const userPrefix = username || "guest";
    const FAV_KEY = `${userPrefix}_favorites`;
    const REC_KEY = `${userPrefix}_recentlyViewed`;

    const addToHistory = useCallback(async (hospitalData: any) => {
        if (!hospitalData) return;

        // Sync Local Storage
        try {
            const raw = JSON.parse(localStorage.getItem(REC_KEY) || "[]");
            const next = [
                { ...hospitalData, viewedAt: Date.now() },
                ...raw.filter((h: any) => h._id !== hospitalData._id)
            ].slice(0, 10);
            localStorage.setItem(REC_KEY, JSON.stringify(next));
        } catch (e) {
            console.error("Local history error", e);
        }

        // Sync Secure Backend
        if (accessToken && hospitalData._id) {
            try {
                await axiosPrivate.post("/user/view", { hospitalId: hospitalData._id });
            } catch (err) {
                console.warn("Background history sync failed");
            }
        }
    }, [REC_KEY, accessToken, axiosPrivate]);

    useEffect(() => {
        const fetchHospital = async () => {
            try {
                setLoading(true);
                setError(null);
                let res;

                if (name) {
                    res = await getHospitalByName(name);
                } else if (slug && country && city) {
                    res = await getHospitalDetails({ id, country, city, slug });
                } else if (id) {
                    res = await getHospitalDetails({ id });
                }

                if (!res) throw new Error("Hospital data not found");

                setHospital(res);

                // Verify Favorites
                const saved = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
                const isFav = saved.some((h: any) => h._id === res._id || h.name === res.name);
                setIsFavorite(isFav);

                // Record History
                if (res?._id && lastRecordedId.current !== res._id) {
                    addToHistory(res);
                    lastRecordedId.current = res._id;
                }

            } catch (err: any) {
                console.error("Fetch error:", err);
                setError(err.message || "Failed to retrieve hospital details.");
            } finally {
                setLoading(false);
            }
        };

        fetchHospital();
    }, [id, country, city, slug, name, FAV_KEY, addToHistory]);

    const toggleFavorite = async () => {
        if (!hospital) return;

        const previousState = isFavorite;
        setIsFavorite(!previousState);

        const saved = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
        let next;

        if (previousState === true) {
            next = saved.filter((h: any) => h._id !== hospital._id && h.name !== hospital.name);
        } else {
            next = [{ ...hospital, savedAt: Date.now() }, ...saved];
        }
        localStorage.setItem(FAV_KEY, JSON.stringify(next));

        if (accessToken && hospital._id) {
            try {
                await axiosPrivate.post(`/user/favorites-status/${hospital._id}`);
                if (!previousState) toast.success("Saved to your dashboard");
                else toast.info("Removed from saved list");
            } catch (err) {
                setIsFavorite(previousState);
                localStorage.setItem(FAV_KEY, JSON.stringify(saved));
                toast.error("Unable to save changes securely.");
            }
        } else if (!accessToken && !previousState) {
            toast.success("Saved to guest favorites");
        }
    };

    return { hospital, loading, error, isFavorite, toggleFavorite };
};
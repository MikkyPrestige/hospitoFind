import { useState, useEffect } from "react";
import { api } from "@/services/api";
import {Tip} from "@/types/media";

export const useHealthTips = () => {
    const [tips, setTips] = useState<Tip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        const storedTips = localStorage.getItem("dailyHealthTips");
        const storedDate = localStorage.getItem("dailyHealthTipDate");

        if (storedTips && storedDate === today) {
            setTips(JSON.parse(storedTips));
            setLoading(false);
            return;
        }

        const fetchTips = async () => {
            try {
                setLoading(true);
                const response = await api.get("/health/tips", { skipErrorToast: true } as any);
                const data = response.data;

                if (Array.isArray(data) && data.length > 0) {
                    setTips(data);
                    localStorage.setItem("dailyHealthTips", JSON.stringify(data));
                    localStorage.setItem("dailyHealthTipDate", today);
                }
            } catch (err) {
                console.error("Failed to fetch tips", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTips();
    }, []);

    return { tips, loading };
};
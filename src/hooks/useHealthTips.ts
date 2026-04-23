import { useState, useEffect } from "react";
import { BASE_URL } from "@/context/UserProvider";
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
                const res = await fetch(`${BASE_URL}/health/tips`);
                const data = await res.json();

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
import { useState, useEffect } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

// const isDev = import.meta.env.MODE === 'development';

// const MOCK_STATS = {
//     totalSubmissions: 12,
//     verifiedSubmissions: 8,
//     contributorLevel: "Elite Guardian"
// };

export const useStats = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const axiosPrivate = useAxiosPrivate();

    const fetchStats = async () => {
        // if (isDev) {
        //     setStats(MOCK_STATS);
        //     setLoading(false);
        //     return;
        // }
        try {
            setLoading(true);
            const { data } = await axiosPrivate.get("/user/stats");
            setStats(data);
            setError(false);
        } catch (err) {
            console.error("Stats fetch failed");
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return { stats, loading, error, refresh: fetchStats };
};
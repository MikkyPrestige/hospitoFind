import { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {DashboardStats} from "@/types/admin";

export const useAdminDashboard = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalHospitals: 0,
        pendingHospitals: 0,
        liveHospitals: 0,
        totalUsers: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const axiosPrivate = useAxiosPrivate();

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosPrivate.get("/hospitals/admin/stats");
            setStats(response.data);
        } catch (err: any) {
            console.error("Dashboard Stats Error:", err);
            setError("Failed to synchronize dashboard analytics.");
        } finally {
            setLoading(false);
        }
    }, [axiosPrivate]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading, error, refresh: fetchStats };
};
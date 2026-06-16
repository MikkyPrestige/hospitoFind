import { useState, useEffect } from "react";
import { Hospital } from "@/types/hospital";
import { api } from "@/services/api";

export const useSharedHospitals = (linkId: string | undefined) => {
    const [hospitalList, setHospitalList] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (!linkId) {
            setError("Invalid or missing share link.");
            setLoading(false);
            return;
        }

        const fetchSharedList = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await api.get(`/hospitals/share/${encodeURIComponent(linkId)}`, { skipErrorToast: true } as any);
                const data = response.data;
                const normalized = (Array.isArray(data) ? data : []).map((item: any) => ({
                    ...item,
                    _id: item.hospitalId,
                    phoneNumber: item.phoneNumber || item.phone || undefined,
                    latitude: item.latitude ?? undefined,
                    longitude: item.longitude ?? undefined,
                }));
                setHospitalList(normalized);
            } catch (err: any) {
                console.error("Shared List Fetch Error:", err);
                const errorMsg = err.response?.data?.message || "Unable to retrieve the shared facility list. The link may be invalid or expired.";
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        };

        fetchSharedList();
    }, [linkId]);

    return { hospitalList, loading, error };
};
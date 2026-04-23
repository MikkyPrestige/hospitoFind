import { useState, useEffect } from "react";
import axios from "axios";
import { Hospital } from "@/types/hospital";
import { BASE_URL } from "@/context/UserProvider";

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
                const { data } = await axios.get(`${BASE_URL}/hospitals/share/${encodeURIComponent(linkId)}`);
                setHospitalList(Array.isArray(data) ? data : []);
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
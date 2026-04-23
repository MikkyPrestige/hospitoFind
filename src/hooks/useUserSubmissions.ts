import { useState, useCallback, useEffect } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useAuthContext } from "@/context/UserProvider";
import { toast } from "react-toastify";

export const useUserSubmissions = () => {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const axiosPrivate = useAxiosPrivate();
    const { state } = useAuthContext();

    const fetchSubmissions = useCallback(async () => {
        if (!state?.id && !state?.accessToken) return;

        try {
            setLoading(true);
            setError(false);

            const { data } = await axiosPrivate.get("/hospitals/submissions");
            const validData = Array.isArray(data) ? data : [];

            setSubmissions(validData);
        } catch (err: any) {
            console.error("Submissions Fetch Error:", err);
            setError(true);

            if (err.response?.status !== 401) {
                toast.error("Could not load your submissions. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }, [state?.id, state?.accessToken, axiosPrivate]);

    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    return { submissions, loading, error, refetch: fetchSubmissions };
};
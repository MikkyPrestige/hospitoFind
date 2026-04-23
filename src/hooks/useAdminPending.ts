import { useState, useCallback } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { Hospital } from "@/types/hospital";

export const useAdminPending = () => {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();

    const getPendingHospitals = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axiosPrivate.get(`/admin/hospitals/pending`);
            setHospitals(response.data);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to load pending queue");
        } finally {
            setIsLoading(false);
        }
    }, [axiosPrivate]);

    const approveHospital = async (id: string) => {
        try {
            await axiosPrivate.patch(`/admin/hospitals/approve/${id}`);
            setHospitals((prev) => prev.filter((h) => h._id !== id));
            toast.success("Hospital approved and is now live!");
            return true;
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Approval failed");
            return false;
        }
    };

    const updateAndApprove = async (hospital: Hospital) => {
        try {
            await axiosPrivate.patch(
                `/admin/hospitals/approve/${hospital._id}`,
                hospital
            );
            setHospitals((prev) => prev.filter((h) => h._id !== hospital._id));
            toast.success("Entry corrected and published live!");
            return true;
        } catch (err) {
            toast.error("Failed to update and approve");
            return false;
        }
    };

    const deleteSubmission = async (id: string) => {
        try {
            await axiosPrivate.delete(`/admin/hospitals/${id}`);
            setHospitals((prev) => prev.filter((h) => h._id !== id));
            toast.info("Submission rejected and removed.");
            return true;
        } catch (err) {
            toast.error("Failed to reject submission.");
            return false;
        }
    };

    return {
        hospitals,
        setHospitals,
        isLoading,
        getPendingHospitals,
        approveHospital,
        updateAndApprove,
        deleteSubmission
    };
};
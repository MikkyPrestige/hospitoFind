import { useState, useCallback } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { HospitalFormData } from "@/types/hospital";

export const useAdminHospitals = () => {
    const [hospitals, setHospitals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();

    const fetchHospitals = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axiosPrivate.get("/admin/hospitals");
            setHospitals(response.data);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to securely load the hospital directory.");
        } finally {
            setIsLoading(false);
        }
    }, [axiosPrivate]);

    const submitHospital = async (isEditing: boolean, selectedId: string | null, formData: HospitalFormData) => {
        try {
            if (isEditing && selectedId) {
                await axiosPrivate.patch(`/hospitals/${selectedId}`, formData);
                toast.success("Hospital record securely updated.");
            } else {
                await axiosPrivate.post("/hospitals", formData);
                toast.success("New hospital securely added to the directory.");
            }
            await fetchHospitals();
            return true;
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Operation failed due to a network or validation error.");
            return false;
        }
    };

    const toggleStatus = async (id: string) => {
        try {
            await axiosPrivate.patch(`/admin/hospitals/${id}/toggle-status`);
            toast.success("Hospital verification status updated.");
            await fetchHospitals();
        } catch (err: any) {
            toast.error("Status update failed. Please verify your connection and try again.");
        }
    };

    const removeHospital = async (id: string) => {
        try {
            await axiosPrivate.delete(`/hospitals/${id}`);
            toast.success("Hospital record permanently removed.");
            await fetchHospitals();
        } catch (err: any) {
            toast.error("Deletion failed. Ensure you have the correct administrative permissions.");
        }
    };

    return {
        hospitals,
        isLoading,
        fetchHospitals,
        submitHospital,
        toggleStatus,
        removeHospital
    };
};
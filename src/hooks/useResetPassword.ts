import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/api";

export const useResetPassword = () => {
    const [loading, setLoading] = useState(false);

    const resetPassword = async (resetToken: string, password: string) => {
        setLoading(true);
        try {
            await api.put(`/auth/reset-password/${resetToken}`, { password }, { skipErrorToast: true } as any);
            toast.success("Password reset successful! Please log in.");
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Invalid or expired token");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { resetPassword, loading };
};
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "@/context/UserProvider";

export const useResetPassword = () => {
    const [loading, setLoading] = useState(false);

    const resetPassword = async (resetToken: string, password: string) => {
        setLoading(true);
        try {
            await axios.put(`${BASE_URL}/auth/reset-password/${resetToken}`, { password });
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
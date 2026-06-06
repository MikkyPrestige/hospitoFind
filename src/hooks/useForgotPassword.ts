import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/api";


export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const sendResetLink = async (email: string) => {
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email }, { skipErrorToast: true } as any);
      toast.success("Reset link sent! Check your email.");
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { sendResetLink, loading };
};
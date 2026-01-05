import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {BASE_URL} from "@/context/userContext"


export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const sendResetLink = async (email: string) => {
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/auth/forgot-password`, { email });
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
import { useState, useCallback } from "react";
import axios from "axios";
import { BASE_URL, useAuthContext } from "@/context/UserProvider";

export const useVerifyEmail = () => {
    const { dispatch } = useAuthContext();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your account...");

    const verify = useCallback(async (token: string | null) => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid verification link. No token found.");
            return;
        }

        try {
            const response = await axios.get(`${BASE_URL}/auth/verify-email?token=${token}`);
            const authData = response.data;

            localStorage.setItem("accessToken", authData.accessToken);
            localStorage.setItem("role", authData.role);
            localStorage.setItem("username", authData.username);

            dispatch({
                type: "LOGIN",
                payload: authData,
            });

            setStatus("success");
            setMessage("Account verified! Taking you to your dashboard...");
            return authData;
        } catch (error: any) {
            setStatus("error");
            setMessage(error.response?.data?.message || "Verification failed or link expired.");
        }
    }, [dispatch]);

    return { verify, status, message };
};
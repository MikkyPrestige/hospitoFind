import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { BASE_URL, useAuthContext } from "@/context/UserProvider";
import Logo from "@/assets/images/logo.svg";
import SimpleHeader from "@/layouts/header/SimpleHeader";
import SimpleFooter from "@/layouts/footer/SimpleFooter";

const VerifyEmail = () => {
    const { dispatch } = useAuthContext();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your account...");
    const hasEffectRun = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (hasEffectRun.current) return;
        hasEffectRun.current = true;

        const verify = async () => {
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

                setTimeout(() => {
                    navigate(authData.role === "admin" ? "/admin" : "/dashboard", { replace: true });
                }, 2000);
            } catch (error: any) {
                setStatus("error");
                setMessage(error.response?.data?.message || "Verification failed or link expired.");
            }
        };

        if (token) verify();
    }, [token, dispatch, navigate]);

    return (
        <>
            <SimpleHeader />
            <div style={{
                height: "100vh", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", padding: "2rem",
                background: "linear-gradient(180deg, #f9fbff 0%, #ffffff 100%)"
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        backgroundColor: "#fff", padding: "3rem", borderRadius: "20px",
                        boxShadow: "0 10px 30px rgba(14, 61, 183, 0.08)",
                        textAlign: "center", maxWidth: "450px", width: "100%"
                    }}
                >
                    <img src={Logo} alt="Logo" style={{ width: 80, marginBottom: "1.5rem" }} />

                    <h1 style={{
                        fontSize: "1.5rem", fontWeight: 700,
                        color: status === "error" ? "#FF033E" : "#0e3db7",
                        marginBottom: "1rem"
                    }}>
                        {status === "loading" ? "Almost there..." :
                            status === "success" ? "Verification Successful!" : "Verification Failed"}
                    </h1>

                    <p style={{ color: "#555", lineHeight: "1.6", marginBottom: "2rem" }}>
                        {message}
                    </p>

                    {status !== "loading" && (
                        <Link to="/login" style={{
                            display: "inline-block", backgroundColor: "#0e3db7", color: "#fff",
                            padding: "0.8rem 2rem", borderRadius: "10px", textDecoration: "none",
                            fontWeight: 600, transition: "transform 0.2s"
                        }}>
                            Proceed to Login
                        </Link>
                    )}
                </motion.div>
            </div>
            <SimpleFooter />
        </>
    );
};

export default VerifyEmail;
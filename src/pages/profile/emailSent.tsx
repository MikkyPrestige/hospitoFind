import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, ExternalLink, RefreshCw } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "@/context/UserProvider";
import SimpleHeader from "@/layouts/header/SimpleHeader";
import SimpleFooter from "@/layouts/footer/SimpleFooter";
import Logo from "@/assets/images/logo.svg";

const EmailSent = () => {
    const location = useLocation();
    const email = location.state?.email || "your email";
    const [resending, setResending] = useState(false);

    const handleResend = async () => {
        setResending(true);
        try {
            await axios.post(`${BASE_URL}/auth/resend-verification`, { email });
            toast.success("A new link has been dispatched!");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Could not resend link.");
        } finally {
            setResending(false);
        }
    };

    return (
        <>
            <SimpleHeader />
            <div style={{
                height: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
                background: "linear-gradient(180deg, #f9fbff 0%, #ffffff 100%)", padding: "20px"
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                        maxWidth: "500px", width: "100%", backgroundColor: "#fff",
                        padding: "3rem", borderRadius: "24px", textAlign: "center",
                        boxShadow: "0 20px 40px rgba(14, 61, 183, 0.05)"
                    }}
                >
                    <motion.img
                        src={Logo}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ width: 80, marginBottom: "2rem" }}
                    />

                    <h1 style={{ color: "#0e3db7", fontSize: "1.8rem", fontWeight: 800, marginBottom: "1rem" }}>
                        Verify your email
                    </h1>

                    <p style={{ color: "#4a5568", lineHeight: "1.6", marginBottom: "2rem" }}>
                        We've sent a verification link to <br />
                        <strong style={{ color: "#1a202c" }}>{email}</strong>. <br />
                        Click the link in the email to activate your account.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <a
                            href="https://mail.google.com/"
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                                backgroundColor: "#0e3db7", color: "#fff", padding: "1rem",
                                borderRadius: "12px", textDecoration: "none", fontWeight: 700
                            }}
                        >
                            <ExternalLink size={18} /> Open Gmail
                        </a>

                        <button
                            onClick={handleResend}
                            disabled={resending}
                            style={{
                                background: "none", border: "1px solid #e2e8f0", color: "#4a5568",
                                padding: "1rem", borderRadius: "12px", fontWeight: 600, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
                            }}
                        >
                            {resending ? <RefreshCw size={18} className="animate-spin" /> : <Mail size={18} />}
                            {resending ? "Resending..." : "Resend Email"}
                        </button>
                    </div>

                    <Link to="/login" style={{
                        marginTop: "2rem", display: "inline-flex", alignItems: "center", gap: "5px",
                        color: "#718096", textDecoration: "none", fontSize: "0.9rem"
                    }}>
                        <ArrowLeft size={16} /> Back to Login
                    </Link>
                </motion.div>
            </div>
            <SimpleFooter />
        </>
    );
};

export default EmailSent;
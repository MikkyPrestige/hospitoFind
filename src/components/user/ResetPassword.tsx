import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "@/context/UserProvider";
import styles from "./styles/forgotPassword/forgotPassword.module.scss"
import SimpleHeader from "@/layouts/header/simpleHeader";
import SimpleFooter from "@/layouts/footer/simpleFooter";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const { resetToken } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.put(`${BASE_URL}/auth/reset-password/${resetToken}`, { password });
            toast.success("Password reset successful! Logging you in...");
            navigate("/login");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Invalid or expired token");
        }
    };

    return (
        <>
            <SimpleHeader />
            <div className={styles.authContainer}>
                <div className={styles.authCard}>
                    <h2>Reset Password</h2>

                    <form onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <input
                                type="password"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        <button className={styles.submitBtn}>
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
            <SimpleFooter />
        </>
    );
};
export default ResetPassword;
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useResetPassword } from "@/hooks/useResetPassword";
import SimpleHeader from "@/layouts/header/simpleHeader";
import SimpleFooter from "@/layouts/footer/simpleFooter";
import styles from "./styles/resetPassword.module.css";

const ResetPassword = () => {
    const { resetToken } = useParams();
    const navigate = useNavigate();

    const { resetPassword, loading } = useResetPassword();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (!resetToken) {
            toast.error("Reset token is missing");
            return;
        }

        const success = await resetPassword(resetToken, password);

        if (success) {
            navigate("/login");
        }
    };

    return (
        <>
            <SimpleHeader />
            <main className={styles.authContainer}>
                <div className={styles.authCard}>
                    <h2 className={styles.title}>Secure Reset</h2>
                    <p className={styles.subtitle}>
                        Almost there. Enter a strong new password for your account.
                    </p>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <input
                                type="password"
                                className={styles.input}
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                autoComplete="new-password"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <input
                                type="password"
                                className={styles.input}
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                autoComplete="new-password"
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={loading || !password}
                        >
                            {loading ? "Updating..." : "Set New Password"}
                        </button>
                    </form>
                </div>
            </main>
            <SimpleFooter />
        </>
    );
};

export default ResetPassword;
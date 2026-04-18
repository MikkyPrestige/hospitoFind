import { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import SimpleHeader from "@/layouts/header/simpleHeader";
import SimpleFooter from "@/layouts/footer/simpleFooter";
import styles from "./styles/forgotPassword.module.css"
import { FiArrowLeft } from "react-icons/fi";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const { sendResetLink, loading } = useForgotPassword();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        const success = await sendResetLink(email);
        if (success) setEmail("");
    };

    return (
        <>
            <SimpleHeader />

            <main className={styles.authContainer}>
                <div className={styles.authCard}>
                    <h2 className={styles.title}>Forgot Password?</h2>
                    <p className={styles.subtitle}>
                        Enter your email address below and we'll send you a secure link to reset your account password.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <input
                                type="email"
                                className={styles.input}
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !email}
                            className={styles.submitBtn}
                        >
                            {loading ? "Sending Link..." : "Send Reset Link"}
                        </button>
                    </form>

                    <div className={styles.authFooter}>
                        <Link to="/login" className={styles.backLink}>
                            <FiArrowLeft className={styles.backIcon} />Back to Login
                        </Link>
                    </div>
                </div>
            </main>
            <SimpleFooter />
        </>
    );
};

export default ForgotPassword;
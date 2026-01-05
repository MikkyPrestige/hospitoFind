import { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPassword } from "@/hooks/user/forgotPassword";
import styles from "./style/scss/forgotPassword/forgotPassword.module.scss";
import Header from "@/layouts/header/nav";

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
        <Header />
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <h2>Forgot Password?</h2>
                <p>Enter your email and we'll send you a reset link.</p>

                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className={styles.submitBtn}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <div className={styles.authFooter}>
                    <Link to="/login">Back to Login</Link>
                </div>
            </div>
        </div>
            <div className={styles.copyright}>
                <p>&copy; {new Date().getFullYear()} HospitoFind Inc. All rights reserved.</p>
            </div>
        </>
    );
};

export default ForgotPassword;
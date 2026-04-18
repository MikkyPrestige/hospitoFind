import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, ExternalLink, RefreshCw } from "lucide-react";
import { useResendVerification } from '@/hooks/useResendVerification';
import SimpleHeader from "@/layouts/header/simpleHeader";
import SimpleFooter from "@/layouts/footer/simpleFooter";
import Logo from "@/assets/images/logo.svg";
import styles from "./styles/scss/emailSent/emailSent.module.scss";

const EmailSent = () => {
    const location = useLocation();
    const email = location.state?.email || "your email";

    const { resendEmail, resending } = useResendVerification();

    const handleResend = () => {
        resendEmail(email);
    };

    return (
        <>
            <SimpleHeader />
            <div className={styles.wrapper}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={styles.card}
                >
                    <motion.img
                        src={Logo}
                        alt="Hospital Logo"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className={styles.logo}
                    />

                    <h1 className={styles.title}>Verify your email</h1>

                    <p className={styles.description}>
                        We've sent a verification link to <br />
                        <strong>{email}</strong>. <br />
                        Click the link in the email to activate your account.
                    </p>

                    <div className={styles.actionGroup}>
                        <a
                            href="https://mail.google.com/"
                            target="_blank"
                            rel="noreferrer"
                            className={styles.primaryBtn}
                        >
                            <ExternalLink size={20} /> Open Gmail
                        </a>

                        <button
                            onClick={handleResend}
                            disabled={resending}
                            className={styles.secondaryBtn}
                        >
                            {resending ? (
                                <RefreshCw size={20} className={styles.spin} />
                            ) : (
                                <Mail size={20} />
                            )}
                            {resending ? "Resending..." : "Resend Email"}
                        </button>
                    </div>

                    <Link to="/login" className={styles.backLink}>
                        <ArrowLeft size={18} /> Back to Login
                    </Link>
                </motion.div>
            </div>
            <SimpleFooter />
        </>
    );
};

export default EmailSent;
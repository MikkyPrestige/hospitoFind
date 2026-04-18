import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useVerifyEmail } from "@/hooks/useVerifyEmail";
import Logo from "@/assets/images/logo.svg";
import SimpleHeader from "@/layouts/header/simpleHeader";
import SimpleFooter from "@/layouts/footer/simpleFooter";
import styles from "./styles/scss/verifyEmail/verifyEmail.module.scss";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const hasEffectRun = useRef(false);

    const { verify, status, message } = useVerifyEmail();

    useEffect(() => {
        if (hasEffectRun.current) return;
        hasEffectRun.current = true;

        const executeVerification = async () => {
            const data = await verify(token);

            if (data) {
                setTimeout(() => {
                    navigate(data.role === "admin" ? "/admin" : "/dashboard", { replace: true });
                }, 2500);
            }
        };

        executeVerification();
    }, [token, verify, navigate]);

    return (
        <>
            <SimpleHeader />
            <main className={styles.container}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.card}
                >
                    <img src={Logo} alt="Logo" className={styles.logo} />

                    <h1 className={`${styles.title} ${styles[status]}`}>
                        {status === "loading" && "Authenticating..."}
                        {status === "success" && "Success!"}
                        {status === "error" && "Verification Failed"}
                    </h1>

                    <p className={styles.message}>{message}</p>

                    {status === "error" && (
                        <Link to="/login" className={styles.btn}>
                            Return to Login
                        </Link>
                    )}
                </motion.div>
            </main>
            <SimpleFooter />
        </>
    );
};

export default VerifyEmail;
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { usePersistLogin } from "@/hooks/usePersistLogin";
import Logo from "@/assets/images/logo.svg";
import styles from "./styles/persistLogin.module.css";

const PersistLogin = () => {
    const { isLoading } = usePersistLogin();

    if (isLoading) {
        return (
            <div className={styles.persistContainer}>
                <motion.img
                    src={Logo}
                    alt="HospitoFind Logo"
                    className={styles.logo}
                    animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={styles.loadingText}
                >
                    Securing your session...
                </motion.p>
            </div>
        );
    }

    return <Outlet />;
};
export default PersistLogin;
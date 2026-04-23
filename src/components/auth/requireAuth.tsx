import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { motion } from "framer-motion";
import { useAuthContext } from "@/context/UserProvider";
import { RequireAuthProps } from "@/types/auth";
import Logo from "@/assets/images/logo.svg";
import styles from "./styles/requireAuth.module.css";

const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
    const { state } = useAuthContext();
    const { isLoading: auth0Loading } = useAuth0();
    const location = useLocation();

    const isSyncing = auth0Loading || (localStorage.getItem("accessToken") && !state.role);

    if (isSyncing) {
        return (
            <div className={styles.loaderContainer}>
                <motion.img
                    src={Logo}
                    alt="HospitoFind Loading"
                    className={styles.logo}
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.6, 1, 0.6]
                    }}
                    transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <p className={styles.statusText}>
                    Verifying permissions...
                </p>
            </div>
        );
    }

    const isUserLoggedIn = !!(state.accessToken && state.role);

    const hasRequiredRole = state.role && allowedRoles.includes(state.role as "user" | "admin");

    if (isUserLoggedIn && hasRequiredRole) {
        return <Outlet />;
    }

    if (isUserLoggedIn && !hasRequiredRole) {
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }

    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireAuth;
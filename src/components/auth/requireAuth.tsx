import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/context/UserProvider";
import { useAuth0 } from "@auth0/auth0-react";
import { motion } from "framer-motion";
import Logo from "@/assets/images/logo.svg";

interface Props {
    allowedRoles: ("user" | "admin")[];
}

const RequireAuth = ({ allowedRoles }: Props) => {
    const { state } = useAuthContext();
    const { isLoading: auth0Loading } = useAuth0();
    const location = useLocation();

    const isSyncing = auth0Loading || (localStorage.getItem("accessToken") && !state.role);

    if (isSyncing) {
        return (
            <div style={{
                display: "flex", flexDirection: "column", justifyContent: "center",
                alignItems: "center", height: "100vh",
                backgroundColor: "var(--color-bg)",
            }}>
                <motion.img
                    src={Logo}
                    alt="HospitoFind Loading"
                    style={{ width: 60, height: 60, marginBottom: "1.2rem" }}
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
                <p style={{
                    color: "var(--color-blue)",
                    fontSize: "1rem",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    fontFamily: "var(--font-inter)"
                }}>
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
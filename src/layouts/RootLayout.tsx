import { Outlet, useNavigation, useLocation } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import AdminBreadcrumbs from "../components/admin/breadCrumbs";
import Logo from "@/assets/images/logo.svg";

// 🛡️ NProgress Configuration
NProgress.configure({
    showSpinner: false,
    speed: 400,
    minimum: 0.2,
    easing: 'ease-in-out'
});

export default function RootLayout() {
    const navigation = useNavigation();
    const location = useLocation();

    const isAdminPath = location.pathname.startsWith("/admin");

    useEffect(() => {
        if (navigation.state === "loading") {
            NProgress.start();
        } else {
            NProgress.done();
        }
    }, [navigation.state]);

    return (
        <>
            <style>
                {`
                    #nprogress .bar {
                        background: #0e3db7 !important;
                        height: 3px !important;
                        box-shadow: 0 0 10px rgba(14, 61, 183, 0.5);
                        z-index: 10001 !important;
                    }
                    #nprogress .peg {
                        box-shadow: 0 0 10px #0e3db7, 0 0 5px #0e3db7 !important;
                    }
                `}
            </style>

            {/* --- GLOBAL API OVERLAY (Managed by Axios Interceptor) --- */}
            <div
                id="global-loader"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    display: "none",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 10000,
                    flexDirection: "column",
                    gap: "1.2rem"
                }}
            >
                <motion.img
                    src={Logo}
                    alt="Synchronizing..."
                    style={{ width: 75, height: 75 }}
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            <div className="app-main-content" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                {isAdminPath && (
                    <div className="breadcrumb-container" style={{ padding: "0 2rem" }}>
                        <AdminBreadcrumbs />
                    </div>
                )}

                <Suspense
                    fallback={
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100vh",
                                width: "100vw",
                                background: "linear-gradient(180deg, #f9fbff 0%, #ffffff 100%)",
                                color: "#0e3db7",
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            <motion.img
                                src={Logo}
                                alt="HospitoFind Logo"
                                style={{ width: 85, height: 85, marginBottom: "1.5rem" }}
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.8, 1, 0.8]
                                }}
                                transition={{
                                    duration: 1.8,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />

                            <motion.h2
                                style={{
                                    fontSize: "1.2rem",
                                    fontWeight: 600,
                                    color: "#0e3db7",
                                    letterSpacing: "0.3px",
                                }}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                Connecting you to trusted healthcare...
                            </motion.h2>
                        </div>
                    }
                >
                    <Outlet />
                </Suspense>
            </div>
        </>
    );
}
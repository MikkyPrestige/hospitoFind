import { Outlet, useNavigation, useLocation } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import AdminBreadcrumbs from "@/components/admin/breadCrumbs";
import Logo from "@/assets/images/logo.svg";
import style from "./rootLayout.module.css";

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
        <div className={style.nprogressOverride}>
            {navigation.state === "loading" && (
                <div id="global-loader" className={style.globalLoader}>
                    <motion.img
                        src={Logo}
                        alt="Synchronizing data..."
                        style={{ width: 75, height: 75 }}
                        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
            )}

            <main className={style.mainContent}>
                {isAdminPath && (
                    <div className={style.breadcrumbWrapper}>
                        <AdminBreadcrumbs />
                    </div>
                )}

                <Suspense
                    fallback={
                        <div className={style.suspenseFallback}>
                            <motion.img
                                src={Logo}
                                alt="HospitoFind Loading"
                                style={{ width: 85, height: 85, marginBottom: "1.5rem" }}
                                animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.h2
                                className={style.statusText}
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
            </main>
        </div>
    );
}
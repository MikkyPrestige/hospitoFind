import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuthContext, BASE_URL } from "@/context/userContext";
import { motion } from "framer-motion";
import Logo from "@/assets/images/logo.svg";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { state, dispatch } = useAuthContext();
    const effectRun = useRef(false);
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            console.log("🔄 PersistLogin: Verifying persistent session...");
            try {
                const response = await axios.get(`${BASE_URL}/auth/refresh`, {
                    withCredentials: true
                });

                console.log("✅ PersistLogin: Session synchronized.");
                dispatch({
                    type: 'REFRESH',
                    payload: response.data
                });
            } catch (err) {
                console.warn("❌ PersistLogin: No valid session found.");

                const authPages = ['/login', '/signup', '/verify-email', '/email-sent'];
                const isAuthPage = authPages.some(path => location.pathname.includes(path));

                if (!isAuthPage) {
                    localStorage.removeItem("accessToken");
                    dispatch({ type: 'LOGOUT' });
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        const storedToken = localStorage.getItem("accessToken");

        if (!state?.accessToken && storedToken) {
            verifyRefreshToken();
        } else {
            setIsLoading(false);
        }

        return () => {
            isMounted = false;
            effectRun.current = true;
        };
    }, [location.pathname]);

    return (
        <>
            {isLoading ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                        width: "100vw",
                        background: "linear-gradient(180deg, #f9fbff 0%, #ffffff 100%)",
                        zIndex: 30000
                    }}
                >
                    <motion.img
                        src={Logo}
                        alt="HospitoFind"
                        style={{ width: 80, height: 80, marginBottom: "1.5rem" }}
                        animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ color: "#0e3db7", fontWeight: 600, fontSize: "0.95rem" }}
                    >
                        Securing your session...
                    </motion.p>
                </div>
            ) : (
                <Outlet />
            )}
        </>
    );
};

export default PersistLogin;

// import { Outlet } from "react-router-dom";
// import { useState, useEffect } from "react";
// import useRefresh from "@/hooks/user/useRefresh";
// import { useAuthContext } from "@/context/userContext";

// const PersistLogin = () => {
//     const [isLoading, setIsLoading] = useState(true);
//     const refresh = useRefresh();
//     const { state } = useAuthContext();

//     useEffect(() => {
//         let isMounted = true;

//         const verifyRefreshToken = async () => {
//             try {
//                 //  Call refresh to get new access token
//                 await refresh();
//             } catch (err) {
//                 console.error(err);
//             } finally {
//                 isMounted && setIsLoading(false);
//             }
//         };

//         //  If no access token, try to refresh it
//         !state.accessToken ? verifyRefreshToken() : setIsLoading(false);

//         return () => { isMounted = false };
//     }, []);

//     return (
//         <>
//             {isLoading ? <p>Loading...</p> : <Outlet />}
//         </>
//     );
// };

// export default PersistLogin;
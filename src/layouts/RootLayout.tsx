import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import { motion } from "framer-motion";
import Logo from "@/assets/images/logo.svg";

export default function RootLayout() {
    return (
        <Suspense
            fallback={
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                        background: "linear-gradient(180deg, #f9fbff 0%, #ffffff 100%)",
                        color: "#0e3db7",
                        fontFamily: "'Inter', sans-serif",
                    }}
                >
                    <motion.img
                        src={Logo}
                        alt="HospitoFind logo"
                        style={{ width: 80, height: 80, marginBottom: "1rem" }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    />

                    <motion.h2
                        style={{
                            fontSize: "1.25rem",
                            fontWeight: 600,
                            color: "#0e3db7",
                            letterSpacing: "0.5px",
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        Connecting you to trusted healthcare...
                    </motion.h2>

                    <motion.div
                        style={{
                            marginTop: "2rem",
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            border: "3px solid rgba(14, 61, 183, 0.15)",
                            borderTopColor: "#0e3db7",
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            }
        >
            <Outlet />
        </Suspense>
    );
}


// import { Outlet } from "react-router-dom";
// import { Suspense } from "react";
// import Loading from "@/assets/images/loading.gif";

// export default function RootLayout() {
//     return (
//         <Suspense
//             fallback={
//                 <div style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     height: "100vh",
//                 }}>
//                     <img src={Loading} alt="Loading..." />
//                 </div>
//             }
//         >
//             <Outlet />
//         </Suspense>
//     );
// }

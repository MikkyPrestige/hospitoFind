import { motion } from "framer-motion";
import Logo from "@/assets/images/logo.svg";

export const ComponentPulse = () => (
    <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "var(--color-bg)",
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem'
    }}>
        <motion.img
            src={Logo}
            alt="HospitoFind Pulse"
            style={{ width: 80, height: 80 }}
            animate={{
                scale: [1, 1.15, 1],
                opacity: [0.6, 1, 0.6]
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
    </div>
);
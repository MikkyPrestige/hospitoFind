import { motion } from "framer-motion";
import Logo from "@/assets/images/logo.svg";
import styles from "./styles/componentPulse.module.css";

export const ComponentPulse = () => (
    <div className={styles.pulseOverlay}>
        <motion.img
            src={Logo}
            alt="HospitoFind Pulse"
            className={styles.pulseLogo}
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
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { FiArrowLeft } from "react-icons/fi";
import styles from "./styles/simpleHeader.module.css";

const SimpleHeader = () => {
    return (
        <header className={styles.header}>
            <div className={styles.rightSection}>
                <Link to="/" className={styles.backLink}>
                    <FiArrowLeft className={styles.icon} />
                    <span>Back to Home</span>
                </Link>

                <div className={styles.toggleWrapper}>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
};

export default SimpleHeader;
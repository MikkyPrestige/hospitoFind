import { Link } from "react-router-dom";
import { FaCopyright } from 'react-icons/fa';
import styles from "./styles/simpleFooter.module.css";

const SimpleFooter = () => {
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.copyright}>
                <FaCopyright /> {year} HospitoFind. All rights reserved.
            </div>

            <div className={styles.links}>
                <Link to="/policy" className={styles.link}>
                    Privacy Policy
                </Link>
                <Link to="/terms" className={styles.link}>
                    Terms of Service
                </Link>
                <Link to="/faq" className={styles.link}>
                    Help
                </Link>
            </div>
        </footer>
    );
};

export default SimpleFooter;
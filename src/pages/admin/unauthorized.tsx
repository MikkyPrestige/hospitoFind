import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import styles from "./style/unauthorized.module.css";

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className={styles.container}>
                <div className={styles.contentCard}>
                    <div className={styles.iconWrapper}>
                        <ShieldAlert size={80} className={styles.icon} />
                    </div>
                    <h1>Access Restricted</h1>
                    <p>
                        Your current account level does not have the permissions required
                        to access this administrative zone.
                    </p>

                    <div className={styles.actions}>
                        <button onClick={() => navigate(-1)} className={styles.btnBack}>
                            <ArrowLeft size={18} /> Go Back
                        </button>
                        <button onClick={() => navigate("/")} className={styles.btnHome}>
                            <Home size={18} /> Return Home
                        </button>
                    </div>

                    <div className={styles.footerNote}>
                        <p>Think this is a mistake? Contact your system administrator.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Unauthorized;
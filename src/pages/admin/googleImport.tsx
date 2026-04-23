import { useState } from "react";
import { toast } from "react-toastify";
import {
    FiDownloadCloud,
    FiCheckCircle,
    FiAlertCircle,
    FiMapPin,
    FiGlobe
} from "react-icons/fi";
import { MdOutlineCleaningServices } from "react-icons/md";
import { useGoogleImport } from "@/hooks/useGoogleImport";
import styles from "./styles/scss/googleImport/googleImport.module.scss";

const GoogleImport = ({ onSuccess }: { onSuccess?: () => void }) => {
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const { importHospitals, loading, loadingText, result, resetImport } = useGoogleImport(onSuccess);

    const handleImport = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!city || !country) {
            toast.error("Please enter both City and Country");
            return;
        }
        await importHospitals(city, country);
    };

    const handleReset = () => {
        setCity("");
        setCountry("");
        resetImport();
    };

    return (
        <div className={styles.importCard}>
            <header className={styles.header}>
                <div className={styles.iconWrapper}>
                    <FiDownloadCloud />
                </div>
                <div>
                    <h3>Import from Google Maps</h3>
                    <p>Bulk add hospitals with photos, hours, and reviews.</p>
                </div>
            </header>

            {!result ? (
                <form onSubmit={handleImport} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <div className={styles.inputWrapper}>
                            <FiMapPin className={styles.inputIcon} />
                            <input
                                type="text"
                                placeholder="City (e.g. London)"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className={styles.inputWrapper}>
                            <FiGlobe className={styles.inputIcon} />
                            <input
                                type="text"
                                placeholder="Country (e.g. UK)"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={styles.importBtn}
                        disabled={loading || !city || !country}
                    >
                        {loading ? "Processing..." : "Start Rich Import"}
                    </button>
                </form>
            ) : (
                /* --- RESULT SUMMARY --- */
                <div className={styles.resultBox}>
                    <div className={styles.statsGrid}>
                        <div className={`${styles.stat} ${styles.success}`}>
                            <span className={styles.count}>{result.imported}</span>
                            <span className={styles.label}>Imported</span>
                            <FiCheckCircle className={styles.statIcon} />
                        </div>
                        <div className={`${styles.stat} ${styles.skipped}`}>
                            <span className={styles.count}>{result.skipped}</span>
                            <span className={styles.label}>Duplicates (Skipped)</span>
                            <FiAlertCircle className={styles.statIcon} />
                        </div>
                    </div>

                    <p className={styles.resultMsg}>{result.message}</p>

                        <button onClick={handleReset} className={styles.resetBtn}>
                        <MdOutlineCleaningServices /> Import Another Location
                    </button>
                </div>
            )}

            {loading && (
                <div className={styles.loaderOverlay}>
                    <div className={styles.spinner}></div>
                    <p className={styles.loadingText}>{loadingText}</p>
                    <small className={styles.loadingSubtext}>
                        (Rich data import takes 5-10 seconds per batch)
                    </small>
                </div>
            )}
        </div>
    );
};

export default GoogleImport;
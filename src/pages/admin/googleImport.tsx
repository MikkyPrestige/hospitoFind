import { useState, useEffect, useRef } from "react";
import {
    FiDownloadCloud,
    FiCheckCircle,
    FiAlertCircle,
    FiMapPin,
    FiGlobe
} from "react-icons/fi";
import { MdOutlineCleaningServices } from "react-icons/md";
import useAxiosPrivate from "@/hooks/user/useAxiosPrivate";
import { toast } from "react-toastify";
import styles from "./style//scss/googleImport/googleImport.module.scss";

// Interface for the API response
interface ImportResult {
    message: string;
    imported: number;
    skipped: number;
}

const GoogleImport = ({ onSuccess }: { onSuccess?: () => void }) => {
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("Connecting to Google...");
    const [result, setResult] = useState<ImportResult | null>(null);

    // Refs to manage timers prevents memory leaks if component unmounts
    const timersRef = useRef<NodeJS.Timeout[]>([]);
    const axiosPrivate = useAxiosPrivate();

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            timersRef.current.forEach(clearTimeout);
        };
    }, []);

    const handleImport = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!city || !country) {
            toast.error("Please enter both City and Country");
            return;
        }

        setLoading(true);
        setResult(null);
        setLoadingText("Searching for locations...");

        //  UX: Cycle messages to keep user engaged during the 5-10s wait
        // clear any existing timers first
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [
            setTimeout(() => setLoadingText("Found locations. Fetching details..."), 2500),
            setTimeout(() => setLoadingText("Downloading photos & reviews..."), 5500),
            setTimeout(() => setLoadingText("Finalizing database entries..."), 9000),
        ];

        try {
            // API Call
            const { data } = await axiosPrivate.post("/admin/hospitals/import-google", {
                city: city.trim(),
                targetCountry: country.trim()
            });

            setResult(data);
            toast.success(`Success! Added ${data.imported} locations with rich data.`);

            // Refresh the parent dashboard numbers
            if (onSuccess) onSuccess();

        } catch (err: any) {
            console.error("Import Error:", err);
            const msg = err.response?.data?.message || "Import failed. Check your API limits.";
            toast.error(msg);
        } finally {
            // Cleanup
            timersRef.current.forEach(clearTimeout);
            setLoading(false);
        }
    };

    const resetForm = () => {
        setCity("");
        setCountry("");
        setResult(null);
        setLoadingText("Connecting to Google...");
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
                /* --- INPUT FORM --- */
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

                    <button onClick={resetForm} className={styles.resetBtn}>
                        <MdOutlineCleaningServices /> Import Another Location
                    </button>
                </div>
            )}

            {/* --- LOADING OVERLAY --- */}
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
import { useState } from "react";
import { FiDownloadCloud, FiCheckCircle, FiAlertCircle, FiMapPin } from "react-icons/fi";
import { MdOutlineCleaningServices } from "react-icons/md";
import useAxiosPrivate from "@/hooks/user/useAxiosPrivate";
import { toast } from "react-toastify";
import styles from "./style/scss/googleImport/googleImport.module.scss";

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
    const [result, setResult] = useState<ImportResult | null>(null);

    const axiosPrivate = useAxiosPrivate();

    const handleImport = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!city || !country) {
            toast.error("Please enter both City and Country");
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const { data } = await axiosPrivate.post("/admin/hospitals/import-google", {
                city: city.trim(),
                targetCountry: country.trim()
            });

            setResult(data);
            toast.success(`Successfully imported ${data.imported} hospitals!`);

            if (onSuccess) onSuccess();

        } catch (err: any) {
            const msg = err.response?.data?.message || "Import failed. Check your API limits.";
            toast.error(msg);
            console.error("Import Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setCity("");
        setCountry("");
        setResult(null);
    };

    return (
        <div className={styles.importCard}>
            <header className={styles.header}>
                <div className={styles.iconWrapper}>
                    <FiDownloadCloud />
                </div>
                <div>
                    <h3>Import from Google Maps</h3>
                    <p>Bulk add hospitals from Google Places API to your review queue.</p>
                </div>
            </header>

            {!result ? (
                <form onSubmit={handleImport} className={styles.form}>
                    <div className={styles.inputGroup}>
                        {/* CITY INPUT */}
                        <div className={styles.inputWrapper}>
                            <FiMapPin className={styles.inputIcon} />
                            <input
                                type="text"
                                placeholder="City (e.g. Sao Paulo)"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        {/* COUNTRY INPUT */}
                        <div className={styles.inputWrapper}>
                            <FiMapPin className={styles.inputIcon} />
                            <input
                                type="text"
                                placeholder="Country (e.g. Brazil)"
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
                        {loading ? "Connecting to Google..." : "Start Import"}
                    </button>
                </form>
            ) : (
                /* RESULT VIEW */
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

            {/* LOADER OVERLAY */}
            {loading && (
                <div className={styles.loaderOverlay}>
                    <div className={styles.spinner}></div>
                    <p>Fetching data from Google Maps...</p>
                </div>
            )}
        </div>
    );
};

export default GoogleImport;
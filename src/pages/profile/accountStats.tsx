import { useState, useEffect } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { FiAward, FiCheckCircle, FiPlusSquare } from "react-icons/fi";
import styles from "./styles/scss/accountStats/accountStats.module.scss";

const AccountStats = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axiosPrivate.get("/users/stats");
                setStats(data);
            } catch (err) {
                console.error("Stats fetch failed");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className={styles.statsLoader}>Gathering your impact...</div>;

    return (
        <div className={styles.statsGrid}>
            <div className={styles.statCard}>
                <div className={`${styles.iconCircle} ${styles.blue}`}>
                    <FiPlusSquare />
                </div>
                <div className={styles.statInfo}>
                    <span>Total Added</span>
                    <h3>{stats?.totalSubmissions || 0}</h3>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={`${styles.iconCircle} ${styles.green}`}>
                    <FiCheckCircle />
                </div>
                <div className={styles.statInfo}>
                    <span>Verified</span>
                    <h3>{stats?.verifiedSubmissions || 0}</h3>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={`${styles.iconCircle} ${styles.purple}`}>
                    <FiAward />
                </div>
                <div className={styles.statInfo}>
                    <span>Rank</span>
                    <h3>{stats?.contributorLevel}</h3>
                </div>
            </div>
        </div>
    );
};

export default AccountStats;
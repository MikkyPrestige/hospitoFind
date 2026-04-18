import { FiAward, FiCheckCircle, FiPlusSquare, FiActivity } from "react-icons/fi";
import { useStats } from "@/hooks/useStats";
import styles from "./styles/scss/accountStats/accountStats.module.scss";

const AccountStats = () => {
    const { stats, loading, error } = useStats();

    if (loading) {
        return (
            <div className={styles.skeletonGrid}>
                {[1, 2, 3].map((i) => <div key={i} className={styles.skeletonCard} />)}
            </div>
        );
    }

    if (error) return null;

    return (
        <div className={styles.statsGrid}>
            <div className={styles.statCard}>
                <div className={styles.cardHeader}>
                    <div className={`${styles.iconWrapper} ${styles.blue}`}>
                        <FiPlusSquare />
                    </div>
                    <span className={styles.trend}>+12% this month</span>
                </div>
                <div className={styles.cardBody}>
                    <h3>{stats?.totalSubmissions || 0}</h3>
                    <p>Total Facilities Added</p>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.cardHeader}>
                    <div className={`${styles.iconWrapper} ${styles.green}`}>
                        <FiCheckCircle />
                    </div>
                    <div className={styles.verifiedBadge}>Active</div>
                </div>
                <div className={styles.cardBody}>
                    <h3>{stats?.verifiedSubmissions || 0}</h3>
                    <p>Verified Records</p>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.cardHeader}>
                    <div className={`${styles.iconWrapper} ${styles.purple}`}>
                        <FiAward />
                    </div>
                    <FiActivity className={styles.pulseIcon} />
                </div>
                <div className={styles.cardBody}>
                    <h3 className={styles.rankText}>{stats?.contributorLevel || "Novice"}</h3>
                    <p>Community Rank</p>
                    <div className={styles.progressContainer}>
                        <div className={styles.progressBar} style={{ width: '65%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountStats;
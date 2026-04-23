import { Link } from "react-router-dom";
import {
    FiActivity, FiClock, FiCheckCircle, FiUsers, FiArrowRight, FiUserCheck, FiDatabase, FiLogOut
} from "react-icons/fi";
import { FaExclamationTriangle } from 'react-icons/fa';
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import useLogout from "@/hooks/useLogout";
import GoogleImport from "./googleImport";
import ThemeToggle from "@/components/ui/ThemeToggle"
import styles from "./styles/scss/adminDashboard/adminDashboard.module.scss";

const AdminDashboard = () => {
    const { logout } = useLogout();
    const { stats, loading, error, refresh } = useAdminDashboard();

    const handleLogout = () => {
        logout();
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Securing Administrative Session...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.dashboardContainer}>
                <div className={styles.errorContainer}>
                    <p><FaExclamationTriangle /> {error}</p>
                    <button onClick={refresh} className={styles.retryBtn}>
                        Retry Synchronization
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.dashboardContainer}>
            <header className={styles.header}>
                <h1>Admin Overview</h1>
                <div className={styles.actions}>
                    <ThemeToggle />
                    <button onClick={handleLogout}><FiLogOut size={24} /></button>
                </div>
            </header>

            <div className={styles.statsGrid}>
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className={styles.skeletonCard} />
                    ))
                ) : (
                    <>
                <div className={styles.statCard}>
                    <div className={`${styles.iconWrapper} ${styles.iconUsers}`}>
                        <FiUsers size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span>Platform Users</span>
                        <h3>{stats.totalUsers.toLocaleString()}</h3>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.iconWrapper} ${styles.iconTotal}`}>
                        <FiActivity size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span>Total Registered</span>
                        <h3>{stats.totalHospitals.toLocaleString()}</h3>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.iconWrapper} ${styles.iconPending}`}>
                        <FiClock size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span>Pending Review</span>
                        <h3 className={stats.pendingHospitals > 0 ? styles.alertText : ''}>
                            {stats.pendingHospitals}
                        </h3>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.iconWrapper} ${styles.iconLive}`}>
                        <FiCheckCircle size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span>Live Facilities</span>
                        <h3>{stats.liveHospitals.toLocaleString()}</h3>
                    </div>
                </div>
                        </>
                )}
            </div>

            <section className={styles.adminNav}>
                <div className={styles.sectionHeader}>
                    <h2>Management Systems</h2>
                    <div className={styles.headerLine}></div>
                </div>

                <div className={styles.navGrid}>
                    <Link to="/admin/hospitals" className={styles.navCard}>
                        <div className={styles.navIcon}><FiDatabase /></div>
                        <div className={styles.navText}>
                            <strong>Manage Hospital Directory</strong>
                            <p>Perform deep-edits, audit logs, or remove invalid facility entries.</p>
                        </div>
                        <FiArrowRight className={styles.navArrow} />
                    </Link>

                    <Link to="/admin/users" className={styles.navCard}>
                        <div className={styles.navIcon}><FiUserCheck /></div>
                        <div className={styles.navText}>
                            <strong>User & Permission Control</strong>
                            <p>Adjust administrative roles and monitor user account security.</p>
                        </div>
                        <FiArrowRight className={styles.navArrow} />
                    </Link>

                    <Link to="/admin/pending" className={styles.navCard}>
                        <div className={styles.navIcon}><FiClock /></div>
                        <div className={styles.navText}>
                            <strong>Review Submission Queue</strong>
                            <p>Verify {stats.pendingHospitals} pending submissions from the community.</p>
                        </div>
                        <FiArrowRight className={styles.navArrow} />
                    </Link>
                </div>
            </section>

            <section className={styles.adminNav} style={{ marginTop: '3rem' }}>
                <div className={styles.sectionHeader}>
                    <h2>Data Acquisition Tools</h2>
                    <div className={styles.headerLine}></div>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                    <GoogleImport onSuccess={refresh} />
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
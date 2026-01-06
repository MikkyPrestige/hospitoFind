import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import useAxiosPrivate from "@/hooks/user/useAxiosPrivate";
import {
    FiActivity, FiClock, FiCheckCircle, FiUsers, FiArrowRight, FiUserCheck, FiDatabase, FiLogOut
} from "react-icons/fi";
import styles from "./style/scss/adminDashboard/adminDashboard.module.scss";
import GoogleImport from "./googleImport";
import ThemeToggle from "@/components/themeToggle"
import useLogout from "@/hooks/user/logout";

interface DashboardStats {
    totalHospitals: number;
    pendingHospitals: number;
    liveHospitals: number;
    totalUsers: number;
}

const AdminDashboard = () => {
    const { logout } = useLogout();
    const [stats, setStats] = useState<DashboardStats>({
        totalHospitals: 0, pendingHospitals: 0, liveHospitals: 0, totalUsers: 0
    });
    const [loading, setLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();

    const fetchStats = useCallback(async () => {
        try {
            const response = await axiosPrivate.get("/hospitals/admin/stats");
            setStats(response.data);
        } catch (err) {
            console.error("Dashboard Stats Error:", err);
        } finally {
            setLoading(false);
        }
    }, [axiosPrivate]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading Dashboard Analytics...</p>
            </div>
        );
    }

    const handleLogout = () => {
        logout()
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

            {/* --- STATS GRID --- */}
            <div className={styles.statsGrid}>
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
            </div>

            {/* --- MANAGEMENT SYSTEMS --- */}
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
                    <GoogleImport onSuccess={fetchStats} />
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
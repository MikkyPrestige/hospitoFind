import { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { FiClock, FiCheckCircle, FiInfo, FiAlertTriangle, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { toast } from "react-toastify";
import styles from "./styles/scss/userSubmissions/userSubmissions.module.scss";
import { useAuthContext } from "@/context/UserProvider";

const ITEMS_PER_PAGE = 9;

const UserSubmissions = () => {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const axiosPrivate = useAxiosPrivate();
    const { state } = useAuthContext();

    const fetchMyData = useCallback(async () => {
        if (!state?.id && !state?.accessToken) return;

        try {
            setLoading(true);
            setError(false);
            const { data } = await axiosPrivate.get("/hospitals/submissions");

            const validData = Array.isArray(data) ? data : [];
            setSubmissions(validData);

        } catch (err: any) {
            console.error("Submissions Fetch Error:", err);
            setError(true);
            if (err.response?.status !== 401) {
                toast.error("Could not load your submissions");
            }
        } finally {
            setLoading(false);
        }
    }, [state?.id, state?.accessToken, axiosPrivate]);

    useEffect(() => {
        fetchMyData();
    }, [fetchMyData]);

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = submissions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(submissions.length / ITEMS_PER_PAGE);

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
            document.querySelector(`.${styles.list}`)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            document.querySelector(`.${styles.list}`)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const getStatusBadge = (verified: boolean) => {
        if (verified) return <span className={styles.statusApproved}><FiCheckCircle /> Approved</span>;
        return <span className={styles.statusPending}><FiClock /> Under Review</span>;
    };

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <FiAlertTriangle size={40} color="#ff4d4f" />
                    <p>Failed to connect to the server.</p>
                    <button onClick={fetchMyData} className={styles.retryBtn}>Retry</button>
                </div>
            </div>
        );
    }

    if (loading) return <div className={styles.loader}>Loading your contributions...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerText}>
                    <h2>My Submissions</h2>
                    <p>Track the status of the hospitals you've added.</p>
                </div>
                <div className={styles.countBadge}>
                    {submissions.length} Found
                </div>
            </header>

            {submissions.length > 0 ? (
                <>
                    <div className={styles.list}>
                        {currentItems.map(hosp => (
                            <div key={hosp._id} className={styles.subCard}>
                                <div className={styles.cardInfo}>
                                    <h3>{hosp.name}</h3>
                                    <p>{hosp.address?.city}, {hosp.address?.state}</p>
                                </div>
                                <div className={styles.cardStatus}>
                                    {getStatusBadge(hosp.verified)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                onClick={handlePrev}
                                disabled={currentPage === 1}
                                className={styles.pageBtn}
                            >
                                <FiChevronLeft /> Prev
                            </button>

                            <span className={styles.pageInfo}>
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                onClick={handleNext}
                                disabled={currentPage === totalPages}
                                className={styles.pageBtn}
                            >
                                Next <FiChevronRight />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className={styles.emptyState}>
                    <FiInfo size={40} />
                    <p>You haven't submitted any hospitals yet.</p>
                </div>
            )}
        </div>
    );
};

export default UserSubmissions;
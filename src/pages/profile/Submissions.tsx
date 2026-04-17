import { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
    FiClock,
    FiCheckCircle,
    FiInfo,
    FiAlertTriangle,
    FiChevronLeft,
    FiChevronRight,
    FiMapPin,
    FiCalendar,
    FiActivity
} from "react-icons/fi";
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Recently added";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusBadge = (verified: boolean) => {
        if (verified) {
            return (
                <span className={`${styles.statusBadge} ${styles.statusApproved}`}>
                    <FiCheckCircle className={styles.statusIcon} />
                    Approved
                </span>
            );
        }
        return (
            <span className={`${styles.statusBadge} ${styles.statusPending}`}>
                <FiClock className={styles.statusIcon} />
                Under Review
            </span>
        );
    };

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <div className={styles.emptyIconWrapperError}>
                        <FiAlertTriangle size={32} />
                    </div>
                    <h3>Connection Error</h3>
                    <p>We couldn't retrieve your submission data securely. Please check your connection and try again.</p>
                    <button onClick={fetchMyData} className={styles.retryBtn}>Retry Connection</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerText}>
                    <h2>My Submissions</h2>
                    <p>Track the verification status of healthcare facilities you've contributed.</p>
                </div>
                {!loading && submissions.length > 0 && (
                    <div className={styles.countBadge}>
                        <span className={styles.countNumber}>{submissions.length}</span>
                        <span className={styles.countLabel}>Total</span>
                    </div>
                )}
            </header>

            {loading ? (
                <div className={styles.list}>
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className={styles.skeletonCard}>
                            <div className={styles.skeletonAvatar}></div>
                            <div className={styles.skeletonContent}>
                                <div className={styles.skeletonTitle}></div>
                                <div className={styles.skeletonMeta}></div>
                            </div>
                            <div className={styles.skeletonBadge}></div>
                        </div>
                    ))}
                </div>
            ) : submissions.length > 0 ? (
                <>
                    <div className={styles.list}>
                        {currentItems.map(hosp => (
                            <div
                                key={hosp._id}
                                className={`${styles.subCard} ${hosp.verified ? styles.cardApproved : styles.cardPending}`}
                            >
                                <div className={styles.cardMain}>
                                    <div className={styles.cardIconWrapper}>
                                        <FiActivity size={24} />
                                    </div>
                                    <div className={styles.cardInfo}>
                                        <h3>{hosp.name}</h3>
                                        <div className={styles.metaRow}>
                                            <span className={styles.metaItem}>
                                                <FiMapPin className={styles.metaIcon} />
                                                {hosp.address?.city || 'Unknown City'}, {hosp.address?.state || 'Unknown State'}
                                            </span>
                                            <span className={styles.metaDivider}>•</span>
                                            <span className={styles.metaItem}>
                                                <FiCalendar className={styles.metaIcon} />
                                                {formatDate(hosp.createdAt)}
                                            </span>
                                        </div>
                                    </div>
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
                                <FiChevronLeft /> Previous
                            </button>

                            <span className={styles.pageInfo}>
                                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
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
                    <div className={styles.emptyIconWrapper}>
                        <FiInfo size={32} />
                    </div>
                    <h3>No Submissions Yet</h3>
                    <p>You haven't added any hospitals to the network yet. Your contributions help improve healthcare access for everyone.</p>
                </div>
            )}
        </div>
    );
};

export default UserSubmissions;


// import { useState, useEffect, useCallback } from "react";
// import useAxiosPrivate from "@/hooks/useAxiosPrivate";
// import { FiClock, FiCheckCircle, FiInfo, FiAlertTriangle, FiChevronLeft, FiChevronRight } from "react-icons/fi";
// import { toast } from "react-toastify";
// import styles from "./styles/scss/userSubmissions/userSubmissions.module.scss";
// import { useAuthContext } from "@/context/UserProvider";

// const ITEMS_PER_PAGE = 9;

// const UserSubmissions = () => {
//     const [submissions, setSubmissions] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(false);
//     const [currentPage, setCurrentPage] = useState(1);
//     const axiosPrivate = useAxiosPrivate();
//     const { state } = useAuthContext();

//     const fetchMyData = useCallback(async () => {
//         if (!state?.id && !state?.accessToken) return;

//         try {
//             setLoading(true);
//             setError(false);
//             const { data } = await axiosPrivate.get("/hospitals/submissions");

//             const validData = Array.isArray(data) ? data : [];
//             setSubmissions(validData);

//         } catch (err: any) {
//             console.error("Submissions Fetch Error:", err);
//             setError(true);
//             if (err.response?.status !== 401) {
//                 toast.error("Could not load your submissions");
//             }
//         } finally {
//             setLoading(false);
//         }
//     }, [state?.id, state?.accessToken, axiosPrivate]);

//     useEffect(() => {
//         fetchMyData();
//     }, [fetchMyData]);

//     const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
//     const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
//     const currentItems = submissions.slice(indexOfFirstItem, indexOfLastItem);
//     const totalPages = Math.ceil(submissions.length / ITEMS_PER_PAGE);

//     const handleNext = () => {
//         if (currentPage < totalPages) {
//             setCurrentPage(prev => prev + 1);
//             document.querySelector(`.${styles.list}`)?.scrollIntoView({ behavior: 'smooth' });
//         }
//     };

//     const handlePrev = () => {
//         if (currentPage > 1) {
//             setCurrentPage(prev => prev - 1);
//             document.querySelector(`.${styles.list}`)?.scrollIntoView({ behavior: 'smooth' });
//         }
//     };

//     const getStatusBadge = (verified: boolean) => {
//         if (verified) return <span className={styles.statusApproved}><FiCheckCircle /> Approved</span>;
//         return <span className={styles.statusPending}><FiClock /> Under Review</span>;
//     };

//     if (error) {
//         return (
//             <div className={styles.container}>
//                 <div className={styles.emptyState}>
//                     <FiAlertTriangle size={40} color="#ff4d4f" />
//                     <p>Failed to connect to the server.</p>
//                     <button onClick={fetchMyData} className={styles.retryBtn}>Retry</button>
//                 </div>
//             </div>
//         );
//     }

//     if (loading) return <div className={styles.loader}>Loading your contributions...</div>;

//     return (
//         <div className={styles.container}>
//             <header className={styles.header}>
//                 <div className={styles.headerText}>
//                     <h2>My Submissions</h2>
//                     <p>Track the status of the hospitals you've added.</p>
//                 </div>
//                 <div className={styles.countBadge}>
//                     {submissions.length} Found
//                 </div>
//             </header>

//             {submissions.length > 0 ? (
//                 <>
//                     <div className={styles.list}>
//                         {currentItems.map(hosp => (
//                             <div key={hosp._id} className={styles.subCard}>
//                                 <div className={styles.cardInfo}>
//                                     <h3>{hosp.name}</h3>
//                                     <p>{hosp.address?.city}, {hosp.address?.state}</p>
//                                 </div>
//                                 <div className={styles.cardStatus}>
//                                     {getStatusBadge(hosp.verified)}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     {totalPages > 1 && (
//                         <div className={styles.pagination}>
//                             <button
//                                 onClick={handlePrev}
//                                 disabled={currentPage === 1}
//                                 className={styles.pageBtn}
//                             >
//                                 <FiChevronLeft /> Prev
//                             </button>

//                             <span className={styles.pageInfo}>
//                                 Page {currentPage} of {totalPages}
//                             </span>

//                             <button
//                                 onClick={handleNext}
//                                 disabled={currentPage === totalPages}
//                                 className={styles.pageBtn}
//                             >
//                                 Next <FiChevronRight />
//                             </button>
//                         </div>
//                     )}
//                 </>
//             ) : (
//                 <div className={styles.emptyState}>
//                     <FiInfo size={40} />
//                     <p>You haven't submitted any hospitals yet.</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default UserSubmissions;
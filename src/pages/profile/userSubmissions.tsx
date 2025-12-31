import { useState, useEffect } from "react";
import useAxiosPrivate from "@/hooks/user/useAxiosPrivate";
import { FiClock, FiCheckCircle, FiInfo } from "react-icons/fi";
import { toast } from "react-toastify";
import styles from "./style/scss/userSubmissions/userSubmissions.module.scss";
import { useAuthContext } from "@/context/userContext";

const UserSubmissions = () => {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();
    const {state} = useAuthContext();

        useEffect(() => {
            const fetchMyData = async () => {
                if (!state.accessToken) return;
                try {
                    const { data } = await axiosPrivate.get("/hospitals/submissions");
                    setSubmissions(data);
                } catch (err: any) {
                    if (err.response?.status !== 401) {
                        toast.error("Could not load your submissions");
                    }
                } finally {
                    setLoading(false);
                }
            };
            fetchMyData();
        }, [state.accessToken, axiosPrivate]);

    const getStatusBadge = (verified: boolean) => {
        if (verified) return <span className={styles.statusApproved}><FiCheckCircle /> Approved</span>;
        return <span className={styles.statusPending}><FiClock /> Under Review</span>;
    };

    if (loading) return <div className={styles.loader}>Loading your contributions...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2>My Submissions</h2>
                <p>Track the status of the hospitals you've added to the directory.</p>
            </header>

            <div className={styles.list}>
                {submissions.length > 0 ? (
                    submissions.map(hosp => (
                        <div key={hosp._id} className={styles.subCard}>
                            <div className={styles.cardInfo}>
                                <h3>{hosp.name}</h3>
                                <p>{hosp.address.city}, {hosp.address.state}</p>
                            </div>
                            <div className={styles.cardStatus}>
                                {getStatusBadge(hosp.verified)}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <FiInfo size={40} />
                        <p>You haven't submitted any hospitals yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserSubmissions;
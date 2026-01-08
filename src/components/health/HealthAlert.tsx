import { useEffect, useState } from "react";
import style from "./styles/healthAlert.module.css";
import AnimatedLoader from "@/components/ui/AnimatedLoader";
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiArrowRight, FiCalendar, FiExternalLink } from "react-icons/fi";
import { BASE_URL } from "@/context/UserProvider";

type Alert = {
    title: string;
    date: string;
    summary: string;
    link: string;
    source: string;
};

const HealthAlerts = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAlerts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${BASE_URL}/health/alerts`);
                const data = await res.json();
                const list = Array.isArray(data) ? data : (data.results || []);
                setAlerts(list.slice(0, 3));
            } catch (err) {
                setError("Failed to health alerts");
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, []);

    if (loading) {
        return <AnimatedLoader message="Scanning for health alerts..." variant="list" count={3} />;
    }

    if (error) return null;

    return (
        <section className={style.section}>
            <div className={style.headerRow}>
                <div className={style.titleGroup}>
                    <span className={style.iconWrapper}><FiAlertTriangle /></span>
                    <h2 className={style.heading}>Outbreaks & Alerts</h2>
                    <span className={style.badge}>Live Feed</span>
                </div>

                <p className={style.subHeadingDesktop}>
                    Track active disease outbreaks and health emergencies reported globally.
                </p>

                <button
                    className={style.viewAllLink}
                    onClick={() => navigate("/disease-outbreaks")}
                >
                    View All <FiArrowRight />
                </button>
            </div>

            {/* Mobile Subheading */}
            <p className={style.subHeadingMobile}>
                Track active disease outbreaks and health emergencies reported globally.
            </p>

            {alerts.length > 0 ? (
                <div className={style.listWrapper}>
                    <ul className={style.list}>
                        {alerts.map((a, i) => {
                            const sourceLower = a.source ? a.source.toLowerCase() : "";
                            const isWHO = sourceLower.includes("who");
                            const isCDC = sourceLower.includes("cdc");
                            const isArchived = sourceLower.includes("archived");

                            return (
                                <li key={i} className={`${style.card} ${isArchived ? style.cardArchived : ""}`}>
                                    <div className={style.cardBody}>
                                        <div className={style.metaHeader}>
                                            <span className={`
                                                ${style.sourceBadge}
                                                ${isWHO ? style.sourceWHO : isCDC ? style.sourceCDC : style.sourceGeneral}
                                            `}>
                                                {a.source || "Global Report"}
                                            </span>
                                            <span className={style.date}>
                                                <FiCalendar className={style.dateIcon} />
                                                {a.date ? new Date(a.date).toLocaleDateString(undefined, {
                                                    month: 'short', day: 'numeric', year: 'numeric'
                                                }) : "Recent"}
                                            </span>
                                        </div>

                                        <h3 className={style.title}>{a.title}</h3>

                                        <p className={style.summary}>{a.summary}</p>

                                        <div className={style.footer}>
                                            <a
                                                href={a.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={style.link}
                                            >
                                                Full Report <FiExternalLink />
                                            </a>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ) : (
                <div className={style.emptyState}>
                    <p>No active health alerts at this time.</p>
                </div>
            )}
        </section>
    );
};

export default HealthAlerts;
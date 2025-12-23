import { useEffect, useState } from "react";
import style from "./style/healthAlert.module.css";
import AnimatedLoader from "../components/utils/AnimatedLoader";
import { useNavigate } from "react-router-dom";

type Alert = {
    title: string;
    date: string;
    summary: string;
    link: string;
    source: string;
};

const URL = import.meta.env.VITE_BASE_URL;

const HealthAlerts = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAlerts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${URL}/health/alerts`);
                const data = await res.json();
                setAlerts(data.slice(0, 3));
            } catch (err) {
                // handle error
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, []);

    return (
        <section className={style.section}>
            <div className={style.headerRow}>
                <div className={style.titleGroup}>
                    <h2 className={style.heading}>⚠️ Outbreaks Alert</h2>
                    <span className={style.badge}>Live updates</span>
                </div>
                <button
                    className={style.viewAllLink}
                    onClick={() => navigate("/outbreaks")}
                >
                    See All Alerts →
                </button>
            </div>

            <p className={style.subHeading}>
                Stay informed about current health concerns and outbreaks worldwide.
            </p>

            {loading ? (
                <AnimatedLoader message="Getting latest disease alerts..." variant="list" count={4} />
            ) : alerts.length > 0 ? (
                <div className={style.listWrapper}>
                    <ul className={style.list}>
                        {alerts.map((a, i) => {
                            const sourceLower = a.source.toLowerCase();
                            const isWHO = sourceLower.includes("who");
                            const isArchived = sourceLower.includes("archived");
                            const isMedia = sourceLower.includes("newsdata") || sourceLower.includes("media");

                            return (
                                <li
                                    key={i}
                                    className={`${style.card} ${isArchived ? style.cardArchived : ""}`}
                                >
                                    <div className={style.cardBody}>
                                        <div className={style.titleRow}>
                                            <h3 className={style.title}>{a.title}</h3>

                                            <span className={`
                                                ${style.sourceBadge}
                                                ${isArchived ? style.sourceArchived : ''}
                                                ${isWHO ? style.sourceWHO : ''}
                                                ${isMedia ? style.sourceMedia : ''}
                                            `}>
                                                {isArchived ? "Archived" : isWHO ? "WHO Verified" : "Media Report"}
                                            </span>
                                        </div>

                                        <div className={style.metaRow}>
                                            <span className={style.date}>
                                                📅 {a.date ? new Date(a.date).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                }) : "Recent"}
                                            </span>
                                        </div>

                                        <p className={style.summary}>{a.summary}</p>

                                        <div className={style.footer}>
                                            <a
                                                href={a.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={style.link}
                                            >
                                                Read full report →
                                            </a>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ) : (
                <p className={style.status}>No current health alerts found.</p>
            )}
        </section>
    );
};

export default HealthAlerts;
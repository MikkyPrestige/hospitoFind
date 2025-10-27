import { useEffect, useState } from "react";
import style from "./style/healthAlerts.module.css";

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

    useEffect(() => {
        const fetchAlerts = async () => {
            setLoading(true);
            try {
                const res = await fetch("http://localhost:5000/health/alerts");
                const data = await res.json();
                setAlerts(data);
            } catch (err) {
                console.error("Error fetching health alerts:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, []);

    return (
        <section className={style.section}>
            <div className={style.headerRow}>
                <h2 className={style.heading}>⚠️ Health & Outbreaks Alerts</h2>
                <span className={style.badge}>Live updates</span>
            </div>
            <p className={style.subHeading}>
                Stay informed about current health concerns and outbreaks worldwide.
            </p>

            {loading ? (
                <p className={style.status}>Getting latest health alerts around the world...</p>
            ) : alerts.length > 0 ? (
                <ul className={style.list}>
                    {alerts.map((a, i) => {
                        const isWHO = a.source.toLowerCase().includes("who");
                        const isArchived = a.source.toLowerCase().includes("archived");
                        const isMedia = a.source.toLowerCase().includes("newsdata");

                        return (
                            <li
                                key={i}
                                className={`${style.card} ${isArchived ? style.cardArchived : ""
                                    }`}
                            >
                                <div className={style.titleRow}>
                                    <h3 className={style.title}>{a.title}</h3>

                                    {isArchived ? (
                                        <span className={style.sourceArchived}>Archived</span>
                                    ) : isWHO ? (
                                        <span className={style.sourceWHO}>WHO Alert</span>
                                    ) : isMedia ? (
                                        <span className={style.sourceMedia}>Media Report</span>
                                    ) : null}
                                </div>

                                <p className={style.date}>
                                    {a.date ? new Date(a.date).toLocaleDateString() : ""}
                                </p>
                                <p className={style.summary}>{a.summary}</p>
                                <a
                                    href={a.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={style.link}
                                >
                                    Read more →
                                </a>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className={style.status}>No current health alerts found.</p>
            )}
        </section>
    );
};

export default HealthAlerts;
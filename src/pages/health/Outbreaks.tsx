import { useOutbreaks } from "@/hooks/useOutbreaks";
import Motion from "@/components/ui/Motion";
import { fadeUp, sectionReveal } from "@/utils/animations";
import AnimatedLoader from "@/components/ui/AnimatedLoader";
import { FiAlertTriangle, FiCalendar, FiExternalLink, FiGlobe, FiShield, FiPhone, FiInfo, FiRefreshCw } from "react-icons/fi";
import style from "./styles/outbreaks.module.css";
import { SEOHelmet } from "@/components/ui/SeoHelmet";

const Outbreaks = () => {
    const {
        alerts, loading, error, selectedContinent,
        setSelectedContinent, activeData, refetch
    } = useOutbreaks();

    return (
        <>
            <SEOHelmet
                title="Live Outbreak Alerts & Global Health Warnings"
                description="Stay updated with real-time disease outbreak alerts, health warnings, and safety protocols worldwide. Current alerts, regional safety info, and emergency contacts from trusted sources."
                canonical="https://hospitofind.online/disease-outbreaks"
                schemaType="outbreaks"
                schemaData={alerts}
                autoBreadcrumbs={true}
                lang="en"
            />

            <div className={style.section}>
                <Motion variants={sectionReveal} className={style.pageHeader}>
                    <div className={style.titleGroup}>
                        <FiAlertTriangle className={style.headerIcon} />
                        <h1 className={style.pageTitle}>Outbreak Alerts</h1>
                        <span className={style.liveBadge}>Live Feed</span>
                    </div>
                    <p className={style.pageSubtitle}>
                        Stay informed about current health concerns, safety protocols, and live disease updates worldwide.
                    </p>
                </Motion>

                <div className={style.layout}>
                    <main className={style.mainFeed}>
                        {loading ? (
                            <AnimatedLoader message="Scanning global health reports..." variant="list" count={6} />
                        ) : error ? (
                            <div className={style.errorBox}>
                                <p>{error}</p>
                                <button onClick={refetch} className={style.retryBtn}>
                                    <FiRefreshCw /> Refresh Data
                                </button>
                            </div>
                        ) : alerts.length > 0 ? (
                            <ul className={style.list}>
                                {alerts.map((a, i) => {
                                    const sourceLower = a.source ? a.source.toLowerCase() : "";
                                    const isWHO = sourceLower.includes("who");
                                    const isArchived = sourceLower.includes("archived");
                                    const isMedia = sourceLower.includes("newsdata");

                                    return (
                                        <Motion key={i} variants={fadeUp} className={`${style.card} ${isArchived ? style.cardArchived : ""}`}>
                                            <div className={style.titleRow}>
                                                <h3 className={style.title}>{a.title}</h3>
                                                <span className={isWHO ? style.sourceWHO : isMedia ? style.sourceMedia : style.sourceDefault}>
                                                    {isArchived ? "Archived" : isWHO ? "WHO Alert" : isMedia ? "Media Report" : a.source}
                                                </span>
                                            </div>
                                            <p className={style.date}>
                                                <FiCalendar className={style.iconSmall} />
                                                {a.date ? new Date(a.date).toLocaleDateString(undefined, {
                                                    year: 'numeric', month: 'long', day: 'numeric'
                                                }) : "Recent Update"}
                                            </p>
                                            <p className={style.summary}>{a.summary}</p>
                                            <a href={a.link} target="_blank" rel="noopener noreferrer" className={style.readMoreLink}>
                                                Full Report <FiExternalLink />
                                            </a>
                                        </Motion>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className={style.noAlerts}>
                                <p>No active health alerts reported at this time.</p>
                            </div>
                        )}
                    </main>

                    <aside className={style.sidebar}>
                        <div className={style.regionCard}>
                            <h3><FiGlobe className={style.cardIcon} /> Regional Safety Center</h3>
                            <p className={style.sidebarHint}>Showing protocols for your region</p>
                            <select
                                value={selectedContinent}
                                onChange={(e) => setSelectedContinent(e.target.value)}
                                className={style.regionSelect}
                            >
                                <option value="AF">Africa</option>
                                <option value="EU">Europe</option>
                                <option value="NA">North America</option>
                                <option value="AS">Asia</option>
                                <option value="GLOBAL">Global / International</option>
                            </select>
                        </div>

                        <div className={style.safetyCard}>
                            <h3><FiShield className={style.cardIcon} /> {activeData.name} Protocols</h3>
                            <ul className={style.protocolList}>
                                {activeData.protocols.map((tip, i) => (
                                    <li key={i}><FiInfo className={style.listIcon} /> {tip}</li>
                                ))}
                            </ul>
                        </div>

                        <div className={style.emergencyCard}>
                            <h3><FiPhone className={style.cardIcon} /> {activeData.agency}</h3>
                            <div className={style.contactItem}>
                                <strong>Emergency Contact:</strong>
                                <span>{activeData.hotline}</span>
                            </div>
                            <p className={style.emergencyNote}>
                                Contact local authorities immediately if you are experiencing a medical emergency.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
};

export default Outbreaks;
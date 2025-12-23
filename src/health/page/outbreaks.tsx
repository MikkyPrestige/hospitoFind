import { useEffect, useState } from "react";
import Motion from "@/components/motion";
import { fadeUp, sectionReveal } from "@/hooks/animations";
import Header from "@/layouts/header/nav";
import Footer from "@/layouts/footer/footer";
import AnimatedLoader from "@/components/utils/AnimatedLoader";
import style from "./style/outbreaks.module.css";

const continentData = {
    AF: {
        name: "Africa",
        agency: "Africa CDC / WHO AFRO",
        hotline: "Check Local NCDC/Ministry",
        protocols: [
            "Follow local disease surveillance guidelines.",
            "Ensure vaccinations (Yellow Fever, Meningitis) are up to date.",
            "Practice strict hand hygiene in outbreak zones."
        ]
    },
    EU: {
        name: "Europe",
        agency: "ECDC / WHO Europe",
        hotline: "112 (Universal Emergency)",
        protocols: [
            "Follow ECDC travel health notices.",
            "Consult the 'Re-open EU' platform for travel safety.",
            "Adhere to local healthcare system entry protocols."
        ]
    },
    NA: {
        name: "North America",
        agency: "CDC / PHAC Canada",
        hotline: "911 (Emergency)",
        protocols: [
            "Monitor CDC Health Alert Network (HAN) notices.",
            "Verify health insurance coverage for cross-border care.",
            "Follow regional respiratory virus precautions."
        ]
    },
    AS: {
        name: "Asia",
        agency: "WHO SEARO / WPRO",
        hotline: "Contact Local Health Ministry",
        protocols: [
            "Be aware of regional vector-borne disease alerts.",
            "Follow mask-wearing norms in high-density areas.",
            "Practice food and water safety in tropical regions."
        ]
    },
    GLOBAL: {
        name: "Global / Other Regions",
        agency: "World Health Organization",
        hotline: "Local Emergency Services",
        protocols: [
            "Visit WHO.int for International Health Regulations.",
            "Maintain distance from symptomatic individuals.",
            "Keep a record of your vaccinations digitally."
        ]
    }
};

type Alert = {
    title: string;
    source: string;
    date: string;
    summary: string;
    link: string;
};

const URL = import.meta.env.VITE_BASE_URL;

const Outbreaks = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedContinent, setSelectedContinent] = useState("GLOBAL");

    useEffect(() => {
        const fetchAlerts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${URL}/health/alerts`);
                const data = await res.json();
                setAlerts(data);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, []);

    // Silent Auto-Detection of Region
    useEffect(() => {
        const autoDetectRegion = async () => {
            try {
                const res = await fetch('https://ipapi.co/json/');
                const data = await res.json();
                if (data.continent_code && continentData[data.continent_code as keyof typeof continentData]) {
                    setSelectedContinent(data.continent_code);
                }
            } catch (err) {
                console.warn("Location detection failed, defaulting to GLOBAL.");
            }
        };
        autoDetectRegion();
    }, []);

    const activeData = continentData[selectedContinent as keyof typeof continentData] || continentData.GLOBAL;

    return (
        <>
            <Header />
            <div className={style.section}>
                <Motion variants={sectionReveal} className={style.pageHeader}>
                    <h1 className={style.pageTitle}>⚠️ Outbreaks Alert</h1>
                    <p className={style.pageSubtitle}>
                        Stay informed about current health concerns and live disease updates worldwide.
                    </p>
                    <span className={style.liveBadge}>Live Updates</span>
                </Motion>

                <div className={style.layout}>
                    <main className={style.mainFeed}>
                        {loading ? (
                            <AnimatedLoader message="Getting latest disease alerts..." variant="list" count={6} />
                        ) : alerts.length > 0 ? (
                            <ul className={style.list}>
                                {alerts.map((a, i) => {
                                    const sourceLower = a.source.toLowerCase();
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
                                            <p className={style.date}>📅 {a.date ? new Date(a.date).toLocaleDateString() : "Recent"}</p>
                                            <p className={style.summary}>{a.summary}</p>
                                            <a href={a.link} target="_blank" rel="noopener noreferrer" className={style.readMoreLink}>Full Report →</a>
                                        </Motion>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className={style.noAlerts}><p>No current health alerts found.</p></div>
                        )}
                    </main>

                    {/* --- DYNAMIC SIDEBAR --- */}
                    <aside className={style.sidebar}>
                        <div className={style.regionCard}>
                            <h3>🌍 Regional Safety Center</h3>
                            <p className={style.sidebarHint}>Showing info for your continent</p>
                            <select
                                value={selectedContinent}
                                onChange={(e) => setSelectedContinent(e.target.value)}
                                className={style.regionSelect}
                            >
                                <option value="AF">Africa</option>
                                <option value="EU">Europe</option>
                                <option value="NA">North America</option>
                                <option value="AS">Asia</option>
                                <option value="GLOBAL">Other / International</option>
                            </select>
                        </div>

                        <div className={style.safetyCard}>
                            <h3>🛡️ {activeData.name} Protocols</h3>
                            <ul className={style.protocolList}>
                                {activeData.protocols.map((tip, i) => (
                                    <li key={i}>{tip}</li>
                                ))}
                            </ul>
                        </div>

                        <div className={style.emergencyCard}>
                            <h3>🚨 {activeData.agency}</h3>
                            <div className={style.contactItem}>
                                <strong>Emergency Number:</strong>
                                <span>{activeData.hotline}</span>
                            </div>
                            <p className={style.emergencyNote}>
                                Contact local authorities if you are experiencing a medical emergency.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Outbreaks;
import { useEffect, useState } from "react";
import style from "./style/dailyTips.module.css";

type Tip = {
    Title: string;
    MyHFDescription: string;
    ImageUrl?: string;
    AccessibleVersion: string;
};

const URL = import.meta.env.VITE_BASE_URL;

const DailyHealthTip = () => {
    const [tips, setTips] = useState<Tip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        const storedTips = localStorage.getItem("dailyHealthTips");
        const storedDate = localStorage.getItem("dailyHealthTipDate");

        if (storedTips && storedDate === today) {
            setTips(JSON.parse(storedTips));
            setLoading(false);
            return;
        }

        const fetchTips = async () => {
            try {
                // const res = await fetch("http://localhost:5000/health/tips");
                const res = await fetch(`${URL}/health/tips`);
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setTips(data);
                    localStorage.setItem("dailyHealthTips", JSON.stringify(data));
                    localStorage.setItem("dailyHealthTipDate", today);
                }
            } catch (err) {
                console.error("Error fetching health tips:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTips();
    }, []);

    if (loading) return <p className={style.status}>Getting your daily health tips...</p>;
    if (!tips.length) return <p className={style.status}>No tips available today.</p>;

    return (
        <section className={style.section}>
            <div className={style.headerRow}>
                <h2 className={style.heading}>💡 Health Tips</h2>
                <span className={style.badge}>Updated daily</span>
            </div>
            <p className={style.subHeading}>
                Quick reminders to help you live healthier every day.
            </p>
            <div className={style.tipsGrid}>
                {tips.map((tip, i) => (
                    <div key={i} className={style.tipCard}>
                        {tip.ImageUrl ? (
                            <img src={tip.ImageUrl} alt={tip.Title} className={style.image} />
                        ) : (
                            <div className={style.imagePlaceholder}>No Image</div>
                        )}
                        <div className={style.content}>
                            <h3 className={style.title}>{tip.Title}</h3>
                            <p
                                className={style.description}
                                dangerouslySetInnerHTML={{ __html: tip.MyHFDescription }}
                            />
                            <a
                                href={tip.AccessibleVersion}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={style.readMore}
                            >
                                Read full tip →
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default DailyHealthTip;

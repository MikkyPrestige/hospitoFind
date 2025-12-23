import { useEffect, useState } from "react";
import style from "./style/dailyTips.module.css";
import AnimatedLoader from "../components/utils/AnimatedLoader";
import { useNavigate } from "react-router-dom";

type Tip = {
    Title: string;
    ImageUrl?: string;
    ImageAlt?: string;
    Link: string;
};

const URL = import.meta.env.VITE_BASE_URL;

const DailyHealthTip = () => {
    const [tips, setTips] = useState<Tip[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
                const res = await fetch(`${URL}/health/tips`);
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setTips(data);
                    localStorage.setItem("dailyHealthTips", JSON.stringify(data));
                    localStorage.setItem("dailyHealthTipDate", today);
                }
            } catch (err) {
            } finally {
                setLoading(false);
            }
        };

        fetchTips();
    }, []);

    if (loading) {
        return <AnimatedLoader message="Getting daily health tips..." variant="card" count={1} />;
    }

    if (!tips.length) return null;

    const featuredTip = tips[0];

    return (
        <section className={style.section}>
            <div className={style.headerRow}>
                <div className={style.titleGroup}>
                    <h2 className={style.heading}>💡 Health Tip of the Day</h2>
                    <span className={style.badge}>Updated daily</span>
                </div>
                <button
                    className={style.viewAllLink}
                    onClick={() => navigate("/health-tips")}
                >
                    See Wellness Library →
                </button>
            </div>

            <div className={style.featuredCard}>
                <div className={style.imageWrapper}>
                    {featuredTip.ImageUrl ? (
                        <img src={featuredTip.ImageUrl} alt={featuredTip.ImageAlt} className={style.image} />
                    ) : (
                        <div className={style.imagePlaceholder}>💡</div>
                    )}
                </div>
                <div className={style.content}>
                    <h3 className={style.title}>{featuredTip.Title}</h3>
                    <p className={style.description}>
                        Discover simple ways to improve your wellbeing and maintain a healthy lifestyle.
                    </p>
                    <a
                        href={featuredTip.Link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={style.readMore}
                    >
                        Learn More about this Tip →
                    </a>
                </div>
            </div>
        </section>
    );
};

export default DailyHealthTip;

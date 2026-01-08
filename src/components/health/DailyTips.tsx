import { useEffect, useState } from "react";
import style from "./styles/dailyTips.module.css";
import AnimatedLoader from "@/components/ui/AnimatedLoader";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "@/context/UserProvider";
import { HiLightBulb } from "react-icons/hi";
import { FiArrowRight, FiExternalLink } from "react-icons/fi";

type Tip = {
    Title: string;
    ImageUrl?: string;
    ImageAlt?: string;
    Link: string;
};

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
                const res = await fetch(`${BASE_URL}/health/tips`);
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
        return <AnimatedLoader message="Loading daily tip..." variant="card" count={1} />;
    }

    if (!tips.length) return null;

    const featuredTip = tips[0];

    return (
        <section className={style.section}>
            <div className={style.headerRow}>
                <div className={style.titleGroup}>
                    <span className={style.iconWrapper}><HiLightBulb /></span>
                    <h2 className={style.heading}>Daily Wellness</h2>
                </div>
                <button
                    className={style.viewAllLink}
                    onClick={() => navigate("/health-tips")}
                >
                    All Tips <FiArrowRight />
                </button>
            </div>

            <div className={style.featuredCard}>
                <div className={style.imageWrapper}>
                    {featuredTip.ImageUrl ? (
                        <img
                            src={featuredTip.ImageUrl}
                            alt={featuredTip.ImageAlt || "Health Tip"}
                            className={style.image}
                            loading="lazy"
                        />
                    ) : (
                        <div className={style.imagePlaceholder}>
                            <HiLightBulb size={50} />
                        </div>
                    )}
                </div>

                <div className={style.content}>
                    <span className={style.cardBadge}>Today's Focus</span>
                    <h3 className={style.title}>{featuredTip.Title}</h3>

                    <a
                        href={featuredTip.Link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={style.readMore}
                    >
                        Read Advice <FiExternalLink />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default DailyHealthTip;
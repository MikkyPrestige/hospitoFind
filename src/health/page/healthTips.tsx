import { useEffect, useState } from "react";
import Motion from "@/components/motion";
import { fadeUp, sectionReveal } from "@/hooks/animations";
import Header from "@/layouts/header/nav";
import Footer from "@/layouts/footer/footer";
import AnimatedLoader from "@/components/utils/AnimatedLoader";
import style from "./style/healthTips.module.css";

type Tip = {
    Title: string;
    ImageUrl: string;
    ImageAlt: string;
    Link: string;
    Category?: string;
};

const URL = import.meta.env.VITE_BASE_URL;

const HealthTips = () => {
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
                setLoading(true);
                const res = await fetch(`${URL}/health/tips`);
                const data = await res.json();

                if (Array.isArray(data) && data.length > 0) {
                    setTips(data);
                    localStorage.setItem("dailyHealthTips", JSON.stringify(data));
                    localStorage.setItem("dailyHealthTipDate", today);
                }
            } catch (err) {
                console.error("Failed to fetch tips", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTips();
    }, []);

    return (
        <>
            <Header />
            <div className={style.section}>
                <Motion variants={sectionReveal} className={style.pageHeader}>
                    <h1 className={style.pageTitle}>💡Daily Health Tips</h1>
                    <p className={style.pageSubtitle}>
                        Small, actionable steps you can take every day to improve your physical and mental well-being.
                    </p>
                    <div className={style.dateBadge}>
                        Today: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                </Motion>

                <div className={style.container}>
                    {loading ? (
                        <AnimatedLoader
                            message="Generating your wellness guide..."
                            variant="card"
                            count={3}
                            showImage
                            imageHeight={180}
                        />
                    ) : tips.length > 0 ? (
                        <div className={style.tipsGrid}>
                            {tips.map((tip, i) => (
                                <Motion key={i} variants={fadeUp} className={style.tipCard}>
                                    <div className={style.imageWrapper}>
                                        {tip.ImageUrl ? (
                                            <img src={tip.ImageUrl} alt={tip.ImageAlt} className={style.tipImage} />
                                        ) : (
                                            <div className={style.imagePlaceholder}>
                                                <span>Daily Wellness</span>
                                            </div>
                                        )}
                                        <div className={style.categoryTag}>
                                            {tip.Category || "General Health"}
                                        </div>
                                    </div>
                                    <div className={style.content}>
                                        <h3 className={style.title}>{tip.Title}</h3>
                                        <p className={style.shortDesc}>
                                            Practical advice curated by medical experts to enhance your daily routine.
                                        </p>
                                        <a
                                            href={tip.Link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={style.actionBtn}
                                        >
                                            Learn More →
                                        </a>
                                    </div>
                                </Motion>
                            ))}
                        </div>
                    ) : (
                        <div className={style.emptyState}>
                            <p>Check back later for your fresh dose of wellness tips!</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default HealthTips;
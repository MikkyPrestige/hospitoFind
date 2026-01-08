import { useEffect, useState } from "react";
import Motion from "@/components/ui/Motion";
import { fadeUp, sectionReveal } from "@/utils/animations";
import AnimatedLoader from "@/components/ui/AnimatedLoader";
import style from "./styles/healthTips.module.css";
import { BASE_URL } from "@/context/UserProvider";
import { FiExternalLink, FiSun, FiActivity, FiHeart } from "react-icons/fi";

type Tip = {
    Title: string;
    ImageUrl: string;
    ImageAlt: string;
    Link: string;
    Category?: string;
};

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
                const res = await fetch(`${BASE_URL}/health/tips`);
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

    // Random icon for placeholder
    const getRandomIcon = (index: number) => {
        const icons = [<FiSun size={30} />, <FiHeart size={30} />, <FiActivity size={30} />];
        return icons[index % icons.length];
    };

    return (
        <>
            <section className={style.section}>
                <Motion variants={sectionReveal} className={style.pageHeader}>
                    <div className={style.titleGroup}>
                        <h1 className={style.pageTitle}>Daily Wellness</h1>
                        <div className={style.dateBadge}>
                            {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                    </div>
                    <p className={style.pageSubtitle}>
                        Small, actionable steps you can take every day to improve your physical and mental well-being.
                    </p>
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
                                            <img
                                                src={tip.ImageUrl}
                                                alt={tip.ImageAlt}
                                                className={style.tipImage}
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className={style.imagePlaceholder}>
                                                <div className={style.placeholderIcon}>
                                                    {getRandomIcon(i)}
                                                </div>
                                                <span>Health Tip</span>
                                            </div>
                                        )}
                                        <div className={style.categoryTag}>
                                            {tip.Category || "Lifestyle"}
                                        </div>
                                    </div>

                                    <div className={style.content}>
                                        <h3 className={style.title}>{tip.Title}</h3>
                                        <p className={style.shortDesc}>
                                            Simple, science-backed advice to help you live healthier.
                                        </p>
                                        <a
                                            href={tip.Link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={style.actionBtn}
                                        >
                                            View Tip <FiExternalLink />
                                        </a>
                                    </div>
                                </Motion>
                            ))}
                        </div>
                    ) : (
                        <div className={style.emptyState}>
                            <p>No tips available right now. Check back tomorrow!</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default HealthTips;
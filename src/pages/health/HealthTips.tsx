import Motion from "@/components/ui/Motion";
import AnimatedLoader from "@/components/ui/AnimatedLoader";
import { fadeUp, sectionReveal } from "@/utils/animations";
import { useHealthTips } from "@/hooks/useHealthTips";
import { FiExternalLink, FiSun, FiActivity, FiHeart } from "react-icons/fi";
import style from "./styles/healthTips.module.css";
import { SEOHelmet } from "@/src/components/ui/SeoHelmet";

const HealthTips = () => {
    const { tips, loading } = useHealthTips();

    const getRandomIcon = (index: number) => {
        const icons = [<FiSun size={30} />, <FiHeart size={30} />, <FiActivity size={30} />];
        return icons[index % icons.length];
    };

    return (
        <>
            <SEOHelmet
                title="Daily Wellness Tips & Health Advice"
                description="Get daily actionable wellness tips for better physical and mental health. Science-backed advice on lifestyle, fitness, nutrition, and mindfulness from trusted experts."
                canonical="https://hospitofind.online/health-tips"
                schemaType="healthTips"
                schemaData={tips}
                autoBreadcrumbs={true}
                lang="en"
            />

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
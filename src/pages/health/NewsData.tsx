import { useHealthNews } from "@/hooks/useHealthNews";
import Motion from "@/components/ui/Motion";
import { fadeUp, sectionReveal } from "@/utils/animations";
import AnimatedLoader from "@/components/ui/AnimatedLoader";
import { FiExternalLink, FiCalendar, FiActivity, FiRefreshCw } from "react-icons/fi";
import style from "./styles/newsData.module.css";
import { SEOHelmet } from "@/components/ui/SeoHelmet";

const NewsData = () => {
    const { articles, loading, error, refetch } = useHealthNews(12);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Recent Update";
        try {
            return new Date(dateString).toLocaleDateString(undefined, {
                month: "short", day: "numeric", year: "numeric"
            });
        } catch (e) {
            return "Recent Update";
        }
    };

    return (
        <>
            <SEOHelmet
                title="Global Health News & Medical Updates"
                description="Stay informed with the latest global health news, medical research, breakthroughs, disease alerts, and healthcare innovations from trusted sources. Updated daily."
                canonical="https://hospitofind.online/health-news"
                schemaType="healthNews"
                schemaData={articles}
                autoBreadcrumbs={true}
                lang="en"
            />

            <section className={style.section}>
                <Motion variants={sectionReveal} className={style.pageHeader}>
                    <div className={style.titleGroup}>
                        <h1 className={style.heading}>
                            <FiActivity className={style.headerIcon} /> Global Health News
                        </h1>
                        <span className={style.liveBadge}>Live Feed</span>
                    </div>
                    <p className={style.subHeading}>
                        Stay informed with curated real-time health updates, research findings, and medical breakthroughs from trusted global sources.
                    </p>
                </Motion>

                <div className={style.container}>
                    {loading ? (
                        <AnimatedLoader
                            message="Curating latest medical headlines..."
                            variant="card"
                            count={6}
                            showImage
                            imageHeight={220}
                        />
                    ) : error ? (
                        <div className={style.errorBox}>
                            <p>{error}</p>
                            <button onClick={refetch} className={style.retryBtn}>
                                <FiRefreshCw />Try Again
                            </button>
                        </div>
                    ) : (
                        <div className={style.newsGrid}>
                            {articles.map((article, i) => (
                                <Motion key={i} variants={fadeUp} className={style.newsCard}>
                                    <div className={style.imageWrapper}>
                                        {article.image_url ? (
                                            <img
                                                src={article.image_url}
                                                alt={article.title}
                                                className={style.newsImage}
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className={style.imagePlaceholder}>
                                                <span>Medical Update</span>
                                            </div>
                                        )}
                                        <div className={style.sourceTag}>
                                            {article.source_id || "Verified Source"}
                                        </div>
                                    </div>

                                    <div className={style.newsContent}>
                                        <h3 className={style.newsTitle}>{article.title}</h3>
                                        <p className={style.newsDesc}>
                                            {article.description
                                                ? `${article.description.slice(0, 120)}...`
                                                : "Read the full details of this medical update at the source link."}
                                        </p>

                                        <div className={style.newsFooter}>
                                            <a
                                                href={article.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={style.readMore}
                                            >
                                                Read Full Article <FiExternalLink />
                                            </a>
                                            <small className={style.date}>
                                                <FiCalendar className={style.dateIcon} />
                                                {formatDate(article.pubDate)}
                                            </small>
                                        </div>
                                    </div>
                                </Motion>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default NewsData;
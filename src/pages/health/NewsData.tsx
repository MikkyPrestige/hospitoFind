import { useEffect, useState } from "react";
import Motion from "@/components/ui/Motion";
import { fadeUp, sectionReveal } from "@/utils/animations";
import AnimatedLoader from "@/components/ui/AnimatedLoader";
import style from "./styles/newsData.module.css";
import { BASE_URL } from "@/context/UserProvider";
import { FiExternalLink, FiCalendar, FiActivity } from "react-icons/fi";

type Article = {
    title: string;
    description: string;
    link: string;
    image_url?: string;
    pubDate?: string;
    source_id?: string;
};

const NewsData = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(`${BASE_URL}/health/news`);
                if (!res.ok) throw new Error("Failed to fetch health news");
                const data = await res.json();
                const list = Array.isArray(data) ? data : (data.results || []);
                setArticles(list.slice(0, 12));
            } catch (err) {
                setError("Unable to load the latest headlines. Please check your connection.");
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    // Format date
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
                            <button onClick={() => window.location.reload()} className={style.retryBtn}>
                                Try Again
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
                                            {article.source_id || "Health News"}
                                        </div>
                                    </div>

                                    <div className={style.newsContent}>
                                        <h3 className={style.newsTitle}>{article.title}</h3>
                                        <p className={style.newsDesc}>
                                            {article.description
                                                ? `${article.description.slice(0, 120)}...`
                                                : "Read the full details of this medical update at the source link below."}
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
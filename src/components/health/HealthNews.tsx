import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./styles/healthNews.module.css";
import AnimatedLoader from "@/components/ui/AnimatedLoader";
import { HiOutlineNewspaper } from "react-icons/hi";
import { FiExternalLink, FiArrowRight } from "react-icons/fi";
import { BASE_URL } from "@/context/UserProvider";

type Article = {
    title: string;
    description: string;
    link: string;
    image_url?: string;
    pubDate?: string;
    source_id?: string;
};

const HealthNews = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${BASE_URL}/health/news`);
                if (!res.ok) throw new Error("Failed to fetch health news");
                const data = await res.json();
                const list = Array.isArray(data) ? data : (data.results || []);
                setArticles(list.slice(0, 3));
            } catch (err) {
                setError("Failed to load latest health news");
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    if (loading) {
        return (
            <AnimatedLoader
                message="Fetching latest health news..."
                variant="card"
                count={3}
                showImage
                imageHeight={200}
            />
        );
    }

    if (error) return null;

    return (
        <section className={style.section}>
            <div className={style.headerRow}>
                <div className={style.titleGroup}>
                    <span className={style.iconWrapper}><HiOutlineNewspaper /></span>
                    <h2 className={style.heading}>Global Health News</h2>
                    <span className={style.badge}>Live Updates</span>
                </div>

                <p className={style.subHeadingDesktop}>
                    Stay informed with real-time health updates from around the world.
                </p>

                <button
                    className={style.viewAllLink}
                    onClick={() => navigate("/health-news")}
                >
                    View All <FiArrowRight />
                </button>
            </div>

            <p className={style.subHeadingMobile}>
                Stay informed with real-time health updates from around the world.
            </p>

            <div className={style.newsList}>
                {articles.map((article, i) => (
                    <article key={i} className={style.newsCard}>
                        <div className={style.imageContainer}>
                            {article.image_url ? (
                                <img
                                    src={article.image_url}
                                    alt={article.title}
                                    className={style.newsImage}
                                    loading="lazy"
                                />
                            ) : (
                                <div className={style.imagePlaceholder}>
                                    <HiOutlineNewspaper size={40} />
                                </div>
                            )}
                        </div>
                        <div className={style.newsContent}>
                            <div className={style.metaHeader}>
                                <span className={style.sourceTag}>
                                    {article.source_id || "Health News"}
                                </span>
                                <span className={style.date}>
                                    {article.pubDate ? new Date(article.pubDate).toLocaleDateString() : "Today"}
                                </span>
                            </div>

                            <h3 className={style.newsTitle}>{article.title}</h3>

                            <p className={style.newsDesc}>
                                {article.description?.slice(0, 100)}...
                            </p>

                            <div className={style.newsFooter}>
                                <a
                                    href={article.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={style.readMore}
                                >
                                    Read full article <FiExternalLink />
                                </a>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default HealthNews;
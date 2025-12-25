import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./style/healthNews.module.css";
import AnimatedLoader from "../components/utils/AnimatedLoader";

type Article = {
    title: string;
    description: string;
    link: string;
    image_url?: string;
    pubDate?: string;
    source_id?: string;
};


const URL = import.meta.env.VITE_BASE_URL;

const HealthNews = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${URL}/health/news`);
                if (!res.ok) throw new Error("Failed to fetch health news");
                const data = await res.json();
                setArticles(data.slice(0, 3));
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

    if (error) return <p className={style.status}>{error}</p>;

    return (
        <section className={style.section}>
            <div className={style.headerRow}>
                <div className={style.titleGroup}>
                    <h2 className={style.heading}>🩺 Global Health News</h2>
                    <span className={style.badge}>Live updates</span>
                </div>
                <button
                    className={style.viewAllLink}
                    onClick={() => navigate("/health-news")}
                >
                    View all news →
                </button>
            </div>
            <p className={style.subHeading}>Stay informed with real-time health updates from around the world.</p>

            <div className={style.newsList}>
                {articles.map((article, i) => (
                    <article key={i} className={style.newsCard}>
                        <div className={style.imageContainer}>
                            {article.image_url ? (
                                <img
                                    src={article.image_url}
                                    alt={article.title}
                                    className={style.newsImage}
                                />
                            ) : (
                                <div className={style.imagePlaceholder}>
                                    <span>Health Update</span>
                                </div>
                            )}
                        </div>
                        <div className={style.newsContent}>
                            <h3 className={style.newsTitle}>{article.title}</h3>
                            <p className={style.newsDesc}>
                                {article.description?.slice(0, 120)}...
                            </p>
                            <div className={style.newsFooter}>
                                <a href={article.link} target="_blank" rel="noopener noreferrer" className={style.readMore}>
                                    Read more →
                                </a>
                                <small className={style.meta}>
                                    {article.source_id && `${article.source_id} • `}
                                    {article.pubDate?.split(" ")[0]}
                                </small>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default HealthNews;

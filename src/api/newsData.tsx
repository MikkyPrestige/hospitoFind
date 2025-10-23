import { useEffect, useState } from "react";
import style from "./style/newsData.module.css";

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

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch(
                    `https://newsdata.io/api/1/news?category=health&q=hospital+medical+doctor&language=en&apikey=${import.meta.env.VITE_NEWS_DATA_API_KEY
                    }`
                );
                const data = await res.json();
                if (data.results) setArticles(data.results.slice(0, 9)); // show first 6
                else setError("No news available");
            } catch (err) {
                console.error("Error fetching news:", err);
                setError("Failed to fetch news");
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    if (loading) return <p className={style.status}>Getting latest medical news...</p>;
    if (error) return <p className={style.status}>{error}</p>;

    return (
        <section className={style.section}>
            <div className={style.headerRow}>
                <h2 className={style.heading}>🩺 Global Health & Hospital News</h2>
                <span className={style.badge}>Live updates</span>
            </div>
            <p className={style.subHeading}>
                Get the latest updates from the healthcare world.
            </p>
            <div className={style.newsList}>
                {articles.map((article, i) => (
                    <div key={i} className={style.newsCard}>
                        {article.image_url ? (
                            <img
                                src={article.image_url}
                                alt={article.title}
                                className={style.newsImage}
                            />
                        ) : (
                            <div className={style.imagePlaceholder}>No Image</div>
                        )}
                        <div className={style.newsContent}>
                            <h3 className={style.newsTitle}>{article.title}</h3>
                            <p className={style.newsDesc}>
                                {article.description || "No description available."}
                            </p>
                            <div className={style.newsFooter}>
                                <a
                                    href={article.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={style.readMore}
                                >
                                    Read more →
                                </a>
                                <small className={style.meta}>
                                    {article.source_id ? `${article.source_id}` : ""}
                                    {article.pubDate ? ` • ${article.pubDate.split(" ")[0]}` : ""}
                                </small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HealthNews;

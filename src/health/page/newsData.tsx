import { useEffect, useState } from "react";
import Motion from "@/components/motion";
import { fadeUp, sectionReveal } from "@/hooks/animations";
import Header from "@/layouts/header/nav";
import Footer from "@/layouts/footer/footer";
import AnimatedLoader from "@/components/utils/AnimatedLoader";
import style from "./style/newsData.module.css";

type Article = {
    title: string;
    description: string;
    link: string;
    image_url?: string;
    pubDate?: string;
    source_id?: string;
};

const URL = import.meta.env.VITE_BASE_URL;

const NewsData = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(`${URL}/health/news`);
                if (!res.ok) throw new Error("Failed to fetch health news");
                const data = await res.json();
                setArticles(data.slice(0, 12));
            } catch (err) {
                setError("Failed to load latest health news. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    return (
        <>
            <Header />
            <section className={style.section}>
                <Motion variants={sectionReveal} className={style.pageHeader}>
                    <div className={style.titleGroup}>
                        <h1 className={style.heading}>🩺 Global Health News</h1>
                        <span className={style.liveBadge}>Live Updates</span>
                    </div>
                    <p className={style.subHeading}>
                        Stay informed with curated real-time health updates and medical breakthroughs from around the world.
                    </p>
                </Motion>

                <div className={style.container}>
                    {loading ? (
                            <AnimatedLoader
                                message="Fetching the latest medical headlines..."
                                variant="card"
                                count={6}
                                showImage
                                imageHeight={220}
                            />
                    ) : error ? (
                        <div className={style.errorBox}>
                            <p>{error}</p>
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
                                                <span>Health News</span>
                                            </div>
                                        )}
                                        <div className={style.sourceTag}>
                                            {article.source_id || "Medical News"}
                                        </div>
                                    </div>

                                    <div className={style.newsContent}>
                                        <h3 className={style.newsTitle}>{article.title}</h3>
                                        <p className={style.newsDesc}>
                                            {article.description
                                                ? `${article.description.slice(0, 110)}...`
                                                : "Click below to read the full details of this medical update."}
                                        </p>

                                        <div className={style.newsFooter}>
                                            <a
                                                href={article.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={style.readMore}
                                            >
                                                Read Article →
                                            </a>
                                            <small className={style.date}>
                                                📅 {article.pubDate ? article.pubDate.split(" ")[0] : "Recently"}
                                            </small>
                                        </div>
                                    </div>
                                </Motion>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </>
    );
};

export default NewsData;
import { useState, useEffect, useCallback } from "react";
import { BASE_URL } from "@/context/UserProvider";
import { Article, UseHealthNewsReturn} from "@/types/media";

export const useHealthNews = (limit: number = 12): UseHealthNewsReturn => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNews = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`${BASE_URL}/health/news`);

            if (!res.ok) {
                throw new Error(res.status === 404 ? "News service currently unavailable." : "Server error.");
            }

            const data = await res.json();
            const list = Array.isArray(data) ? data : (data.results || []);

            setArticles(list.slice(0, limit));
        } catch (err) {
            setError("We're having trouble connecting to our news partners. Please check back shortly.");
            console.error("Health News Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    return { articles, loading, error, refetch: fetchNews };
};
import { useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";
import { Article, UseHealthNewsReturn} from "@/types/media";

export const useHealthNews = (limit: number = 12): UseHealthNewsReturn => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNews = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get("/health/news", { skipErrorToast: true } as any);
            const data = response.data;

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
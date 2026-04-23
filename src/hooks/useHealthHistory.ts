import { useState, useEffect, useCallback } from 'react';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { HealthSession, FeedbackPayload} from "@/types/healthHistory";

export const useHealthHistory = () => {
  const axiosPrivate = useAxiosPrivate();
  const [history, setHistory] = useState<HealthSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axiosPrivate.get('/user/health-history');
      setHistory(data.history || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load health history');
    } finally {
      setIsLoading(false);
    }
  }, [axiosPrivate]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const saveFeedback = useCallback(
    async (sessionId: string, payload: FeedbackPayload) => {
      try {
        await axiosPrivate.patch(
          `/user/health-history/${sessionId}/feedback`,
          payload
        );
        setHistory((prev) =>
          prev.map((s) =>
            s._id === sessionId
              ? {
                  ...s,
                  ...(payload.rating !== undefined && { rating: payload.rating }),
                  ...(payload.feedback !== undefined && { feedback: payload.feedback }),
                }
              : s
          )
        );
        return { success: true };
      } catch (err: any) {
        return {
          success: false,
          error: err?.response?.data?.message || 'Failed to save feedback',
        };
      }
    },
    [axiosPrivate]
  );

  const deleteSession = useCallback(
    async (sessionId: string) => {
      try {
        await axiosPrivate.delete(`/user/health-history/${sessionId}`);
        setHistory((prev) => prev.filter((s) => s._id !== sessionId));
        return { success: true };
      } catch (err: any) {
        return {
          success: false,
          error: err?.response?.data?.message || 'Failed to delete session',
        };
      }
    },
    [axiosPrivate]
  );

  const clearHistory = useCallback(async () => {
    try {
      await axiosPrivate.delete('/user/health-history');
      setHistory([]);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.message || 'Failed to clear history',
      };
    }
  }, [axiosPrivate]);

  return {
    history,
    isLoading,
    error,
    fetchHistory,
    saveFeedback,
    deleteSession,
    clearHistory,
  };
};

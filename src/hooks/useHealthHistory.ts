/**
 * useHealthHistory.ts
 * Fetches and manages the user's health history sessions.
 * Uses useAxiosPrivate so the access token is sent automatically.
 */

import { useState, useEffect, useCallback } from 'react';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface MatchedHospital {
  hospitalId: {
    _id: string;
    name: string;
    slug: string;
    address: { city: string; state: string };
    photoUrl?: string;
  } | null;
  name: string;
  matchScore: number;
}

export interface HealthSession {
  _id: string;
  date: string;
  symptoms: string[];
  location: string;
  matchedHospitals: MatchedHospital[];
  hospitalVisited: {
    _id: string;
    name: string;
    slug: string;
    address: { city: string; state: string };
  } | null;
  rating: number | null;
  feedback: string | null;
}

export interface FeedbackPayload {
  hospitalVisited?: string;
  rating?: number;
  feedback?: string;
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useHealthHistory = () => {
  const axiosPrivate = useAxiosPrivate();
  const [history, setHistory] = useState<HealthSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch all sessions ──────────────────────────────────────────────────────
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

  // ── Save feedback for a session ─────────────────────────────────────────────
  const saveFeedback = useCallback(
    async (sessionId: string, payload: FeedbackPayload) => {
      try {
        await axiosPrivate.patch(
          `/user/health-history/${sessionId}/feedback`,
          payload
        );
        // Update local state immediately — no need to refetch
        // Only spread rating and feedback (primitives) — not hospitalVisited
        // since local state holds the populated object, not the ID string
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

  // ── Delete a single session ─────────────────────────────────────────────────
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

  // ── Clear all history ───────────────────────────────────────────────────────
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

import { useState, useEffect, useCallback } from "react";
import { Hospital } from "@/types/hospital";
import { useAuthContext } from "@/context/UserProvider";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

export function useHospitalInteractions(
  onFavoritesUpdate?: () => void,
  onRecentUpdate?: () => void,
  onWeeklyViewsChange?: (count: number) => void
) {
  const { state } = useAuthContext();
  const axiosPrivate = useAxiosPrivate();
  const [favorites, setFavorites] = useState<Hospital[]>([]);

  const userPrefix = state?.username || "guest";
  const FAV_KEY = `${userPrefix}_favorites`;
  const REC_KEY = `${userPrefix}_recentlyViewed`;
  const WEEKLY_KEY = `${userPrefix}_weeklyStats`;

  useEffect(() => {
    setFavorites(JSON.parse(localStorage.getItem(FAV_KEY) || "[]"));
  }, [FAV_KEY]);

  const toggleFav = useCallback(async (h: Hospital) => {
    const raw = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
    const exists = raw.some((r: any) => r._id === h._id);
    const next = exists
      ? raw.filter((r: any) => r._id !== h._id)
      : [{ ...h }, ...raw].slice(0, 50);

    localStorage.setItem(FAV_KEY, JSON.stringify(next));
    setFavorites(next);
    onFavoritesUpdate?.();

    if (state?.accessToken) {
      try {
        await axiosPrivate.post(`/user/favorites-status/${h._id}`);
      } catch (error) {
        console.error("Sync failed", error);
      }
    }
  }, [FAV_KEY, onFavoritesUpdate, state?.accessToken, axiosPrivate]);

  const handleExplore = useCallback(async (hospital: Hospital) => {
    const raw = JSON.parse(localStorage.getItem(REC_KEY) || "[]");
    const filtered = raw.filter((h: any) => String(h._id) !== String(hospital._id));

    const next = [
      { ...hospital, viewedAt: Date.now() },
      ...filtered
    ].slice(0, 10);

    localStorage.setItem(REC_KEY, JSON.stringify(next));
    onRecentUpdate?.();

    const stored = JSON.parse(localStorage.getItem(WEEKLY_KEY) || "{}");
    const now = Date.now();
    const oneWeekMs = 604800000;

    let count = 1;
    let lastReset = now;

    if (stored.lastReset && (now - stored.lastReset < oneWeekMs)) {
      count = (stored.count || 0) + 1;
      lastReset = stored.lastReset;
    }

    localStorage.setItem(WEEKLY_KEY, JSON.stringify({ count, lastReset }));
    onWeeklyViewsChange?.(count);

    if (state?.accessToken) {
      try {
        await axiosPrivate.post("/user/view", { hospitalId: hospital._id });
      } catch (e) {
         console.error("View sync failed", e);
      }
    }
  }, [REC_KEY, WEEKLY_KEY, onRecentUpdate, onWeeklyViewsChange, state?.accessToken, axiosPrivate]);

  return { favorites, toggleFav, handleExplore };
}
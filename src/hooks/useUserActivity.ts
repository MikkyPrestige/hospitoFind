import useAxiosPrivate from "./useAxiosPrivate";
import { toast } from "react-toastify";

export const useUserActivity = () => {
  const axiosPrivate = useAxiosPrivate();

  const syncFavorite = async (hospitalId: string) => {
    try {
      await axiosPrivate.post("/user/favorites", { hospitalId });
    } catch (err) {
      console.error("Background Sync Error (Fav):", err);
    }
  };

  const syncView = async (hospitalId: string) => {
    try {
      return await axiosPrivate.post("/user/view", { hospitalId });
    } catch (err) {
      console.error("Background Sync Error (View):", err);
    }
  };

  const fetchActivity = async () => {
    try {
      const { data } = await axiosPrivate.get("/user/activity");
      return data;
    } catch (err) {
      console.error("Hydration Error:", err);
      return null;
    }
  };

  const removeFavoriteItem = async (id: string): Promise<boolean> => {
    try {
      await axiosPrivate.delete(`/user/favorites/${id}`);
      toast.success("Removed from saved collections");
      return true;
    } catch (err: any) {
      console.error("Failed to delete favorite", err);
      toast.error(err.response?.data?.message || "Could not sync with server. Please try again.");
      return false;
    }
  };

  const removeHistoryItem = async (id: string): Promise<boolean> => {
    try {
      await axiosPrivate.delete(`/user/history/${id}`);
      toast.success("Removed from recent history");
      return true;
    } catch (err: any) {
      console.error("Failed to delete history item", err);
      toast.error(err.response?.data?.message || "Could not sync with server. Please try again.");
      return false;
    }
  };

  return { syncFavorite, syncView, fetchActivity, removeFavoriteItem, removeHistoryItem };
};
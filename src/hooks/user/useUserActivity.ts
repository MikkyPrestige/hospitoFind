import useAxiosPrivate from "./useAxiosPrivate";

export const useUserActivity = () => {
  const axiosPrivate = useAxiosPrivate();

  const syncFavorite = async (hospitalId: string) => {
    try {
      await axiosPrivate.post("/users/favorites", { hospitalId });
    } catch (err) {
      console.error("Background Sync Error (Fav):", err);
    }
  };

  const syncView = async (hospitalId: string) => {
    try {
      return await axiosPrivate.post("/users/view", { hospitalId });
    } catch (err) {
      console.error("Background Sync Error (View):", err);
    }
  };

  const fetchActivity = async () => {
    try {
      const { data } = await axiosPrivate.get("/users/activity");
      return data;
    } catch (err) {
      console.error("Hydration Error:", err);
      return null;
    }
  };

  return { syncFavorite, syncView, fetchActivity };
};
// import { api } from "@/services/api";

// const useUserActivity = () => {
//   const syncFavorite = async (hospitalId: string) => {
//     try {
//         const token = localStorage.getItem("accessToken");
//      const res = await api.post("/hospitals/favorite", { hospitalId }, { headers: { Authorization: `Bearer ${token}` }});
//       return res.data;
//     } catch (err) { console.error("Sync failed", err);
//         return null;
//     }
//   };

//   const syncView = async (hospitalId: string) => {
//     try {
//         const token = localStorage.getItem("accessToken");
//        const res = await api.post("/hospitals/view", { hospitalId }, { headers: { Authorization: `Bearer ${token}` } });
//       return res.data;
//     } catch (err) { console.error("Sync failed", err);
//         return null;
//     }
//   };

//   return { syncFavorite, syncView };
// };

// export default useUserActivity;
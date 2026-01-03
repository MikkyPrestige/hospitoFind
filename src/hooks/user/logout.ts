import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthContext } from "@/context/userContext";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { toast } from "react-toastify";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { logout: logoutAuth0 } = useAuth0();
  const { state, dispatch } = useAuthContext();
  const navigate = useNavigate();

  const logout = async (localOnly = false) => {
    setLoading(true);
    try {
      if (!localOnly) {
        await api.post("/auth/logout");
      }
    } catch (error) {
      console.error("Backend logout skipped or failed");
    } finally {
      if (!state.auth0Id) {
        navigate("/", { replace: true });
      }

      const keysToRemove = [
        "accessToken",
        "username",
        "role",
        "id",
        "auth0.is_authenticated",
        "selectedLink",
        "email"
      ];

      keysToRemove.forEach((key) => localStorage.removeItem(key));

      dispatch({ type: "LOGOUT" });

if (state.auth0Id) {
        logoutAuth0({ logoutParams: { returnTo: window.location.origin } });
      } else {
        if (localOnly) {
          window.location.href = "/login";
        } else {
          toast.success("Logged out successfully");
        }
      }

      setLoading(false);
    }
  };

  return { logout, loading };
};

export default useLogout;
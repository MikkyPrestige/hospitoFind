import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthContext } from "@/context/userContext";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { toast } from "react-toastify";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { logout: logoutAuth0 } = useAuth0();
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const logout = async () => {
    setLoading(true);
    try {
      // Clear backend session (JWT Cookie)
      await api.post("/auth/logout");

      dispatch({ type: "LOGOUT" });

      // Check if they are an Auth0 user before redirecting
      const isAuth0User = !!localStorage.getItem("auth0.is_authenticated");

      toast.success("Logged out successfully", { position: "top-center" });

      if (isAuth0User) {
        //  Log out of Auth0 Session
        logoutAuth0({
          logoutParams: {
            returnTo: window.location.origin
          }
        });
      } else {
        navigate("/");
      }
    } catch (error) {
      // Even if network fails, clear local data so they aren't "stuck"
      dispatch({ type: "LOGOUT" });
      // navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading };
};

export default useLogout;

// import axios from 'axios';
// import { useState } from 'react';
// import { useAuthContext, BASE_URL } from '@/context/userContext';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// const useLogout = () => {
//   const [loading, setLoading] = useState(false);
//   const { dispatch } = useAuthContext();
//   const navigate = useNavigate();

//   const logout = async () => {
//     setLoading(true);

//     try {
//       await axios.post(`${BASE_URL}/auth/logout`);

//       dispatch({ type: 'LOGOUT' });

//       toast.info("Logged out successfully. See you soon!", {
//         position: "top-center",
//         autoClose: 3000,
//       });

//       navigate('/');
//     } catch (error: any) {
//       dispatch({ type: 'LOGOUT' });
//       navigate('/');
//       toast.warning("Session ended.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { loading, logout };
// };

// export default useLogout;
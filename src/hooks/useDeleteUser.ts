import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/UserProvider';
import { useAuth0 } from "@auth0/auth0-react";
import { api } from '@/services/api';
import { toast } from "react-toastify";

const useDelete = () => {
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const { logout, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const deleteUser = async (username: string, password?: string) => {
    setLoading(true);
    try {
      await api.delete(`/users`, {
        data: { username, password },
      });

      dispatch({ type: 'DELETE' });
      localStorage.clear();

      toast.info("Account deleted. We're sorry to see you go!", { position: "top-center" });

      if (isAuthenticated) {
        logout({ logoutParams: { returnTo: window.location.origin } });
      } else {
        navigate('/');
      }

    } catch (error: any) {
      const msg = error.response?.data?.message || "Deletion failed.";
      toast.error(msg, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return { loading, deleteUser };
};

export default useDelete;
import { useState } from 'react'
import { PasswordUpdate } from '@/services/user'
import useLogout from './logout';
import { api } from '@/services/api'
import { toast } from 'react-toastify';

const usePasswordUpdate = () => {
  const [loading, setLoading] = useState(false);
  const {logout} = useLogout();

  const updatePassword = async (user: PasswordUpdate) => {
    setLoading(true);
    try {
      await api.patch(`/users/password`, user);

      toast.success("Password updated successfully!", { position: "top-center" });
      localStorage.removeItem("accessToken");
      setTimeout(() => {
        logout(true);
      }, 1500);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to update password";
      toast.error(msg, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return { loading, updatePassword };
};

export default usePasswordUpdate;
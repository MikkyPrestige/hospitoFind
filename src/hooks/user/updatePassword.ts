import { useState } from 'react'
import { useAuthContext } from '@/context/userContext'
import { PasswordUpdate } from '@/services/user'
import { api } from '@/services/api'
import { toast } from 'react-toastify';

const usePasswordUpdate = () => {
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const updatePassword = async (user: PasswordUpdate) => {
    setLoading(true);
    try {
      const response = await api.patch(`/users/password`, user);

      dispatch({
        type: 'UPDATE',
        payload: response.data,
      });

      toast.success("Password updated successfully!", { position: "top-center" });
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
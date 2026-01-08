import { useState } from 'react';
import { User } from '@/services/user';
import { useAuthContext } from '@/context/UserProvider';
import { api } from '@/services/api';
import { toast } from "react-toastify";

const useUpdate = () => {
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const update = async (user: User, onSuccess?: () => void) => {
    setLoading(true);
    try {
      const response = await api.patch<User>(`/users`, user);

      dispatch({
        type: 'UPDATE',
        payload: response.data,
      });

      toast.success("Profile updated successfully!", { position: "top-center" });
      if (onSuccess) onSuccess();

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Could not update profile.";
      toast.error(errorMessage, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return { loading, update };
};

export default useUpdate;
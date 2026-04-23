import { useState } from 'react';
import { User } from '@/types/user';
import { useAuthContext } from '@/context/UserProvider';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { toast } from "react-toastify";

const useUpdate = () => {
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const axiosPrivate = useAxiosPrivate();

  const update = async (user: User, onSuccess?: () => void) => {
    setLoading(true);
    try {
      const response = await axiosPrivate.patch<User>(`/user`, user);

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
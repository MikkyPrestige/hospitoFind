import { useState } from 'react';
import { api } from '@/services/api';
import { User } from '@/src/types/user';
import { toast } from 'react-toastify';

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const signUp = async (user: User) => {
    setLoading(true);

    try {
      const response = await api.post(`/auth/register`, user);

     toast.success(response.data.message || "Account created! Verify your email.", {
        position: "top-center"
      });
      setSuccess(true);

    } catch (error: any) {
      const msg = error.response?.data?.message || "Registration failed. Try a different email.";
      toast.error(msg, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return { loading, signUp, success };
};

export default useSignup;
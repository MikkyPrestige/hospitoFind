import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/UserProvider';
import { api } from '@/services/api';
import { Login } from '@/services/user';
import { toast } from 'react-toastify';


const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const login = async (credentials: Login) => {
    setLoading(true);
    setSuccess(false);

    try {
      const response = await api.post(`/auth`, credentials);
      const data = response.data;

      dispatch({
        type: 'LOGIN',
        payload: data,
      });

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username);

      setUser(data);
      setSuccess(true);

      toast.success(`Welcome back, ${data.name}!`, { position: "top-center" });

      // Redirect based on role
      if (response.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Login failed. Check your credentials.";
      toast.error(msg, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return { loading, login, success, user };
};

export default useLogin;
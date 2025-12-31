import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/userContext';
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


// const useLogin = () => {
//   const [loading, setLoading] = useState(false);
//   const { dispatch } = useAuthContext();
//   const navigate = useNavigate();

//   const login = async (user: Login) => {
//     setLoading(true);

//     try {
//       const response = await api.post(`${BASE_URL}/auth`, user, { withCredentials: true });
//       const { accessToken, name, email, username, role, createdAt, updatedAt } = response.data;

//       document.cookie = `accessToken=${accessToken}; SameSite=None; Max-Age=3600;`;

//       dispatch({
//         type: 'LOGIN',
//         payload: { username, name, email, accessToken, role, createdAt, updatedAt },
//       });

//       toast.success(`Welcome back, ${name}!`, { position: "top-center" });

//       if (role === 'admin') {
//         navigate('/admin/dashboard');
//       } else {
//         navigate('/dashboard');
//       }
//     } catch (error: any) {
//       const msg = error.response?.data?.message || "Login failed. Please check your credentials.";
//       toast.error(msg, { position: "top-center" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { loading, login };
// };

// export default useLogin;
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuthContext } from '@/context/userContext';
import { api } from '@/services/api';
import { User } from '@/services/user';
import { toast } from 'react-toastify';

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  // const { dispatch } = useAuthContext();
  // const navigate = useNavigate();

  const signUp = async (user: User) => {
    setLoading(true);

    try {
      const response = await api.post(`/auth/register`, user);

      // dispatch({
      //   type: 'REGISTER',
      //   payload: response.data,
      // });

     toast.success(response.data.message || "Account created! Verify your email.", {
        position: "top-center"
      });
      setSuccess(true);

      // navigate('/dashboard');
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
// const useSignup = () => {
//   const [loading, setLoading] = useState(false);
//   const { dispatch } = useAuthContext();
//   const navigate = useNavigate();

//   const signUp = async (user: User) => {
//     setLoading(true);

//     try {
//       const response = await api.post(`${BASE_URL}/auth/register`, user);

//       dispatch({
//         type: 'REGISTER',
//         payload: response.data,
//       });

//       toast.success("Account created successfully! Welcome to HospitoFind.", {
//         position: "top-center",
//       });

//       navigate('/dashboard');
//     } catch (error: any) {
//       const msg = error.response?.data?.message || "Registration failed. Try a different email or username.";
//       toast.error(msg, { position: "top-center" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { loading, signUp };
// };

// export default useSignup;
import { useState } from 'react';
import { User } from '@/services/user';
import { useAuthContext } from '@/context/userContext';
import { api } from '@/services/api';
import { toast } from "react-toastify";

const useUpdate = () => {
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const update = async (user: User) => {
    setLoading(true);
    try {
      const response = await api.patch<User>(`/users`, user);

      dispatch({
        type: 'UPDATE',
        payload: response.data,
      });

      toast.success("Profile updated successfully!", { position: "top-center" });
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

// import axios from 'axios'
// import { useState, useEffect } from 'react'
// import { User } from '@/services/user'
// import { useAuthContext, BASE_URL } from '@/context/userContext'

// const useUpdate = () => {
//   const [loading, setLoading] = useState(false)
//   const [success, setSuccess] = useState('')
//   const [error, setError] = useState('')
//   const { dispatch } = useAuthContext()

//   useEffect(() => {
//     if (success || error) {
//       const timer = setTimeout(() => {
//         setSuccess('')
//         setError('')
//       }, 10000)

//       return () => clearTimeout(timer)
//     }
//   }, [success, error])

//   const update = async (user: User) => {
//     setLoading(true)
//     setError('')
//     await axios
//       .patch<User>(`${BASE_URL}/users`, user)
//       .then((response) => {
//         dispatch({
//           type: 'UPDATE',
//           payload: response.data,
//         });
//         setSuccess(`${user.username} info updated successfully`)
//       })
//       .catch((error) => {
//         if (error.response) {
//           setError(error.response.data.message)
//         } else if (error.request) {
//           setError('We couldn’t reach the server. Please check your connection and try again.')
//         } else {
//           setError(error.message)
//         }
//       })
//       .finally(() => {
//         setLoading(false)
//       })
//   }

//   return { loading, success, error, update }
// }

// export default useUpdate

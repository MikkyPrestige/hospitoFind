// import axios from 'axios';
// import { useAuthContext, BASE_URL } from '@/context/userContext';

// const useRefresh = () => {
//     const { dispatch } = useAuthContext();

//     const refresh = async () => {
//         try {
//             // refresh endpoint with credentials
//             const response = await axios.get(`${BASE_URL}/auth/refresh`, {
//                 withCredentials: true
//             });

//             const { accessToken, role, username, email, name } = response.data;

//             dispatch({
//                 type: 'REFRESH',
//                 payload: {
//                     accessToken,
//                     role,
//                     username,
//                     email,
//                     name
//                 }
//             });

//             return accessToken;
//         } catch (error) {
//             console.error("Refresh failed", error);
//             throw error;
//             // dispatch({ type: 'LOGOUT' });
//             // return null;
//         }
//     };

//     return refresh;
// };

// export default useRefresh;
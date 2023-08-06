import { useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { BASE_URL } from '@/context/userContext';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/userContext';

const Callback = () => {
  const { user, getIdTokenClaims, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  useEffect(() => {
    const getUserInfo = async () => {
      if (isAuthenticated) {
        try {
          const idToken = await getIdTokenClaims();
          const email = idToken.email;
          const name = idToken.name;
          const username = idToken.nickname;

          const response = await axios.post(`${BASE_URL}/auth/auth0`, {
            email,
            name,
            username,
            idToken: idToken.__raw,
          });

          const { accessToken } = response.data;
          //  set the access token in the cookie
          document.cookie = `accessToken=${accessToken}; SameSite=None; Max-Age=3600;`;
          //  set the access token in the state
          dispatch({
            type: 'LOGIN',
            payload: {
              username: username,
              name: name,
              email: email,
              accessToken: accessToken,
            },
          });
          navigate("/dashboard");
        } catch (error) {
          console.log(error);
        }
      }
    };

    if (user) {
      getUserInfo();
    }
  }, [user, getIdTokenClaims, navigate]);

  return <div>Redirecting...</div>;
};


export default Callback;
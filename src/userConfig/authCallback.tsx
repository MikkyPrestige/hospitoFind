import { useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { BASE_URL } from '@/context/userContext';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/userContext';
import { IdToken } from '@/services/user';
import style from "./style/callback.module.css";

const Callback = () => {
  const { user, getIdTokenClaims, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  useEffect(() => {
    const getUserInfo = async () => {
      if (isAuthenticated) {
        try {
          const idToken: IdToken | undefined = await getIdTokenClaims();
          if (idToken) {
            const name = idToken.name;
            const username = idToken.nickname;
            const email = idToken.email;

            const response = await axios.post(`${BASE_URL}/auth/auth0`, {
              name,
              username,
              email,
              idToken: idToken.__raw,
            });

            const { accessToken } = response.data;
            document.cookie = `accessToken=${accessToken}; SameSite=None; Max-Age=3600;`;
            dispatch({
              type: 'LOGIN',
              payload: {
                name: name,
                username: username,
                email: email,
                accessToken: accessToken,
              },
            });
            navigate("/dashboard");
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    if (user) {
      getUserInfo();
    }
  }, [user, getIdTokenClaims, navigate]);

  return (
    <div className={style.container}>
      <div className={style.blob}></div>
      <p className={style.text}>Authenticating Please wait...</p>
    </div>
  )
};


export default Callback;

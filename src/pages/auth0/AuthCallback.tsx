import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { BASE_URL } from "@/context/UserProvider";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/UserProvider";
import { IdToken } from "@/src/types/user";
import style from "./styles/callback.module.css";

const Callback = () => {
  const { user, getIdTokenClaims, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();
  const [isFadingOut, setIsFadingOut] = useState(false);

  const requestStarted = useRef(false);

  useEffect(() => {
    const getUserInfo = async () => {
      if (isLoading) return;

      if (isAuthenticated && user && !requestStarted.current) {
        requestStarted.current = true;

        try {
          const idToken: IdToken | undefined = await getIdTokenClaims();

          if (idToken?.__raw) {
            const response = await axios.post(
              `${BASE_URL}/auth/auth0`,
              {
                name: idToken.name,
                username: idToken.nickname,
                email: idToken.email,
                idToken: idToken.__raw,
              },
              { withCredentials: true }
            );

            const authData = response.data;

            localStorage.setItem("accessToken", authData.accessToken);
            localStorage.setItem("role", authData.role);
            localStorage.setItem("username", authData.username);
            localStorage.setItem("name", authData.name);
            localStorage.setItem("email", authData.email);
            localStorage.setItem("createdAt", authData.createdAt);
            localStorage.setItem("id", authData.id);
            localStorage.setItem("auth0Id", authData.auth0Id || "");

            dispatch({
              type: "LOGIN",
              payload: authData,
            });

            await new Promise((resolve) => setTimeout(resolve, 1000));
            setIsFadingOut(true);
            await new Promise((resolve) => setTimeout(resolve, 500));

            const redirectPath = authData.role === 'admin' ? "/admin" : "/dashboard";
            navigate(redirectPath, { replace: true });
          }
        } catch (error) {
          console.error("❌ Auth0 Callback Error:", error);
          localStorage.removeItem("accessToken");
          navigate("/login", { replace: true });
        }
      }
    };

    getUserInfo();
  }, [user, getIdTokenClaims, isAuthenticated, isLoading, navigate, dispatch]);

  return (
    <div className={`${style.container} ${isFadingOut ? style.fadeOut : ""}`}>
      <div className={style.loader}>
        <div className={style.blob}></div>
      </div>
      <p className={style.text}>
        Securing Account...<br />
        <span>Welcome to HospitoFind</span>
      </p>
    </div>
  );
};

export default Callback;
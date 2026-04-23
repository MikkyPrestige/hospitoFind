import { useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuth0Handshake } from "@/hooks/useAuth0Handshake";
import style from "./styles/callback.module.css";

const Callback = () => {
  const { user, getIdTokenClaims, isAuthenticated, isLoading } = useAuth0();
  const { handleCallback, isFadingOut } = useAuth0Handshake();
  const requestStarted = useRef(false);

  useEffect(() => {
    const syncUser = async () => {
      if (isLoading) return;

      if (isAuthenticated && user && !requestStarted.current) {
        requestStarted.current = true;
        const idToken = await getIdTokenClaims();

        if (idToken?.__raw) {
          await handleCallback(idToken);
        }
      }
    };

    syncUser();
  }, [user, getIdTokenClaims, isAuthenticated, isLoading]);

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
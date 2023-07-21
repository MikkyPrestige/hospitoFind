import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Callback = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    const handleAuthentication = async () => {
      if (!isLoading) {
        await loginWithRedirect({
          appState: {
            returnTo: "/dashboard",
          },
        });
      }
    }

    handleAuthentication();
  }, [isLoading, loginWithRedirect])

  return (
    <div>
      {isAuthenticated && <p>Loading...</p>}
    </div>
  )
}

export default Callback

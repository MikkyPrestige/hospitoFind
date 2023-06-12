import axios from "axios";
import { useState } from "react";
// import { useAuth0 } from "@auth0/auth0-react"
import { useAuthContext } from "../contexts/userContext";
import { Login } from "@/services/userTypes";

const BASE_URL = "http://localhost:5000/auth"

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { dispatch } = useAuthContext();
  // const { loginWithRedirect, getAccessTokenSilently } = useAuth0()

  //  access the access token from the Auth0 client instance
  // const getAccessToken = getAccessTokenSilently()

  const login = async (user: Login) => {
    setLoading(true);
    setError("");
    await axios.post<{ accessToken: string }>(`${BASE_URL}`, user)
      .then((response) => {
        const { accessToken } = response.data
        document.cookie = `accessToken=${accessToken}; SameSite=None; Max-Age=3600;`;
        dispatch({
          type: "LOGIN",
          payload: {
            user: user.username,
            accessToken: accessToken
          }
        })
      })
      .catch((error) => {
        if (error.response) {
          // Request made and server responded
          setError(error.response.data.message)
        }
        else if (error.request) {
          // The request was made but no response was received
          setError("Server did not respond")
        }
        else {
          // Something happened in setting up the request that triggered an Error
          setError(error.message)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return { loading, error, login }

}

export default useLogin
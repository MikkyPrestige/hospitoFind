import axios from "axios";
import { useState } from "react";
import { useAuthContext } from "@/contexts/userContext";

const BASE_URL = "http://localhost:5000/auth/logout"

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { dispatch } = useAuthContext();

  const logout = async () => {
    setLoading(true);
    setError("");
    await axios.post(`${BASE_URL}`)
      .then(() => {
        dispatch({ type: "LOGOUT" })
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data.message)
        }
        else if (error.request) {
          setError("Server did not respond")
        }
        else {
          setError(error.message)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return { loading, error, logout }

}

export default useLogout
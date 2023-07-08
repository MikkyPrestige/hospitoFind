import axios from "axios";
import { useState } from "react";
import { useAuthContext } from "@/contexts/userContext";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../contexts/userContext";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const logout = async () => {
    setLoading(true);
    setError("");
    await axios.post(`${BASE_URL}/auth/logout`)
      .then(() => {
        dispatch({ type: "LOGOUT" })
        navigate("/")
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
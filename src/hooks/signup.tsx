import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext, BASE_URL } from "@/context/userContext";
import { User } from "@/services/user";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const signUp = async (user: User) => {
    setLoading(true);
    setError("");
    await axios.post(`${BASE_URL}/users`, user)
      .then(() => {
        dispatch({
          type: "REGISTER",
          payload: {
            username: user.username,
            name: user.name,
            email: user.email,
          }
        })
        navigate("/dashboard")
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

  return { loading, error, signUp }

}

export default useSignup
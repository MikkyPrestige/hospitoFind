import axios from "axios";
import { useState } from "react";
import { useAuthContext } from "@/contexts/userContext";
import { User } from "@/services/userTypes";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000/user"

const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const signUp = async (user: User) => {
    setLoading(true);
    setError("");
    await axios.post(`${BASE_URL}`, user)
      .then(() => {
        // const { id } = response.headers;
        dispatch({
          type: "REGISTER",
          payload: {
            // id: id,
            username: user.username,
            name: user.name,
            email: user.email,
            // profileDp: user.profileDp || undefined
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

export default useSignUp


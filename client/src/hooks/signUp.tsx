import axios from "axios";
import { useState } from "react";
import { useAuthContext } from "@/contexts/userContext";
import { User } from "@/services/userTypes";

const BASE_URL = "http://localhost:5000/user"

const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { dispatch } = useAuthContext();

  const signUp = async (user: User) => {
    setLoading(true);
    setError("");
    await axios.post(`${BASE_URL}`, user)
      .then(() => {
        dispatch({
          type: "REGISTER",
          payload: {
            user: user.username,
          }
        })
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


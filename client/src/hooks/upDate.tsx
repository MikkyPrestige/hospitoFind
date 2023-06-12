import axios from "axios";
import { useState } from "react";
import { useAuthContext } from "../contexts/userContext";
import { User } from "@/services/userTypes";

const BASE_URL = "http://localhost:5000/user"

const useUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { dispatch } = useAuthContext();

  const update = async (user: User) => {
    setLoading(true);
    setError("");
    await axios.patch<User>(`${BASE_URL}`, user)
      .then(() => {
        dispatch({
          type: "UPDATE",
          payload: {
            user: user.username
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

  return { loading, error, update }

}

export default useUpdate
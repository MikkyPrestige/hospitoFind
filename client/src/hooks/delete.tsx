import axios from "axios";
import { useState } from "react";
import { useAuthContext } from "../contexts/userContext";

const BASE_URL = "http://localhost:5000/user"

const useDelete = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { dispatch } = useAuthContext();

  const deleteUser = async (username: string, password: string) => {
    setLoading(true);
    setError("");
    await axios.delete(`${BASE_URL}`, {
      data: {
        username: username,
        password: password
      }
    })
      .then(() => {
        dispatch({
          type: "DELETE",
          payload: {
            user: username
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

  return { loading, error, deleteUser }

}

export default useDelete

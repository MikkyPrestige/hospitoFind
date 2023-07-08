import axios from "axios";
import { useState } from "react";
import { useAuthContext } from "../contexts/userContext";
import { BASE_URL } from "../contexts/userContext";

const useDelete = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { dispatch } = useAuthContext();

  const deleteUser = async (username: string, password: string) => {
    setLoading(true);
    setError("");
    await axios.delete(`${BASE_URL}/user`, {
      data: {
        username: username,
        password: password
      }
    })
      .then(() => {
        dispatch({
          type: "DELETE",
          payload: {
            username: username
          }
        })
        setSuccess(`${username} account deleted successfully`)
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

  return { loading, success, error, deleteUser }

}

export default useDelete

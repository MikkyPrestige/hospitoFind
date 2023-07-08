import axios from "axios";
import { useState } from "react";
import { useAuthContext } from "../contexts/userContext";
import { BASE_URL } from "../contexts/userContext";

interface Edit {
  username: string;
  password: string;
  newPassword: string;
}

const usePasswordUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { dispatch } = useAuthContext();

  const updatePassword = async (user: Edit) => {
    setLoading(true);
    setError("");
    await axios.patch<Edit>(`${BASE_URL}/user`, user)
      .then(() => {
        dispatch({
          type: "UPDATE",
          payload: {
            username: user.username,
            password: user.password,
            newPassword: user.newPassword
          }
        })
        setSuccess(`${user.username} account updated successfully`)
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

  return { loading, success, error, updatePassword }

}

export default usePasswordUpdate
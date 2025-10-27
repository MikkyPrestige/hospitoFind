import axios from 'axios'
import { useState, useEffect } from 'react'
import { useAuthContext, BASE_URL } from '@/context/userContext'

const useDelete = () => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const { dispatch } = useAuthContext()

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('')
        setError('')
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [success, error])

  const deleteUser = async (username: string, password: string) => {
    setLoading(true)
    setError('')
    await axios
      .delete(`${BASE_URL}/users`, {
        data: {
          username: username,
          password: password,
        },
      })
      .then(() => {
        dispatch({
          type: 'DELETE',
          payload: {
            username: username,
            password: password,
          },
        })
        setSuccess(`${username} account deleted successfully`)
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data.message)
        } else if (error.request) {
          setError('We couldn’t reach the server. Please check your connection and try again.')
        } else {
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

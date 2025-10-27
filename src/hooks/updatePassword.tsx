import axios from 'axios'
import { useState, useEffect } from 'react'
import { useAuthContext, BASE_URL } from '@/context/userContext'
import { PasswordUpdate } from '@/services/user'

const usePasswordUpdate = () => {
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

  const updatePassword = async (user: PasswordUpdate) => {
    setLoading(true)
    setError('')
    await axios
      .patch<PasswordUpdate>(`${BASE_URL}/users/password`, user)
      .then(() => {
        dispatch({
          type: 'PASSWORD-UPDATE',
          payload: {
            username: user.username,
            password: user.password,
            newPassword: user.newPassword,
          },
        })
        setSuccess(`${user.username} password changed successfully`)
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

  return { loading, success, error, updatePassword }
}

export default usePasswordUpdate

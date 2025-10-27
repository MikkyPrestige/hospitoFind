import axios from 'axios'
import { useState, useEffect } from 'react'
import { User } from '@/services/user'
import { useAuthContext, BASE_URL } from '@/context/userContext'

const useUpdate = () => {
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

  const update = async (user: User) => {
    setLoading(true)
    setError('')
    await axios
      .patch<User>(`${BASE_URL}/users`, user)
      .then(() => {
        dispatch({
          type: 'UPDATE',
          payload: {
            username: user.username,
            name: user.name,
            email: user.email,
          },
        })
        setSuccess(`${user.username} info updated successfully`)
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

  return { loading, success, error, update }
}

export default useUpdate

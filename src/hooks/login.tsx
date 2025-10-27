import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext, BASE_URL } from '../context/userContext'
import { Login } from '@/services/user'

const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { dispatch } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('')
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [error])

  const login = async (user: Login) => {
    setLoading(true)
    setError('')
    await axios
      .post(`${BASE_URL}/auth`, user)
      .then((response) => {
        const { accessToken, name, email, username } = response.data
        //  set the access token in the cookie
        document.cookie = `accessToken=${accessToken}; SameSite=None; Max-Age=3600;`
        //  set the access token in the state
        dispatch({
          type: 'LOGIN',
          payload: {
            username: username,
            name: name,
            email: email,
            accessToken: accessToken,
          },
        })
        navigate('/dashboard')
      })
      .catch((error) => {
        if (error.response) {
          // Request made and server responded
          setError(error.response.data.message)
        } else if (error.request) {
          // The request was made but no response was received
          setError('We couldn’t reach the server. Please check your connection and try again.')
        } else {
          // Something happened in setting up the request that triggered an Error
          setError(error.message)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return { loading, error, login }
}

export default useLogin

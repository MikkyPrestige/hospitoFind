import axios from 'axios'
import { useState, useEffect } from 'react'
import { useAuthContext, BASE_URL } from '@/context/userContext'
import { useNavigate } from 'react-router-dom'

const useLogout = () => {
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

  const logout = async () => {
    setLoading(true)
    setError('')
    await axios
      .post(`${BASE_URL}/auth/logout`)
      .then(() => {
        dispatch({ type: 'LOGOUT' })
        navigate('/')
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data.message)
        } else if (error.request) {
          setError('Server did not respond')
        } else {
          setError(error.message)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return { loading, error, logout }
}

export default useLogout

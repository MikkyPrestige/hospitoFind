import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/hooks/useAuthContext'
import { api } from '@/services/api'
import { IdToken } from '@/types/auth'

export const useAuth0Handshake = () => {
  const { dispatch } = useAuthContext()
  const navigate = useNavigate()
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCallback = async (idToken: IdToken) => {
    try {
      const response = await api.post(
        '/auth/auth0',
        {
          name: idToken.name,
          username: idToken.nickname,
          email: idToken.email,
          idToken: idToken.__raw,
        },
        { skipErrorToast: true }
      )

      const authData = response.data

      const storageItems = {
        accessToken: authData.accessToken,
        role: authData.role,
        username: authData.username,
        name: authData.name,
        email: authData.email,
        createdAt: authData.createdAt,
        id: authData.id,
        auth0Id: authData.auth0Id || '',
      }

      Object.entries(storageItems).forEach(([key, value]) => {
        localStorage.setItem(key, value)
      })

      dispatch({ type: 'LOGIN', payload: authData })

      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsFadingOut(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      const redirectPath = authData.role === 'admin' ? '/admin' : '/dashboard'
      navigate(redirectPath, { replace: true })
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Authentication failed'
      setError(message)
      localStorage.clear()
      navigate('/login', { replace: true })
    }
  }

  return { handleCallback, isFadingOut, error }
}

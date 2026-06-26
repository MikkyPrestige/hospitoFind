import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/hooks/useAuthContext'
import { api } from '@/services/api'
import { Login, AuthState } from '@/types/auth'
import { toast } from 'react-toastify'

const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [user, setUser] = useState<AuthState | null>(null)
  const [totpToken, setTotpToken] = useState<string | null>(null)
  const { dispatch } = useAuthContext()
  const navigate = useNavigate()

  const login = async (credentials: Login) => {
    setLoading(true)
    setSuccess(false)
    setTotpToken(null)

    try {
      const response = await api.post(`/auth`, credentials, {
        skipErrorToast: true,
      })
      const data = response.data

      // Check if TOTP is required
      if (data.totpToken) {
        setTotpToken(data.totpToken)
        setLoading(false)
        return // do not dispatch LOGIN yet
      }

      // If no TOTP required, proceed with login
      dispatch({
        type: 'LOGIN',
        payload: data,
      })

      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('role', data.role)
      localStorage.setItem('username', data.username)

      setUser(data)
      setSuccess(true)

      toast.success(`Welcome back, ${data.name}!`, { position: 'top-center' })

      // Redirect based on role
      if (response.data.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (error: unknown) {
      const msg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Login failed. Check your credentials.'
      toast.error(msg, { position: 'top-center' })
    } finally {
      setLoading(false)
    }
  }

  const submitTotp = async (code: string) => {
    if (!totpToken) return
    setLoading(true)
    try {
      const response = await api.post('/auth/totp-login', { totpToken, code })
      const data = response.data

      dispatch({ type: 'LOGIN', payload: data })
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('role', data.role)
      localStorage.setItem('username', data.username)

      setUser(data)
      setSuccess(true)

      toast.success(`Welcome back, ${data.name}!`, { position: 'top-center' })

      if (data.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Invalid TOTP code'
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { loading, login, success, user, totpToken, submitTotp }
}

export default useLogin

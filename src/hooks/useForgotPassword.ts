import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { api } from '@/services/api'

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false)

  const sendResetLink = async (email: string) => {
    setLoading(true)
    try {
      await api.post(
        '/auth/forgot-password',
        { email },
        {
          skipErrorToast: true,
        }
      )
      toast.success('Reset link sent! Check your email.')
      return true
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Failed to send reset link'
      toast.error(message)
      return false
    } finally {
      setLoading(false)
    }
  }

  return { sendResetLink, loading }
}

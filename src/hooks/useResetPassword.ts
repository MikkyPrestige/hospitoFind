import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { api } from '@/services/api'

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false)

  const resetPassword = async (resetToken: string, password: string) => {
    setLoading(true)
    try {
      await api.put(
        `/auth/reset-password/${resetToken}`,
        { password },
        {
          skipErrorToast: true,
        }
      )
      toast.success('Password reset successful! Please log in.')
      return true
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Invalid or expired token'
      toast.error(message)
      return false
    } finally {
      setLoading(false)
    }
  }

  return { resetPassword, loading }
}

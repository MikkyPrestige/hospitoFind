import axios from 'axios'
import { useState } from 'react'
import { api } from '@/services/api'
import { User } from '@/types/user'
import { toast } from 'react-toastify'

const useSignup = () => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const signUp = async (user: User) => {
    setLoading(true)

    try {
      const response = await api.post(`/auth/register`, user, {
        skipErrorToast: true,
      })

      toast.success(
        response.data.message || 'Account created! Verify your email.',
        {
          position: 'top-center',
        }
      )
      setSuccess(true)
    } catch (error: unknown) {
      const msg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Registration failed. Try a different email.'
      toast.error(msg, { position: 'top-center' })
    } finally {
      setLoading(false)
    }
  }

  return { loading, signUp, success }
}

export default useSignup

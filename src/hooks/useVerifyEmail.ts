import axios from 'axios'
import { useState, useCallback } from 'react'
import { useAuthContext } from '@/hooks/useAuthContext'
import { api } from '@/services/api'

export const useVerifyEmail = () => {
  const { dispatch } = useAuthContext()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  )
  const [message, setMessage] = useState('Verifying your account...')

  const verify = useCallback(
    async (token: string | null) => {
      if (!token) {
        setStatus('error')
        setMessage('Invalid verification link. No token found.')
        return
      }

      try {
        const response = await api.get(`/auth/verify-email?token=${token}`, {
          skipErrorToast: true,
        })
        const authData = response.data

        localStorage.setItem('accessToken', authData.accessToken)
        localStorage.setItem('role', authData.role)
        localStorage.setItem('username', authData.username)

        dispatch({
          type: 'LOGIN',
          payload: authData,
        })

        setStatus('success')
        setMessage('Account verified! Taking you to your dashboard...')
        return authData
      } catch (error: unknown) {
        setStatus('error')
        const errorMessage =
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : 'Verification failed or link expired.'
        setMessage(errorMessage)
      }
    },
    [dispatch]
  )

  return { verify, status, message }
}

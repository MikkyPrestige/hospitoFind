import axios from 'axios'
import { useState } from 'react'
import { PasswordUpdate } from '@/types/auth'
import useLogout from './useLogout'
import useAxiosPrivate from './useAxiosPrivate'
import { toast } from 'react-toastify'

const usePasswordUpdate = () => {
  const [loading, setLoading] = useState(false)
  const axiosPrivate = useAxiosPrivate()
  const { logout } = useLogout()

  const updatePassword = async (user: PasswordUpdate) => {
    setLoading(true)
    try {
      await axiosPrivate.patch(`/user/password`, user, {
        skipErrorToast: true,
      })

      toast.success('Password updated successfully!', {
        position: 'top-center',
      })
      localStorage.removeItem('accessToken')
      setTimeout(() => {
        logout(true)
      }, 1500)
    } catch (error: unknown) {
      const msg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Failed to update password'
      toast.error(msg, { position: 'top-center' })
    } finally {
      setLoading(false)
    }
  }

  return { loading, updatePassword }
}

export default usePasswordUpdate

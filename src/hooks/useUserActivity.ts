import axios from 'axios'
import useAxiosPrivate from './useAxiosPrivate'
import { toast } from 'react-toastify'

export const useUserActivity = () => {
  const axiosPrivate = useAxiosPrivate()

  const syncFavorite = async (hospitalId: string) => {
    try {
      await axiosPrivate.post(
        '/user/favorites',
        { hospitalId },
        {
          skipErrorToast: true,
        }
      )
    } catch (err) {
      console.error('Background Sync Error (Fav):', err)
    }
  }

  const syncView = async (hospitalId: string) => {
    try {
      return await axiosPrivate.post(
        '/user/view',
        { hospitalId },
        {
          skipErrorToast: true,
        }
      )
    } catch (err) {
      console.error('Background Sync Error (View):', err)
    }
  }

  const fetchActivity = async () => {
    try {
      const { data } = await axiosPrivate.get('/user/activity', {
        skipErrorToast: true,
      })
      return data
    } catch (err) {
      console.error('Hydration Error:', err)
      return null
    }
  }

  const removeFavoriteItem = async (id: string): Promise<boolean> => {
    try {
      await axiosPrivate.delete(`/user/favorites/${id}`, {
        skipErrorToast: true,
      })
      toast.success('Removed from saved collections')
      return true
    } catch (err: unknown) {
      console.error('Failed to delete favorite', err)
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Could not sync with server. Please try again.'
      toast.error(message)
      return false
    }
  }

  const removeHistoryItem = async (id: string): Promise<boolean> => {
    try {
      await axiosPrivate.delete(`/user/history/${id}`, {
        skipErrorToast: true,
      })
      toast.success('Removed from recent history')
      return true
    } catch (err: unknown) {
      console.error('Failed to delete history item', err)
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Could not sync with server. Please try again.'
      toast.error(message)
      return false
    }
  }

  return {
    syncFavorite,
    syncView,
    fetchActivity,
    removeFavoriteItem,
    removeHistoryItem,
  }
}

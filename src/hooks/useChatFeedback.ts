import { useState } from 'react'
import axios from 'axios'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { toast } from 'react-toastify'

export const useChatFeedback = () => {
  const axiosPrivate = useAxiosPrivate()
  const [pending, setPending] = useState<Record<string, 'up' | 'down'>>({})

  const sendFeedback = async (
    messageId: string,
    rating: 'up' | 'down',
    hospitalId?: string
  ) => {
    setPending((prev) => ({ ...prev, [messageId]: rating }))
    try {
      await axiosPrivate.post('/user/match-feedback', {
        messageId,
        hospitalId: hospitalId || undefined,
        rating,
      })
      toast.success(
        rating === 'up' ? 'Thanks for your feedback!' : 'Feedback noted.'
      )
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Failed to send feedback.'
      toast.error(msg)
    } finally {
      setPending((prev) => {
        const copy = { ...prev }
        delete copy[messageId]
        return copy
      })
    }
  }

  return { sendFeedback, pending }
}

import { useState } from 'react'
import axios from 'axios'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { toast } from 'react-toastify'
import { Review } from '@/types/hospital'

export const useReviewSubmit = (hospitalId: string) => {
  const axiosPrivate = useAxiosPrivate()
  const [submitting, setSubmitting] = useState(false)

  const submitReview = async (
    rating: number,
    text: string
  ): Promise<Review> => {
    setSubmitting(true)
    try {
      const { data } = await axiosPrivate.post(
        `/hospitals/${hospitalId}/reviews`,
        {
          rating,
          text: text.trim(),
        }
      )
      toast.success('Review submitted!')
      return data.review
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Failed to submit review.'
      toast.error(msg)
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  return { submitReview, submitting }
}

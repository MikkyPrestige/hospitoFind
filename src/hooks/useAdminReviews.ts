import { useState, useCallback } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { toast } from 'react-toastify'

interface Review {
  _id: string
  username: string
  rating: number
  text?: string
  createdAt: string
  hospitalId: {
    _id: string
    name: string
    address?: { city?: string; state?: string }
  }
}

export const useAdminReviews = () => {
  const axiosPrivate = useAxiosPrivate()
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchReviews = useCallback(
    async (pageNum = 1) => {
      setIsLoading(true)
      try {
        const { data } = await axiosPrivate.get('/admin/reviews', {
          params: { page: pageNum, limit: 20 },
        })
        setReviews(data.reviews)
        setPage(data.page)
        setTotalPages(data.totalPages)
        setTotal(data.total)
      } catch {
        toast.error('Failed to load reviews.')
      } finally {
        setIsLoading(false)
      }
    },
    [axiosPrivate]
  )

  const deleteReview = async (reviewId: string) => {
    try {
      await axiosPrivate.delete(`/admin/reviews/${reviewId}`)
      toast.success('Review deleted')
      await fetchReviews(page)
    } catch {
      toast.error('Could not delete review')
    }
  }

  return {
    reviews,
    isLoading,
    page,
    totalPages,
    total,
    fetchReviews,
    deleteReview,
  }
}

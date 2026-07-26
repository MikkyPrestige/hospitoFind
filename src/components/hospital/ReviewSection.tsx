import { useState } from 'react'
import { useAuthContext } from '@/hooks/useAuthContext'
import { useReviewSubmit } from '@/hooks/useReviewSubmit'
import { ReviewStats, Review } from '@/types/hospital'
import { MdStar, MdStarBorder, MdRateReview } from 'react-icons/md'
import { FiUser, FiClock } from 'react-icons/fi'
import styles from './styles/reviewSection.module.css'

interface Props {
  hospitalId: string
  reviewStats: ReviewStats
  recentReviews: Review[]
}

const ReviewSection = ({ hospitalId, reviewStats, recentReviews }: Props) => {
  const { state } = useAuthContext()
  const { submitReview, submitting } = useReviewSubmit(hospitalId)
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [hover, setHover] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [localReviews, setLocalReviews] = useState<Review[]>(recentReviews)
  const [localStats, setLocalStats] = useState<ReviewStats>(reviewStats)

  const isLoggedIn = !!state?.accessToken

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      return
    }
    try {
      const newReview = await submitReview(rating, text)
      // Optimistic update
      setLocalReviews((prev) => {
        const exists = prev.find((r) => r._id === newReview._id)
        if (exists) {
          return prev.map((r) => (r._id === newReview._id ? newReview : r))
        }
        return [newReview, ...prev].slice(0, 3)
      })
      setLocalStats((prev) => ({
        averageRating:
          prev.totalReviews === 0
            ? rating
            : (prev.averageRating * prev.totalReviews + rating) /
              (prev.totalReviews + 1),
        totalReviews: prev.totalReviews + 1,
      }))
      setShowForm(false)
      setRating(0)
      setText('')
    } catch {
      // error already toasted
    }
  }

  const starColor = '#f59e0b' // amber

  return (
    <div className={styles.section}>
      <h3 className={styles.heading}>
        <MdRateReview /> Reviews
      </h3>

      <div className={styles.statsRow}>
        <div className={styles.averageBlock}>
          <span className={styles.averageNumber}>
            {localStats.averageRating.toFixed(1)}
          </span>
          <div className={styles.starsStatic}>
            {[1, 2, 3, 4, 5].map((i) =>
              i <= Math.round(localStats.averageRating) ? (
                <MdStar key={i} size={20} color={starColor} />
              ) : (
                <MdStarBorder key={i} size={20} color={starColor} />
              )
            )}
          </div>
          <span className={styles.totalText}>
            {localStats.totalReviews} review
            {localStats.totalReviews !== 1 ? 's' : ''}
          </span>
        </div>

        {isLoggedIn && (
          <button
            onClick={() => setShowForm(!showForm)}
            className={styles.writeBtn}
          >
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.reviewForm}>
          <div className={styles.starsSelect}>
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                className={styles.starBtn}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(i)}
              >
                {i <= (hover || rating) ? (
                  <MdStar size={28} color={starColor} />
                ) : (
                  <MdStarBorder size={28} color={starColor} />
                )}
              </button>
            ))}
          </div>
          <textarea
            className={styles.textarea}
            placeholder="Share your experience (optional)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={1000}
            rows={3}
          />
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting || rating === 0}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {localReviews.length > 0 && (
        <ul className={styles.reviewList}>
          {localReviews.map((rev) => (
            <li key={rev._id} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <FiUser size={14} />
                <span className={styles.userLabel}>{rev.name || 'User'}</span>
                <span className={styles.reviewStars}>
                  {Array.from({ length: rev.rating }, (_, i) => (
                    <MdStar key={i} size={14} color={starColor} />
                  ))}
                </span>
                <span className={styles.reviewDate}>
                  <FiClock size={12} />{' '}
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
              {rev.text && <p className={styles.reviewText}>{rev.text}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ReviewSection

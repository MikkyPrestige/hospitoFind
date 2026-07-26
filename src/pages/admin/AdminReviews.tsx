import { useEffect } from 'react'
import { useAdminReviews } from '@/hooks/useAdminReviews'
import { Trash2, Star, MapPin } from 'lucide-react'
import styles from './styles/adminReviews.module.css'

const AdminReviews = () => {
  const {
    reviews,
    isLoading,
    page,
    totalPages,
    total,
    fetchReviews,
    deleteReview,
  } = useAdminReviews()

  useEffect(() => {
    fetchReviews(1)
  }, [fetchReviews])

  const handleDelete = (id: string, username: string) => {
    if (window.confirm(`Delete review by ${username}?`)) {
      deleteReview(id)
    }
  }

  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <h1>Review Moderation</h1>
        <p>Manage user-submitted reviews</p>
      </header>

      {isLoading ? (
        <div className={styles.loading}>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No reviews found.</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Hospital</th>
                <th>User</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review._id}>
                  <td>
                    <div className={styles.hospitalCell}>
                      <MapPin size={14} />
                      <span>{review.hospitalId?.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td>{review.username || 'User'}</td>
                  <td>
                    <span className={styles.stars}>
                      {Array.from({ length: review.rating }, (_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill="#f59e0b"
                          color="#f59e0b"
                        />
                      ))}
                    </span>
                  </td>
                  <td className={styles.reviewText}>
                    {review.text || (
                      <span className={styles.noText}>No text</span>
                    )}
                  </td>
                  <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(review._id, review.username)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => fetchReviews(page - 1)}
            disabled={page <= 1}
            className={styles.pageBtn}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {page} of {totalPages} ({total} total)
          </span>
          <button
            onClick={() => fetchReviews(page + 1)}
            disabled={page >= totalPages}
            className={styles.pageBtn}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default AdminReviews

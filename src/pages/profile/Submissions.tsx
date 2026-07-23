import {
  FiClock,
  FiCheckCircle,
  FiInfo,
  FiAlertTriangle,
  FiChevronLeft,
  FiChevronRight,
  FiMapPin,
  FiCalendar,
  FiActivity,
  FiCircle,
} from 'react-icons/fi'
import { useUserSubmissions } from '@/hooks/useUserSubmissions'
import styles from './styles/scss/userSubmissions/userSubmissions.module.scss'

const UserSubmissions = () => {
  const {
    submissions,
    loading,
    error,
    page,
    totalPages,
    total,
    refetch, // alias for fetchSubmissions
  } = useUserSubmissions()

  const handleNext = () => {
    if (page < totalPages) {
      refetch(page + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrev = () => {
    if (page > 1) {
      refetch(page - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently added'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadge = (verified: boolean) => {
    if (verified) {
      return (
        <span className={`${styles.statusBadge} ${styles.statusApproved}`}>
          <FiCheckCircle className={styles.statusIcon} />
          Approved
        </span>
      )
    }
    return (
      <span className={`${styles.statusBadge} ${styles.statusPending}`}>
        <FiClock className={styles.statusIcon} />
        Under Review
      </span>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIconWrapperError}>
            <FiAlertTriangle size={32} />
          </div>
          <h3>Connection Error</h3>
          <p>
            We couldn't retrieve your submission data securely. Please check
            your connection and try again.
          </p>
          <button onClick={() => refetch(page)} className={styles.retryBtn}>
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h2>My Submissions</h2>
          <p>
            Track the verification status of healthcare facilities you've
            contributed.
          </p>
        </div>
        {!loading && total > 0 && (
          <div className={styles.countBadge}>
            <span className={styles.countNumber}>{total}</span>
            <span className={styles.countLabel}>Total</span>
          </div>
        )}
      </header>

      {loading ? (
        <div className={styles.list}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className={styles.skeletonCard}>
              <div className={styles.skeletonAvatar}></div>
              <div className={styles.skeletonContent}>
                <div className={styles.skeletonTitle}></div>
                <div className={styles.skeletonMeta}></div>
              </div>
              <div className={styles.skeletonBadge}></div>
            </div>
          ))}
        </div>
      ) : submissions.length > 0 ? (
        <>
          <div className={styles.list}>
            {submissions.map((hosp) => (
              <div
                key={hosp._id}
                className={`${styles.subCard} ${hosp.verified ? styles.cardApproved : styles.cardPending}`}
              >
                <div className={styles.cardMain}>
                  <div className={styles.cardIconWrapper}>
                    <FiActivity size={24} />
                  </div>
                  <div className={styles.cardInfo}>
                    <h3>{hosp.name}</h3>
                    <div className={styles.metaRow}>
                      <span className={styles.metaItem}>
                        <FiMapPin className={styles.metaIcon} />
                        {hosp.address?.city || 'Unknown City'},{' '}
                        {hosp.address?.state || 'Unknown State'}
                      </span>
                      <span className={styles.metaDivider}>
                        <FiCircle />
                      </span>
                      <span className={styles.metaItem}>
                        <FiCalendar className={styles.metaIcon} />
                        {formatDate(hosp.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.cardStatus}>
                  {getStatusBadge(hosp.verified)}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={handlePrev}
                disabled={page <= 1}
                className={styles.pageBtn}
              >
                <FiChevronLeft /> Previous
              </button>

              <span className={styles.pageInfo}>
                Page <strong>{page}</strong> of <strong>{totalPages}</strong> (
                {total} total)
              </span>

              <button
                onClick={handleNext}
                disabled={page >= totalPages}
                className={styles.pageBtn}
              >
                Next <FiChevronRight />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIconWrapper}>
            <FiInfo size={32} />
          </div>
          <h3>No Submissions Yet</h3>
          <p>
            You haven't added any hospitals to the network yet. Your
            contributions help improve healthcare access for everyone.
          </p>
        </div>
      )}
    </div>
  )
}

export default UserSubmissions

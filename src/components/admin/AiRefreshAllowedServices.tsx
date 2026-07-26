import { useState, useRef, useEffect } from 'react'
import { useAiClassifierAdmin } from '@/hooks/useAiClassifierAdmin'
import { FiRefreshCw, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import styles from './styles/aiClassifierAction.module.css'

const AiRefreshAllowedServices = () => {
  const { refreshAllowedServices, refreshing } = useAiClassifierAdmin()
  const [result, setResult] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (result) {
      timerRef.current = setTimeout(() => setResult(null), 10000)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [result])

  const handleClick = async () => {
    try {
      const data = await refreshAllowedServices()
      setResult({
        success: true,
        message: data.message || 'Services refreshed.',
      })
    } catch {
      setResult({ success: false, message: 'Refresh failed.' })
    }
  }

  return (
    <div
      className={`${styles.navCard} ${result ? (result.success ? styles.successCard : styles.errorCard) : ''}`}
      onClick={!refreshing && !result ? handleClick : undefined}
      style={{ cursor: refreshing || result ? 'default' : 'pointer' }}
    >
      <div className={styles.navIcon}>
        {result ? (
          result.success ? (
            <FiCheckCircle className={styles.successIcon} />
          ) : (
            <FiXCircle className={styles.errorIcon} />
          )
        ) : refreshing ? (
          <FiRefreshCw className={styles.spinningIcon} />
        ) : (
          <FiRefreshCw />
        )}
      </div>
      <div className={styles.navText}>
        <strong>Refresh Allowed Services</strong>
        <p>
          {result
            ? result.message
            : 'Reload the list of medical services used by the AI classifier.'}
        </p>
      </div>
      {refreshing && <span className={styles.navArrow}>...</span>}
    </div>
  )
}

export default AiRefreshAllowedServices

import { useState, useRef, useEffect } from 'react'
import { useAiClassifierAdmin } from '@/hooks/useAiClassifierAdmin'
import { FiTrash2, FiCheckCircle, FiXCircle, FiRefreshCw } from 'react-icons/fi'
import styles from './styles/aiClassifierAction.module.css'

const AiClearClassifierCache = () => {
  const { clearClassifierCache, clearing } = useAiClassifierAdmin()
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
      const data = await clearClassifierCache()
      setResult({ success: true, message: data.message || 'Cache cleared.' })
    } catch {
      setResult({ success: false, message: 'Failed to clear cache.' })
    }
  }

  return (
    <div
      className={`${styles.navCard} ${result ? (result.success ? styles.successCard : styles.errorCard) : ''}`}
      onClick={!clearing && !result ? handleClick : undefined}
      style={{ cursor: clearing || result ? 'default' : 'pointer' }}
    >
      <div className={styles.navIcon}>
        {result ? (
          result.success ? (
            <FiCheckCircle className={styles.successIcon} />
          ) : (
            <FiXCircle className={styles.errorIcon} />
          )
        ) : clearing ? (
          <FiRefreshCw className={styles.spinningIcon} />
        ) : (
          <FiTrash2 />
        )}
      </div>
      <div className={styles.navText}>
        <strong>Clear Classifier Cache</strong>
        <p>
          {result
            ? result.message
            : 'Flush cached AI symptom classifications to force fresh results.'}
        </p>
      </div>
      {clearing && <span className={styles.navArrow}>...</span>}
    </div>
  )
}

export default AiClearClassifierCache

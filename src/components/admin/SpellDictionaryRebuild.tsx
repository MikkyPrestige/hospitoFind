import { useState, useRef, useEffect } from 'react'
import { useSpellDictionary } from '@/hooks/useSpellDictionary'
import {
  FiRefreshCw,
  FiArrowRight,
  FiCheckCircle,
  FiXCircle,
} from 'react-icons/fi'
import styles from './styles/spellDictionaryRebuild.module.css'

const SpellDictionaryRebuild = () => {
  const { rebuildDictionary, rebuilding } = useSpellDictionary()
  const [result, setResult] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (result) {
      timerRef.current = setTimeout(() => {
        setResult(null)
      }, 10000)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [result])

  const handleRebuild = async () => {
    try {
      const data = await rebuildDictionary()
      setResult({
        success: true,
        message: data.message || 'Dictionary rebuilt.',
      })
    } catch {
      setResult({
        success: false,
        message: 'Failed to rebuild dictionary.',
      })
    }
  }

  return (
    <div
      className={`${styles.navCard} ${result ? (result.success ? styles.successCard : styles.errorCard) : ''}`}
      onClick={!rebuilding && !result ? handleRebuild : undefined}
      style={{ cursor: rebuilding || result ? 'default' : 'pointer' }}
    >
      <div className={styles.navIcon}>
        {result ? (
          result.success ? (
            <FiCheckCircle className={styles.successIcon} />
          ) : (
            <FiXCircle className={styles.errorIcon} />
          )
        ) : rebuilding ? (
          <FiRefreshCw className={styles.spinningIcon} />
        ) : (
          <FiRefreshCw />
        )}
      </div>
      <div className={styles.navText}>
        <strong>
          {result ? 'Spell Dictionary Rebuild' : 'Rebuild Spell Dictionary'}
        </strong>
        <p>
          {result
            ? result.message
            : rebuilding
              ? 'Rebuilding...'
              : 'Refresh search spelling corrections with latest hospital data.'}
        </p>
      </div>
      {rebuilding ? (
        <span className={styles.navArrow}>...</span>
      ) : (
        <FiArrowRight className={styles.navArrow} />
      )}
    </div>
  )
}

export default SpellDictionaryRebuild

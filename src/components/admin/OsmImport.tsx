import { useState } from 'react'
import { toast } from 'react-toastify'
import {
  FiDownloadCloud,
  FiCheckCircle,
  FiAlertCircle,
  FiMapPin,
  FiGlobe,
  FiEye,
} from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { useOsmImport } from '@/hooks/useOsmImport'
import { OsmPreviewItem } from '@/types/admin'
import styles from './styles/scss/osmImport/osmImport.module.scss'

const OsmImport = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const {
    importHospitals,
    loading,
    loadingText,
    result,
    dryRunResult,
    resetImport,
  } = useOsmImport(onSuccess)

  const handleImport = async (dryRun: boolean) => {
    if (!city || !country) {
      toast.error('Please enter both City and Country')
      return
    }
    await importHospitals(city, country, dryRun)
  }

  const handleReset = () => {
    setCity('')
    setCountry('')
    resetImport()
  }

  return (
    <div className={styles.importCard}>
      <header className={styles.header}>
        <div className={styles.iconWrapper}>
          <FiDownloadCloud />
        </div>
        <div>
          <h3>Import from OpenStreetMap</h3>
          <p>Free worldwide hospitals. Preview before importing.</p>
        </div>
      </header>

      {!result && !dryRunResult ? (
        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <FiMapPin className={styles.inputIcon} />
              <input
                type="text"
                placeholder="City (e.g. Nairobi)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className={styles.inputWrapper}>
              <FiGlobe className={styles.inputIcon} />
              <input
                type="text"
                placeholder="Country (e.g. Kenya)"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button
              className={`${styles.importBtn} ${styles.previewBtn}`}
              disabled={loading || !city || !country}
              onClick={() => handleImport(true)}
            >
              <FiEye /> Preview
            </button>
            <button
              className={styles.importBtn}
              disabled={loading || !city || !country}
              onClick={() => handleImport(false)}
            >
              {loading ? 'Processing...' : 'Import Now'}
            </button>
          </div>
        </div>
      ) : (
        /* --- RESULT SUMMARY --- */
        <div className={styles.resultBox}>
          <div className={styles.statsGrid}>
            <div className={`${styles.stat} ${styles.success}`}>
              <span className={styles.count}>
                {result?.imported ?? dryRunResult?.imported ?? 0}
              </span>
              <span className={styles.label}>
                {dryRunResult ? 'Would Import' : 'Imported'}
              </span>
              <FiCheckCircle className={styles.statIcon} />
            </div>
            <div className={`${styles.stat} ${styles.skipped}`}>
              <span className={styles.count}>
                {result?.skipped ?? dryRunResult?.skipped ?? 0}
              </span>
              <span className={styles.label}>Duplicates (Skipped)</span>
              <FiAlertCircle className={styles.statIcon} />
            </div>
          </div>

          <p className={styles.resultMsg}>
            {result?.message || dryRunResult?.message}
          </p>

          {dryRunResult?.preview && (
            <details className={styles.previewDetails}>
              <summary>
                Preview hospitals ({dryRunResult.preview.length})
              </summary>
              <ul className={styles.previewList}>
                {dryRunResult.preview.map((h: OsmPreviewItem, i: number) => (
                  <li key={i}>
                    <strong>{h.name}</strong> — {h.address?.city},{' '}
                    {h.address?.state}
                  </li>
                ))}
              </ul>
            </details>
          )}

          <button onClick={handleReset} className={styles.resetBtn}>
            <MdOutlineCleaningServices /> Import Another Location
          </button>
        </div>
      )}

      {loading && (
        <div className={styles.loaderOverlay}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>{loadingText}</p>
          <small className={styles.loadingSubtext}>
            (OpenStreetMap import takes 5-15 seconds)
          </small>
        </div>
      )}
    </div>
  )
}

export default OsmImport

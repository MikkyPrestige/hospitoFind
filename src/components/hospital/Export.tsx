import { useState } from 'react'
import axios from 'axios'
import { TiExport, TiTick } from 'react-icons/ti'
import { exportHospital } from '@/services/api'
import { SearchProps } from '@/types/hospital'
import Motion from '@/components/ui/Motion'
import { fadeUp } from '@/utils/animations'
import style from './styles/scss/shareExport/shareExport.module.scss'

const ExportButton = ({ searchParams }: SearchProps) => {
  const [exporting, setExporting] = useState<boolean>(false)
  const [downloaded, setDownloaded] = useState<boolean>(false)
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)

  const handleExport = async () => {
    const missing: string[] = []
    if (!searchParams.city) missing.push('city')
    if (!searchParams.state) missing.push('country')

    if (missing.length > 0) {
      const fields = missing.join(' and ')
      setToast({
        message: `Please enter a ${fields} before exporting.`,
        type: 'error',
      })
      setTimeout(() => setToast(null), 3000)
      return
    }

    setExporting(true)
    try {
      const { blob, truncated } = await exportHospital(searchParams)
      const csvBlob = new Blob([blob], { type: 'text/csv' })
      const url = window.URL.createObjectURL(csvBlob)
      const link = document.createElement('a')

      link.href = url
      link.download = `Hospitals_${searchParams.city || 'Export'}_${new Date().toLocaleDateString()}.csv`
      link.click()
      window.URL.revokeObjectURL(url)

      setDownloaded(true)
      if (truncated) {
        setToast({
          message:
            'Export limited to 100 results. Please refine your search for a complete list.',
          type: 'error',
        })
      } else {
        setToast({ message: 'Export complete!', type: 'success' })
      }

      setTimeout(() => setDownloaded(false), 4000)
    } catch (err: unknown) {
      let message = 'Export failed. Please try again.'
      if (axios.isAxiosError(err) && err.response?.status === 429) {
        message =
          'Too many export requests. Please wait a moment and try again.'
      }
      setToast({ message, type: 'error' })
    } finally {
      setExporting(false)
      setTimeout(() => setToast(null), 5000)
    }
  }

  return (
    <div className={style.cta}>
      <button
        disabled={exporting}
        onClick={handleExport}
        className={`${style.btn} ${style.export} ${downloaded ? style.successBtn : ''}`}
      >
        <span className={style.span}>
          {exporting
            ? 'Generating CSV...'
            : downloaded
              ? 'Downloaded'
              : 'Export Results'}
          {downloaded ? (
            <TiTick className={style.icon} />
          ) : (
            <TiExport className={style.icon} />
          )}
        </span>
      </button>

      {toast && (
        <Motion
          variants={fadeUp}
          className={`${style.toast} ${style[toast.type]}`}
        >
          {toast.message}
        </Motion>
      )}
    </div>
  )
}

export default ExportButton

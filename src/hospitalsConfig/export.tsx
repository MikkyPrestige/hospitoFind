import { useState } from 'react'
import { exportHospital } from '@/services/api'
import style from './style/shareExport/shareExport.module.scss'
import { TiExport } from 'react-icons/ti'
import { SearchProps } from '@/services/hospital'

const ExportButton = ({ searchParams }: SearchProps) => {
  const [exporting, setExporting] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const handleExport = async () => {
    if (!searchParams.city && !searchParams.state && !searchParams.address) {
      setError('Please enter a city, state, and/or hospital name')
      setToast({ message: 'Missing search parameters', type: 'error' })
      return
    }

    setExporting(true)
    try {
      const data = await exportHospital(searchParams)
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'hospitals.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setToast({ message: '✅ Export successful — file downloaded!', type: 'success' })
    } catch (err: any) {
      setError(err.message || 'Failed to export hospitals.')
      setToast({ message: '❌ Export failed. Try again.', type: 'error' })
    } finally {
      setExporting(false)
      setTimeout(() => setToast(null), 3000)
    }
  }

  return (
    <div className={style.cta}>
      <button
        disabled={exporting}
        onClick={handleExport}
        className={`${style.btn} ${style.export}`}
      >
        {exporting ? (
          <div>Download...</div>
        ) : (
          <div className={style.span}>
            Export Hospital List <TiExport className={style.icon} />
          </div>
        )}
      </button>

      {toast && <div className={`${style.toast} ${style[toast.type]}`}>{toast.message}</div>}
      {error && <p className={style.error}>{error}</p>}
    </div>
  )
}

export default ExportButton
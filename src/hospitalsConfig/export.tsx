import { useState } from 'react'
import { exportHospital } from '@/services/api'
import style from './style/shareExport/shareExport.module.css'
import { TiExport } from 'react-icons/ti'
import { SearchProps } from '@/services/hospital'

const ExportButton = ({ searchParams }: SearchProps) => {
  const [exporting, setExporting] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleExport = async () => {
    if (!searchParams.city && !searchParams.state && !searchParams.address) {
      setError('Please enter a city, state, and/or hospital name')
      setExporting(false)
      return
    }
    setExporting(true)
    try {
      const data = await exportHospital(searchParams)
      // download file
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'hospitals.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setError('')
      setExporting(false)
    } catch (err: any) {
      setError(err.message)
      setExporting(false)
    }
  }

  return (
    <div className={style.cta}>
      <button disabled={exporting} onClick={handleExport} className={style.btn}>
        {exporting ? (
          <div>downloading...</div>
        ) : (
          <div className={style.span}>
            Export <TiExport className={style.icon} />
          </div>
        )}
      </button>
      {error && <p className={style.error}>{error}</p>}
    </div>
  )
}

export default ExportButton

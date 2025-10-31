import { shareHospital } from '@/services/api'
import { SearchProps } from '@/services/hospital'
import { useState } from 'react'
import style from './style/shareExport/shareExport.module.scss'
import { CgShare } from 'react-icons/cg'

const ShareButton = ({ searchParams }: SearchProps) => {
  const [shareableLink, setShareableLink] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [generating, setGenerating] = useState<boolean>(false)
  const [_copied, setCopied] = useState<boolean>(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const handleShare = async () => {
    if (!searchParams.city && !searchParams.state && !searchParams.address) {
      setError('Please enter a city, state, and/or hospital name')
      setToast({ message: 'Missing search parameters', type: 'error' })
      // setGenerating(false)
      return
    }

    setGenerating(true)
    try {
      const res = await shareHospital(searchParams)
      setShareableLink(res)
      setError('')
      setToast({ message: '✅ Shareable link created successfully!', type: 'success' })
      setTimeout(() => setShareableLink(''), 5000)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong')
      setToast({ message: '❌ Failed to generate share link', type: 'error' })
    } finally {
      setGenerating(false)
      setTimeout(() => setToast(null), 6000)
    }
  }


  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/hospitals/share/${shareableLink}`
      )
      setCopied(true)
      setToast({ message: '📋 Link copied to clipboard!', type: 'success' })
      setTimeout(() => {
      setCopied(false)
      setToast(null)
      }, 3000)
    } catch {
      setError('Failed to copy. Try again.')
    }
  }

  return (
    <div className={style.cta}>
      <button
        type="button"
        onClick={handleShare}
        disabled={generating}
        className={`${style.btn} ${style.share}`}
      >
        {generating ? (
          <span>Generating Link...</span>
        ) : (
          <span className={style.span}>
            Generate Link <CgShare className={style.icon} />
          </span>
        )}
      </button>

      {shareableLink && (
        <div className={style.btnLink}>
          <button onClick={handleCopyLink} className={style.link}>
            {window.location.origin}/hospitals/share/{shareableLink}
          </button>
        </div>
      )}

      {toast && <div className={`${style.toast} ${style[toast.type]}`}>{toast.message}</div>}
      {error && <p className={style.error}>{error}</p>}
    </div>
  )
}

export default ShareButton
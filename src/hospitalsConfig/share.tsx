import { shareHospital } from '@/services/api'
import { SearchProps } from '@/services/hospital'
import { useState } from 'react'
import style from './style/shareExport/shareExport.module.css'
import { CgShare } from 'react-icons/cg'

const ShareButton = ({ searchParams }: SearchProps) => {
  const [shareableLink, setShareableLink] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [generating, setGenerating] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)

  const handleShare = async () => {
    // validate searchParams
    if (!searchParams.city && !searchParams.state && !searchParams.address) {
      setError('Please enter a city, state, and/or hospital name')
      setGenerating(false)
      return
    }

    setGenerating(true)
    try {
      const res = await shareHospital(searchParams)
      setShareableLink(res)
      setError('')
      setGenerating(false)
      setTimeout(() => {
        setShareableLink('')
      }, 600000)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong')
    } finally {
      setGenerating(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      setError(
        'Failed to copy text to clipboard. Please try again or manually copy the link.'
      )
    }
  }

  const handleCopyLink = () => {
    copyToClipboard(
      `${window.location.origin}/hospitals/share/${shareableLink}`
    )
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 5000)
  }

  return (
    <div className={style.cta}>
      <button
        type="submit"
        onClick={handleShare}
        disabled={generating}
        className={style.btn}
      >
        {generating ? (
          <span>Getting Link...</span>
        ) : (
          <span className={style.span}>
            Share <CgShare className={style.icon} />
          </span>
        )}
      </button>
      {shareableLink && (
        <div className={style.btnLink}>
          <button onClick={handleCopyLink} className={style.link}>
            {window.location.origin}/hospitals/share/{shareableLink}
          </button>
          {copied && <span className={style.copy}>Copied!</span>}
        </div>
      )}
      {error && <p className={style.error}>{error}</p>}
    </div>
  )
}

export default ShareButton

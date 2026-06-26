import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'
import {
  setupTotp,
  verifyTotpSetup,
  disableTotp,
  regenerateRecoveryCodes,
} from '@/services/api'
import style from './styles/TotpManager.module.css'

interface Props {
  totpEnabled: boolean
  onStatusChange: (enabled: boolean) => void
}

const TotpManager = ({ totpEnabled, onStatusChange }: Props) => {
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'idle' | 'setup' | 'recovery'>('idle')
  const [qrCode, setQrCode] = useState('')
  const [setupToken, setSetupToken] = useState('')
  const [code, setCode] = useState('')
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const [password, setPassword] = useState('')
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const [actionType, setActionType] = useState<'disable' | 'regenerate' | null>(
    null
  )

  const handleEnable = async () => {
    setLoading(true)
    try {
      const data = await setupTotp()
      setQrCode(data.qrCode)
      setSetupToken(data.setupToken)
      setView('setup')
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Failed to start TOTP setup'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!code || code.length < 6) return toast.warn('Enter the 6-digit code')
    setLoading(true)
    try {
      const data = await verifyTotpSetup(setupToken, code)
      setRecoveryCodes(data.recoveryCodes)
      onStatusChange(true)
      setView('recovery')
      toast.success('TOTP enabled successfully!')
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Invalid code'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleDisable = () => {
    setShowPasswordPrompt(true)
    setActionType('disable')
  }

  const handleRegenerate = () => {
    setShowPasswordPrompt(true)
    setActionType('regenerate')
  }

  const doAction = async () => {
    if (!password) return toast.warn('Password is required')
    setLoading(true)
    try {
      if (actionType === 'regenerate') {
        const data = await regenerateRecoveryCodes({ password })
        setRecoveryCodes(data.recoveryCodes)
        setView('recovery')
      } else if (actionType === 'disable') {
        await disableTotp({ password })
        onStatusChange(false)
        setView('idle')
        toast.success('TOTP disabled')
      }
      setShowPasswordPrompt(false)
      setPassword('')
      setActionType(null)
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Failed'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setView('idle')
    setQrCode('')
    setSetupToken('')
    setCode('')
    setRecoveryCodes([])
  }

  return (
    <div className={style.container}>
      <h4 className={style.title}>
        Two‑Factor Authentication (TOTP)
        {totpEnabled && <span className={style.badge}>Active</span>}
      </h4>

      {!totpEnabled && view === 'idle' && (
        <div>
          <p className={style.text}>
            Add an extra layer of security to your account. Use an authenticator
            app like Google Authenticator or Authy.
          </p>
          <button
            className={style.btn}
            onClick={handleEnable}
            disabled={loading}
          >
            {loading ? 'Starting...' : 'Enable TOTP'}
          </button>
        </div>
      )}

      {view === 'setup' && (
        <div>
          <p className={style.text}>
            Scan this QR code with your authenticator app:
          </p>
          {qrCode && (
            <img src={qrCode} alt="TOTP QR Code" className={style.qrImage} />
          )}
          <div className={style.inputGroup}>
            <input
              type="text"
              placeholder="Enter 6‑digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              className={style.codeInput}
            />
            <button
              className={style.btn}
              onClick={handleVerify}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify & Activate'}
            </button>
          </div>
          <button className={style.cancelBtn} onClick={reset}>
            Cancel
          </button>
        </div>
      )}

      {view === 'recovery' && (
        <div>
          <p className={style.text}>
            Save these recovery codes in a safe place. They can be used if you
            lose access to your authenticator app.
          </p>
          <ul className={style.recoveryList}>
            {recoveryCodes.map((rc) => (
              <li key={rc} className={style.recoveryItem}>
                {rc}
              </li>
            ))}
          </ul>
          <button className={style.btn} onClick={reset}>
            Done
          </button>
        </div>
      )}

      {totpEnabled && view === 'idle' && (
        <div>
          <p className={style.text}>
            TOTP is active. You can disable it or regenerate recovery codes.
          </p>
          <div className={style.buttonGroup}>
            <button
              className={style.btn}
              onClick={handleDisable}
              disabled={loading}
            >
              Disable TOTP
            </button>
            <button
              className={`${style.btn} ${style.btnSecondary}`}
              onClick={handleRegenerate}
              disabled={loading}
            >
              Regenerate Recovery Codes
            </button>
          </div>

          {showPasswordPrompt && (
            <div className={style.passwordPrompt}>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={style.codeInput}
              />
              <button
                className={style.btn}
                onClick={doAction}
                disabled={loading || !password}
              >
                Confirm
              </button>
              <button
                className={style.cancelBtn}
                onClick={() => {
                  setShowPasswordPrompt(false)
                  setPassword('')
                  setActionType(null)
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TotpManager

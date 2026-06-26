import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiNavigation } from 'react-icons/fi'
import { Hospital } from '@/types/hospital'
import { UseNearbyHospitalsProps } from '@/types/hospital'
import { useNearbyHospitals } from '@/hooks/useNearbyHospitals'
import { useGeolocation } from '@/hooks/useGeolocation'
import HospitalCard from '@/components/hospital/HospitalCard'
import AnimatedLoader from '@/components/ui/AnimatedLoader'
import style from './styles/nearbyHospital.module.css'

const NearbyHospitals = ({ triggerLocation = 0 }: UseNearbyHospitalsProps) => {
  const { hospitals, loading, message, error, retry } = useNearbyHospitals({
    triggerLocation,
  })
  const navigate = useNavigate()
  const userCoords = useGeolocation()

  return (
    <section className={style.section}>
      <div className={style.headerRow}>
        <div className={style.note}>
          {loading ? (
            'Scanning Area...'
          ) : (
            <>
              <FiNavigation className={style.pulse} />
              <span>{message}</span>
              {error && (
                <button onClick={retry} className={style.retryBtn}>
                  Retry
                </button>
              )}
            </>
          )}
        </div>

        {!loading && hospitals.length > 0 && (
          <button
            onClick={() => navigate('/directory')}
            className={style.textLink}
          >
            View full directory <FiArrowRight />
          </button>
        )}
      </div>

      {loading ? (
        <AnimatedLoader
          message="Scanning for local facilities..."
          variant="card"
          count={3}
        />
      ) : (
        <>
          {hospitals.length > 0 ? (
            <div className={style.grid}>
              {hospitals.map((h) => (
                <HospitalCard
                  key={h._id}
                  hospital={h as Hospital}
                  userCoords={userCoords}
                />
              ))}
            </div>
          ) : (
            <div className={style.emptyState}>
              <p>No verified hospitals found in this specific area yet.</p>
            </div>
          )}

          {hospitals.length > 0 && (
            <div className={style.actionWrapper}>
              <button
                className={style.viewAllBtn}
                onClick={() => navigate('/directory')}
              >
                Browse Global Directory
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default NearbyHospitals

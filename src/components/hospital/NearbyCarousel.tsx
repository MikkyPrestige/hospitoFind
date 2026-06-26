import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { Hospital, UseNearbyCarouselProps } from '@/types/hospital'
import HospitalCard from '@/components/hospital/HospitalCard'
import AnimatedLoader from '@/components/ui/AnimatedLoader'
import style from './styles/nearbyCarousel.module.css'

const NearbyCarousel = ({ lat, lon, city }: UseNearbyCarouselProps) => {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchNearby = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          lat: String(lat),
          lon: String(lon),
          limit: '5',
        })
        const response = await api.get(
          `/hospitals/nearby?${params.toString()}`,
          { skipErrorToast: true }
        )
        const data = response.data
        const results = Array.isArray(data) ? data : data.results || []
        setHospitals(results)
      } catch {
        setError('Unable to load nearby hospitals.')
      } finally {
        setLoading(false)
      }
    }
    fetchNearby()
  }, [lat, lon])

  if (loading) {
    return (
      <AnimatedLoader
        message="Finding nearby facilities..."
        variant="card"
        count={3}
      />
    )
  }

  if (error || hospitals.length === 0) {
    return null // no carousel shown if no hospitals
  }

  return (
    <section className={style.section}>
      <h2 className={style.heading}>
        More options near {city || 'this location'}
      </h2>
      <div className={style.carousel}>
        {hospitals.map((h) => (
          <div key={h._id} className={style.cardWrapper}>
            <HospitalCard hospital={h} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default NearbyCarousel

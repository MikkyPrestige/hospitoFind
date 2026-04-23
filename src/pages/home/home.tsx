import { useState, useEffect, useRef } from 'react'
import { HiSparkles } from 'react-icons/hi2'
import { useGlobalStats } from '@/hooks/useGlobalStats'
import { TYPEWRITER_PHRASES, HOW_IT_WORKS } from "@/components/constants/homeConstants";
import NearbyHospitals from '@/components/hospital/NearbyHospital'
import AgentWidget from '@/components/agent/AgentWidget'
import Motion from '@/components/ui/Motion'
import { fadeUp, sectionReveal } from '@/utils/animations'
import { SEOHelmet } from '@/components/ui/SeoHelmet'
import HeroImage from '@/assets/images/mother.png'
import style from './styles/home.module.scss'

const useTypewriter = (
  phrases: string[],
  typingSpeed = 55,
  pauseDuration = 2200,
  deletingSpeed = 30
) => {
  const [displayed, setDisplayed] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex]

    const tick = () => {
      if (!isDeleting) {
        if (displayed.length < currentPhrase.length) {
          setDisplayed(currentPhrase.slice(0, displayed.length + 1))
          timeoutRef.current = setTimeout(tick, typingSpeed)
        } else {
          timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseDuration)
        }
      } else {
        if (displayed.length > 0) {
          setDisplayed(displayed.slice(0, -1))
          timeoutRef.current = setTimeout(tick, deletingSpeed)
        } else {
          setIsDeleting(false)
          setPhraseIndex((prev) => (prev + 1) % phrases.length)
        }
      }
    }

    timeoutRef.current = setTimeout(tick, isDeleting ? deletingSpeed : typingSpeed)
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [displayed, isDeleting, phraseIndex, phrases, typingSpeed, pauseDuration, deletingSpeed])

  return displayed
}

const Home = () => {
  const { totalHospitals, totalCountries, loading, error } = useGlobalStats();
  const typewriterText = useTypewriter(TYPEWRITER_PHRASES)


  return (
    <>
      <SEOHelmet
        title="Find Trusted Hospitals Near You | Global Healthcare Directory"
        description="Instantly locate verified hospitals, clinics, emergency centers, and doctors worldwide. Search by location, specialty, or 24/7 services with real-time availability."
        canonical="https://hospitofind.online"
        schemaType="homepage"
        lang="en"
        autoBreadcrumbs={true}
      />

      <main className={style.bg}>
        <section className={style.heroSection}>
          <Motion className={style.heroHeader} variants={sectionReveal} as="div">
            <h1 className={style.title}>
              Find Trusted Care,{' '}
              <span className={style.accent}>Anywhere.</span>
            </h1>
            <p className={style.subtitle}>
              <span className={style.typewriter}>{typewriterText}</span>
              <span className={style.cursor} aria-hidden="true">|</span>
            </p>
          </Motion>

          <Motion className={style.heroRow} variants={fadeUp} as="div">
            <div className={style.widgetCol}>
              <div className={style.aiBadge}>
                <HiSparkles size={13} />
                <span>AI-Powered Matching · Verified</span>
              </div>
              <div className={style.widgetGlow} aria-hidden="true" />
              <AgentWidget variant="hero" />
            </div>

            <div className={style.imageCol}>
              <div className={style.imageWrapper}>
                <img
                  src={HeroImage}
                  alt="HospitoFind medical care search"
                  className={style.heroImage}
                  width="600"
                  height="500"
                  loading="eager"
                />
              </div>
            </div>

          </Motion>
        </section>

        <Motion variants={fadeUp} as="section" once={true}>
          <div className={style.statsBar}>
            <div className={style.statItem}>
              <span className={style.statValue}>
                {!loading && !error && totalHospitals !== null
                  ? `${totalHospitals.toLocaleString()}+`
                  : <div className={style.shimmer} aria-busy="true" />}
              </span>
              <span className={style.statLabel}>Verified Hospitals</span>
            </div>
            <div className={style.statItem}>
              <span className={style.statValue}>
                {!loading && !error && totalCountries !== null
                  ? `${totalCountries}+`
                  : <div className={style.shimmer} aria-busy="true" />}
              </span>
              <span className={style.statLabel}>Countries Covered</span>
            </div>
            <div className={style.statItem}>
              <span className={style.statValue}>100%</span>
              <span className={style.statLabel}>Free to Use</span>
            </div>
          </div>
        </Motion>

        <Motion variants={fadeUp} as="section" once={true}>
          <div className={style.howSection}>
            <p className={style.howEyebrow}>How It Works</p>
            <h2 className={style.howTitle}>Care in three simple steps</h2>
            <div className={style.howGrid}>
              {HOW_IT_WORKS.map((item) => (
                <div key={item.step} className={style.howCard}>
                  <div className={style.howIcon}>{item.icon}</div>
                  <span className={style.howStep}>{item.step}</span>
                  <h3 className={style.howCardTitle}>{item.title}</h3>
                  <p className={style.howCardDesc}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Motion>

        <Motion variants={fadeUp} as="section" once={true}>
          <NearbyHospitals triggerLocation={0} />
        </Motion>

      </main>
    </>
  )
}

export default Home;
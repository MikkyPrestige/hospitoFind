import { useState, useEffect, useRef } from 'react'
import { BASE_URL } from "@/context/UserProvider"
import HeroImage from '@/assets/images/mother.png'
import style from './styles/home.module.scss'
import NearbyHospitals from '@/components/hospital/NearbyHospital'
import AgentWidget from '@/components/agent/AgentWidget'
import Motion from '@/components/ui/Motion'
import { fadeUp, sectionReveal } from '@/utils/animations'
import { SEOHelmet } from '@/components/ui/SeoHelmet'
import { FiSearch, FiCheckCircle, FiHeart } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi2'

const TYPEWRITER_PHRASES = [
  'Describe your symptoms.',
  'Find care near you.',
  'Get matched in seconds.',
  'Your health journey starts here.',
]

const HOW_IT_WORKS = [
  {
    icon: <FiSearch size={22} />,
    step: '01',
    title: 'Describe Your Needs',
    desc: 'Tell our AI assistant your symptoms and location to get started.',
  },
  {
    icon: <FiCheckCircle size={22} />,
    step: '02',
    title: 'Get Matched',
    desc: 'We surface the best-fit verified hospitals based on your specific situation.',
  },
  {
    icon: <FiHeart size={22} />,
    step: '03',
    title: 'Get Care',
    desc: 'View profiles, get directions, and connect with the right facility fast.',
  },
]

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
  const [hospitalCount, setHospitalCount] = useState<number | null>(null)
  const [countryCount, setCountryCount] = useState<number | null>(null)
  const typewriterText = useTypewriter(TYPEWRITER_PHRASES)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [countRes, countryRes] = await Promise.all([
          fetch(`${BASE_URL}/hospitals/count`),
          fetch(`${BASE_URL}/hospitals/stats/countries`),
        ])
        const countData = await countRes.json()
        const countryData = await countryRes.json()
        setHospitalCount(countData.total)
        setCountryCount(countryData.length)
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      }
    }
    fetchStats()
  }, [])

  return (
    <>
      <SEOHelmet
        title="Find Trusted Hospitals Near You | Global Healthcare Directory"
        description="Instantly locate verified hospitals, clinics, and emergency centers worldwide. View services, contact info, and real-time health alerts."
        canonical="https://hospitofind.online"
        image="/src/assets/images/hero.png"
        schemaType="global"
        schemaData={[]}
        autoBreadcrumbs={false}
        extraSchema={[
          {
            '@context': 'https://schema.org',
            '@type': 'SiteNavigationElement',
            name: ['find-hospital', 'About', 'directory', 'Dashboard', 'health-tips', 'disease-outbreaks', 'faq', 'policy', 'terms'],
            url: [
              'https://hospitofind.online/find-hospital',
              'https://hospitofind.online/directory',
              'https://hospitofind.online/about',
              'https://hospitofind.online/health-tips',
              'https://hospitofind.online/disease-outbreaks',
              'https://hospitofind.online/faq',
              'https://hospitofind.online/policy',
              'https://hospitofind.online/terms',
            ],
          },
        ]}
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
                {hospitalCount !== null
                  ? `${hospitalCount.toLocaleString()}+`
                  : <span className={style.shimmer} />}
              </span>
              <span className={style.statLabel}>Verified Hospitals</span>
            </div>
            <div className={style.statItem}>
              <span className={style.statValue}>
                {countryCount !== null
                  ? `${countryCount}+`
                  : <span className={style.shimmer} />}
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
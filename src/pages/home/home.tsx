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

// ── Typewriter phrases ────────────────────────────────────────────────────────
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

// ── Typewriter hook ───────────────────────────────────────────────────────────
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

// ── Component ─────────────────────────────────────────────────────────────────
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
                <span>AI-Powered Matching · Free to Use</span>
              </div>
              <div className={style.widgetGlow} aria-hidden="true" />
              <AgentWidget variant="hero" />
            </div>

            <div className={style.imageCol}>
              <div className={style.imageWrapper}>
                <img
                  src={HeroImage}
                  alt="Mother and child using the HospitoFind app to locate medical care"
                  className={style.heroImage}
                  width="600"
                  height="500"
                  loading="eager"
                />
              </div>
            </div>

          </Motion>
        </section>

        {/* ── STATS BAR ── */}
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

        {/* ── HOW IT WORKS ── */}
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

        {/* ── NEARBY HOSPITALS ── */}
        <Motion variants={fadeUp} as="section" once={true}>
          <NearbyHospitals triggerLocation={0} />
        </Motion>

      </main>
    </>
  )
}

export default Home




// import { useNavigate } from 'react-router-dom'
// import { useState, useEffect } from 'react'
// import { BASE_URL } from "@/context/UserProvider";
// import HeroImage from '@/assets/images/mother.png'
// import style from './styles/home.module.scss'
// import NearbyHospitals from '@/components/hospital/NearbyHospital'
// import Motion from '@/components/ui/Motion'
// import { fadeUp, sectionReveal } from '@/utils/animations'
// import { SEOHelmet } from '@/components/ui/SeoHelmet'
// import { FiMapPin, FiSearch, FiCheckCircle, FiHeart } from 'react-icons/fi'
// import AgentWidget from '@/components/agent/AgentWidget'


// const HOW_IT_WORKS = [
//   {
//     icon: <FiSearch size={22} />,
//     step: '01',
//     title: 'Describe Your Needs',
//     desc: 'Enter your symptoms, location, or hospital name to get started instantly.',
//   },
//   {
//     icon: <FiCheckCircle size={22} />,
//     step: '02',
//     title: 'Get Matched',
//     desc: 'We surface the best-fit verified hospitals based on your specific situation.',
//   },
//   {
//     icon: <FiHeart size={22} />,
//     step: '03',
//     title: 'Get Care',
//     desc: 'View profiles, get directions, and connect with the right facility fast.',
//   },
// ]

// const Home = () => {
//   const navigate = useNavigate()
//   const [searchQuery, setSearchQuery] = useState('')
//   const [error, setError] = useState('')
//   const [triggerLocation, setTriggerLocation] = useState(0)
//   const [hospitalCount, setHospitalCount] = useState<number | null>(null)
//   const [countryCount, setCountryCount] = useState<number | null>(null)

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const [countRes, countryRes] = await Promise.all([
//           fetch(`${BASE_URL}/hospitals/count`),
//           fetch(`${BASE_URL}/hospitals/stats/countries`),
//         ])
//         const countData = await countRes.json()
//         const countryData = await countryRes.json()
//         setHospitalCount(countData.total)
//         setCountryCount(countryData.length)
//       } catch (err) {
//         console.error('Failed to fetch stats:', err)
//       }
//     }
//     fetchStats()
//   }, [])

//   const handleSearch = () => {
//     if (!searchQuery.trim()) {
//       setError('Please enter a location or hospital name to search.')
//       return
//     }
//     setError('')
//     navigate(`/find-hospital?q=${encodeURIComponent(searchQuery.trim())}`)
//   }

//   return (
//     <>
//       <SEOHelmet
//         title="Find Trusted Hospitals Near You | Global Healthcare Directory"
//         description="Instantly locate verified hospitals, clinics, and emergency centers worldwide. View services, contact info, and real-time health alerts."
//         canonical="https://hospitofind.online"
//         image="/src/assets/images/hero.png"
//         schemaType="global"
//         schemaData={[]}
//         autoBreadcrumbs={false}
//         extraSchema={[
//           {
//             '@context': 'https://schema.org',
//             '@type': 'SiteNavigationElement',
//             name: ['find-hospital', 'About', 'directory', 'Dashboard', 'health-tips', 'disease-outbreaks', 'faq', 'policy', 'terms'],
//             url: [
//               'https://hospitofind.online/find-hospital',
//               'https://hospitofind.online/directory',
//               'https://hospitofind.online/about',
//               'https://hospitofind.online/health-tips',
//               'https://hospitofind.online/disease-outbreaks',
//               'https://hospitofind.online/faq',
//               'https://hospitofind.online/policy',
//               'https://hospitofind.online/terms',
//             ],
//           },
//         ]}
//       />

//       <main className={style.bg}>

//         {/* ── HERO ── */}
//         <div className={style.wrapper}>
//           <Motion className={style.container} variants={sectionReveal} as="section">
//             <div className={style.header}>
//               <h1 className={style.title}>
//                 Find Trusted Care, <span className={style.accent}>Anywhere.</span>
//               </h1>
//               <p className={style.subtitle}>
//                 Instantly connect with verified hospitals, clinics, and emergency
//                 centers globally. Your health journey starts here.
//               </p>
//             </div>

//             <div className={style.searchBox}>
//               <div className={`${style.inputWrapper} ${error ? style.inputError : ''}`}>
//                 <span className={style.searchIcon}>🔍</span>
//                 <input
//                   type="text"
//                   placeholder="Enter city, region, or hospital name..."
//                   className={style.mainInput}
//                   value={searchQuery}
//                   onChange={(e) => {
//                     setSearchQuery(e.target.value)
//                     if (error) setError('')
//                   }}
//                   onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//                   aria-label="Search for hospitals"
//                 />
//               </div>

//               {error && <p className={style.errorMessage}>{error}</p>}

//               <button
//                 className={style.locationBtn}
//                 onClick={() => setTriggerLocation(Date.now())}
//                 title="Find hospitals near my current location"
//               >
//                 <FiMapPin /> Near Me
//               </button>

//               <button className={style.btnPrimary} onClick={handleSearch}>
//                 Find Hospitals
//               </button>
//             </div>
//           </Motion>

//           <Motion className={style.imgContainer} variants={fadeUp}>
//             <img
//               src={HeroImage}
//               alt="Mother and child using the HospitoFind app to locate medical care"
//               className={style.heroImage}
//               width="600"
//               height="500"
//               loading="eager"
//             />
//           </Motion>
//         </div>

//         {/* ── STATS BAR ── */}
//         <Motion variants={fadeUp} as="section" once={true}>
//           <div className={style.statsBar}>
//             <div className={style.statItem}>
//               <span className={style.statValue}>
//                 {hospitalCount !== null ? `${hospitalCount.toLocaleString()}+` : <span className={style.shimmer} />}
//               </span>
//               <span className={style.statLabel}>Verified Hospitals</span>
//             </div>
//             <div className={style.statItem}>
//               <span className={style.statValue}>
//                 {countryCount !== null ? `${countryCount}+` : <span className={style.shimmer} />}
//               </span>
//               <span className={style.statLabel}>Countries Covered</span>
//             </div>
//             <div className={style.statItem}>
//               <span className={style.statValue}>100%</span>
//               <span className={style.statLabel}>Free to Use</span>
//             </div>
//           </div>
//         </Motion>

//         {/* ── HOW IT WORKS ── */}
//         <Motion variants={fadeUp} as="section" once={true}>
//           <div className={style.howSection}>
//             <p className={style.howEyebrow}>How It Works</p>
//             <h2 className={style.howTitle}>Care in three simple steps</h2>
//             <div className={style.howGrid}>
//               {HOW_IT_WORKS.map((item) => (
//                 <div key={item.step} className={style.howCard}>
//                   <div className={style.howIcon}>{item.icon}</div>
//                   <span className={style.howStep}>{item.step}</span>
//                   <h3 className={style.howCardTitle}>{item.title}</h3>
//                   <p className={style.howCardDesc}>{item.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </Motion>

//         {/* ── NEARBY HOSPITALS ── */}
//         <Motion variants={fadeUp} as="section" once={true}>
//           <NearbyHospitals triggerLocation={triggerLocation} />
//         </Motion>

//       </main>
//     </>
//   )
// }

// export default Home




// import { useNavigate } from 'react-router-dom'
// import { useState } from 'react'
// import HeroImage from '@/assets/images/mother.png'
// import style from './styles/home.module.scss'
// import DailyHealthTip from '@/components/health/DailyTips'
// import NearbyHospitals from '@/components/hospital/NearbyHospital'
// import HealthNews from '@/components/health/HealthNews'
// import HealthAlerts from '@/components/health/HealthAlert'
// import TrustedSection from '@/components/hospital/TrustedHospitals'
// import Motion from '@/components/ui/Motion'
// import { fadeUp, sectionReveal } from '@/utils/animations'
// import { SEOHelmet } from '@/components/ui/SeoHelmet'
// import { FiMapPin } from 'react-icons/fi'


// const Home = () => {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [error, setError] = useState("");
//   const [triggerLocation, setTriggerLocation] = useState(0);

//   const handleSearch = () => {
//     if (!searchQuery.trim()) {
//       setError("Please enter a location or hospital name to search.");
//       return;
//     }

//     setError("");
//     navigate(`/find-hospital?q=${encodeURIComponent(searchQuery.trim())}`);
//   };

//   return (
//     <>
//       <SEOHelmet
//         title="Find Trusted Hospitals Near You | Global Healthcare Directory"
//         description="Instantly locate verified hospitals, clinics, and emergency centers worldwide. View services, contact info, and real-time health alerts."
//         canonical="https://hospitofind.online"
//         image="/src/assets/images/hero.png"
//         schemaType="global"
//         schemaData={[]}
//         autoBreadcrumbs={false}
//         extraSchema={[
//           {
//             "@context": "https://schema.org",
//             "@type": "SiteNavigationElement",
//             name: ["find-hospital", "About", "directory", "Dashboard", "health-tips", "disease-outbreaks", "health-tips", "faq", "policy", "terms"],
//             url: [
//               "https://hospitofind.online/find-hospital",
//               "https://hospitofind.online/directory",
//               "https://hospitofind.online/about",
//               "https://hospitofind.online/health-tips",
//               "https://hospitofind.online/disease-outbreaks",
//               "https://hospitofind.online/health-tips",
//               "https://hospitofind.online/faq",
//               "https://hospitofind.online/policy",
//               "https://hospitofind.online/terms"
//             ]
//           }
//         ]}
//       />

//       <main className={style.bg}>
//         <div className={style.wrapper}>
//           <Motion className={style.container} variants={sectionReveal} as="section">
//             <div className={style.header}>
//               <h1 className={style.title}>
//                 Find Trusted Care, <span className={style.accent}>Anywhere.</span>
//               </h1>
//               <p className={style.subtitle}>
//                 Instantly connect with verified hospitals, clinics, and emergency centers globally. Your health journey starts here.
//               </p>
//             </div>

//             <div className={style.searchBox}>
//               <div className={`${style.inputWrapper} ${error ? style.inputError : ""}`}>
//                 <span className={style.searchIcon}>🔍</span>
//                 <input
//                   type="text"
//                   placeholder="Enter city, region, or hospital name..."
//                   className={style.mainInput}
//                   value={searchQuery}
//                   onChange={(e) => {
//                     setSearchQuery(e.target.value);
//                     if (error) setError("");
//                   }}
//                   onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//                   aria-label="Search for hospitals"
//                 />
//               </div>

//               {error && <p className={style.errorMessage}>{error}</p>}

//               <button className={style.locationBtn} onClick={() => setTriggerLocation(Date.now())} title="Find hospitals near my current location">
//                 <FiMapPin /> Near Me
//               </button>

//               <button className={style.btnPrimary} onClick={handleSearch}>
//                 Find Hospitals
//               </button>
//             </div>
//           </Motion>

//           <Motion className={style.imgContainer} variants={fadeUp}>
//             <img
//               src={HeroImage}
//               alt="Mother and child using the HospitoFind app to locate medical care"
//               className={style.heroImage}
//               width="600"
//               height="500"
//               loading="eager"
//             />
//           </Motion>
//         </div>
//         <Motion variants={fadeUp} as="section" once={true}>
//           <NearbyHospitals triggerLocation={triggerLocation} />
//         </Motion>
//         <Motion variants={fadeUp} as="section" once={true}>
//           <TrustedSection />
//         </Motion>
//         <Motion variants={fadeUp} as="section" once={true}>
//           <HealthNews />
//         </Motion>
//         <Motion variants={fadeUp} as="section" once={true}>
//           <DailyHealthTip />
//         </Motion>
//         <Motion variants={fadeUp} as="section" once={true}>
//           <HealthAlerts />
//         </Motion>
//       </main >
//     </>
//   );
// };

// export default Home;

import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import HeroImage from '@/assets/images/mother.png'
import style from './styles/home.module.scss'
import DailyHealthTip from '@/components/health/DailyTips'
import NearbyHospitals from '@/components/hospital/NearbyHospital'
import HealthNews from '@/components/health/HealthNews'
import HealthAlerts from '@/components/health/HealthAlert'
import TrustedSection from '@/components/hospital/TrustedHospitals'
import Motion from '@/components/ui/Motion'
import { fadeUp, sectionReveal } from '@/utils/animations'
import { SEOHelmet } from '@/components/ui/SeoHelmet'
import { FiMapPin } from 'react-icons/fi'


const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [triggerLocation, setTriggerLocation] = useState(0);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setError("Please enter a location or hospital name to search.");
      return;
    }

    setError("");
    navigate(`/find-hospital?q=${encodeURIComponent(searchQuery.trim())}`);
  };

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
            "@context": "https://schema.org",
            "@type": "SiteNavigationElement",
            name: ["find-hospital", "About", "directory", "Dashboard", "health-tips", "disease-outbreaks", "health-tips", "faq", "policy", "terms"],
            url: [
              "https://hospitofind.online/find-hospital",
              "https://hospitofind.online/directory",
              "https://hospitofind.online/about",
              "https://hospitofind.online/health-tips",
              "https://hospitofind.online/disease-outbreaks",
              "https://hospitofind.online/health-tips",
              "https://hospitofind.online/faq",
              "https://hospitofind.online/policy",
              "https://hospitofind.online/terms"
            ]
          }
        ]}
      />

      <main className={style.bg}>
        <div className={style.wrapper}>
          <Motion className={style.container} variants={sectionReveal} as="section">
            <div className={style.header}>
              <h1 className={style.title}>
                Find Trusted Care, <span className={style.accent}>Anywhere.</span>
              </h1>
              <p className={style.subtitle}>
                Instantly connect with verified hospitals, clinics, and emergency centers globally. Your health journey starts here.
              </p>
            </div>

            <div className={style.searchBox}>
              <div className={`${style.inputWrapper} ${error ? style.inputError : ""}`}>
                <span className={style.searchIcon}>🔍</span>
                <input
                  type="text"
                  placeholder="Enter city, region, or hospital name..."
                  className={style.mainInput}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (error) setError("");
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  aria-label="Search for hospitals"
                />
              </div>

              {error && <p className={style.errorMessage}>{error}</p>}

              <button className={style.locationBtn} onClick={() => setTriggerLocation(Date.now())} title="Find hospitals near my current location">
                <FiMapPin /> Near Me
              </button>

              <button className={style.btnPrimary} onClick={handleSearch}>
                Find Hospitals
              </button>
            </div>
          </Motion>

          <Motion className={style.imgContainer} variants={fadeUp}>
            <img
              src={HeroImage}
              alt="Mother and child using the HospitoFind app to locate medical care"
              className={style.heroImage}
              width="600"
              height="500"
              loading="eager"
            />
          </Motion>
        </div>
        <Motion variants={fadeUp} as="section" once={true}>
          <NearbyHospitals triggerLocation={triggerLocation} />
        </Motion>
        <Motion variants={fadeUp} as="section" once={true}>
          <TrustedSection />
        </Motion>
        <Motion variants={fadeUp} as="section" once={true}>
          <HealthNews />
        </Motion>
        <Motion variants={fadeUp} as="section" once={true}>
          <DailyHealthTip />
        </Motion>
        <Motion variants={fadeUp} as="section" once={true}>
          <HealthAlerts />
        </Motion>
      </main >
    </>
  );
};

export default Home;

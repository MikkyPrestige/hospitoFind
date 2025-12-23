import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Hero from '@/assets/images/hero.png'
import style from './style/home.module.scss'
import Header from '@/layouts/header/nav'
import DailyHealthTip from '@/health/dailyTips'
import NearbyHospitals from '@/health/nearbyHospital'
import HealthNews from '@/health/healthNews'
import HealthAlerts from '@/health/healthAlert'
import Footer from '@/layouts/footer/footer'
import TrustedSection from '@/components/trustedHospitals'
import Motion from '@/components/motion'
import { fadeUp, sectionReveal } from '@/hooks/animations'
import { SEOHelmet } from '@/components/utils/seoUtils'


const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [triggerLocation, setTriggerLocation] = useState(0);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/find-hospital?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className={style.home}>
      <SEOHelmet
        title="Hospital Finder & Healthcare Directory"
        description="Find hospitals near you with HospitoFind. Search by city, country, or name to discover verified healthcare facilities and services worldwide."
        canonical="https://hospitofind.online"
        image="/src/assets/images/hero.png"
        schemaType="global"
        schemaData={[]}
        autoBreadcrumbs={true}
        extraSchema={[
          {
            "@context": "https://schema.org",
            "@type": "SiteNavigationElement",
            name: ["find-hospital", "About", "Explore", "Dashboard", "news", "outbreaks", "health-tips", "faq", "policy"],
            url: [
              "https://hospitofind.online/find-hospital",
              "https://hospitofind.online/country",
              "https://hospitofind.online/about",
              "https://hospitofind.online/news",
              "https://hospitofind.online/outbreaks",
              "https://hospitofind.online/tips",
              "https://hospitofind.online/faq",
              "https://hospitofind.online/policy"
            ]
          }
        ]}
      />

      <Header />

      <main className={style.bg}>
        <div className={style.wrapper}>
          <Motion className={style.container} variants={sectionReveal} as="section">
            <div className={style.header}>
              <h1 className={style.title}>
                Find Trusted Hospitals Near You — Fast and Easy!
              </h1>
              <p className={style.subtitle}>
                Locate verified healthcare facilities worldwide. Search by City, Country, or Hospital Name.
              </p>
            </div>

            <div className={style.searchBox}>
              <div className={style.inputWrapper}>
                <span className={style.searchIcon}>🔍</span>
                <input
                  type="text"
                  placeholder="Enter city, country, or hospital..."
                  className={style.mainInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  className={style.locationBtn}
                  onClick={() => setTriggerLocation(Date.now())}
                  title="Find hospitals near me"
                >
                  📍 Use My Location
                </button>
              </div>
              <button className={style.btnPrimary} onClick={handleSearch}>
                Search Now
              </button>
            </div>
          </Motion>

          <Motion className={style.imgContainer} variants={fadeUp}>
            <img
              src={Hero}
              alt="HospitoFind medical directory interface"
              className={style.heroImage}
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

      <Footer />
    </div >
  );
};

export default Home;

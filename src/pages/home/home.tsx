import { Link } from 'react-router-dom'
import { Avatar } from '@/components/avatar'
import Hero from '@/assets/images/hero.png'
import style from './style/home.module.scss'
import Header from '@/layouts/header/nav'
import DailyHealthTip from '@/health/dailyTips'
import NearbyHospitals from '@/health/nearbyHospital'
import HealthNews from '@/health/newsData'
import HealthAlerts from '@/health/healthAlert'
import Footer from '@/layouts/footer/footer'
import TrustedSection from '@/components/trustedHospitals'
import Motion from '@/components/motion'
import { fadeUp, sectionReveal } from '@/hooks/animations'
import { SEOHelmet } from '@/components/utils/seoUtils'


const Home = () => {

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
            name: ["FindHospital", "About", "Explore", "Dashboard", "news", "outbreaks", "tips"],
            url: [
              "https://hospitofind.online/findHospital",
              "https://hospitofind.online/country",
              "https://hospitofind.online/about",
              "https://hospitofind.online/news",
              "https://hospitofind.online/outbreaks",
              "https://hospitofind.online/tips"
            ]
          }
        ]}
      />

      <Header />

      <section className={style.bg}>
        <div className={style.wrapper}>

          <Motion className={style.container} variants={sectionReveal} as="section">
            <div className={style.header}>
              <h1 className={style.title}>
                Find Hospitals Near You
              </h1>
              <p className={style.subtitle}>
                HospitoFind is your trusted hospital finder. Whether you’re looking for hospitals near you or exploring healthcare worldwide, our directory helps you connect with verified hospitals easily. Search by city, country, or hospital name to discover healthcare facilities and services worldwide.
              </p>
            </div>

            <div className={style.cta}>
              <Link to="/findHospital" className={style.btn}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
                  />
                </svg>

                <span>Start Your Search</span>
              </Link>
            </div>
          </Motion>

          <Motion className={style.img}>
            <Avatar
              image={Hero}
              alt="Hospital"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Motion>
        </div>

        <Motion variants={fadeUp} as="section" once={false}>
          <NearbyHospitals />
        </Motion>

        <Motion variants={fadeUp} as="section" once={false}>
          <HealthNews />
        </Motion>

        <Motion variants={fadeUp} as="section" once={false}>
          <DailyHealthTip />
        </Motion>

        <Motion variants={fadeUp} as="section" once={false}>
          <HealthAlerts />
        </Motion>

        <Motion variants={fadeUp} as="section" once={false}>
          <TrustedSection />
        </Motion>
      </section >

      <Footer />
    </div >
  );
};

export default Home;

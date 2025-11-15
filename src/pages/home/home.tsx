import { Link } from 'react-router-dom'
import { Avatar } from '@/components/avatar'
import Hero from '@/assets/images/hero.png'
import { Button } from '@/components/button'
import style from './style/home.module.scss'
import Header from '@/layouts/header/nav'
import DailyHealthTip from '@/health/dailyTips'
import NearbyHospitals from '@/health/nearbyHospital'
import HealthNews from '@/health/newsData'
import HealthAlerts from '@/health/healthAlert'
import Footer from '@/layouts/footer/footer'
import { Helmet } from 'react-helmet-async'
import TrustedSection from '@/components/trustedHospitals'
import Motion from '@/components/motion'
import { fadeUp, sectionReveal } from '@/hooks/animations'


const Home = () => {

  return (
    <div className={style.home}>
      <Helmet>
        <title>Home | HospitoFind</title>
        <meta
          name="description"
          content="Find trusted hospitals near you — anytime, anywhere."
        />
        <meta
          name="keywords"
          content="hospital, doctor, appointment, healthcare, clinic, medical, find"
        />
      </Helmet>

      <Header />

      <section className={style.bg}>
        <div className={style.wrapper}>

          <Motion className={style.container} variants={sectionReveal} as="section">
            <div className={style.header}>
              <h1 className={style.title}>
                Find trusted hospitals near you — Anytime, Anywhere!
              </h1>
              <p className={style.subtitle}>
                Connecting you to quality healthcare across the globe. Fast, easy, reliable.
              </p>
            </div>

            <div className={style.cta}>
              <Button>
                <Link to="/explore" className={style.btn}>
                  Explore Hospitals
                </Link>
              </Button>
            </div>
          </Motion>

          <Motion className={style.img}>
            <Avatar
              image={Hero}
              alt="Hospital"
              style={{
                width: "100%",
                height: "100%",
                // boxShadow:
                //   "12px 12px 20px rgba(14, 61, 183, 0.25), 0 4px 4px rgba(0,0,0,0.25)",
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
      </section>

      <Footer />
    </div>
  );
};

export default Home;

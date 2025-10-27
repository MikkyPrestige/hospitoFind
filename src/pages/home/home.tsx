import { Link } from 'react-router-dom'
import { BsArrowRightShort } from 'react-icons/bs'
import { Avatar } from '@/components/avatar'
import Image from '@/assets/images/doctor-patient.jpg'
import { Button } from '@/components/button'
import style from './style/home.module.scss'
import Header from '@/layouts/header/nav'
import DailyHealthTip from '@/health/dailyTips'
import NearbyHospitals from '@/health/nearbyHospital'
import HealthNews from '@/health/newsData'
import HealthAlerts from '@/health/healthAlert'
import Footer from '@/layouts/footer/footer'
import { useAuthContext } from '@/context/userContext'
import { Helmet } from 'react-helmet-async'
import TrustedSection from '@/components/trustedHospitals'
import Motion from '@/components/motion'
import { fadeUp, sectionReveal } from '@/hooks/animations'

const Home = () => {
  const { state } = useAuthContext();

  return (
    <div className={style.home}>
      <Helmet>
        <title>Home | CareFinder</title>
        <meta
          name="description"
          content="Find trusted hospitals near you — anytime, anywhere."
        />
        <meta
          name="keywords"
          content="hospital, doctor, appointment, healthcare, clinic, medical, find, Nigeria"
        />
      </Helmet>

      <Header />

      <section className={style.bg}>
        <div className={style.wrapper}>

          {/* 🩺 Hero Section */}
          <Motion className={style.container} variants={sectionReveal} as="section">
            <div className={style.header}>
              <h1 className={style.title}>
                Find trusted hospitals near you — anytime, anywhere.
              </h1>
              <p className={style.subtitle}>
                Connecting you to quality healthcare across the globe, with tools
                that make finding care simple and fast.
              </p>
            </div>

            <div className={style.cta}>
              {state.username ? (
                <Button>
                  <Link to="/dashboard" className={style.btn}>
                    My Account
                  </Link>
                </Button>
              ) : (
                <Button>
                  <Link to="/signup" className={style.btn}>
                    Start Searching
                  </Link>
                </Button>
              )}

              <Link to="/about" className={style.outlineBtn}>
                Learn More <BsArrowRightShort className={style.icon} />
              </Link>
            </div>
          </Motion>

          {/* 👩‍⚕️ Hero Image */}
          <Motion className={style.img}>
            <Avatar
              image={Image}
              alt="Doctor and patient"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "2rem",
                boxShadow:
                  "12px 12px 20px rgba(14, 61, 183, 0.25), 0 4px 4px rgba(0,0,0,0.25)",
                objectFit: "cover",
              }}
            />
          </Motion>
        </div>

        {/* 🏥 Nearby Hospitals */}
        <Motion variants={fadeUp} as="section" once={false}>
          <NearbyHospitals />
        </Motion>

        {/* 🚨 Health Alerts */}
        <Motion variants={fadeUp} as="section" once={false}>
          <HealthAlerts />
        </Motion>

        {/* 📰 Health News */}
        <Motion variants={fadeUp} as="section" once={false}>
          <HealthNews />
        </Motion>

        {/* 💡 Daily Health Tips */}
        <Motion variants={fadeUp} as="section" once={false}>
          <DailyHealthTip />
        </Motion>

        {/* 🏆 Trusted Hospitals */}
        <Motion variants={fadeUp} as="section" once={false}>
          <TrustedSection />
        </Motion>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

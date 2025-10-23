import { Link } from 'react-router-dom'
import { BsArrowRightShort } from 'react-icons/bs'
import { Avatar } from '@/components/avatar'
import Image from '@/assets/images/doctor-patient.jpg'
import { Button } from '@/components/button'
import style from './style/home.module.scss'
import Header from '@/layouts/header/nav'
import DailyHealthTip from '@/api/dailyTips'
import NearbyHospitals from '@/api/nearbyHospital'
import HealthNews from '@/api/newsData'
import HealthAlerts from '@/api/healthAlert'
import Footer from '@/layouts/footer/footer'
import { useAuthContext } from '@/context/userContext'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import Logo1 from '@/assets/images/hospital1.jpg'
import Logo2 from '@/assets/images/hospital2.jpg'
import Logo3 from '@/assets/images/hospital3.jpg'
import Logo4 from '@/assets/images/hospital4.jpg'
import Logo5 from '@/assets/images/hospital5.jpg'

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

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
          <div className={style.container}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className={style.header}
            >
              <h1 className={style.title}>
                Find trusted hospitals near you — anytime, anywhere.
              </h1>
              <p className={style.subtitle}>
                Connecting you to quality healthcare across the globe, with tools
                that make finding care simple and fast.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className={style.cta}
            >
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
            </motion.div>
          </div>


          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className={style.img}
          >
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
          </motion.div>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <NearbyHospitals />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <HealthAlerts />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <DailyHealthTip />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <HealthNews />
        </motion.div>

        {/* 🤝 Trusted Hospitals */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className={style.trusted}
        >
          <h3 className={style.trustedTitle}>
            Trusted by leading hospitals and healthcare providers
          </h3>
          <div className={style.logos}>
            {[Logo1, Logo2, Logo3, Logo4, Logo5].map((logo, i) => (
              <Avatar
                key={i}
                image={logo}
                alt={`Hospital logo ${i + 1}`}
                style={{
                  width: "120px",
                  height: "auto",
                  objectFit: "contain",
                  opacity: 0.85,
                  transition: "opacity 0.3s ease",
                }}
              />
            ))}
          </div>
        </motion.div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
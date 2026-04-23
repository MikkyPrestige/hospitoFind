import { Link } from "react-router-dom";
import { BsShieldCheck, BsLightningCharge } from "react-icons/bs";
import { MdStarBorderPurple500 } from "react-icons/md";
import { motion } from "framer-motion";
import { useGlobalStats } from "@/hooks/useGlobalStats";
import { features, steps, reviews } from "@/components/constants/aboutConstants";
import Motion from "@/components/ui/Motion";
import { Avatar } from "@/components/ui/Avatar";
import { SEOHelmet } from "@/components/ui/SeoHelmet";
import { fadeUp, slideLeft, slideRight, zoomIn, sectionReveal } from "@/utils/animations";
import Lobby from "@/assets/images/hospitalLobby.png"
import PhoneMap from "@/assets/images/phone.jpg";
import style from "./styles/about.module.scss";

const About = () => {
  const { totalHospitals, totalCountries, loading } = useGlobalStats();

  return (
    <>
      <SEOHelmet
        title="Our Mission | Making Healthcare Accessible Worldwide"
        description="We are dedicated to making global healthcare accessible, transparent, and verified for everyone, everywhere. Discover how HospitoFind connects people with trusted hospitals, clinics, and doctors across the globe."
        canonical="https://hospitofind.online/about"
        schemaType="about"
        autoBreadcrumbs={true}
        lang="en"
      />

      <main className={style.bg}>
        <Motion className={style.heroWrapper} variants={fadeUp} as="section">
          <div className={style.heroContent}>
            <div className={style.badge}>About HospitoFind</div>
            <h1 className={style.heroTitle}>
              Connecting You to <span className={style.span}>Verified Global Healthcare</span>
            </h1>
            <p className={style.heroPara}>
              In a medical emergency, accurate information saves lives. HospitoFind is the world's most reliable directory for verified hospitals, clinics, and emergency centers. We bridge the gap between patients and quality care through technology and transparency.
            </p>

            <div className={style.statsRow}>
              <div className={style.statItem}>
                <span className={style.statNumber}>
                  {loading ? "..." : totalHospitals ? `${totalHospitals.toLocaleString()}+` : "500+"}
                </span>
                <span className={style.statLabel}>Verified Facilities</span>
              </div>
              <div className={style.divider}></div>
              <div className={style.statItem}>
                <span className={style.statNumber}>
                  {loading ? "..." : totalCountries ? `${totalCountries}+` : "50+"}
                </span>
                <span className={style.statLabel}>Countries Covered</span>
              </div>
            </div>

            <Link to="/find-hospital" className={style.ctaLink}>
              Locate a Facility
            </Link>
          </div>

          <div className={style.heroImages}>
            <motion.div variants={slideLeft} className={style.img1}>
              <Avatar image={PhoneMap} alt="HospitoFind Mobile Interface" className={style.avatar} />
            </motion.div>
            <motion.div variants={slideRight} className={style.img2}>
              <Avatar image={Lobby} alt="Modern Hospital Lobby" className={style.avatar} />
            </motion.div>
          </div>
        </Motion>

        <Motion className={style.missionWrapper} variants={sectionReveal} as="section">
          <div className={style.missionGrid}>
            <div className={style.missionText}>
              <h2 className={style.sectionHeading}>Our Mission</h2>
              <p>
                To democratize healthcare access by providing a centralized, verified source of medical facility data. We envision a world where finding safe, reliable medical care is immediate and stress-free, regardless of your location, language, or circumstance.
              </p>
            </div>
            <div className={style.valuesList}>
              <div className={style.valueItem}>
                <div className={style.iconBox}>
                  <BsShieldCheck className={style.valueIcon} />
                </div>
                <div className={style.valueContent}>
                  <h4>Data Integrity</h4>
                  <p>We rigorously verify every facility to ensure you have accurate contact details and location data when it matters most.</p>
                </div>
              </div>
              <div className={style.valueItem}>
                <div className={style.iconBox}>
                  <BsLightningCharge className={style.valueIcon} />
                </div>
                <div className={style.valueContent}>
                  <h4>Rapid Access</h4>
                  <p>Our platform is optimized for speed, delivering critical information instantly, even in low-bandwidth environments.</p>
                </div>
              </div>
            </div>
          </div>
        </Motion>

        <section className={style.featureSection}>
          <div className={style.sectionHeaderCenter}>
            <h2>Why Choose <span>HospitoFind</span>?</h2>
            <p>Tools designed to empower your healthcare decisions.</p>
          </div>
          <div className={style.featureContainer}>
            {features.map((item, i) => (
              <Motion key={i} className={style.featureBox} variants={fadeUp}>
                <div className={style.iconWrapper}>{item.icon}</div>
                <h3 className={style.featureTitle}>{item.title}</h3>
                <p className={style.featureText}>{item.text}</p>
              </Motion>
            ))}
          </div>
        </section>

        <Motion className={style.howItWorksWrapper} variants={sectionReveal} as="section">
          <div className={style.howItWorks_inner}>
            <div className={style.sectionHeaderCenter}>
              <h2 className={style.heading}>Navigating the Platform</h2>
              <p className={style.subHeading}>Four simple steps to accessing or contributing to our global network.</p>
            </div>

            <div className={style.stepsGrid}>
              {steps.map((step, i) => (
                <motion.div key={i} className={style.stepCard} variants={zoomIn}>
                  <div className={style.stepAvatarWrapper}>
                    <Avatar image={step.img} alt={step.head} className={style.imgAvatar} />
                    <span className={style.stepNumber}>{i + 1}</span>
                  </div>
                  <h3 className={style.stepHead}>{step.head}</h3>
                  <p className={style.stepText}>{step.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Motion>

        <Motion className={style.reviewSection} variants={sectionReveal} as="section">
          <div className={style.reviewHeader}>
            <h2 className={style.review_title}>Trusted by Patients & Providers</h2>
            <p className={style.review_subtitle}>See how HospitoFind is making a difference in communities worldwide.</p>
          </div>

          <div className={style.review_grid}>
            {reviews.map((review, i) => (
              <motion.div key={i} className={style.review_box} variants={fadeUp}>
                <div className={style.review_top}>
                  <Avatar image={review.img} alt={review.name} className={style.reviewAvatar} />
                  <div className={style.userInfo}>
                    <span className={style.userName}>{review.name}</span>
                    <span className={style.userRole}>{review.role}</span>
                  </div>
                </div>
                <div className={style.starRow}>
                  {[...Array(5)].map((_, j) => (
                    <MdStarBorderPurple500 key={j} />
                  ))}
                </div>
                <p className={style.review_text}>"{review.text}"</p>
              </motion.div>
            ))}
          </div>
        </Motion>
      </main>
    </>
  );
};

export default About;
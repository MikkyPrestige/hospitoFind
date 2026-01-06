import { useEffect, useState } from "react";
import { BsGlobe2, BsShieldCheck, BsLightningCharge } from "react-icons/bs";
import { FaNotesMedical, FaMapMarkedAlt, FaRegNewspaper } from "react-icons/fa";
import { MdStarBorderPurple500 } from "react-icons/md";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import style from "./style/about.module.scss";
import { BASE_URL } from "@/context/userContext";
import Motion from "@/components/motion";
import { Avatar } from "@/components/avatar";
import { SEOHelmet } from "@/components/utils/seoUtils";
import { fadeUp, slideLeft, slideRight, zoomIn, sectionReveal } from "@/hooks/animations";
import Stethoscope from "@/assets/images/stethoscope.jpg";
import Handset from "@/assets/images/handset.jpg";
import Laptop from "@/assets/images/laptop.jpg";
import Lobby from "@/assets/images/hospitalLobby.png"
import Search from "@/assets/images/hospitalSearch.png";
import PhoneMap from "@/assets/images/phone.jpg";
import Reviewer2 from "@/assets/images/man1.jpg";
import Reviewer4 from "@/assets/images/man2.jpg";
// import Reviewer5 from "@/assets/images/woman.jpg";
import Reviewer7 from "@/assets/images/woman3.jpg";
import Reviewer9 from "@/assets/images/woman5.jpg";
import Reviewer8 from "@/assets/images/woman8.jpg";
import Reviewer10 from "@/assets/images/woman9.jpg";


const About = () => {
  const [count, setCount] = useState<number | null>(null);
  const [countryCount, setCountryCount] = useState(null);

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        // Promise.all to fetch both in parallel
        const [countRes, countryRes] = await Promise.all([
          fetch(`${BASE_URL}/hospitals/count`),
          fetch(`${BASE_URL}/hospitals/stats/countries`)
        ]);

        const countData = await countRes.json();
        const countryData = await countryRes.json();

        setCount(countData.total);

        setCountryCount(countryData.length);

      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchGlobalStats();
  }, []);

  return (
    <>
      <SEOHelmet
        title="Our Mission"
        description="We are dedicated to making global healthcare accessible, transparent, and verified for everyone, everywhere."
        canonical="https://hospitofind.online/about"
      />

      <main className={style.bg}>
        <Motion className={style.heroWrapper} variants={fadeUp} as="section">
          <div className={style.heroContent}>
            <h1 className={style.heroTitle}>
              Connecting You to <span className={style.span}>Verified Global Healthcare</span>
            </h1>
            <p className={style.heroPara}>
              In a medical emergency, accurate information saves lives. HospitoFind is the world's most reliable directory for verified hospitals, clinics, and emergency centers. We bridge the gap between patients and quality care through technology and transparency.
            </p>

            <div className={style.statsRow}>
              <div className={style.statItem}>
                <span className={style.statNumber}>
                  {count ? count.toLocaleString() : "500"}+
                </span>
                <span className={style.statLabel}>Verified Facilities</span>
              </div>

              <div className={style.statItem}>
                <span className={style.statNumber}>
                  {countryCount ? countryCount : "50"}+
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
              <Avatar image={PhoneMap} alt="HospitoFind Mobile Interface showing map" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "2rem", display: "block" }} />
            </motion.div>
            <motion.div variants={slideRight} className={style.img2}>
              <Avatar image={Lobby} alt="Modern Hospital Lobby" style={{
                width: "100%", height: "100%", objectFit: "cover", borderRadius: "2rem", display: "block"
              }} />
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
                <BsShieldCheck className={style.valueIcon} />
                <div>
                  <h4>Data Integrity</h4>
                  <p>We rigorously verify every facility to ensure you have accurate contact details and location data when it matters most.</p>
                </div>
              </div>
              <div className={style.valueItem}>
                <BsLightningCharge className={style.valueIcon} />
                <div>
                  <h4>Rapid Access</h4>
                  <p>Our platform is optimized for speed, delivering critical information instantly—even in low-bandwidth environments.</p>
                </div>
              </div>
            </div>
          </div>
        </Motion>

        <section className={style.featureSection}>
          <div className={style.sectionHeaderCenter}>
            <h2>Why Choose HospitoFind?</h2>
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
          <div className={style.semiCircle_container}>
            <div className={style.semiCircle_bg}>
              <div className={`${style.semiCircle} ${style.one}`}></div>
              <div className={`${style.semiCircle} ${style.two}`}></div>
              <div className={`${style.semiCircle} ${style.three}`}></div>
            </div>

            <div className={style.howItWorks_inner}>
              <h2 className={style.heading}>Navigating the Platform</h2>
              <p className={style.subHeading}>Four simple steps to accessing or contributing to our global network.</p>

              <div className={style.stepsGrid}>
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    className={style.stepCard}
                    variants={zoomIn}
                  >
                    <div className={style.stepAvatarWrapper}>
                      <Avatar image={step.img} alt={step.head} style={{ width: "6.5rem", height: "6.5rem", borderRadius: "50%", border: "3px solid white" }} />
                      <span className={style.stepNumber}>{i + 1}</span>
                    </div>
                    <h3 className={style.stepHead}>{step.head}</h3>
                    <p className={style.stepText}>{step.text}</p>
                  </motion.div>
                ))}
              </div>
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
                <p className={style.review_text}>"{review.text}"</p>
                <div className={style.starRow}>
                  {[...Array(5)].map((_, j) => (
                    <MdStarBorderPurple500 key={j} />
                  ))}
                </div>
                <div className={style.userInfo}>
                  <Avatar image={review.img} alt={review.name} style={{ width: "3.5rem", height: "3.5rem", borderRadius: "50%" }} />
                  <span className={style.userName}>{review.name}</span>
                  <span className={style.userRole}>{review.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Motion>
      </main>
    </>
  );
};

// --- DATA ARRAYS ---
const features = [
  { icon: <FaNotesMedical />, title: "Comprehensive Profiles", text: "Access detailed facility records, including specialized services, accreditation status, and direct contact channels." },
  { icon: <FaMapMarkedAlt />, title: "Interactive Mapping", text: "Visualize healthcare density in your region with our precision mapping tools and get instant turn-by-turn directions." },
  { icon: <BsGlobe2 />, title: "Global Directory", text: "Seamlessly switch between countries to find care while traveling or for family members abroad." },
  { icon: <FaRegNewspaper />, title: "Health Intelligence", text: "Stay informed with curated health alerts and epidemiological updates relevant to your location." },
];

const steps = [
  { img: Search, head: "Search & Discover", text: "Enter your city or region to instantly view a curated list of verified medical facilities near you.", pos: "content1" },
  { img: Stethoscope, head: "Create Profile", text: "Sign up to save critical contacts, track your history, and unlock advanced search filters.", pos: "content2" },
  { img: Handset, head: "Save & Share", text: "Export facility details to PDF or share secure links with family members in emergencies.", pos: "content3" },
  { img: Laptop, head: "Contribute Data", text: "Help the community by submitting new facilities or updating existing records for verification.", pos: "content4" },
];

const reviews = [
  {
    text: "While traveling abroad, HospitoFind helped me quickly locate hospitals in a new country. The map and distance area made it stress free to get care when I needed it most.",
    img: Reviewer7,
    name: "Abena A.",
    role: "International Traveler"
  },
  {
    text: "Creating an account was a game-changer. I tracked my searches, downloaded lists, and shared options with my family while planning a surgery abroad. It’s intuitive and genuinely helpful.",
    img: Reviewer9,
    name: "Elena Marquez",
    role: "Caregiver"
  },
  {
    text: "HospitoFind gave me more than directions. From services to daily health tips, it feels like having a healthcare guide in my pocket.",
    img: Reviewer2,
    name: "Oliver Ray",
    role: "Health Enthusiast"
  },
  {
    text: "The outbreak alerts kept me informed during a local health scare. HospitoFind isn’t just about finding hospitals—it’s about staying safe, prepared, and ahead of the curve.",
    img: Reviewer8,
    name: "Bolu Adeboye",
    role: "Community Member"
  },
  {
    text: "I love that I can contribute by adding verified hospitals. Knowing my input helps others in my community find trusted care makes me feel part of a global movement.",
    img: Reviewer4,
    name: "Emeka O.",
    role: "Contributor"
  },
  {
    text: "The ‘recently viewed’ feature saved me so much time. I didn’t have to repeat searches; I could quickly compare hospitals I checked earlier and finalize my choice.",
    img: Reviewer10,
    name: "Amira Solano",
    role: "Patient"
  }
];

export default About;
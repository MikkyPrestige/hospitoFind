import { useEffect, useState } from "react";
import { BsGlobe2, BsShieldCheck, BsLightningCharge } from "react-icons/bs";
import { FaNotesMedical, FaMapMarkedAlt, FaRegNewspaper } from "react-icons/fa";
import { MdStarBorderPurple500 } from "react-icons/md";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import style from "./style/about.module.scss";
import Header from "@/layouts/header/nav";
import Footer from "@/layouts/footer/footer";
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
import Reviewer1 from "@/assets/images/man.jpg";
import Reviewer2 from "@/assets/images/man1.jpg";
import Reviewer3 from "@/assets/images/man2.jpg";
import Reviewer4 from "@/assets/images/man3.jpg";
import Reviewer5 from "@/assets/images/woman.jpg";
import Reviewer6 from "@/assets/images/woman1.jpg";
import Reviewer7 from "@/assets/images/woman3.jpg";
import Reviewer8 from "@/assets/images/woman4.jpg";
import Reviewer9 from "@/assets/images/woman5.jpg";
import Reviewer10 from "@/assets/images/woman7.jpg";
import Reviewer11 from "@/assets/images/woman8.jpg";
import Reviewer12 from "@/assets/images/woman9.jpg";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const About = () => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch(`${BASE_URL}/hospitals/count`);
        const data = await res.json();
        setCount(data.total);
      } catch {
        setCount(null);
      }
    };
    fetchCount();
  }, []);

  return (
    <>
      <SEOHelmet
        title="About Us"
        description="Discover our mission to make global healthcare accessible and transparent."
        canonical="https://hospitofind.online/about"
      />

      <Header />

      <main className={style.bg}>
        <Motion className={style.heroWrapper} variants={fadeUp} as="section">
          <div className={style.heroContent}>
            <h1 className={style.heroTitle}>
              Bridging the Gap to <span className={style.span}>Global Healthcare</span>
            </h1>
            <p className={style.heroPara}>
              HospitoFind is a global hospital search platform designed to help users quickly find verified hospitals, clinics, and emergency medical centers anywhere in the world. We believe that finding care should be the easiest part of your healthcare journey.
            </p>

            <div className={style.statsRow}>
              <div className={style.statItem}>
                <span className={style.statNumber}>{count ? count.toLocaleString() : "281"}+</span>
                <span className={style.statLabel}>Verified Hospitals</span>
              </div>
              <div className={style.statItem}>
                <span className={style.statNumber}>27+</span>
                <span className={style.statLabel}>Global Countries</span>
              </div>
            </div>

            <Link to="/find-hospital" className={style.ctaLink}>
              Find a Hospital Now
            </Link>
          </div>

          <div className={style.heroImages}>
            <motion.div variants={slideLeft} className={style.img1}>
              <Avatar image={PhoneMap} alt="Mobile App" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "2rem", display: "block" }} />
            </motion.div>
            <motion.div variants={slideRight} className={style.img2}>
              <Avatar image={Lobby} alt="Medical Team" style={{
                width: "100%", height: "100%", objectFit: "cover", borderRadius: "2rem", display: "block"
              }} />
            </motion.div>
          </div>
        </Motion>

        <Motion className={style.missionWrapper} variants={sectionReveal} as="section">
          <div className={style.missionGrid}>
            <div className={style.missionText}>
              <h2 className={style.sectionHeading}>Our Mission</h2>
              <p>To empower every individual with the information they need to access reliable healthcare, regardless of their location or language. We are building a world where verified medical data is a right, not a privilege.</p>
            </div>
            <div className={style.valuesList}>
              <div className={style.valueItem}>
                <BsShieldCheck className={style.valueIcon} />
                <div>
                  <h4>Verified Data</h4>
                  <p>Every hospital in our directory is manually checked for authenticity.</p>
                </div>
              </div>
              <div className={style.valueItem}>
                <BsLightningCharge className={style.valueIcon} />
                <div>
                  <h4>Real-Time Alerts</h4>
                  <p>Stay updated with live outbreak alerts and health news.</p>
                </div>
              </div>
            </div>
          </div>
        </Motion>

        <section className={style.featureSection}>
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
              <h2 className={style.heading}>How It Works</h2>

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
            <h2 className={style.review_title}>Voices from Our Community</h2>
            <p className={style.review_subtitle}>Real experiences from people whose healthcare journey was made easier.</p>
          </div>

          <div className={style.review_grid}>
            {reviews.map((review, i) => (
              <motion.div key={i} className={style.review_box} variants={fadeUp}>
                <p className={style.review_text}>"{review.text}"</p>
                <div className={style.starRow}>
                  {[...Array(5)].map((_, j) => (
                    <MdStarBorderPurple500 key={j} className={style.starIcon} />
                  ))}
                </div>
                <div className={style.userInfo}>
                  <Avatar image={review.img} alt={review.name} style={{ width: "3.5rem", height: "3.5rem", borderRadius: "50%" }} />
                  <span className={style.userName}>{review.name}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* <div className={style.finalCTA}>
            <h3>Ready to find the care you deserve?</h3>
            <Link to="/signup" className={style.ctaLinkMain}>Create Free Account</Link>
          </div> */}
        </Motion>
      </main>

      <Footer />
    </>
  );
};

// --- DATA ARRAYS ---
const features = [
  { icon: <FaNotesMedical />, title: "Hospital Insights", text: "Detailed hospital profiles including services, location and contact info." },
  { icon: <FaMapMarkedAlt />, title: "Interactive Maps", text: "View hospitals on a map, check distances, and get directions instantly." },
  { icon: <BsGlobe2 />, title: "Global Atlas", text: "Explore hospitals grouped by country for a worldwide perspective." },
  { icon: <FaRegNewspaper />, title: "Health Updates", text: "Read global health news and outbreak alerts right inside the platform." },
];

const steps = [
  { img: Search, head: "Find Hospitals", text: "Discover hospitals near you with essential services and info.", pos: "content1" },
  { img: Stethoscope, head: "Sign Up / Login", text: "Save searches, track favorites and access advanced tools.", pos: "content2" },
  { img: Handset, head: "Export or Share", text: "Download hospital lists or share securely with family.", pos: "content3" },
  { img: Laptop, head: "Add Hospitals", text: "Submit verified hospitals to help others access healthcare.", pos: "content4" },
];

const reviews = [
  {
    text: "HospitoFind gave me more than directions. I could see hospital services, health news, and even daily health tips. It feels like having a healthcare guide in my pocket.",
    img: Reviewer2,
    name: "Oliver Ray",
  },
  {
    text: "While traveling abroad, HospitoFind helped me quickly locate hospitals in a new country. The map and distance area made it stress free to get care when I needed it most.",
    img: Reviewer7,
    name: "Abena A.",
  },
  {
    text: "I love that I can contribute by adding verified hospitals. Knowing my input helps others find trusted care makes me feel part of a global community.",
    img: Reviewer4,
    name: "Emeka O.",
  },
  {
    text: "HospitoFind made it easy to save hospitals I liked and revisit them later. I created an account to track my searches, download lists, and share options with my sister while planning her surgery abroad. It’s intuitive and genuinely helpful.",
    img: Reviewer9,
    name: "Elena Marquez",
  },
  {
    text: "The ‘recently viewed’ feature saved me time. I didn’t have to repeat searches. I could quickly go back to hospitals I had checked earlier and finalize my choice.",
    img: Reviewer10,
    name: "Amira Solano",
  },
  {
    text: "Creating an account on HospitoFind made a huge difference. I can save hospitals I trust, revisit my recently viewed ones, and keep everything organized without starting from scratch each time.",
    img: Reviewer1,
    name: "Jamie",
  },
  {
    text: "After moving to a new city, HospitoFind made it simple to find reputable hospitals. A lifesaver for new settlers.",
    img: Reviewer6,
    name: "Khadija",
  },
  {
    text: "The outbreak alerts kept me informed during a health scare in my city. HospitoFind isn’t just about finding hospitals — it’s about staying safe and prepared.",
    img: Reviewer8,
    name: "Bolu Adeboye",
  },
  {
    text: "HospitoFind helped me locate the nearest hospital while traveling, the directions and results were spot on!",
    img: Reviewer11,
    name: "Rebecca T.",
  },
  {
    text: "HospitoFind helped me compare hospitals based on services and distance, which made choosing the right one easy. I also appreciate the health tips, they’re practical and relevant to my daily life.",
    img: Reviewer3,
    name: "Priya S.",
  },
  {
    text: "Adding a hospital myself felt empowering. Knowing that my contribution helps others in my community access verified care makes me proud to be part of the network.",
    img: Reviewer12,
    name: "Leila",
  },
  {
    text: "HospitoFind keeps me updated with outbreak alerts and health news that matter in my region. Knowing I can rely on accurate information while also finding hospitals nearby gives me peace of mind every day.",
    img: Reviewer5,
    name: "Thandiwe N.",
  },
];

export default About;
import { BsGlobe2 } from "react-icons/bs";
import { useEffect, useState } from "react";
import { FaNotesMedical, FaMapMarkedAlt, FaRegNewspaper } from "react-icons/fa";
import { MdStarBorderPurple500 } from "react-icons/md";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import style from "./style/about.module.css";
import Header from "@/layouts/header/nav";
import Footer from "@/layouts/footer/footer";
import Motion from "@/components/motion";
import { fadeUp, slideLeft, slideRight, zoomIn, sectionReveal } from "@/hooks/animations";
import { Avatar } from "@/components/avatar";
import NursesAndPatient from "@/assets/images/hero2.png";
import Stethoscope from "@/assets/images/stethoscope.jpg";
import Handset from "@/assets/images/handset.jpg";
import Laptop from "@/assets/images/laptop.jpg";
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
import { SEOHelmet } from "@/components/utils/seoUtils";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const About = () => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/hospitals/count`);
        const data = await res.json();
        setCount(data.total);
      } catch {
        setCount(null);
      }
    })();
  }, []);

  return (
    <>
      <SEOHelmet
        title="About Hospital Finder"
        description="HospitoFind is a trusted hospital finder and healthcare directory connecting users with verified medical facilities worldwide. Learn more about our mission to provide easy access to healthcare information and services."
        canonical="https://hospitofind.online/about"
        schemaType="about"
        schemaData={[]}
        autoBreadcrumbs={true}
      />

      <Header />

      <main className={style.bg}>
        {/*  Hero Section */}
        <Motion className={style.wrapper} variants={fadeUp} as="section">
          <div className={style.top}>
            <h1 className={style.title}>
              About <span className={style.span}>HospitoFind</span>
            </h1>
            <p className={style.para}>
              HospitoFind is a global hospital search platform designed to help users quickly find verified hospitals, clinics, and emergency medical centers anywhere in the world. Whether you're looking for hospitals near you, browsing by city or country, or searching for a specific healthcare facility, HospitoFind makes the process fast and reliable.
              We provide detailed hospital profiles and location to ensure you always have the best information when making health decisions.
            </p>
            <p className={style.gradient}>
              {count !== null
                ? `Explore our growing directory of over ${count.toLocaleString()} hospitals worldwide - your trusted gateway to reliable, accessible healthcare anywhere you go.` : "Loading hospital statistics…"}
            </p>

            <Link to="/dashboard" className={style.ctaLink}>
              Get Started
            </Link>
          </div>

          <div className={style.img}>
            <motion.div variants={slideLeft} className={style.img_1}>
              <Avatar
                image={PhoneMap}
                alt="Person using HospitoFind on a smartphone to find nearby healthcare locations"
                style={{ width: "100%", height: "100%", borderRadius: "1rem", objectFit: "cover" }}
              />
            </motion.div>
            <motion.div variants={slideRight} className={style.img_2}>
              <Avatar
                image={NursesAndPatient}
                alt="Healthcare professionals supporting an older adult in a hospital corridor"
                style={{ width: "100%", height: "100%", borderRadius: "1rem", objectFit: "cover" }}
              />
            </motion.div>
          </div>
        </Motion>

        {/* Feature Boxes */}
        <Motion className={style.wrapper2} variants={sectionReveal} as="section" once={false}>
          <div className={style.container}>
            {[
              {
                icon: <FaNotesMedical />,
                title: "Hospital Insights",
                text: "Access detailed hospital profiles including services, location and contact information etc.",
              },
              {
                icon: <FaMapMarkedAlt />,
                title: "Interactive Maps",
                text: "View hospitals on a map, check distances, and get directions instantly.",
              },
              {
                icon: <BsGlobe2 />,
                title: "Global Atlas",
                text: "Explore hospitals grouped by country, giving you a worldwide perspective on healthcare access.",
              },
              {
                icon: <FaRegNewspaper />,
                title: "Health Updates",
                text: "Read global health news, outbreak alerts and daily wellness tips right inside the platform.",
              },
            ].map((item, i) => (
              <motion.div key={i} className={style.box} variants={fadeUp}>
                <div className={style.icon_box}>{item.icon}</div>
                <div className={style.box2}>
                  <h2 className={style.title}>{item.title}</h2>
                  <p className={style.subtitle}>{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/*  How It Works */}
          <div className={style.semiCircle_bg}>
            <div className={`${style.semiCircle} ${style.one}`}></div>
            <div className={`${style.semiCircle} ${style.two}`}></div>
            <div className={`${style.semiCircle} ${style.three}`}></div>

            <h2 className={style.heading}>How It Works</h2>

            <div className={style.content}>
              {[
                {
                  img: Search,
                  head: "Find Hospitals",
                  text: "Use our smart search to quickly discover hospitals near you, complete with essential details like services and contact information.",
                  pos: "content1",
                },
                {
                  img: Stethoscope,
                  head: "Sign Up / Login",
                  text: "Create an account to save searches, track favorite hospitals and access advanced tools tailored to your needs.",
                  pos: "content2",
                },
                {
                  img: Handset,
                  head: "Export or Share",
                  text: "Download hospital lists for future reference or share them securely with friends, family and caregivers.",
                  pos: "content3",
                },
                {
                  img: Laptop,
                  head: "Add Hospitals",
                  text: "Submit verified hospitals to strengthen our growing database and help others access healthcare.",
                  pos: "content4",
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  className={`${style.item} ${style[step.pos]}`}
                  variants={zoomIn}
                >
                  <Avatar
                    image={step.img}
                    alt={step.head}
                    style={{ width: "7rem", height: "7rem", borderRadius: "50%" }}
                  />
                  <h3 className={style.head}>{step.head}</h3>
                  <p className={style.text}>{step.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Motion>

        {/*  Testimonials */}
        <Motion className={style.review} variants={sectionReveal} as="section" once={false}>
          <h2 className={style.review_title}>
            <span className={style.review_title_span}></span>Voices from Our Community
          </h2>
          <h3 className={style.review_subtitle}>Real experiences from people whose healthcare journey was made easier with HospitoFind</h3>
          <div className={style.review_container}>
            {[
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
            ].map((review, i) => (
              <motion.div key={i} className={style.review_box} variants={fadeUp}>
                <p className={style.review_text}>{review.text}</p>
                <div className={style.star}>
                  {[...Array(5)].map((_, j) => (
                    <MdStarBorderPurple500 key={j} className={style.star_icon} />
                  ))}
                </div>
                <figure className={style.user}>
                  <Avatar
                    image={review.img}
                    alt={`Photo of ${review.name}`}
                    style={{ width: "3.5rem", height: "3.5rem", borderRadius: "50%" }}
                  />
                  <figcaption className={style.name}>{review.name}</figcaption>
                </figure>
              </motion.div>
            ))}
          </div>
        </Motion>
      </main>

      <Footer />
    </>
  );
};

export default About;
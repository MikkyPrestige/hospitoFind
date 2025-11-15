import { BsHospital, BsBuildingAdd } from "react-icons/bs";
import { useEffect, useState } from "react";
import { FaFileExport } from "react-icons/fa";
import { SlShareAlt } from "react-icons/sl";
import { MdStarBorderPurple500 } from "react-icons/md";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import style from "./style/about.module.css";
import Header from "@/layouts/header/nav";
import Footer from "@/layouts/footer/footer";
import Motion from "@/components/motion";
import { fadeUp, slideLeft, slideRight, zoomIn, sectionReveal } from "@/hooks/animations";
import { Avatar } from "@/components/avatar";
import Doctor from "@/assets/images/hero2.png";
import Stethoscope from "@/assets/images/stethoscope.jpg";
import Handset from "@/assets/images/handset.jpg";
import Laptop from "@/assets/images/laptop.jpg";
import Search from "@/assets/images/hospitalSearch.png";
import Reviewer1 from "@/assets/images/reviewer1.jpg";
import Reviewer2 from "@/assets/images/reviewer2.jpg";
import Reviewer3 from "@/assets/images/reviewer3.jpg";
import Patient from "@/assets/images/phone.jpg";
import { Button } from "@/components/button";

const BASE_URL =  import.meta.env.VITE_BASE_URL;

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
      <Helmet>
        <title>About | HospitoFind</title>
        <meta
          name="description"
          content="Learn more about HospitoFind and how we make hospital search easier for everyone."
        />
        <meta
          name="keywords"
          content="hospitofind, hospital finder, healthcare, find hospitals, medical search"
        />
      </Helmet>

      <Header />

      <section className={style.bg}>
        {/* 🩺 Hero Section */}
        <Motion className={style.wrapper} variants={fadeUp} as="section">
          <div className={style.top}>
            <h1 className={style.title}>
              About <span className={style.span}>HospitoFind</span>
            </h1>
            <p className={style.para}>
              We believe healthcare access shouldn’t be a hassle. In many parts of the world, especially in developing regions, finding a nearby hospital or clinic can be a stressful and frustrating task. We're here to change that. HospitoFind provides a simple, trustworthy platform to help you locate hospitals, learn about their services, and access essential contact information.
            </p>
            <p className={style.gradient}>
              {count !== null
                ? `Today, HospitoFind lists over ${count.toLocaleString()} hospitals across multiple countries — and growing!.`
                : "Loading hospital statistics…"}
            </p>

            <Button
              children={
                <span className={style.cta}>
                  <Link to="/dashboard">Explore Services</Link>
                </span>
              }
            />
          </div>

          <div className={style.img}>
            <motion.div variants={slideLeft} className={style.img_1}>
              <Avatar
                image={Patient}
                alt="Patient"
                style={{ width: "100%", height: "100%", borderRadius: "1rem", objectFit: "cover" }}
              />
            </motion.div>
            <motion.div variants={slideRight} className={style.img_2}>
              <Avatar
                image={Doctor}
                alt="Doctor with patient"
                style={{ width: "100%", height: "100%", borderRadius: "1rem", objectFit: "cover" }}
              />
            </motion.div>
          </div>
        </Motion>

        {/* 🧭 Feature Boxes */}
        <Motion className={style.wrapper2} variants={sectionReveal} as="section" once={false}>
          <div className={style.container}>
            {[
              {
                icon: <BsHospital />,
                title: "Search Hospitals",
                text: "Easily locate the best hospitals near you by name or area.",
              },
              {
                icon: <FaFileExport />,
                title: "Export Results",
                text: "Save your search results as a CSV file for future reference.",
              },
              {
                icon: <SlShareAlt />,
                title: "Share with Others",
                text: "Share hospital lists via a secure link with your friends or family.",
              },
              {
                icon: <BsBuildingAdd />,
                title: "Add a Hospital",
                text: "Contribute by adding verified hospitals to our growing network.",
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

          {/* 💡 How It Works */}
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
                  text: "Use our intelligent search to locate top-rated hospitals near you.",
                  pos: "content1",
                },
                {
                  img: Stethoscope,
                  head: "Sign Up / Login",
                  text: "Create a free account to access advanced search and personalization.",
                  pos: "content2",
                },
                {
                  img: Handset,
                  head: "Export or Share",
                  text: "Easily download hospital data or share it instantly with others.",
                  pos: "content3",
                },
                {
                  img: Laptop,
                  head: "Add Hospitals",
                  text: "Add verified hospitals to improve accuracy and help others find care.",
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

        {/* 💬 Testimonials */}
        <Motion className={style.review} variants={sectionReveal} as="section" once={false}>
          <h2 className={style.review_title}>
            <span className={style.review_title_span}></span>Testimonials
          </h2>
          <h3 className={style.review_subtitle}>What Our Users Say</h3>
          <div className={style.review_container}>
            {[
              {
                text: "Finding the right hospital has never been easier. The platform is intuitive and gave me all the info I needed quickly!",
                img: Reviewer1,
                name: "Sarah M.",
              },
              {
                text: "HospitoFind helped me locate the nearest hospital while traveling — the directions and results were spot on!",
                img: Reviewer2,
                name: "John D.",
              },
              {
                text: "After moving to a new city, HospitoFind made it simple to find reputable hospitals. A lifesaver for newcomers.",
                img: Reviewer3,
                name: "Emily T.",
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
                    alt={review.name}
                    style={{ width: "3.5rem", height: "3.5rem", borderRadius: "50%" }}
                  />
                  <figcaption className={style.name}>{review.name}</figcaption>
                </figure>
              </motion.div>
            ))}
          </div>
        </Motion>
      </section>

      <Footer />
    </>
  );
};

export default About;
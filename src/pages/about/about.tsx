import { BsHospital, BsBuildingAdd } from "react-icons/bs";
import { FaFileExport } from "react-icons/fa";
import { SlShareAlt } from "react-icons/sl";
import { MdStarBorderPurple500 } from "react-icons/md";
import style from "./style/about.module.css";
import { Avatar } from "@/components/avatar";
import Doctor from "@/assets/images/patient-doctor.jpg";
import Stethoscope from "@/assets/images/stethoscope.jpg";
import Handset from "@/assets/images/handset.jpg";
import Laptop from "@/assets/images/laptop.jpg";
import Search from "@/assets/images/hospitalSearch.png";
import Reviewer1 from "@/assets/images/reviewer1.jpg";
import Reviewer2 from "@/assets/images/reviewer2.jpg";
import Reviewer3 from "@/assets/images/reviewer3.jpg";
import Patient from "@/assets/images/patient.jpg";
import { Button } from "@/components/button";
import Header from "@/layouts/header/nav";
import Footer from "@/layouts/footer/footer";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About | HospitoFind</title>
        <meta name="description" content="Learn more about HospitoFind and how we make hospital search easier for everyone." />
        <meta name="keywords" content="hospitofind, hospital finder, healthcare, find hospitals, medical search" />
      </Helmet>

      <Header />

      <section className={style.bg}>
        <section className={style.wrapper}>
          <div className={style.top}>
            <h1 className={style.title}>
              Welcome to <span className={style.span}>HospitoFind</span>
            </h1>
            <p className={style.para}>
              HospitoFind helps you locate hospitals in your area, explore medical services, and
              connect with trusted healthcare providers — making access to care simpler and faster.
            </p>
            <Button
              children={
                <span className={style.cta}>
                  <Link to="/find">Explore Services</Link>
                </span>
              }
            />
          </div>

          <div className={style.img}>
            <div className={style.img_1}>
              <Avatar image={Patient} alt="Patient" style={{ width: "100%", height: "100%", borderRadius: "1rem" }} />
            </div>
            <div className={style.img_2}>
              <Avatar image={Doctor} alt="Doctor with patient" style={{ width: "100%", height: "100%", borderRadius: "1rem" }} />
            </div>
          </div>
        </section>

        <section className={style.wrapper2}>
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
              <div key={i} className={style.box}>
                <div className={style.icon_box}>{item.icon}</div>
                <div className={style.box2}>
                  <h2 className={style.title}>{item.title}</h2>
                  <p className={style.subtitle}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>

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
                  arrow: "arrow1",
                  pos: "content1",
                },
                {
                  img: Stethoscope,
                  head: "Sign Up / Login",
                  text: "Create a free account to access advanced search and personalization.",
                  arrow: "arrow2",
                  pos: "content2",
                },
                {
                  img: Handset,
                  head: "Export or Share",
                  text: "Easily download hospital data or share it instantly with others.",
                  arrow: "arrow3",
                  pos: "content3",
                },
                {
                  img: Laptop,
                  head: "Add Hospitals",
                  text: "Add verified hospitals to improve accuracy and help others find care.",
                  pos: "content4",
                },
              ].map((step, i) => (
                <div key={i} className={`${style.item} ${style[step.pos]}`}>
                  <Avatar image={step.img} alt={step.head} style={{ width: "7rem", height: "7rem", borderRadius: "50%" }} />
                  <h3 className={style.head}>{step.head}</h3>
                  <p className={style.text}>{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={style.review}>
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
              <div key={i} className={style.review_box}>
                <p className={style.review_text}>{review.text}</p>
                <div className={style.star}>
                  {[...Array(5)].map((_, i) => (
                    <MdStarBorderPurple500 key={i} className={style.star_icon} />
                  ))}
                </div>
                <figure className={style.user}>
                  <Avatar image={review.img} alt={review.name} style={{ width: "3.5rem", height: "3.5rem", borderRadius: "50%" }} />
                  <figcaption className={style.name}>{review.name}</figcaption>
                </figure>
              </div>
            ))}
          </div>
        </section>
      </section>

      <Footer />
    </>
  );
};

export default About;
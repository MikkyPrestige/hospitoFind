import { Link } from "react-router-dom"
import { BsArrowRightShort, BsSearchHeart } from "react-icons/bs"
import { TfiLocationPin } from "react-icons/tfi"
import { Avatar } from "@/components/avatar"
import Image from "@/assets/images/doctor-patient.jpg";
import { Button } from "@/components/button"
import style from "./style/home.module.css"
import Header from "@/layouts/header/nav";
import Footer from "@/layouts/footer/footer";
import { Helmet } from "react-helmet-async";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Home | Hospital Finder</title>
        <meta name="description" content="Find the nearest hospital to you" />
        <meta name="keywords" content="hospital, doctor, appointment, health, care, medical, clinic, find, search, nearby, nearest" />
      </Helmet>
      <Header />
      <section className={style.bg}>
        <div className={style.wrapper}>
          <div className={style.container}>
            <div className={style.header}>
              <h1 className={style.title}>Find the nearest hospital to you and make an appointment</h1>
              <p className={style.subtitle}>Discover Your Perfect Care: Find Your Hospital, Anytime, Anywhere!</p>
            </div>
            <div className={style.cta}>
              <Button children={<Link to="/signup" className={style.btn}>GET STARTED</Link>} />
              <Link to="/about" className={style.link}>Learn more <BsArrowRightShort className={style.icon} /></Link>
            </div>
          </div>
          <div className={style.img}>
            <Avatar
              image={Image}
              alt="Doctor and patient"
              style={{ width: "100%", height: "100%", borderRadius: "3.125rem 0rem 0rem 3.125rem", boxShadow: "12px 12px 20px 0px rgba(14, 61, 183, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)", objectFit: "cover" }}
            />
          </div>
        </div>
        <div className={style.search}>
          <h2 className={style.heading}>Find a nearby hospital</h2>
          <label htmlFor="searchHospital" className={style.label}>
            <TfiLocationPin className={style.icon_location} />
            <input type="text" placeholder="Enter your location" className={style.input} disabled />
            <BsSearchHeart className={style.icon_search} />
          </label>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Home
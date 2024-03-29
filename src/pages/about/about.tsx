import { BsHospital, BsBuildingAdd } from "react-icons/bs"
import { FaFileExport } from "react-icons/fa"
import { SlShareAlt } from "react-icons/sl"
import { MdStarBorderPurple500 } from "react-icons/md"
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
        <title>About | Hospital Finder</title>
        <meta name="description" content="About HospitoFind" />
        <meta name="keywords" content="hospital, doctor, appointment, health, care, medical, clinic, find, search, nearby, nearest" />
      </Helmet>
      <Header />
      <section className={style.bg}>
        <section className={style.wrapper}>
          <div className={style.top}>
            <h1 className={style.title}>Welcome to <span className={style.span}>HospitoFind</span></h1>
            <p className={style.para}>HospitoFind is a platform where users can search for hospitals in their areas, export hospital details for your records and  enhance your healthcare experience by connecting with others and sharing valuable resources.</p>
            <Button children={<span className={style.cta}>
              <Link to="/find">OUR SERVICES</Link>
            </span>} />
          </div>
          <div className={style.img}>
            <div className={style.img_1}>
              <Avatar
                image={Patient}
                alt="Patient"
                style={{ width: "100%", height: "100%", borderRadius: "1rem" }}
              />
            </div>
            <div className={style.img_2}>
              <Avatar
                image={Doctor}
                alt="Doctor and patient"
                style={{ width: "100%", height: "100%", borderRadius: "1rem" }}
              />
            </div>
          </div>
        </section>
        <section className={style.wrapper2}>
          <div className={style.container}>
            <div className={style.box}>
              <div className={style.icon_box}>
                <BsHospital className={style.icon} />
              </div>
              <div className={style.box2}>
                <h2 className={style.title}>Search Hospital</h2>
                <p className={style.subtitle}>
                  Effortlessly Find the Best Hospitals Near You by entering your location or name of hospital you are looking for.
                </p>
              </div>
            </div>
            <div className={style.box}>
              <div className={style.icon_box}>
                <FaFileExport className={style.icon} />
              </div>
              <div className={style.box2}>
                <h2 className={style.title}>Export Hospital</h2>
                <p className={style.subtitle}>
                  Export the list of hospitals searched, for your records via CSV format.
                </p>
              </div>
            </div>
            <div className={style.box}>
              <div className={style.icon_box}>
                <SlShareAlt className={style.icon} />
              </div>
              <div className={style.box2}>
                <h2 className={style.title}>Share Hospital</h2>
                <p className={style.subtitle}>
                  Share the list of hospitals you searched with others by generating a shareable link.
                </p>
              </div>
            </div>
            <div className={style.box}>
              <div className={style.icon_box}>
                <BsBuildingAdd className={style.icon} />
              </div>
              <div className={style.box2}>
                <h2 className={style.title}>Add Hospital</h2>
                <p className={style.subtitle}>
                  Add a hospital to our database and help others find the best hospitals near them.
                </p>
              </div>
            </div>
          </div>
          <div className={style.semiCircle_bg}>
            <div className={`${style.semiCircle} ${style.one}`}>{""}</div>
            <div className={`${style.semiCircle} ${style.two}`}>{""}</div>
            <div className={`${style.semiCircle} ${style.three}`}>{""}</div>
            <h2 className={style.heading}>How It Works</h2>
            <div className={style.content}>
              <div className={`${style.item} ${style.content1}`}>
                <Avatar
                  image={Search}
                  alt="Search hospital"
                  style={{ width: "7rem", height: "7rem", borderRadius: "50%" }}
                />
                <h3 className={style.head}>Find Hospital</h3>
                <p className={style.text}>Find the best hospitals and doctors near you, our efficient search engine provides you with the best results.</p>
                <div className={`${style.arrow} ${style.arrow1}`}>
                  <div className={style.arrow_line}></div>
                  <div className={style.arrow_head}></div>
                </div>
              </div>
              <div className={`${style.item} ${style.content2}`}>
                <Avatar
                  image={Stethoscope}
                  alt="Stethoscope"
                  style={{ width: "7rem", height: "7rem", borderRadius: "50%" }}
                />
                <h3 className={style.head}>Sign up / Login</h3>
                <p className={style.text}>
                  Join our community to enjoy seamless access to all the features of our web app.
                </p>
                <div className={`${style.arrow} ${style.arrow2}`}>
                  <div className={style.arrow_line}></div>
                  <div className={style.arrow_head}></div>
                </div>
              </div>
              <div className={`${style.item} ${style.content3}`}>
                <Avatar
                  image={Handset}
                  alt="Handset"
                  style={{ width: "7rem", height: "7rem", borderRadius: "50%" }}
                />
                <h3 className={style.head}>Export or Share hospital</h3>
                <p className={style.text}>
                  Export the list of hospitals you searched for your records via CSV format or share the list of hospitals you searched with others via generating a shareable link.
                </p>
                <div className={`${style.arrow} ${style.arrow3}`}>
                  <div className={style.arrow_line}></div>
                  <div className={style.arrow_head}></div>
                </div>
              </div>
              <div className={`${style.item} ${style.content4}`}>
                <Avatar
                  image={Laptop}
                  alt="Laptop"
                  style={{ width: "7rem", height: "7rem", borderRadius: "50%" }}
                />
                <h3 className={style.head}>Add Hospitals</h3>
                <p className={style.text}>
                  Add a hospital to our database and help others find the best hospitals near them.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className={style.review}>
          <h2 className={style.review_title}><span className={style.review_title_span}>{""}</span> Testimonials</h2>
          <h3 className={style.review_subtitle}>What Our Users Say</h3>
          <div className={style.review_container}>
            <div className={style.review_box}>
              <p className={style.review_text}>Finding the right hospital has never been easier! With this website, I was able to locate a nearby hospital quickly and efficiently. The search feature is user-friendly, and it provided me with all the essential information I needed. Highly recommended</p>
              <div className={style.star}>
                <MdStarBorderPurple500 className={style.star_icon} />
                <MdStarBorderPurple500 className={style.star_icon} />
                <MdStarBorderPurple500 className={style.star_icon} />
                <MdStarBorderPurple500 className={style.star_icon} />
                <MdStarBorderPurple500 className={style.star_icon} />
              </div>
              <figure className={style.user}>
                <Avatar
                  image={Reviewer1}
                  alt="Reviewer"
                  style={{ width: "3.5rem", height: "3.5rem", borderRadius: "50%" }}
                />
                <figcaption className={style.name}>Sarah M.</figcaption>
              </figure>
            </div>
            <div className={style.review_box}>
              <p className={style.review_text}>I can't express how grateful I am for HospitoFind website. When i needed urgent medical care while traveling, it helped me locate the nearest hospital in a matter of  seconds. The accurate results and detailed directions saved me valuable time and ensured i received the care i needed</p>
              <div className={style.star}>
                <MdStarBorderPurple500 className={style.star_icon} />
                <MdStarBorderPurple500 className={style.star_icon} />
                <MdStarBorderPurple500 className={style.star_icon} />
                <MdStarBorderPurple500 className={style.star_icon} />
                <MdStarBorderPurple500 className={style.star_icon} />
              </div>
              <figure className={style.user}>
                <Avatar
                  image={Reviewer2}
                  alt="Reviewer"
                  style={{ width: "3.5rem", height: "3.5rem", borderRadius: "50%" }}
                />
                <figcaption className={style.name}>John D.</figcaption>
              </figure>
            </div>
            <div className={style.review_box}>
              <p className={style.review_text}>I recently moved to a new city and had no idea where to go for medical assistance, my friend shared me some hospital details using the HospitoFind website. It made my life easier, i was able to fine reputable hospitals near me effortlessly. The website’s is user friendly interface and comprehensive search gave me peace of mind. I highly recommend.</p>
              <div className={style.star}>
                <MdStarBorderPurple500 className={style.star_icon} />
                <MdStarBorderPurple500 className={style.star_icon} />
                <MdStarBorderPurple500 className={style.star_icon} />
                <MdStarBorderPurple500 className={style.star_icon} />
                <MdStarBorderPurple500 className={style.star_icon} />
              </div>
              <figure className={style.user}>
                <Avatar
                  image={Reviewer3}
                  alt="Reviewer"
                  style={{ width: "3.5rem", height: "3.5rem", borderRadius: "50%" }}
                />
                <figcaption className={style.name}>Emily T.</figcaption>
              </figure>
            </div>
          </div>
        </section>
      </section>
      <Footer />
    </>
  );
}

export default About;

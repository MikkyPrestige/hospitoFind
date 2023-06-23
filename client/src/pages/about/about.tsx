import { BsHospital } from "react-icons/bs"
import { FaFileExport } from "react-icons/fa"
import { SlShareAlt } from "react-icons/sl"
import { MdStarBorderPurple500 } from "react-icons/md"
import style from "./style/about.module.css";
import { Avatar } from "@/components/avatar";
import Doctor from "../../../public/images/patient-doctor.jpg";
import Stethoscope from "../../../public/images/stethoscope.jpg";
import Handset from "../../../public/images/handset.jpg";
import Laptop from "../../../public/images/laptop.jpg";
import Women from "../../../public/images/women.jpg";
import Reviewer1 from "../../../public/images/reviewer1.jpg";
import Reviewer2 from "../../../public/images/reviewer2.jpg";
import Reviewer3 from "../../../public/images/reviewer3.jpg";
import Patient from "../../../public/images/patient.jpg";
import { Button } from "@/components/button";
import Header from "@/layouts/header/nav";
import Footer from "@/layouts/footer/footer";

const About = () => {
  const semiCircleOne = `${style.semiCircle} ${style.one}`;
  const semiCircleTwo = `${style.semiCircle} ${style.two}`;
  const semiCircleThree = `${style.semiCircle} ${style.three}`;

  const item1 = `${style.item} ${style.content1}`;
  const item2 = `${style.item} ${style.content2}`;
  const item3 = `${style.item} ${style.content3}`;
  const item4 = `${style.item} ${style.content4}`;

  const arrow1 = `${style.arrow} ${style.arrow1}`;
  const arrow2 = `${style.arrow} ${style.arrow2}`;
  const arrow3 = `${style.arrow} ${style.arrow3}`;

  return (
    <>
      <Header />
      <section className={style.bg}>
        <section className={style.wrapper}>
          <div className={style.top}>
            <h1 className={style.title}>Welcome to <span className={style.span}>CareFinder</span></h1>
            <p className={style.para}>Carefinder is a platform where users can search for hospitals in their areas, export hospital details for your records and  enhance your healthcare experience by connecting with others and sharing valuable resources.</p>
            <Button children={<span className={style.cta}>OUR SERVICES</span>} />
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
        <div className={style.container}>
          <div className={style.box}>
            <div className={style.icon_box}>
              <BsHospital className={style.icon} />
            </div>
            <div className={style.box2}>
              <h2 className={style.title}>Search Doctors</h2>
              <p className={style.subtitle}>Effortlessly Find the Best Hospitals Near You</p>
            </div>
          </div>
          <div className={style.box}>
            <div className={style.icon_box}>
              <FaFileExport className={style.icon} />
            </div>
            <div className={style.box2}>
              <h2 className={style.title}>Export Hospitals</h2>
              <p className={style.subtitle}>Save list of hospitals.</p>
            </div>
          </div>
          <div className={style.box}>
            <div className={style.icon_box}>
              <SlShareAlt className={style.icon} />
            </div>
            <div className={style.box2}>
              <h2 className={style.title}>Share Hospitals</h2>
              <p className={style.subtitle}>Share the list of hospitals with others.</p>
            </div>
          </div>
        </div>
        <section className={style.semiCircle_bg}>
          <div className={semiCircleOne}>{""}</div>
          <div className={semiCircleTwo}>{""}</div>
          <div className={semiCircleThree}>{""}</div>
          <h2 className={style.heading}>How It Works</h2>
          <div className={style.content}>
            <div className={item1}>
              <Avatar
                image={Stethoscope}
                alt="Stethoscope"
                style={{ width: "7rem", height: "7rem", borderRadius: "50%" }}
              />
              <h3 className={style.head}>Find Hospital</h3>
              <p className={style.text}>Find the best hospitals and doctors near you, our efficient search engine provides you with the best results.</p>
              <div className={arrow1}>
                <div className={style.arrow_line}></div>
                <div className={style.arrow_head}></div>
              </div>
            </div>
            <div className={item2}>
              <Avatar
                image={Handset}
                alt="Handset"
                style={{ width: "7rem", height: "7rem", borderRadius: "50%" }}
              />
              <h3 className={style.head}>Save or share hospital</h3>
              <p className={style.text}>Carefinder allows users to save and share the list of hospitals with others. Users can share the information via email or by generating a shareable link.</p>
              <div className={arrow2}>
                <div className={style.arrow_line}></div>
                <div className={style.arrow_head}></div>
              </div>
            </div>
            <div className={item3}>
              <Avatar
                image={Laptop}
                alt="Laptop"
                style={{ width: "7rem", height: "7rem", borderRadius: "50%" }}
              />
              <h3 className={style.head}>Book Appointment</h3>
              <p className={style.text}>Book appointments easily by inputting correct details.</p>
              <div className={arrow3}>
                <div className={style.arrow_line}></div>
                <div className={style.arrow_head}></div>
              </div>
            </div>
            <div className={item4}>
              <Avatar
                image={Women}
                alt="Woman doctor and patient"
                style={{ width: "7rem", height: "7rem", borderRadius: "50%" }}
              />
              <h3 className={style.head}>Make a visit</h3>
              <p className={style.text}>Appointment confirmed, then make a visit to your selected hospital or doctor</p>
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
              <p className={style.review_text}>I can't express how grateful I am for Carefinder website. When i needed urgent medical care while traveling, it helped me locate the nearest hospital in a matter of  seconds. The accurate results and detailed directions saved me valuable time and ensured i received the care i needed</p>
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
              <p className={style.review_text}>I recently moved to a new city and had no idea where to go for medical assistance, my friend shared me some hospital details using the carefinder website. It made my life easier, i was able to fine reputable hospitals near me effortlessly. The website’s is user friendly interface and comprehensive search gave me peace of mind. I highly recommend.</p>
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

import { Link } from "react-router-dom";
import { BsHospital } from "react-icons/bs"
import { FaFileExport } from "react-icons/fa"
import { SlShareAlt } from "react-icons/sl"
import { MdStarBorderPurple500 } from "react-icons/md"
import style from "./style/about.module.css";
import { Avatar } from "@/components/avatar";
import Doctor from "@/assets/images/patient-doctor.jpg";
import Patient from "@/assets/images/patient.jpg";
import Stethoscope from "@/assets/images/stethoscope.jpg";
import Handset from "@/assets/images/handset.jpg";
import Laptop from "@/assets/images/laptop.jpg";
import Women from "@/assets/images/women.jpg";
import Reviewer1 from "@/assets/images/reviewer1.jpg";
import Reviewer2 from "@/assets/images/reviewer2.jpg";
import Reviewer3 from "@/assets/images/reviewer3.jpg";
import { Button } from "@/components/button";

export const About = () => {

  return (
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
      <div>
        <div>
          <div>
            <BsHospital />
          </div>
          <div>
            <h2>Search Doctors</h2>
            <p>Effortlessly Find the Best Hospitals Near You</p>
          </div>
        </div>
        <div>
          <div>
            <FaFileExport />
          </div>
          <div>
            <h2>Export Hospitals</h2>
            <p>Save list of hospitals.</p>
          </div>
        </div>
        <div>
          <div>
            <SlShareAlt />
          </div>
          <div>
            <h2>Share Hospitals</h2>
            <p>Share the list of hospitals with others.</p>
          </div>
        </div>
      </div>
      <section>
        <h2>How It Works</h2>
      </section>
    </section>
  )
}
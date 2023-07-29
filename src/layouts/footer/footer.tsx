import { Link } from "react-router-dom";
import Logo from "@/assets/images/logo.svg";
import { Avatar } from "@/components/avatar";
import style from "./style/footer.module.css";

const Footer = () => {
  return (
    <section className={style.footer}>
      <div className={style.box1}>
        <Link to="/" className={style.logo}>
          <Avatar
            image={Logo}
            alt="logo"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Link>
      </div>
      <div className={style.box2}>
        <div className={style.content}>
          <h2 className={style.heading}>About Us</h2>
          <Link to="/about" className={style.link}>News & Media</Link>
          <Link to="mailto: michaelelue117@gmail.com" className={style.link}>Contact Us</Link>
        </div>
        <div className={style.content}>
          <h2 className={style.heading}>Quick Links</h2>
          <Link to="/dashboard" className={style.link}>My account</Link>
          <Link to="/find" className={style.link}>Find Hospital</Link>
        </div>
      </div>
    </section>
  )
}

export default Footer
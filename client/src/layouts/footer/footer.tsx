import { Link } from "react-router-dom";
import style from "./style/footer.module.css";

export const Footer = () => {
  return (
    <section className={style.footer}>
      <div className={style.box1}>
        <h1 className={style.heading}>CareFinder</h1>
        <p className={style.link}>Core Area</p>
        <Link to="tel: +2348030849685" className={style.link}>+234 803 0849 685</Link>
      </div>
      <div className={style.box2}>
        <div>
          <h2 className={style.heading}>About Us</h2>
          <Link to="/about" className={style.link}>News & Media</Link>
          <Link to="/contact" className={style.link}>Contact Us</Link>
        </div>
        <div>
          <h2 className={style.heading}>Quick Links</h2>
          <Link to="/account" className={style.link}> My account</Link>
          <Link to="/library" className={style.link}>Library</Link>
        </div>
      </div>
    </section>
  )
}
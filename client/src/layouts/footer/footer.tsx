import { Link } from "react-router-dom";
import style from "./style/footer.module.css";

export const Footer = () => {
  return (
    <section className={style.footer}>
      <div className={style.box1}>
        <h1 className={style.heading}>CareFinder</h1>
        <p className={style.text}>Core Area
          <br />
          <a href="tel: +2348030849685">+234 803 0849 685</a>
        </p>
      </div>
      <div className={style.box2}>
        <div>
          <h2 className={style.heading}>
            <Link to="/about">About Us</Link>
          </h2>
          <p className={style.text}>News & Media</p>
          <Link to="/contact" className={style.text}>Contact Us</Link>
        </div>
        <div>
          <h2 className={style.heading}>Quick Links</h2>
          <Link to="/account" className={style.text}> My account</Link> <br />
          <Link to="/library" className={style.text}>Library</Link>
        </div>
      </div>
    </section>
  )
}
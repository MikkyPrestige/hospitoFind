import { Link } from "react-router-dom";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";
import style from "./style/footer.module.scss";
import Motion from "@/components/motion";
import { fadeUp, sectionReveal } from "@/hooks/animations";

const Footer = () => {
  return (
    <Motion as="footer" variants={sectionReveal} className={style.footer}>
      <Motion variants={fadeUp} className={style.newsletter}>
        <h2 className={style.newsTitle}>Stay in the loop</h2>
        <p className={style.newsText}>
          Get updates about new hospitals, services and health tips.
        </p>
        <form
          className={style.newsForm}
          onSubmit={(e) => {
            e.preventDefault();
            alert("Coming soon: Newsletter subscription feature!");
          }}
        >
          <input
            type="email"
            placeholder="Enter your email address"
            className={style.newsInput}
            disabled
          />
          <button type="submit" className={style.newsButton} disabled>
            Subscribe
          </button>
        </form>
        <small className={style.note}>Coming soon</small>
      </Motion>

      <Motion variants={fadeUp} className={style.top}>
        <div className={style.brand}>
          <p className={style.about}>
            HospitoFind connects you with trusted hospitals and healthcare providers near you.
          </p>
          <p className={style.tagline}>
            Making healthcare simple, reliable, and accessible — one search at a time.
          </p>
          <div className={style.socials}>
            <a
              href="https://www.linkedin.com/company/prestigeenigma"
              target="_blank"
              rel="noreferrer"
              aria-label="HospitoFind on LinkedIn"
              className={style.socialIcon}
            >
              <FaLinkedin aria-hidden="true" />
            </a>
            <a
              href="mailto:hospitofind@outlook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="HospitoFind via Email"
              className={style.socialIcon}
            >
              <FaEnvelope aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className={style.links}>
          <div className={style.column}>
            <h2>Discover</h2>
            <Link to="/about">Our Mission</Link>
            <Link to="/country">Hospital Directory</Link>
          </div>

          <div className={style.column}>
            <h2>Information</h2>
            <Link to="/faq">FAQ</Link>
            <Link to="/policy">Privacy Policy</Link>
          </div>
        </div>
      </Motion>

      <Motion variants={fadeUp} className={style.bottom}>
        <p>© {new Date().getFullYear()} HospitoFind. All rights reserved.</p>
        <p>
          Built with ❤️ Connecting you to better care.
        </p>
      </Motion>
    </Motion >
  );
};

export default Footer;
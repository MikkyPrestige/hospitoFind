import { Link } from "react-router-dom";
import { FaLinkedin, FaEnvelope, FaTwitter, FaCopyright } from "react-icons/fa";
import { Heart, ArrowRight, ShieldCheck, Mail } from "lucide-react";
import Motion from "@/components/ui/Motion";
import { fadeUp, sectionReveal } from "@/utils/animations";
import BrandLogo from "@/assets/images/logo.svg";
import style from "./styles/scss/footer.module.scss";

const Footer = () => {
  return (
    <Motion as="footer" variants={sectionReveal} className={style.footer}>
      <div className={style.ctaWrapper}>
        <Motion variants={fadeUp} className={style.ctaBar}>
          <div className={style.ctaContent}>
            <h2>Better healthcare starts here.</h2>
            <p>Join thousands of patients finding verified care globally.</p>
          </div>
          <div className={style.ctaActions}>
            <Link to="/signup" className={style.ctaButton}>
              Get Started <ArrowRight size={18} />
            </Link>
          </div>
        </Motion>
      </div>

      <div className={style.container}>
        <div className={style.mainGrid}>
          <div className={style.brandCol}>
            <div className={style.brandColContent}>
              <Link to="/" className={style.logoLink}>
                <img src={BrandLogo} alt="HospitoFind" className={style.brandLogo} />
              </Link>
              <p className={style.brandDesc}>
                Connecting patients with world-class medical facilities through transparency,
                technology, and trust.
              </p>
            </div>
            <div className={style.socialRow}>
              <a href="https://www.linkedin.com/company/findhospital/" target="_blank" rel="noreferrer"  aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="mailto:hospitofind@outlook.com" aria-label="Email"><FaEnvelope /></a>
            </div>
          </div>

          <div className={style.linkGroup}>
            <div className={style.linkCol}>
              <h3>Platform</h3>
              <Link to="/directory">Browse Hospitals</Link>
              <Link to="/find-hospital">Find Care Near Me</Link>
              <Link to="/dashboard">Medical Specialists</Link>
            </div>

            <div className={style.linkCol}>
              <h3>Resources</h3>
              <Link to="/health-news">Medical News</Link>
              <Link to="/disease-outbreaks">Outbreak Radar</Link>
              <Link to="/health-tips">Wellness Guides</Link>
            </div>

            <div className={style.linkCol}>
              <h3>Company</h3>
              <Link to="/about">Our Mission</Link>
              <Link to="/faq">Help Center</Link>
              <Link to="/about">Contact Us</Link>
            </div>
          </div>

          <div className={style.newsletterCol}>
            <h3>Stay Updated</h3>
            <p>Get the latest health insights delivered to your inbox.</p>
            <form className={style.subscribeForm} onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" />
              <button type="submit" aria-label="Subscribe">
                <Mail size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className={style.bottomBar}>
          <div className={style.legalLinks}>
            <p><FaCopyright />  {new Date().getFullYear()} HospitoFind Inc.</p>
            <span className={style.divider}>|</span>
            <Link to="/policy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
          <div className={style.security}>
            <ShieldCheck size={16} /> <span>SSL Secured Directory</span>
          </div>
          <div className={style.credit}>
            Built with <Heart size={14} className={style.heartIcon} /> for a healthier life.
          </div>
        </div>
      </div>
    </Motion>
  );
};

export default Footer;
import { Link } from "react-router-dom";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";
import { Heart, Newspaper, Flame, Lightbulb, ArrowRight, ShieldCheck, MapPin, Building2, Target, HelpCircle, FileText } from "lucide-react";
import style from "./style/footer.module.scss";
import Motion from "@/components/motion";
import { fadeUp, sectionReveal } from "@/hooks/animations";
import BrandLogo from "@/assets/images/logo.svg"

const Footer = () => {
  return (
    <Motion as="footer" variants={sectionReveal} className={style.footer}>
      <Motion variants={fadeUp} className={style.ctaBar}>
        <div className={style.ctaContent}>
          <div className={style.ctaText}>
            <h2>World-Class Healthcare is Just a Click Away</h2>
            <p>Join thousands of patients using HospitoFind to connect with verified medical facilities and specialists globally.</p>
          </div>
          <Link to="/signup" className={style.ctaButton}>
            Get Started Now <ArrowRight size={18} />
          </Link>
        </div>
      </Motion>

      <Motion variants={fadeUp} className={style.mainGrid}>
        <div className={style.brandCol}>
          <Link to="/" className={style.logoLink}>
            <img src={BrandLogo} alt="HospitoFind" className={style.brandLogo} />
          </Link>
          <div className={style.socialRow}>
            <a href="https://www.linkedin.com/company/findhospital/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="mailto:hospitofind@outlook.com" aria-label="Email">
              <FaEnvelope />
            </a>
          </div>
        </div>

        <div className={style.linkGroup}>
          <div className={style.linkCol}>
            <h3>Company</h3>
            <Link to="/about"><Target size={16} className={style.inlineIcon} /> Our Mission</Link>
            <Link to="/directory"><Building2 size={16} className={style.inlineIcon} /> Browse Hospitals</Link>
            <Link to="/find-hospital"><MapPin size={16} className={style.inlineIcon} /> Find Care Near Me</Link>
          </div>

          <div className={style.linkCol}>
            <h3>Resources</h3>
            <Link to="/health-news"><Newspaper size={16} className={style.inlineIcon} /> Medical News</Link>
            <Link to="/disease-outbreaks"><Flame size={16} className={style.inlineIcon} /> Outbreak Radar</Link>
            <Link to="/health-tips"><Lightbulb size={16} className={style.inlineIcon} /> Wellness Guides</Link>
          </div>

          <div className={style.linkCol}>
            <h3>Safety</h3>
            <Link to="/faq"><HelpCircle size={16} className={style.inlineIcon} /> FAQ</Link>
            <Link to="/policy"><ShieldCheck size={16} className={style.inlineIcon} /> Privacy Policy</Link>
            <Link to="/terms"><FileText size={16} className={style.inlineIcon} /> Terms of Service</Link>
          </div>
        </div>
      </Motion>

      <div className={style.bottomBar}>
        <div className={style.copyright}>
          <p>&copy; {new Date().getFullYear()} HospitoFind Inc. All rights reserved.</p>
        </div>
        <div className={style.credit}>
          <p>Built with <Heart size={14} fill="#e11d48" color="#e11d48" /> for a healthier tomorrow.</p>
        </div>
      </div>
    </Motion>
  );
};

export default Footer;
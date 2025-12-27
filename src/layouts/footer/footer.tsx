import { Link } from "react-router-dom";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";
import { Heart, Newspaper, Flame, Lightbulb, ArrowRight } from "lucide-react";
import style from "./style/footer.module.scss";
import Motion from "@/components/motion";
import { fadeUp, sectionReveal } from "@/hooks/animations";

const Footer = () => {
  return (
    <Motion as="footer" variants={sectionReveal} className={style.footer}>
      <Motion variants={fadeUp} className={style.ctaBar}>
        <div className={style.ctaContent}>
          <div className={style.ctaText}>
            <h2>Ready to find the right care?</h2>
            <p>Search our verified directory of hospitals and clinics worldwide.</p>
          </div>
          <Link to="/signup" className={style.ctaButton}>
            Create Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </Motion>

      <Motion variants={fadeUp} className={style.mainGrid}>
        <div className={style.brandCol}>
          <div className={style.logoGroup}>
            <Heart size={20} fill="#0e3db7" color="#0e3db7" />
            <span className={style.logoText}>HospitoFind</span>
          </div>
          <p className={style.brandDesc}>
            Connecting you with trusted hospitals and healthcare providers worldwide. Making care accessible, one search at a time.
          </p>
          <div className={style.socialRow}>
            <a href="https://linkedin.com/..." target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="mailto:hospitofind@..." aria-label="Email">
              <FaEnvelope />
            </a>
          </div>
        </div>

        <div className={style.linkCol}>
          <h3>Platform</h3>
          <Link to="/about">Our Mission</Link>
          <Link to="/directory">Hospital Directory</Link>
          <Link to="/find-hospital">Search Nearby</Link>
        </div>


        <div className={style.linkCol}>
          <h3>Resources</h3>
          <Link to="/health-news">
            <Newspaper size={14} className={style.inlineIcon} /> Global Health News
          </Link>
          <Link to="/disease-outbreaks">
            <Flame size={14} className={style.inlineIcon} /> Outbreak Alerts
          </Link>
          <Link to="/health-tips">
            <Lightbulb size={14} className={style.inlineIcon} /> Daily Health Tips
          </Link>
        </div>

        <div className={style.linkCol}>
          <h3>Information</h3>
          <Link to="/faq">FAQ</Link>
          <Link to="/policy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </Motion>

      <div className={style.bottomBar}>
        <div className={style.copyright}>
          <p>© {new Date().getFullYear()} HospitoFind. All rights reserved.</p>
        </div>
        <div className={style.credit}>
          <p>Built with <Heart size={14} fill="#e11d48" color="#e11d48" /> for a healthier world.</p>
        </div>
      </div>
    </Motion>
  );
};

export default Footer;
// import { FaLinkedin, FaEnvelope } from "react-icons/fa";
// import style from "./style/footer.module.scss";
// import Motion from "@/components/motion";
// import { fadeUp, sectionReveal } from "@/hooks/animations";

// const Footer = () => {
//   return (
//     <Motion as="footer" variants={sectionReveal} className={style.footer}>
//       <Motion variants={fadeUp} className={style.newsletter}>
//         <h2 className={style.newsTitle}>Stay in the loop</h2>
//         <p className={style.newsText}>
//           Get updates about new hospitals, services and health tips.
//         </p>
//         <form
//           className={style.newsForm}
//           onSubmit={(e) => {
//             e.preventDefault();
//             alert("Coming soon: Newsletter subscription feature!");
//           }}
//         >
//           <input
//             type="email"
//             placeholder="Enter your email address"
//             className={style.newsInput}
//             disabled
//           />
//           <button type="submit" className={style.newsButton} disabled>
//             Subscribe
//           </button>
//         </form>
//         <small className={style.note}>Coming soon</small>
//       </Motion>

//       <Motion variants={fadeUp} className={style.top}>
//         <div className={style.brand}>
//           <p className={style.about}>
//             HospitoFind connects you with trusted hospitals and healthcare providers near you.
//           </p>
//           <p className={style.tagline}>
//             Making healthcare simple, reliable, and accessible — one search at a time.
//           </p>
//           <div className={style.socials}>
//             <a
//               href="https://www.linkedin.com/company/prestigeenigma"
//               target="_blank"
//               rel="noreferrer"
//               aria-label="HospitoFind on LinkedIn"
//               className={style.socialIcon}
//             >
//               <FaLinkedin aria-hidden="true" />
//             </a>
//             <a
//               href="mailto:hospitofind@outlook.com"
//               target="_blank"
//               rel="noreferrer"
//               aria-label="HospitoFind via Email"
//               className={style.socialIcon}
//             >
//               <FaEnvelope aria-hidden="true" />
//             </a>
//           </div>
//         </div>

//         <div className={style.links}>
//           <div className={style.column}>
//             <h2>Discover</h2>
//             <Link to="/about">Our Mission</Link>
//             <Link to="/country">Hospital Directory</Link>
//           </div>

//           <div className={style.column}>
//             <h2>Information</h2>
//             <Link to="/faq">FAQ</Link>
//             <Link to="/policy">Privacy Policy</Link>
//           </div>
//         </div>
//       </Motion>

//       <Motion variants={fadeUp} className={style.bottom}>
//         <p>© {new Date().getFullYear()} HospitoFind. All rights reserved.</p>
//         <p>
//           Built with ❤️ Connecting you to better care.
//         </p>
//       </Motion>
//     </Motion >
//   );
// };

// export default Footer;
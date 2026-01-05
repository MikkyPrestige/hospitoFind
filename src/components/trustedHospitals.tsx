import { motion } from "framer-motion";
import style from "./style/trustedHospitals.module.css";

import Logo1 from "@/assets/images/fmc.jpg";
import Logo2 from "@/assets/images/UNIBEN.webp";
import Logo3 from "@/assets/images/misr.jpg";
import Logo4 from "@/assets/images/mater.jpg";
import Logo5 from "@/assets/images/Effia-Nkwanta.webp";
import Logo6 from "@/assets/images/LUMC.jpg";
import Logo7 from "@/assets/images/Korle Bu.jpeg";
import Logo8 from "@/assets/images/hirslanden.webp";
import Logo9 from "@/assets/images/milpark.jpg";
import Logo10 from "@/assets/images/Tygerberg.png";
import Logo11 from "@/assets/images/alexandra.jpg";
import Logo12 from "@/assets/images/CBRM.jpg";

const hospitalPartners = [
    { logo: Logo1, name: "Federal Medical Centre" },
    { logo: Logo2, name: "University of Benin Teaching Hospital" },
    { logo: Logo3, name: "Misr International" },
    { logo: Logo4, name: "Mater Misericordiae" },
    { logo: Logo5, name: "Effia Nkwanta" },
    { logo: Logo6, name: "Leiden University Medical Center" },
    { logo: Logo7, name: "Korle Bu Teaching" },
    { logo: Logo8, name: "Klinik Hirslanden" },
    { logo: Logo9, name: "Netcare Milpark" },
    { logo: Logo10, name: "Tygerberg" },
    { logo: Logo11, name: "Alexandra" },
    { logo: Logo12, name: "Cape Breton" },
];

const TrustedSection = () => {
    const scrollList = [...hospitalPartners, ...hospitalPartners];

    return (
        <motion.section
            className={style.trusted}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
        >
            <div className={style.contentHeader}>
                <span className={style.badge}>Global Network</span>
                <h3 className={style.trustedTitle}>
                    Trusted by World-Class <span className={style.accent}>Medical Institutions</span>
                </h3>
                <p className={style.subText}>
                    We collaborate with accredited hospitals worldwide to ensure you receive verified, high-quality care wherever you are.
                </p>
            </div>

            <div className={style.marquee}>
                <div className={style.track}>
                    {scrollList.map((hospital, i) => (
                        <div key={`${hospital.name}-${i}`} className={style.logoCard}>
                            <div className={style.imageWrapper}>
                                <img
                                    src={hospital.logo}
                                    alt={hospital.name}
                                    className={style.hospitalLogo}
                                    loading="lazy"
                                    />
                            </div>
                            <span className={style.hospitalName}>{hospital.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

export default TrustedSection;
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@/components/avatar";
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

const hospitalPartners = [
    { logo: Logo1, name: "Federal Medical Centre (FMC)" },
    { logo: Logo2, name: "University of Benin Teaching Hospital (UBTH)" },
    { logo: Logo3, name: "Misr International" },
    { logo: Logo4, name: "Mater Misericordiae" },
    { logo: Logo5, name: "Effia Nkwanta" },
    { logo: Logo6, name: "Leiden University Medical Center (LUMC)" },
    { logo: Logo7, name: "Korle Bu Teaching" },
    { logo: Logo8, name: "Klinik Hirslanden" },
    { logo: Logo9, name: "Netcare Milpark" },
    { logo: Logo10, name: "Tygerberg" },
];

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" },
    },
} as const;

const TrustedSection = () => {
    const [isVisible, setIsVisible] = useState(true);
    const sectionRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Detect when the section is in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.2 }
        );

        const currentRef = sectionRef.current;
        if (currentRef) observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);

    const handleExploreClick = () => {
        navigate("/dashboard");
    }

    const scrollList = [...hospitalPartners, ...hospitalPartners];

    return (
        <motion.section
            ref={sectionRef}
            className={`${style.trusted} ${isVisible ? style.active : style.paused}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
        >
            <h3 className={style.trustedTitle}>
                Trusted by leading hospitals and healthcare providers
            </h3>

            <p className={style.subText}>
                We collaborate with reputable hospitals to make access to quality healthcare easier and faster.
            </p>

            <div className={style.marquee}>
                <div className={style.track}>
                    {scrollList.map((h, i) => (
                        <div key={i} className={style.logoCard}>
                            <Avatar
                                image={h.logo}
                                alt={h.name}
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "contain",
                                    borderRadius: "0.75rem",
                                }}
                            />
                            <p className={style.hospitalName}>{h.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            <button className={style.ctaBtn} onClick={handleExploreClick}>Explore Hospitals Near You →</button>
        </motion.section>
    );
};

export default TrustedSection;
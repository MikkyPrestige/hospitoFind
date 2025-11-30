import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { fadeUp, sectionReveal } from "@/hooks/animations";
import Motion from "@/components/motion";
import style from "./style/hospitalDetails.module.css";
import style2 from "../hospitalsConfig/style/info/info.module.css";
import { Button } from "./button";
import Header from "@/layouts/header/nav";
import Footer from "@/layouts/footer/footer";
import { getHospitalDetails } from "@/services/api";
import { SEOHelmet } from "@/components/utils/seoUtils";

type Hospital = {
    _id?: string;
    name: string;
    slug: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
    };
    photoUrl?: string;
    type?: string;
    hours?: { day: string; open: string }[];
    comments?: string[];
    email?: string;
    services?: string[];
    website?: string;
    phoneNumber?: string;
};

const HospitalDetails = () => {
    const { id, country, city, slug } = useParams();
    const [hospital, setHospital] = useState<Hospital | null>(null);
    const [loading, setLoading] = useState(true);
    const [isExiting, setIsExiting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHospital = async () => {
            try {
                const res = await getHospitalDetails({ id, country, city, slug });
                setHospital(res);
            } catch (err) {
            } finally {
                setLoading(false);
            }
        };

        fetchHospital();
    }, [id, country, city, slug]);

    const handleBack = () => {
        setIsExiting(true);
    };

    if (loading)
        return <p className={style.loading}>Getting hospital details...</p>;
    if (!hospital) return <p className={style.error}>Hospital not found.</p>;

    const mapQuery = `${hospital.address?.street || ""}, ${hospital.address?.city || ""}, ${hospital.address?.state || ""}`;
    const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`;

    return (
        <>
            <SEOHelmet
                title={hospital.name}
                description={`${hospital.name} located in ${hospital.address?.city || ""}, ${hospital.address?.state || ""}${hospital.services?.length ? ". Services: " + hospital.services.join(", ") : ""
                    }`}
                canonical={`https://hospitofind.online/hospital/${hospital.slug}`}
                image={hospital.photoUrl}
                schemaType="hospital"
                schemaData={hospital}
                autoBreadcrumbs={true}
                includeBrand={false}
            />

            <Header />
            <AnimatePresence
                mode="wait"
                onExitComplete={() => navigate(-1)}
            >
                {!isExiting && (
                    <Motion
                        key="hospital-details"
                        className={style.section}
                        variants={sectionReveal}
                        once={false}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <Motion variants={fadeUp} className={style.detailsLayout}>
                            <div className={style.infoSection}>
                                <div className={style.header}>
                                    <h1 className={style.name}>{hospital.name}</h1>
                                    {hospital.type && (
                                        <span
                                            className={`${style.typeBadge} ${hospital.type.toLowerCase() === "private"
                                                ? style.privateBadge
                                                : style.publicBadge
                                                }`}
                                        >
                                            {hospital.type || "Unknown"}
                                        </span>
                                    )}
                                </div>

                                {hospital.photoUrl && (
                                    <Motion variants={fadeUp}>
                                        <img
                                            src={hospital.photoUrl}
                                            alt={hospital.name}
                                            className={style.image}
                                        />
                                    </Motion>
                                )}

                                <Motion variants={fadeUp} className={style.info}>
                                    <p className={style.location}>
                                        📍{" "}
                                        {hospital.address
                                            ? `${hospital.address.street}, ${hospital.address.city}, ${hospital.address.state}`
                                            : "Not available"}
                                    </p>
                                    <p className={style.desc}>
                                        <strong className={style2.strong}>Contact:</strong>{" "}
                                        {hospital.phoneNumber || "Not available"}
                                    </p>

                                    {hospital.website && (
                                        <a
                                            href={hospital.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={style.link}
                                        >
                                            Visit Website →
                                        </a>
                                    )}

                                    {hospital.email && (
                                        <p className={style.desc}>
                                            <strong className={style2.strong}>Email:</strong>{" "}
                                            <a
                                                href={`mailto:${hospital.email}?subject=Hello ${hospital.name}!`}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {hospital.email}
                                            </a>
                                        </p>
                                    )}

                                    {hospital.services && hospital.services.length > 0 && (
                                        <div className={style.services}>
                                            <h3>Available Services</h3>
                                            {hospital.services?.length
                                                ? hospital.services.join(", ")
                                                : "Not available"}
                                        </div>
                                    )}

                                    {hospital.hours && (
                                        <div className={style2.section}>
                                            <h3 className={style2.section_title}>🕓 Opening Hours</h3>
                                            <ul className={style2.hours}>
                                                {hospital.hours.map((hour, i) => (
                                                    <li key={i}>
                                                        <span>{hour.day}</span> <span>{hour.open}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {hospital.comments && (
                                        <div className={style2.section}>
                                            <h3 className={style2.section_title}>
                                                💬 Additional Information
                                            </h3>
                                            <ul className={style2.list}>
                                                {hospital.comments.map((comment, i) => (
                                                    <li key={i}>{comment}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </Motion>
                            </div>

                            {/* Map Section */}
                            {hospital.address && (
                                <Motion variants={fadeUp} className={style.mapWrapper}>
                                    <h3>Location Map</h3>
                                    <iframe
                                        title={`Map of ${hospital.name}`}
                                        src={mapUrl}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                    <a
                                        href={directionsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={style.directionsBtn}
                                    >
                                        Get Directions
                                    </a>
                                </Motion>
                            )}
                        </Motion>

                        <Motion variants={fadeUp} className={style.backRow}>
                            <Button onClick={handleBack} className={style.backBtn}>
                                ← Go Back
                            </Button>
                        </Motion>
                    </Motion>
                )}
            </AnimatePresence>
            <Footer />
        </>
    );
};

export default HospitalDetails;

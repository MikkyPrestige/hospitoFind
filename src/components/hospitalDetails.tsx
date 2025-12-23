import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { fadeUp, sectionReveal } from "@/hooks/animations";
import Motion from "@/components/motion";
import style from "./style/hospitalDetails.module.css";
import { Button } from "./button";
import Header from "@/layouts/header/nav";
import Footer from "@/layouts/footer/footer";
import { getHospitalDetails } from "@/services/api";
import { SEOHelmet } from "@/components/utils/seoUtils";
import AnimatedLoader from "./utils/AnimatedLoader";
import Logo from "../assets/images/logo.svg"

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
    comments: string[];
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

    if (loading) {
        return (
            <AnimatedLoader
                message="Getting hospital details..."
                variant="card"
                count={1}
                showImage
                imageHeight={200}
                showButtons={false}
            />
        );
    }
    if (!hospital) return (
        <div className={style.errorContainer}>
            <div className={style.errorCard}>
                <span className={style.errorIcon}>🏥</span>
                <h2 className={style.errorTitle}>Hospital Not Found</h2>
                <p className={style.errorText}>
                    We couldn't find the hospital you're looking for. It may have been removed or the link is broken.
                </p>
                <button
                    onClick={() => navigate("/find-hospital")}
                    className={style.errorBtn}
                >
                    ← Back to Directory
                </button>
            </div>
        </div>
    );

    const mapQuery = `${hospital.address?.street || ""}, ${hospital.address?.city || ""}, ${hospital.address?.state || ""}`;
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyD8YD2ixVI6u2a0J7QpEnzGYzUxZ_-QEi8&q=${encodeURIComponent(mapQuery)}`;
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
                        <div className={style.printHeader}>
                            <div className={style.printBranding}>
                                <img src={Logo} alt="HospitoFind Logo" className={style.printLogo} />
                                <div>
                                    <h2 className={style.printTitle}>HospitoFind</h2>
                                    <p className={style.printSubtitle}>Official Hospital Directory</p>
                                </div>
                            </div>
                            <div className={style.printMeta}>
                                <p><strong>Generated on:</strong> {new Date().toLocaleDateString()}</p>
                                <p><strong>Source:</strong> hospitofind.online</p>
                            </div>
                        </div>
                        <Motion variants={fadeUp} className={style.detailsLayout}>
                            <div className={style.infoSection}>
                                <div className={style.header}>
                                    <h1 className={style.name}>
                                        {hospital.name}
                                        <span className={style.verifiedBadge}>
                                            <span className={style.checkIcon}>✓</span> Verified Facility
                                        </span>
                                    </h1>
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

                                <button onClick={() => window.print()} className={style.backBtn} style={{ marginTop: '1rem', background: '#f1f5f9', color: '#475569' }}>
                                    📥 Save as PDF
                                </button>

                                {hospital.photoUrl && (
                                    <Motion variants={fadeUp}>
                                        <img
                                            src={hospital.photoUrl}
                                            alt={`Photo of ${hospital.name}`}
                                            className={style.image}
                                        />
                                    </Motion>
                                )}

                                <Motion variants={fadeUp} className={style.info}>
                                    <p className={style.location}>📍 {hospital.address?.street}, {hospital.address?.city}</p>
                                    <p className={style.desc}>
                                        <strong className={style.label}>Contact:</strong>{" "}
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
                                            <strong className={style.label}>Email:</strong>{" "}
                                            <a
                                                href={`mailto:${hospital.email}?subject=Hello ${hospital.name}!`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className={style.infoLink}
                                            >
                                                {hospital.email}
                                            </a>
                                        </p>
                                    )}

                                    {hospital.services && hospital.services.length > 0 && (
                                        <div className={style.servicesSection}>
                                            <h3 className={style.sectionTitle}>Available Services & Amenities</h3>
                                            <div className={style.amenitiesGrid}>
                                                {hospital.services.map((service, index) => (
                                                    <div key={index} className={style.amenityChip}>
                                                        <span className={style.chipIcon}>✓</span>
                                                        {service.trim()}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {hospital.comments && hospital.comments.length > 0 && (
                                        <div className={style.commentsSection}>
                                            <h3 className={style.commentsTitle}>
                                                <span>💬</span> Additional Information
                                            </h3>
                                            <ul className={style.commentsList}>
                                                {hospital.comments.map((comment, i) => (
                                                    <li key={i} className={style.commentItem}>
                                                        {comment}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </Motion>
                            </div>

                            {/* Map Section */}
                            {hospital.address && (
                                <Motion variants={fadeUp} as="aside" className={style.mapWrapper}>
                                    <div className={style.mapCard}>
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
                                    </div>

                                    {hospital.hours && (
                                        <div className={style.hoursCard}>
                                            <h3>🕓 Opening Hours</h3>
                                            <ul className={style.hoursList}>
                                                {hospital.hours.map((hour, i) => (
                                                    <li key={i}>
                                                        <span className={style.day}>{hour.day}</span>
                                                        <span className={style.time}>{hour.open}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
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

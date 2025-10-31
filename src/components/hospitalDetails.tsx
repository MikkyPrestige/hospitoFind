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

type Hospital = {
    _id?: string;
    name: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
    };
    photoUrl?: string;
    type?: string;
    services?: string[];
    website?: string;
    phoneNumber?: string;
};

const HospitalDetails = () => {
    const { id } = useParams();
    const [hospital, setHospital] = useState<Hospital | null>(null);
    const [loading, setLoading] = useState(true);
    const [isExiting, setIsExiting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHospital = async () => {
            try {
                const res =  await getHospitalDetails(id as unknown as number);
                setHospital(res);
            } catch (err) {
                // console.error("Error fetching hospital:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHospital();
    }, [id]);

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
                                        <strong>Contact:</strong>{" "}
                                        {hospital.phoneNumber || "Not available"}
                                    </p>

                                    {hospital.services && hospital.services.length > 0 && (
                                        <div className={style.services}>
                                            <h3>Available Services</h3>
                                            {hospital.services?.length
                                                ? hospital.services.join(", ")
                                                : "Not available"}
                                        </div>
                                    )}

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
                                ← Back to Hospitals
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

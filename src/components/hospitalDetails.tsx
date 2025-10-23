import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"
import style from "./style/hospitalDetails.module.css";
import { Button } from "./button";
import Header from "@/layouts/header/nav";
import Footer from "@/layouts/footer/footer";

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
    const [exiting, setExiting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHospital = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/hospitals/${id}`);
                const data = await res.json();
                setHospital(data);
            } catch (err) {
                console.error("Error fetching hospital:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHospital();
    }, [id]);

    const handleBack = () => {
        setExiting(true);
        setTimeout(() => navigate(-1), 500);
    };

    if (loading) return <p className={style.loading}>Getting hospital details...</p>;
    if (!hospital) return <p className={style.error}>Hospital not found.</p>;

    const mapQuery = `${hospital.address?.street || ""}, ${hospital.address?.city || ""}, ${hospital.address?.state || ""}`;
    const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`;


    return (
        <>
            <Header />
            <AnimatePresence mode="wait">
                {!exiting && (
                    <motion.section
                        key="hospital-details"
                        className={style.section}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <motion.div
                            className={style.detailsLayout}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
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
                                    <img src={hospital.photoUrl} alt={hospital.name} className={style.image} />
                                )}

                                <div className={style.info}>
                                    <p className={style.location}>📍 {hospital.address
                                        ? `${hospital.address.street}, ${hospital.address.city}, ${hospital.address.state}`
                                        : "Not available"}</p>
                                    <p className={style.desc}>
                                        <strong>Contact:</strong> {hospital.phoneNumber || "Not available"}
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
                                </div>
                            </div>
                            {/* Map Preview */}
                            {hospital.address && (
                                <div className={style.mapWrapper}>
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
                            )}
                        </motion.div>
                        <motion.div
                            className={style.backRow}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                        >
                            <Button onClick={handleBack} className={style.backBtn}>
                                ← Back to Hospitals
                            </Button>
                        </motion.div>
                    </motion.section>
                )}
            </AnimatePresence>
            <Footer />
        </>
    );
};

export default HospitalDetails;

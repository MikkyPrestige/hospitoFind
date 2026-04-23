import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    MdLocationOn, MdPhone, MdEmail, MdLanguage, MdVerified,
    MdOutlinePrint, MdInfoOutline, MdErrorOutline, MdAccessTime, MdLocalHospital, MdAutoAwesome
} from "react-icons/md";
import { AiFillHeart, AiOutlineHeart, AiOutlineArrowLeft } from "react-icons/ai";
import { AnimatePresence } from "framer-motion";
import { useAuthContext } from "@/context/UserProvider";
import { useTheme } from "@/context/ThemeProvider";
import { useHospitalDetails } from "@/hooks/useHospitalDetails";
import Motion from "@/components/ui/Motion";
import { Button } from "@/components/ui/Button";
import { SEOHelmet } from "@/components/ui/SeoHelmet";
import AnimatedLoader from "@/components/ui/AnimatedLoader";
import { fadeUp, sectionReveal } from "@/utils/animations";
import Logo from "@/assets/images/logo.svg";
import style from "./styles/hospitalDetails.module.css";
import { FaArrowRight } from "react-icons/fa";

const HospitalDetails = () => {
    const { theme } = useTheme();
    const { id, country, city, slug, name } = useParams();
    const { state } = useAuthContext();
    const navigate = useNavigate();
    const [isExiting, setIsExiting] = useState(false);
    const { hospital, loading, isFavorite, toggleFavorite } = useHospitalDetails({
        id, country, city, slug, name,
        accessToken: state?.accessToken,
        username: state?.username
    });

    const handleMatchMe = () => {
        const hospitalContext = {
            name: hospital.name,
            city: hospital.address?.city,
            country: hospital.address?.state,
        };

        if (state?.accessToken) {
            navigate('/dashboard', {
                state: {
                    tab: 'health-history',
                    hospitalContext,
                },
            });
        } else {
            const params = new URLSearchParams({
                hospital: hospitalContext.name,
                city: hospitalContext.city || '',
                country: hospitalContext.country || '',
            });
            navigate(`/?${params.toString()}`);
        }
    };

    const handleBack = () => {
        setIsExiting(true);
        navigate(-1);
    };

    if (loading) {
        return (
            <AnimatedLoader
                message="Retrieving facility details..."
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
            <div className={style.errorContainer}>
                <div className={style.errorCard}>
                    <MdErrorOutline size={60} className={style.errorIcon} />
                    <h2 className={style.errorTitle}>Facility Record Unavailable</h2>
                    <p className={style.errorText}>
                        The healthcare facility you requested cannot be found. It may have been removed or the link is invalid.
                    </p>
                    <button onClick={() => navigate("/find-hospital")} className={style.errorBtn}>
                        ← Return to Directory
                    </button>
                </div>
            </div>
        </div>
    );

    const API_KEY = import.meta.env.VITE_Google_API_Key;
    const mapQuery = encodeURIComponent(`${hospital.name}, ${hospital.address?.city}, ${hospital.address?.state}`);
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${mapQuery}`;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;

    return (
        <>
            <SEOHelmet
                title={`${hospital.name} | ${hospital.address?.city || ""}, ${hospital.address?.country || ""}`}
                description={`Verified details for ${hospital.name} in ${hospital.address?.city || ""}. View services, doctors, contact number, opening hours, directions, and real-time availability. Book appointments or visit this trusted healthcare facility.`}
                canonical={`https://hospitofind.online/hospital/${hospital.address?.state?.toLowerCase()}/${hospital.address?.city?.toLowerCase()}/${hospital.slug}`}
                schemaType="hospital"
                schemaData={hospital}
                autoBreadcrumbs={true}
                lang="en"
            />

            <AnimatePresence mode="wait" onExitComplete={() => navigate(-1)}>
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
                                    <p className={style.printSubtitle}>Verified Healthcare Directory</p>
                                </div>
                            </div>
                            <div className={style.printMeta}>
                                <p><strong>Report Generated:</strong> {new Date().toLocaleDateString()}</p>
                                <p><strong>Source:</strong> hospitofind.online</p>
                            </div>
                        </div>

                        <Motion variants={fadeUp} className={style.detailsLayout}>
                            <div className={style.mainColumn}>
                                <div className={style.infoSection}>
                                    <div className={style.headerMain}>
                                        <div className={style.titleBlock}>
                                            <div className={style.badgeRow}>
                                                <span className={style.verifiedBadge}>
                                                    <MdVerified /> Verified Facility
                                                </span>
                                                {hospital.type && (
                                                    <span className={`${style.typeBadge} ${hospital.type.toLowerCase() === "private" ? style.privateBadge : style.publicBadge}`}>
                                                        {hospital.type}
                                                    </span>
                                                )}
                                            </div>
                                            <h1 className={style.name}>{hospital.name}</h1>
                                        </div>

                                        <div className={style.actionButtons}>
                                            <button onClick={toggleFavorite} className={`${style.actionBtn} ${isFavorite ? style.isFav : ""}`}>
                                                {isFavorite ? <AiFillHeart size={20} /> : <AiOutlineHeart size={20} />}
                                                {isFavorite ? "Saved" : "Save"}
                                            </button>
                                            <button onClick={() => window.print()} className={style.actionBtn}>
                                                <MdOutlinePrint size={20} /> Print
                                            </button>
                                            <button type="button" onClick={handleMatchMe} className={style.matchBtn}>
                                                <MdAutoAwesome /> Match Me Here
                                            </button>
                                        </div>
                                    </div>

                                    {hospital.photoUrl && (
                                        <Motion variants={fadeUp}>
                                            <div className={style.imageWrapper}>
                                                <img src={hospital.photoUrl} alt={`View of ${hospital.name}`} className={style.image} />
                                            </div>
                                        </Motion>
                                    )}

                                    <div className={style.contactGrid}>
                                        <div className={style.contactItem}>
                                            <div className={style.iconWrapper}><MdLocationOn /></div>
                                            <div className={style.contactContent}>
                                                <span className={style.contactLabel}>Address</span>
                                                <span>{hospital.address?.street}, {hospital.address?.city}, {hospital.address?.state}</span>
                                            </div>
                                        </div>
                                        {hospital.phoneNumber && (
                                            <div className={style.contactItem}>
                                                <div className={style.iconWrapper}><MdPhone /></div>
                                                <div className={style.contactContent}>
                                                    <span className={style.contactLabel}>Phone</span>
                                                    <a href={`tel:${hospital.phoneNumber}`} className={style.infoLink}>{hospital.phoneNumber}</a>
                                                </div>
                                            </div>
                                        )}
                                        {hospital.email && (
                                            <div className={style.contactItem}>
                                                <div className={style.iconWrapper}><MdEmail /></div>
                                                <div className={style.contactContent}>
                                                    <span className={style.contactLabel}>Email</span>
                                                    <a href={`mailto:${hospital.email}`} className={style.infoLink}>{hospital.email}</a>
                                                </div>
                                            </div>
                                        )}
                                        {hospital.website && (
                                            <div className={style.contactItem}>
                                                <div className={style.iconWrapper}><MdLanguage /></div>
                                                <div className={style.contactContent}>
                                                    <span className={style.contactLabel}>Online</span>
                                                    <a href={hospital.website} target="_blank" rel="noopener noreferrer" className={style.infoLink}>Visit Website <FaArrowRight size={20} /></a>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {hospital.services && hospital.services.length > 0 && (
                                        <div className={style.servicesSection}>
                                            <h3 className={style.sectionTitle}><MdLocalHospital /> Specialties & Services</h3>
                                            <div className={style.amenitiesGrid}>
                                                {hospital.services.map((service: string, index: number) => (
                                                    <div key={index} className={style.amenityChip}>
                                                        <MdVerified className={style.chipIcon} /> {service.trim()}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {hospital.comments && hospital.comments.length > 0 && (
                                        <div className={style.commentsSection}>
                                            <h3 className={style.commentsTitle}><MdInfoOutline /> Facility Information</h3>
                                            <ul className={style.commentsList}>
                                                {hospital.comments.map((comment: string, i: number) => (
                                                    <li key={i} className={style.commentItem}>{comment}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <aside className={style.sidebarColumn}>
                                <div className={style.sidebarCard}>
                                    <div className={style.cardHeader}>
                                        <h3>Location Map</h3>
                                    </div>
                                    <div className={style.mapContainer}>
                                        <iframe
                                            title={`Map of ${hospital.name}`}
                                            src={mapUrl}
                                            className={style.mapIframe}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            style={{
                                                filter: theme === 'dark' ? 'invert(90%) hue-rotate(180deg) brightness(95%)' : 'none',
                                            }}
                                        ></iframe>
                                    </div>
                                    <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className={style.directionsBtn}>
                                        Get Directions
                                    </a>
                                </div>

                                {hospital.hours && hospital.hours.length > 0 && (
                                    <div className={style.sidebarCard}>
                                        <div className={style.cardHeader}>
                                            <h3><MdAccessTime /> Operating Hours</h3>
                                        </div>
                                        <ul className={style.hoursList}>
                                            {hospital.hours.map((hour: any, i: number) => (
                                                <li key={i}>
                                                    <span className={style.day}>{hour.day}</span>
                                                    <span className={style.time}>{hour.open}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </aside>
                        </Motion>

                        <div className={style.backRow}>
                            <Button onClick={handleBack} className={style.finalBackBtn}>
                                <AiOutlineArrowLeft /> Go Back
                            </Button>
                        </div>
                    </Motion>
                )}
            </AnimatePresence>
        </>
    );
};

export default HospitalDetails;
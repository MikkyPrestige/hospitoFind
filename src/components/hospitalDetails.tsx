import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { fadeUp, sectionReveal } from "@/hooks/animations";
import { useTheme } from "@/context/themeContext";
import Motion from "@/components/motion";
import style from "./style/hospitalDetails.module.css";
import { Button } from "./button";
import Header from "@/layouts/header/nav";
import Footer from "@/layouts/footer/footer";
import { getHospitalDetails } from "@/services/api";
import useAxiosPrivate from "@/hooks/user/useAxiosPrivate";
import { SEOHelmet } from "@/components/utils/seoUtils";
import AnimatedLoader from "./utils/animatedLoader";
import Logo from "../assets/images/logo.svg";
import {
    MdLocationOn,
    MdPhone,
    MdEmail,
    MdLanguage,
    MdVerified,
    MdOutlinePrint,
    MdInfoOutline,
    MdErrorOutline,
    MdAccessTime,
    MdLocalHospital
} from "react-icons/md";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useAuthContext } from "@/context/userContext";
import { toast } from "react-toastify";

const HospitalDetails = () => {
    const { theme } = useTheme();
    const { id, country, city, slug } = useParams();
    const { state } = useAuthContext();
    const [hospital, setHospital] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isExiting, setIsExiting] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const lastRecordedId = useRef<string | null>(null);
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const userPrefix = state?.username || "guest";
    const FAV_KEY = `${userPrefix}_favorites`;
    const REC_KEY = `${userPrefix}_recentlyViewed`;

    // --- HISTORY HANDLER ---
    const addToHistory = async (hospitalData: any) => {
        if (!hospitalData) return;

        try {
            const raw = JSON.parse(localStorage.getItem(REC_KEY) || "[]");
            const next = [
                { ...hospitalData, viewedAt: Date.now() },
                ...raw.filter((h: any) => h._id !== hospitalData._id)
            ].slice(0, 10);
            localStorage.setItem(REC_KEY, JSON.stringify(next));
        } catch (e) { console.error("Local history error", e); }

        if (state.accessToken && hospitalData._id) {
            try {
                await axiosPrivate.post("/users/view", {
                    hospitalId: hospitalData._id
                });
            } catch (err) {
                console.warn("Background history sync failed");
            }
        }
    };

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchHospital = async () => {
            try {
                setLoading(true);
                const res = await getHospitalDetails({ id, country, city, slug });
                setHospital(res);

                const saved = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
                const isFav = saved.some((h: any) => h._id === res._id || h.name === res.name);
                setIsFavorite(isFav);

                if (res?._id && lastRecordedId.current !== res._id) {
                    addToHistory(res);
                    lastRecordedId.current = res._id;
                }

            } catch (err) { }

            finally {
                setLoading(false);
            }
        };

        fetchHospital();
    }, [id, country, city, slug, FAV_KEY]);

    // --- FAVORITE TOGGLE ---
    const toggleFavorite = async () => {
        if (!hospital) return;

        // UI Update
        const previousState = isFavorite;
        setIsFavorite(!previousState);

        const saved = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
        let next;
        if (previousState === true) {
            next = saved.filter((h: any) => h._id !== hospital._id && h.name !== hospital.name);
        } else {
            next = [{ ...hospital, savedAt: Date.now() }, ...saved];
        }
        localStorage.setItem(FAV_KEY, JSON.stringify(next));

        if (state.accessToken && hospital._id) {
            try {
                await axiosPrivate.post(`/users/favorites-status/${hospital._id}`);

                if (!previousState) toast.success("Saved to your dashboard");
                else toast.info("Removed from saved list");

            } catch (err) {
                setIsFavorite(previousState);
                localStorage.setItem(FAV_KEY, JSON.stringify(saved));
                toast.error("Unable to save changes. Please try again.");
            }
        } else if (!state.accessToken && !previousState) {
            toast.success("Saved to guest favorites");
        }
    };

    const handleBack = () => {
        setIsExiting(true);
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
            <div className={style.errorCard}>
                <MdErrorOutline size={60} color="#ef4444" className={style.errorIcon} />
                <h2 className={style.errorTitle}>Facility Record Unavailable</h2>
                <p className={style.errorText}>
                    The healthcare facility you requested cannot be found in our directory. It may have been delisted or the URL is incorrect.
                </p>
                <button onClick={() => navigate("/find-hospital")} className={style.errorBtn}>
                    ← Return to Directory
                </button>
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
                title={hospital.name}
                description={`${hospital.name} - Verified healthcare facility in ${hospital.address?.city || ""}, ${hospital.address?.state || ""}. View services, contact info, and directions.`}
                canonical={`https://hospitofind.online/hospital/${hospital.address.state}/${hospital.address.city}/${hospital.slug}`}
                image={hospital.photoUrl}
                schemaType="hospital"
                schemaData={hospital}
                autoBreadcrumbs={true}
            />

            <Header />
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
                        {/* PRINT HEADER */}
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
                            {/* LEFT SIDE: INFO */}
                            <div className={style.infoSection}>
                                <div className={style.headerMain}>
                                    <div className={style.titleBlock}>
                                        <h1 className={style.name}>{hospital.name}</h1>
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
                                    </div>

                                    <div className={style.actionButtons}>
                                        <button onClick={toggleFavorite} className={`${style.favBtn} ${isFavorite ? style.isFav : ""}`}>
                                            {isFavorite ? <AiFillHeart size={20} /> : <AiOutlineHeart size={20} />}
                                            {isFavorite ? "Saved to List" : "Save Profile"}
                                        </button>
                                        <button onClick={() => window.print()} className={style.printBtn}>
                                            <MdOutlinePrint size={20} /> Print / Save PDF
                                        </button>
                                    </div>
                                </div>

                                {hospital.photoUrl && (
                                    <Motion variants={fadeUp}>
                                        <img
                                            src={hospital.photoUrl}
                                            alt={`Exterior view of ${hospital.name}`}
                                            className={style.image}
                                        />
                                    </Motion>
                                )}

                                <div className={style.contactGrid}>
                                    <div className={style.contactItem}>
                                        <MdLocationOn className={style.contactIcon} />
                                        <span>{hospital.address?.street}, {hospital.address?.city}, {hospital.address?.state}</span>
                                    </div>
                                    {hospital.phoneNumber && (
                                        <div className={style.contactItem}>
                                            <MdPhone className={style.contactIcon} />
                                            <a href={`tel:${hospital.phoneNumber}`} className={style.infoLink}>{hospital.phoneNumber}</a>
                                        </div>
                                    )}
                                    {hospital.email && (
                                        <div className={style.contactItem}>
                                            <MdEmail className={style.contactIcon} />
                                            <a href={`mailto:${hospital.email}`} className={style.infoLink}>{hospital.email}</a>
                                        </div>
                                    )}
                                    {hospital.website && (
                                        <div className={style.contactItem}>
                                            <MdLanguage className={style.contactIcon} />
                                            <a href={hospital.website} target="_blank" rel="noopener noreferrer" className={style.infoLink}>
                                                Official Website →
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {hospital.services && hospital.services.length > 0 && (
                                    <div className={style.servicesSection}>
                                        <h3 className={style.sectionTitle}>
                                            <MdLocalHospital style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
                                            Clinical Specialties & Services
                                        </h3>
                                        <div className={style.amenitiesGrid}>
                                            {hospital.services.map((service: string, index: number) => (
                                                <div key={index} className={style.amenityChip}>
                                                    <MdVerified className={style.chipIcon} />
                                                    {service.trim()}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {hospital.comments && hospital.comments.length > 0 && (
                                    <div className={style.commentsSection}>
                                        <h3 className={style.commentsTitle}>
                                            <MdInfoOutline /> General Information & Reviews
                                        </h3>
                                        <ul className={style.commentsList}>
                                            {hospital.comments.map((comment: string, i: number) => (
                                                <li key={i} className={style.commentItem}>{comment}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* RIGHT SIDE: SIDEBAR */}
                            <aside className={style.mapWrapper}>
                                <div className={style.mapCard}>
                                    <h3>Location Map</h3>
                                    <iframe
                                        title={`Map location of ${hospital.name}`}
                                        src={mapUrl}
                                        className={style.mapIframe}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        style={{
                                            filter: theme === 'dark' ? 'invert(90%) hue-rotate(180deg)' : 'none',
                                            mixBlendMode: theme === 'dark' ? 'luminosity' : 'normal',
                                        }}
                                    ></iframe>
                                    <a
                                        href={directionsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={style.directionsBtn}
                                    >
                                        Get Directions via Google Maps
                                    </a>
                                </div>

                                {hospital.hours && hospital.hours.length > 0 && (
                                    <div className={style.hoursCard}>
                                        <h3><MdAccessTime /> Operating Hours</h3>
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
                                ← Back to Search Results
                            </Button>
                        </div>
                    </Motion>
                )}
            </AnimatePresence>
            <Footer />
        </>
    );
};

export default HospitalDetails;
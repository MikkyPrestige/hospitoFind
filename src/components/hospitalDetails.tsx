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
import Logo from "../assets/images/logo.svg";
import {
    MdLocationOn,
    MdPhone,
    MdEmail,
    MdLanguage,
    MdVerified,
    MdOutlinePrint,
    MdInfoOutline,
    MdErrorOutline
} from "react-icons/md";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useAuthContext } from "@/context/userContext";

const HospitalDetails = () => {
    const { id, country, city, slug } = useParams();
    const { state } = useAuthContext();
    const [hospital, setHospital] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isExiting, setIsExiting] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const navigate = useNavigate();

    // DYNAMIC USER PREFIXED KEY
    const userPrefix = state?.username || "guest";
    const FAV_KEY = `${userPrefix}_favorites`;

    useEffect(() => {
        const fetchHospital = async () => {
            try {
                setLoading(true);
                const res = await getHospitalDetails({ id, country, city, slug });
                setHospital(res);

                // Check if already in user-specific favorites
                const saved = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
                setIsFavorite(saved.some((h: any) => h.name === res.name));
            } catch (err) {
                console.error("Failed to load hospital:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHospital();
    }, [id, country, city, slug, FAV_KEY]);

    const toggleFavorite = () => {
        const saved = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
        let next;
        if (isFavorite) {
            next = saved.filter((h: any) => h.name !== hospital.name);
        } else {
            next = [hospital, ...saved];
        }
        localStorage.setItem(FAV_KEY, JSON.stringify(next));
        setIsFavorite(!isFavorite);
    };

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
                <MdErrorOutline size={60} color="#ef4444" className={style.errorIcon} />
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

    const API_KEY = import.meta.env.VITE_Google_API_Key;
    const mapQuery = encodeURIComponent(`${hospital.name}, ${hospital.address?.city}, ${hospital.address?.state}`);
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${mapQuery}`;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;

    return (
        <>
            <SEOHelmet
                title={hospital.name}
                description={`${hospital.name} located in ${hospital.address?.city || ""}, ${hospital.address?.state || ""}`}
                canonical={`https://hospitofind.online/hospital/${hospital.slug}`}
                image={hospital.photoUrl}
                schemaType="hospital"
                schemaData={hospital}
                autoBreadcrumbs={true}
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
                        {/* PRINT HEADER SECTION */}
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
                                            {isFavorite ? "Saved" : "Save"}
                                        </button>
                                        <button onClick={() => window.print()} className={style.printBtn}>
                                            <MdOutlinePrint size={20} /> Save PDF
                                        </button>
                                    </div>
                                </div>

                                {hospital.photoUrl && (
                                    <Motion variants={fadeUp}>
                                        <img
                                            src={hospital.photoUrl}
                                            alt={`Photo of ${hospital.name}`}
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
                                            <a href={`tel:${hospital.phoneNumber}`}>{hospital.phoneNumber}</a>
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
                                                Visit Website →
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {hospital.services && hospital.services.length > 0 && (
                                    <div className={style.servicesSection}>
                                        <h3 className={style.sectionTitle}>Available Services & Amenities</h3>
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
                                            <MdInfoOutline /> Additional Information
                                        </h3>
                                        <ul className={style.commentsList}>
                                            {hospital.comments.map((comment: string, i: number) => (
                                                <li key={i} className={style.commentItem}>{comment}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <aside className={style.mapWrapper}>
                                <div className={style.mapCard}>
                                    <h3>Location Map</h3>
                                    <iframe
                                        title={`Map of ${hospital.name}`}
                                        src={mapUrl}
                                        className={style.mapIframe}
                                        allowFullScreen
                                        loading="lazy"
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

                                {hospital.hours && hospital.hours.length > 0 && (
                                    <div className={style.hoursCard}>
                                        <h3>🕓 Opening Hours</h3>
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
                                ← Return to Directory
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

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { AnimatePresence } from "framer-motion";
// import { fadeUp, sectionReveal } from "@/hooks/animations";
// import Motion from "@/components/motion";
// import style from "./style/hospitalDetails.module.css";
// import { Button } from "./button";
// import Header from "@/layouts/header/nav";
// import Footer from "@/layouts/footer/footer";
// import { getHospitalDetails } from "@/services/api";
// import { SEOHelmet } from "@/components/utils/seoUtils";
// import AnimatedLoader from "./utils/AnimatedLoader";
// import Logo from "../assets/images/logo.svg";
// import { MdLocationOn, MdPhone, MdEmail, MdLanguage, MdVerified, MdOutlinePrint, MdInfoOutline, MdErrorOutline } from "react-icons/md";
// import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

// const FAVORITES_KEY = "favoriteHospitals";

// const HospitalDetails = () => {
//     const { id, country, city, slug } = useParams();
//     const [hospital, setHospital] = useState<any>(null);
//     const [loading, setLoading] = useState(true);
//     const [isExiting, setIsExiting] = useState(false);
//     const [isFavorite, setIsFavorite] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchHospital = async () => {
//             try {
//                 setLoading(true);
//                 const res = await getHospitalDetails({ id, country, city, slug });
//                 setHospital(res);
//                 const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
//                 setIsFavorite(saved.some((h: any) => h.name === res.name));
//             } catch (err) {
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchHospital();
//     }, [id, country, city, slug]);

//     const toggleFavorite = () => {
//         const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
//         let next = isFavorite ? saved.filter((h: any) => h.name !== hospital.name) : [hospital, ...saved];
//         localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
//         setIsFavorite(!isFavorite);
//     };

//     if (loading) return <AnimatedLoader message="Retrieving facility data..." variant="card" count={1} showImage imageHeight={300} />;

//     if (!hospital) return (
//         <div className={style.errorContainer}>
//             <div className={style.errorCard}>
//                 <MdErrorOutline size={60} color="#ef4444" className={style.errorIcon} />
//                 <h2 className={style.errorTitle}>Facility Not Found</h2>
//                 <p className={style.errorText}>We couldn't find the hospital. It may have been removed or the link is broken.</p>
//                 <button onClick={() => navigate("/find-hospital")} className={style.errorBtn}>← Back to Directory</button>
//             </div>
//         </div>
//     );

//     const API_KEY = import.meta.env.VITE_Google_API_Key;
//     const mapQuery = encodeURIComponent(`${hospital.name}, ${hospital.address?.city}, ${hospital.address?.state}`);
//     const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${mapQuery}`;
//     const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;

//     return (
//         <>
//             <SEOHelmet title={hospital.name} description={`Verified details for ${hospital.name}`} />
//             <Header />
//             <AnimatePresence mode="wait" onExitComplete={() => navigate(-1)}>
//                 {!isExiting && (
//                     <Motion key="hospital-details" className={style.section} variants={sectionReveal} exit={{ opacity: 0, y: -20 }}>
//                         <div className={style.printHeader}>
//                             <div className={style.printBranding}>
//                                 <img src={Logo} alt="Logo" className={style.printLogo} />
//                                 <div><h2 className={style.printTitle}>HospitoFind</h2><p className={style.printSubtitle}>Certified Directory Report</p></div>
//                             </div>
//                             <div className={style.printMeta}><p><strong>Generated:</strong> {new Date().toLocaleDateString()}</p><p><strong>Source:</strong> hospitofind.online</p></div>
//                         </div>

//                         <div className={style.detailsLayout}>
//                             <div className={style.infoSection}>
//                                 <div className={style.headerMain}>
//                                     <div className={style.titleBlock}>
//                                         <h1 className={style.name}>{hospital.name}</h1>
//                                         <div className={style.badgeRow}>
//                                             <span className={style.verifiedBadge}><MdVerified /> Verified Facility</span>
//                                             <span className={`${style.typeBadge} ${hospital.type?.toLowerCase() === "private" ? style.privateBadge : style.publicBadge}`}>{hospital.type || "Public"}</span>
//                                         </div>
//                                     </div>
//                                     <div className={style.actionButtons}>
//                                         <button onClick={toggleFavorite} className={`${style.favBtn} ${isFavorite ? style.isFav : ""}`}>
//                                             {isFavorite ? <AiFillHeart /> : <AiOutlineHeart />} {isFavorite ? "Saved" : "Save"}
//                                         </button>
//                                         <button onClick={() => window.print()} className={style.printBtn}><MdOutlinePrint /> Save PDF</button>
//                                     </div>
//                                 </div>

//                                 {hospital.photoUrl && <img src={hospital.photoUrl} alt={hospital.name} className={style.image} />}

//                                 <div className={style.contactGrid}>
//                                     <div className={style.contactItem}><MdLocationOn className={style.contactIcon} /><span>{hospital.address?.street}, {hospital.address?.city}</span></div>
//                                     {hospital.phoneNumber && <div className={style.contactItem}><MdPhone className={style.contactIcon} /><a href={`tel:${hospital.phoneNumber}`}>{hospital.phoneNumber}</a></div>}
//                                     {hospital.email && <div className={style.contactItem}><MdEmail className={style.contactIcon} /><a href={`mailto:${hospital.email}`} className={style.infoLink}>{hospital.email}</a></div>}
//                                     {hospital.website && <div className={style.contactItem}><MdLanguage className={style.contactIcon} /><a href={hospital.website} target="_blank" rel="noreferrer" className={style.infoLink}>Official Website</a></div>}
//                                 </div>

//                                 {hospital.services?.length > 0 && (
//                                     <div className={style.servicesSection}>
//                                         <h3 className={style.sectionTitle}>Services & Amenities</h3>
//                                         <div className={style.amenitiesGrid}>
//                                             {hospital.services.map((s: string, i: number) => (
//                                                 <div key={i} className={style.amenityChip}><MdVerified className={style.chipIcon} /> {s.trim()}</div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* RESTORED COMMENTS SECTION */}
//                                 {hospital.comments?.length > 0 && (
//                                     <div className={style.commentsSection}>
//                                         <h3 className={style.commentsTitle}><MdInfoOutline /> Additional Information</h3>
//                                         <ul className={style.commentsList}>
//                                             {hospital.comments.map((comment: string, i: number) => (
//                                                 <li key={i} className={style.commentItem}>{comment}</li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                 )}
//                             </div>

//                             <aside className={style.mapWrapper}>
//                                 <div className={style.mapCard}>
//                                     <h3>Location Map</h3>
//                                     <iframe title="map" src={mapUrl} className={style.mapIframe} allowFullScreen loading="lazy"></iframe>
//                                     <a href={directionsUrl} target="_blank" rel="noreferrer" className={style.directionsBtn}>Get Directions</a>
//                                 </div>
//                                 {hospital.hours?.length > 0 && (
//                                     <div className={style.hoursCard}>
//                                         <h3>🕓 Opening Hours</h3>
//                                         <ul className={style.hoursList}>
//                                             {hospital.hours.map((h: any, i: number) => (
//                                                 <li key={i}><span className={style.day}>{h.day}</span><span className={style.time}>{h.open}</span></li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                 )}
//                             </aside>
//                         </div>

//                         <div className={style.backRow}><Button onClick={() => navigate(-1)} className={style.finalBackBtn}>← Return to Directory</Button></div>
//                     </Motion>
//                 )}
//             </AnimatePresence>
//             <Footer />
//         </>
//     );
// };

// export default HospitalDetails;
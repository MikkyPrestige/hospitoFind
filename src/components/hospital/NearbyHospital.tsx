import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiMapPin, FiNavigation } from "react-icons/fi";
import { useNearbyHospitals } from "@/hooks/useNearbyHospitals";
import AnimatedLoader from "@/components/ui/AnimatedLoader";
import HospitalPic from "@/assets/images/hospital-logo.jpg";
import style from "./styles/nearbyHospital.module.css";

type Props = {
    triggerLocation?: number;
};

const NearbyHospitals = ({ triggerLocation = 0 }: Props) => {
    const { hospitals, loading, message } = useNearbyHospitals({ triggerLocation });
    const navigate = useNavigate();

    return (
        <section className={style.section}>
            <div className={style.headerRow}>
                <div className={style.note}>
                    {loading ? (
                        "Scanning Area..."
                    ) : (
                        <>
                            <FiNavigation className={style.pulse} />
                            <span>{message}</span>
                        </>
                    )}
                </div>

                {!loading && hospitals.length > 0 && (
                    <button onClick={() => navigate("/directory")} className={style.textLink}>
                        View full directory <FiArrowRight />
                    </button>
                )}
            </div>

            {loading ? (
                <AnimatedLoader message="Scanning for local facilities..." variant="card" count={3} />
            ) : (
                <>
                    {hospitals.length > 0 ? (
                        <div className={style.grid}>
                            {hospitals.map((h) => (
                                <article key={h._id} className={style.card}>
                                    <div className={style.imageContainer}>
                                        <img
                                            src={h.photoUrl || HospitalPic}
                                            alt={h.name}
                                            className={style.image}
                                            loading="lazy"
                                        />
                                        {h.distance && <span className={style.distBadge}>{h.distance}</span>}
                                    </div>

                                    <div className={style.cardContent}>
                                        <div className={style.cardHeader}>
                                            {h.type && (
                                                <span className={`${style.typeBadge} ${h.type.toLowerCase() === 'private' ? style.privateBadge : style.publicBadge}`}>
                                                    {h.type}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className={style.title}>{h.name}</h3>

                                        <p className={style.location}>
                                            <FiMapPin className={style.pinIcon} />
                                            {h.address?.city || h.address?.state
                                                ? [h.address?.city, h.address?.state].filter(Boolean).join(", ")
                                                : "Verified Facility"}
                                        </p>

                                        <button
                                            className={style.viewBtn}
                                            onClick={() => navigate(`/hospital/${h.address?.state}/${h.address?.city}/${h.slug}`)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className={style.emptyState}>
                            <p>No verified hospitals found in this specific area yet.</p>
                        </div>
                    )}

                    {hospitals.length > 0 && (
                        <div className={style.actionWrapper}>
                            <button className={style.viewAllBtn} onClick={() => navigate("/directory")}>
                                Browse Global Directory
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default NearbyHospitals;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./style/nearbyHospital.module.css";
import AnimatedLoader from "../components/utils/AnimatedLoader";
import HospitalPic from "../assets/images/hospital-logo.jpg"

type Hospital = {
    _id?: string;
    name: string;
    slug?: string;
    address?: {
        state?: string;
        city?: string;
    };
    lat?: number;
    lon?: number;
    type?: string;
    distance?: string;
    photoUrl?: string;
};

type Props = {
    triggerLocation?: number;
};

const URL = import.meta.env.VITE_BASE_URL;

const NearbyHospitals = ({ triggerLocation = 0 }: Props) => {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string>("");
    const navigate = useNavigate();

    const fetchHospitals = async (lat?: number, lon?: number, useFallback = false): Promise<void> => {
        setLoading(true);
        try {
            let url = `${URL}/hospitals/nearby?limit=3`;

            if (useFallback) {
                url = `${URL}/hospitals/top`;
            } else if (lat && lon) {
                url = `${URL}/hospitals/nearby?lat=${lat}&lon=${lon}&limit=3`;
            }

            const res = await fetch(url);
            const data = await res.json();

            // Handle multiple API response formats safely
            const results = Array.isArray(data) ? data : (data?.results || []);
            setHospitals(results);

            // user-facing message
            if (results.length > 0) {
                if (lat && lon) setMessage("Showing verified hospitals near your current location.");
                else if (useFallback) setMessage("Showing top-rated hospitals worldwide.");
                else setMessage("Explore hospitals from our global directory.");
            } else {
                setMessage("No hospitals found in this area.");
            }
        } catch (err) {
            setMessage("Unable to load hospitals. Check your connection.");
            setHospitals([]);
        } finally {
            setLoading(false);
        }
    };

    // requestLocation logic
    const handleRequestLocation = () => {
        if (!navigator.geolocation) {
            setMessage("Location not supported — showing global hospitals.");
            fetchHospitals(undefined, undefined, true);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => fetchHospitals(pos.coords.latitude, pos.coords.longitude),
            () => {
                setMessage("Location access denied — displaying top global hospitals.");
                fetchHospitals(undefined, undefined, true);
            }
        );
    };

    useEffect(() => {
        if (triggerLocation > 0) {
            handleRequestLocation();
        } else {
            fetchHospitals(undefined, undefined, true);
        }
    }, [triggerLocation]);

    return (
        <section className={style.section}>
            {message && <p className={style.note}>{message}</p>}

            {loading ? (
                <AnimatedLoader message="Searching for hospitals near you..." variant="card" count={3} />
            ) : hospitals.length > 0 ? (
                <>
                    <div className={style.grid}>
                        {hospitals.map((h, i) => (
                            <div key={h._id || i} className={style.card}>
                                <div className={style.imageContainer}>
                                    <img
                                        src={h.photoUrl || HospitalPic}
                                        alt={`Photo of ${h.name}`}
                                        className={style.image}
                                        loading="lazy"
                                    />
                                </div>
                                <div className={style.cardContent}>
                                    <div className={style.cardHeader}>
                                        <h3 className={style.title}>{h.name || "Unnamed Hospital"}</h3>
                                        {h.type && (
                                            <span className={`${style.typeBadge} ${h.type.toLowerCase() === 'private' ? style.privateBadge : style.publicBadge}`}>
                                                {h.type}
                                            </span>
                                        )}
                                    </div>

                                    <p className={style.location}>
                                        📍 {h.address?.city || h.address?.state
                                            ? [h.address?.city, h.address?.state].filter(Boolean).join(", ")
                                            : "Verified Global Location"}
                                    </p>
                                    {h.distance && (
                                        <p className={style.distance}>
                                            <strong>{h.distance}</strong> from you
                                        </p>
                                    )}

                                    <button
                                        className={style.viewBtn}
                                        aria-label={`View details for ${h.name}`}
                                        onClick={() => navigate(`/hospital/${h.address?.state}/${h.address?.city}/${h.slug}`)}
                                    >
                                        Details →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {hospitals.length > 0 && (
                        <div className={style.actionWrapper}>
                            <button
                                className={style.viewAllBtn}
                                onClick={() => navigate("/directory")}
                            >
                                View All Nearby Hospitals
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <p className={style.status}>No hospitals found nearby.</p>
            )}
        </section>
    );
};

export default NearbyHospitals;
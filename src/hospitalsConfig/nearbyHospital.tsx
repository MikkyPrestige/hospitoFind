import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import style from "./style/nearbyHospital.module.css";
import AnimatedLoader from "../components/utils/animatedLoader";
import HospitalPic from "../assets/images/hospital-logo.jpg";
import { FiMapPin, FiNavigation } from "react-icons/fi";
import { BASE_URL } from "@/context/userContext";

type Hospital = {
    _id: string;
    name: string;
    slug: string;
    address?: {
        state?: string;
        city?: string;
    };
    type?: string;
    distance?: string;
    photoUrl?: string;
    location?: { coordinates: number[] };
};

type Props = {
    triggerLocation?: number;
};

const NearbyHospitals = ({ triggerLocation = 0 }: Props) => {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string>("Locating nearby services...");
    const navigate = useNavigate();

    // Unified Fetcher Function
    const fetchHospitals = useCallback(async (lat?: number, lon?: number) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ limit: "3" });

            // Check if lat/lon are valid numbers (including 0)
            if (typeof lat === 'number' && typeof lon === 'number') {
                params.append("lat", lat.toString());
                params.append("lon", lon.toString());
            }

            const res = await fetch(`${BASE_URL}/hospitals/nearby?${params.toString()}`);

            if (!res.ok) throw new Error("API Request Failed");

            const data = await res.json();

            const results = Array.isArray(data) ? data : (data.results || []);
            setHospitals(results);

            if (data.message) setMessage(data.message);
            else if (results.length === 0) setMessage("No hospitals found.");

        } catch (err) {
            console.error(err);
            setMessage("Could not load hospitals. Please check connection.");
            setHospitals([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Geolocation Handler
    useEffect(() => {
        if (triggerLocation > 0) {
            if (!navigator.geolocation) {
                setMessage("Geolocation not supported.");
                fetchHospitals();
                return;
            }
            setMessage("Acquiring location...");
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchHospitals(pos.coords.latitude, pos.coords.longitude),
                () => {
                    setMessage("Location denied. Showing popular hospitals.");
                    fetchHospitals();
                },
                { timeout: 10000 }
            );
        } else {
            // Initial Load
            fetchHospitals();
        }
    }, [triggerLocation, fetchHospitals]);

    return (
        <section className={style.section}>
            <div className={style.headerRow}>
                <p className={style.note}>
                    {loading ? "..." : <><FiNavigation /> {message}</>}
                </p>
            </div>

            {loading ? (
                <AnimatedLoader message="Scanning directory..." variant="card" count={3} />
            ) : (
                <>
                    {hospitals.length > 0 ? (
                        <div className={style.grid}>
                            {hospitals.map((h) => (
                                <div key={h._id} className={style.card}>
                                    <div className={style.imageContainer}>
                                        <img
                                            src={h.photoUrl || HospitalPic}
                                            alt={h.name}
                                            className={style.image}
                                            loading="lazy"
                                        />
                                        {h.distance && <span className={style.distBadge}>{h.distance} away</span>}
                                    </div>

                                    <div className={style.cardContent}>
                                        <div className={style.cardHeader}>
                                            <h3 className={style.title}>{h.name}</h3>
                                            {h.type && (
                                                <span className={`${style.typeBadge} ${h.type.toLowerCase() === 'private' ? style.privateBadge : style.publicBadge}`}>
                                                    {h.type}
                                                </span>
                                            )}
                                        </div>

                                        <p className={style.location}>
                                            <FiMapPin className={style.pinIcon} />
                                            {h.address?.city || h.address?.state
                                                ? [h.address?.city, h.address?.state].filter(Boolean).join(", ")
                                                : "Verified Location"}
                                        </p>

                                        <button
                                            className={style.viewBtn}
                                            onClick={() => navigate(`/hospital/${h.address?.state}/${h.address?.city}/${h.slug}`)}
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={style.emptyState}>
                            <p>No verified hospitals available right now.</p>
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
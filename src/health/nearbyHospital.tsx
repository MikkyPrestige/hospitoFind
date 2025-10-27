import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./style/nearbyHospital.module.css";

type Hospital = {
    _id?: string;
    name: string;
    address?: {
        state?: string;
        city?: string;
    }
    lat?: number;
    lon?: number;
    type?: string;
    distance?: string;
    photoUrl?: string;
};

const URL = import.meta.env.VITE_BASE_URL;

const NearbyHospitals = () => {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [locationDenied, setLocationDenied] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHospitals = async (lat?: number, lon?: number): Promise<void> => {
            setLoading(true);
            try {
                // let url = "http://localhost:5000/hospitals?limit=3";
                let url = `${import.meta.env.VITE_BASE_URL}/hospitals?limit=3`;
                if (lat && lon) {
                    // url = `http://localhost:5000/hospitals/nearby?lat=${lat}&lon=${lon}&limit=3`;
                    url = `${URL}/hospitals/nearby?lat=${lat}&lon=${lon}&limit=3`;
                }

                const res = await fetch(url);
                const data = await res.json();
                console.log("📦 Hospital API response:", data);

                if (Array.isArray(data)) {
                    setHospitals(data);
                } else if (data && Array.isArray(data.results)) {
                    setHospitals(data.results);
                    if (data.fallback && data.message) {
                        setLocationDenied(true);
                        console.log("Fallback reason:", data.message);
                    }
                } else {
                    setHospitals([]);
                }
            } catch (err) {
                console.error("Error fetching hospitals:", err);
            } finally {
                setLoading(false);
            }
        };

        // Try geolocation first
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchHospitals(pos.coords.latitude, pos.coords.longitude),
                () => {
                    setLocationDenied(true);
                    fetchHospitals(); // fallback to IP or global
                }
            );
        } else {
            fetchHospitals();
        }
    }, []);

    return (
        <section className={style.section}>
            <h2 className={style.heading}>Hospitals Near You</h2>
            <p className={style.subHeading}>
                Discover trusted hospitals closest to your location.
            </p>
            {locationDenied && (
                <p className={style.note}>
                    Showing hospitals based on your location or global data.
                </p>
            )}

            {loading ? (
                <p className={style.status}>Searching for nearby hospitals...</p>
            ) : hospitals.length > 0 ? (
                <div className={style.grid}>
                    {hospitals.map((h, i) => (
                        <div key={i} className={style.card}>
                            {h.photoUrl && (
                                <img
                                    src={h.photoUrl}
                                    alt={h.name}
                                    className={style.image}
                                    loading="lazy"
                                />
                            )}
                            <div className={style.cardContent}>
                                <div className={style.cardHeader}>
                                    <h3 className={style.title}>{h.name || "Unnamed Hospital"}</h3>
                                    {h.type && (
                                        <span
                                            className={`${style.typeBadge} ${h.type.toLowerCase() === "private"
                                                ? style.privateBadge
                                                : style.publicBadge
                                                }`}
                                        >
                                            {h.type}
                                        </span>
                                    )}
                                </div>

                                <p className={style.location}>
                                    {h.address?.city || h.address?.state
                                        ? [h.address?.city, h.address?.state].filter(Boolean).join(", ")
                                        : "Location unavailable"}
                                </p>
                                <p className={style.distance}>
                                    {h.distance
                                        ? `📍 Approx. ${h.distance} away`
                                        : "📍 Distance unavailable"}
                                </p>

                                <button
                                    className={style.viewBtn}
                                    onClick={() => navigate(`/hospital/${h._id}`)}
                                >
                                    View Details →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className={style.status}>No hospitals found nearby.</p>
            )
            }
        </section >
    );
};

export default NearbyHospitals;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./style/nearbyHospital.module.css";

type Hospital = {
    _id?: string;
    name: string;
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

const URL = import.meta.env.VITE_BASE_URL;

const NearbyHospitals = () => {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHospitals = async (lat?: number, lon?: number, useFallback = false): Promise<void> => {
            setLoading(true);
            try {
                let url: string;

                if (useFallback) {
                    // fallback route when location is denied
                    url = `${URL}/hospitals/top`;
                } else if (lat && lon) {
                    // nearby route when geolocation is available
                    url = `${URL}/hospitals/nearby?lat=${lat}&lon=${lon}&limit=3`;
                } else {
                    // Default (try IP-based or random)
                    url = `${URL}/hospitals/nearby?limit=3`;
                }

                const res = await fetch(url);
                const data = await res.json();
                // console.log("📦 Hospital API response:", data);

                if (Array.isArray(data)) {
                    setHospitals(data);
                    setMessage("Location access denied — showing top hospitals globally.");
                } else if (data && Array.isArray(data.results)) {
                    setHospitals(data.results);
                    setMessage(data.message || "Nearby hospitals found.");
                } else {
                    setHospitals([]);
                    setMessage("No hospitals found.");
                }
            } catch (err) {
                // console.error("Error fetching hospitals:", err);
                setMessage("Failed to fetch hospital data.");
            } finally {
                setLoading(false);
            }
        };

        // 🌍 Try geolocation first
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    fetchHospitals(latitude, longitude);
                },
                (error) => {
                    console.warn("❌ Location denied or unavailable:", error.message);
                    setMessage("Location access denied — showing top hospitals globally.");
                    fetchHospitals(undefined, undefined, true); // fallback
                }
            );
        } else {
            // console.warn("Geolocation not supported — showing global hospitals.");
            fetchHospitals(undefined, undefined, true);
        }
    }, []);

    return (
        <section className={style.section}>
            <h2 className={style.heading}>Hospitals Near You</h2>
            <p className={style.subHeading}>Discover trusted hospitals closest to your location.</p>

            {message && <p className={style.note}>{message}</p>}

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
            )}
        </section>
    );
};

export default NearbyHospitals;
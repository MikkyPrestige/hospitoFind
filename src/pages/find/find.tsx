import { NavLink, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import { accessToken } from "@/config/mapbox";
import { AiOutlineSearch } from "react-icons/ai";
import { findHospitals } from "@/services/api";
import PopularHospitals from "@/components/popular";
import Header from "@/layouts/header/nav";
import Footer from "@/layouts/footer/footer";
import Motion from "@/components/motion";
import { fadeUp, sectionReveal, zoomIn } from "@/hooks/animations";
import { Hospital } from "@/services/hospital";
import HospitalPic from "@/assets/images/hospital-logo.jpg";
import { Avatar } from "@/components/avatar";
import style from "./style/find.module.css";
import style2 from "../../components/style/popular.module.css";

mapboxgl.accessToken = accessToken;

const FindHospital = () => {
    const navigate = useNavigate();
    const [term, setTerm] = useState<string>("");
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [error, setError] = useState<string>("");
    const [searching, setSearching] = useState<boolean>(false);
    const [message, setMessage] = useState<React.ReactNode>(null);
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);

    // 🗺️ Initialize Map
    useEffect(() => {
        const mapInstance = new mapboxgl.Map({
            container: mapContainer.current!,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [8.6753, 9.082],
            zoom: 6,
            accessToken,
        });

        setMap(mapInstance);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { longitude, latitude } = pos.coords;
                    mapInstance.flyTo({ center: [longitude, latitude], zoom: 10 });
                    new mapboxgl.Marker({ color: "#1E90FF" })
                        .setLngLat([longitude, latitude])
                        .setPopup(new mapboxgl.Popup().setText("You are here"))
                        .addTo(mapInstance);
                },
                () => {
                    mapInstance.flyTo({ center: [8.6753, 9.082], zoom: 6 });
                }
            );
        }

        return () => mapInstance.remove();
    }, []);

    // 🔍 Search Handler
    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setHospitals([]);
        setSearching(true);
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

        if (!term.trim()) {
            setError("Please enter a hospital name, city, or state to search.");
            setSearching(false);
            return;
        }

        const query = `term=${encodeURIComponent(term.trim())}`;
        try {
            const data = await findHospitals(query);

            if (!data || data.length === 0) {
                setHospitals([]);
                setMessage(
                    <>
                        ❌ No hospitals found in <strong>{term}</strong>. You can help by adding one from your{" "}
                        <span className={style.addLink} onClick={() => navigate("/dashboard")}>
                            Dashboard
                        </span>.
                    </>
                );

                const geoRes = await axios.get(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                        term.trim()
                    )}.json?access_token=${accessToken}`
                );
                const feature = geoRes.data.features?.[0];
                if (feature && map) {
                    const [lng, lat] = feature.center;
                    map.flyTo({ center: [lng, lat], zoom: 10 });
                }
                return;
            }

            setHospitals(data);
            setMessage("");

            if (map) {
                const bounds = new mapboxgl.LngLatBounds();

                data.forEach((hospital: Hospital) => {
                    if (hospital.longitude && hospital.latitude) {
                        const marker = new mapboxgl.Marker({ color: "#E63946" })
                            .setLngLat([hospital.longitude, hospital.latitude])
                            .setPopup(
                                new mapboxgl.Popup().setHTML(`
                  <strong>${hospital.name}</strong><br/>
                  ${hospital.address?.street || ""}<br/>
                  ${hospital.address?.city || ""}, ${hospital.address?.state || ""}<br/>
                  <em>Click “See more” for full details.</em>
                `)
                            )
                            .addTo(map);

                        markersRef.current.push(marker);
                        bounds.extend([hospital.longitude, hospital.latitude]);
                    }
                });

                if (!bounds.isEmpty()) {
                    map.fitBounds(bounds, { padding: 80, maxZoom: 12, duration: 1000 });
                }
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong while searching. Please try again.");
        } finally {
            setSearching(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Find Hospitals | HospitoFind</title>
                <meta name="description" content="Find nearby hospitals and healthcare centers." />
                <meta name="keywords" content="hospital, doctor, clinic, health, find, search, nearby" />
            </Helmet>

            <Header />

            <section className={style.findSection}>
                {/* 🔍 Search Section */}
                <Motion variants={fadeUp} className={style.search} as="section">
                    <Motion variants={zoomIn} className={style.map}>
                        <div ref={mapContainer} className={style.mapBox} />
                    </Motion>

                    <Motion variants={fadeUp} className={style.container}>
                        <form onSubmit={handleSearch} className={style.form}>
                            <input
                                type="text"
                                name="term"
                                placeholder="Search hospitals by name, city, or state..."
                                onChange={(e) => setTerm(e.target.value)}
                                className={style.input}
                                value={term}
                            />
                            <button
                                type="submit"
                                disabled={searching}
                                className={`${style.cta} ${searching ? style.loading : ""}`}
                            >
                                {searching ? "Searching..." : <AiOutlineSearch className={style.icon} />}
                            </button>
                        </form>
                    </Motion>

                    {error && <p className={style.error}>{error}</p>}
                </Motion>

                {/* 🏥 Results Section */}
                <Motion variants={sectionReveal} as="section" className={style.hospitals}>
                    {hospitals.length > 0 ? (
                        <Motion variants={sectionReveal} initial="hidden" animate="visible" className={style.found}>
                            <Motion variants={fadeUp}>
                                <h2 className={style2.heading}>
                                    Found {hospitals.length} hospital{hospitals.length > 1 ? "s" : ""}{" "}
                                    {term.trim() ? <>in <span className={style2.location}>{term.trim()}</span></> : "around you"}
                                </h2>
                            </Motion>

                            <Motion variants={fadeUp}>
                                <p className={style2.subtitle}>
                                    {term.trim()
                                        ? <>Explore trusted hospitals in {term.trim()}, view their details, and find quality care faster.</>
                                        : <>Explore trusted hospitals around you, view their details, and find quality care faster.</>}
                                </p>
                            </Motion>

                            <Motion variants={sectionReveal} as="section" className={style2.wrapper}>
                                {hospitals.map((hospital, id) => (
                                    <Motion key={id} variants={fadeUp} className={style2.card}>
                                        <div className={style2.img}>
                                            <Avatar
                                                image={hospital.photoUrl || HospitalPic}
                                                alt="hospital"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    borderRadius: "1.2rem",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        </div>
                                        <div className={style2.details}>
                                            <p className={style2.name}>{hospital.name}</p>
                                            <p>
                                                {hospital.address?.street}, {hospital.address?.city}, {hospital.address?.state}
                                            </p>
                                            <NavLink to={`${hospital._id}`} className={style2.btn}>
                                                See more
                                            </NavLink>
                                        </div>
                                    </Motion>
                                ))}
                            </Motion>
                        </Motion>
                    ) : message ? (
                            <Motion variants={fadeUp} className={style.noResults}>
                            <p className={style.noResultsText}>{message}</p>
                        </Motion>
                    ) : (
                        !searching && (
                                    <Motion variants={fadeUp} initial="hidden" animate="visible">
                                <PopularHospitals />
                            </Motion>
                        )
                    )}
                </Motion>
            </section>

            <Footer />
        </>
    );
};

export default FindHospital;
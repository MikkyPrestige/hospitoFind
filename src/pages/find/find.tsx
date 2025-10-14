import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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

    // Initialize map and user location
    useEffect(() => {
        const mapInstance = new mapboxgl.Map({
            container: mapContainer.current!,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [8.6753, 9.082], // Nigeria
            zoom: 6,
            accessToken,
        });

        setMap(mapInstance);

        // Try user location
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

    // 🔍 Handle search
    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setHospitals([]);
        setSearching(true);

        // Clear old markers
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

        if (!term.trim()) {
            setError("Please enter a hospital name, city, or state");
            setSearching(false);
            return;
        }

        const query = `term=${encodeURIComponent(term.trim())}`;
        try {
            console.log("🔍 Searching with query:", query);
            const data = await findHospitals(query);

            if (!data || data.length === 0) {
                setHospitals([]);
                setMessage(
                    <>
                        ❌ No hospitals found in {term}. You can add one from the{" "}
                        <span
                            className={style.addLink}
                            onClick={() => navigate("/dashboard")}
                        > Dashboard </span>
                    </>
                );


                // 🗺️ Geocode fallback for city/state
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
                  ${hospital.address?.city || ""}, ${hospital.address?.state || ""}
                `)
                            )
                            .addTo(map);

                        markersRef.current.push(marker);
                        bounds.extend([hospital.longitude, hospital.latitude]);
                    }
                });

                if (!bounds.isEmpty()) {
                    const zoomBounds = bounds.isEmpty()
                        ? 10
                        : Math.min(map.getZoom(), 12); // prevent over-zoom
                    map.fitBounds(bounds, {
                        padding: 80,
                        maxZoom: zoomBounds,
                        duration: 1000,
                    });
                }
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong while searching");
        } finally {
            setSearching(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Find | Hospital Finder</title>
                <meta name="description" content="Find the nearest hospital to you" />
                <meta
                    name="keywords"
                    content="hospital, doctor, health, care, medical, clinic, find, search, nearby"
                />
            </Helmet>

            <Header />

            <section className={style.findSection}>
                <div className={style.search}>
                    <div className={style.map}>
                        <div
                            ref={mapContainer}
                            style={{ width: "100%", height: "100%", borderRadius: "1rem" }}
                        />
                    </div>

                    <div className={style.container}>
                        <form onSubmit={handleSearch} className={style.form}>
                            <input
                                type="text"
                                name="term"
                                placeholder="Search by hospital name, city or state"
                                onChange={(e) => setTerm(e.target.value)}
                                className={style.input}
                                value={term}
                            />

                            <button type="submit"
                                disabled={searching}
                                className={`${style.cta} ${searching ? style.loading : ""}`}>
                                {searching ? "Searching..." : <AiOutlineSearch className={style.icon} />}
                            </button>
                        </form>
                    </div>

                    {error && <p className={style.error}>{error}</p>}
                </div>

                <div className={style.hospitals}>
                    {hospitals.length > 0 ? (
                        <div className={style.found}>
                            <h2 className={style2.heading}>{hospitals.length} Hospitals found</h2>
                            <ul className={style2.wrapper}>
                                {hospitals.map((hospital, id) => (
                                    <li key={id} className={style2.card}>
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
                                                {hospital.address?.street}, {hospital.address?.city},{" "}
                                                {hospital.address?.state}
                                            </p>
                                            <NavLink to={`${hospital.name}`} className={style2.btn}>
                                                See more
                                            </NavLink>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : message ? (
                        <div className={style.noResults}>
                            <p className={style.noResultsText}>{message}</p>
                        </div>
                    ) : (
                        !searching && <PopularHospitals />
                    )}
                </div>
            </section>
        </>
    );
};

export default FindHospital;

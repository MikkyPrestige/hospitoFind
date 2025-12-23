import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import { FaHospital } from "react-icons/fa";
import { accessToken } from "@/config/mapbox";
import { findHospitals } from "@/services/api";
import PopularHospitals from "@/components/popular";
import Header from "@/layouts/header/nav";
import Footer from "@/layouts/footer/footer";
import Motion from "@/components/motion";
import { fadeUp, sectionReveal, zoomIn } from "@/hooks/animations";
import { Hospital } from "@/services/hospital";
import HospitalPic from "@/assets/images/hospital-logo.jpg";
import { Avatar } from "@/components/avatar";
import style from "./style/find.module.scss";
import { SEOHelmet } from "@/components/utils/seoUtils";

mapboxgl.accessToken = accessToken;
const URL = import.meta.env.VITE_BASE_URL;

const FindHospital = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [term, setTerm] = useState<string>(searchParams.get("q") || "");
    const [searchedTerm, setSearchedTerm] = useState<string>("");
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    // @ts-ignore
    const [error, setError] = useState<string>("");
    const [searching, setSearching] = useState<boolean>(false);
    const [message, setMessage] = useState<React.ReactNode>(null);
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const [searchMode, setSearchMode] = useState<"term" | "nearby">("term");
    const [locationName, setLocationName] = useState<string | null>(null);

    // 1. Initialize Map
    useEffect(() => {
        const mapInstance = new mapboxgl.Map({
            container: mapContainer.current!,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [0, 0],
            zoom: 1.5,
            attributionControl: false,
            accessToken,
        });

        const geolocate = new mapboxgl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true,
            showUserHeading: true,
            fitBoundsOptions: { maxZoom: 10 },
        });

        mapInstance.addControl(geolocate, "top-left");

        geolocate.on("geolocate", async (e: any) => {
            const { latitude, longitude } = e.coords as GeolocationCoordinates;
            try {
                const res = await fetch(`${URL}/hospitals/nearby?lat=${latitude}&lng=${longitude}`);
                const data = await res.json();
                const results = data.results || [];
                setHospitals(results);
                updateMapMarkers(results, mapInstance, [longitude, latitude]);
            } catch (err) {
                console.error("Error fetching nearby hospitals:", err);
            }
        });

        setMap(mapInstance);
        return () => mapInstance.remove();
    }, []);

    // 2. Helper function to update markers
    const updateMapMarkers = (data: Hospital[], mapInstance: mapboxgl.Map, userCoords?: [number, number]) => {
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];
        if (!mapInstance) return;

        const bounds = new mapboxgl.LngLatBounds();
        if (userCoords) bounds.extend(userCoords);

        data.forEach((hospital) => {
            if (hospital.longitude && hospital.latitude) {
                const marker = new mapboxgl.Marker({ color: "#2563EB" })
                    .setLngLat([hospital.longitude, hospital.latitude])
                    .setPopup(
                        new mapboxgl.Popup({ offset: 16 }).setHTML(`
                            <strong>${hospital.name}</strong><br/>
                            ${hospital.address?.street || ""}, ${hospital.address?.city || ""}<br/>
                            <a href="/hospital/${hospital.address.state}/${hospital.address.city}/${hospital.slug}" class="popup-link">See more</a>
                        `)
                    )
                    .addTo(mapInstance);
                markersRef.current.push(marker);
                bounds.extend([hospital.longitude, hospital.latitude]);
            }
        });

        if (!bounds.isEmpty()) {
            mapInstance.fitBounds(bounds, { padding: 80, maxZoom: 12, duration: 1000 });
        }
    };

    // 3. Shared Search Function
    const performSearch = async (searchTerm: string) => {
        if (!searchTerm.trim()) return;

        setSearchMode("term");
        setError("");
        setMessage(null);
        setSearching(true);

        try {
            const apiQuery = `term=${encodeURIComponent(searchTerm.trim())}`;
            const data = await findHospitals(apiQuery);

            // Case 1: No results found
            if (!data || data.length === 0) {
                setHospitals([]);
                setSearchedTerm("");
                setMessage(
                    <>
                        We couldn’t find any hospitals in <strong>{searchTerm}</strong>.
                        Help expand access by adding one through your{" "}
                        <span className={style.addLink} onClick={() => navigate("/dashboard")}>
                            Dashboard
                        </span>.
                    </>
                );

                // Geocode the name to at least move the map to that city/country
                const geoRes = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchTerm)}.json?access_token=${accessToken}`);
                const feature = geoRes.data.features?.[0];
                if (feature && map) {
                    map.flyTo({ center: feature.center, zoom: 6 });
                }
                return;
            }

            // Case 2: Results found
            setHospitals(data);
            setSearchedTerm(searchTerm);

            if (map) {
                updateMapMarkers(data, map);

                // Special zoom if it's a single specific hospital
                if (data.length === 1 && data[0].longitude && data[0].latitude) {
                    map.flyTo({
                        center: [data[0].longitude, data[0].latitude],
                        zoom: 15,
                        duration: 2000
                    });
                }
            }

        } catch (err) {
            setError("Something went wrong while searching. Please try again.");
        } finally {
            setSearching(false);
        }
    };

    // 4. Auto-trigger from Homepage (URL change)
    useEffect(() => {
        const urlSearchTerm = searchParams.get("q");
        if (urlSearchTerm) {
            setTerm(urlSearchTerm);
            performSearch(urlSearchTerm);
        }
    }, [searchParams]);

    // 5. Form Submit Handler
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (term.trim() === "") {
            setHospitals([]);
            setSearchedTerm("");
            setMessage(null);
            return;
        }

        if (term.trim()) {
            // This updates the URL, which triggers the useEffect above
            navigate(`/find-hospital?q=${encodeURIComponent(term.trim())}`);
        } else {
            setError("Please enter a hospital name, city, or state.");
        }
    };

    const fetchNearbyHospitals = async () => {
        setSearching(true)
        setError("");
        setMessage(null);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    const response = await fetch(`${URL}/hospitals/nearby?lat=${latitude}&lng=${longitude}`);
                    const data = await response.json();
                    const results = data.results || [];

                    setHospitals(results);
                    setSearchMode("nearby");
                    setSearchedTerm("");

                    if (results.length > 0) {
                        const { city, state } = results[0].address;
                        setLocationName(`${city}, ${state}`);
                        setSearchMode("nearby");
                        setSearchedTerm("");
                        if (map) updateMapMarkers(results, map, [longitude, latitude]);
                    }
                } catch (error) {
                    setError("Could not find hospitals near your location.");
                } finally {
                    setSearching(false);
                }
            });
        }
    };

    return (
        <>
            <SEOHelmet
                title={term ? `Hospitals in ${term}` : "Find Hospitals Near You"}
                description={
                    term
                        ? `Discover verified hospitals in ${term}. HospitoFind helps you connect with verified healthcare facilities, services and hospital profiles easily.`
                        : "Use HospitoFind’s hospital finder to search hospitals by name, city, or country. Connect with verified healthcare facilities worldwide."
                }
                canonical={
                    term
                        ? `https://hospitofind.online/find-hospital?query=${encodeURIComponent(term)}`
                        : "https://hospitofind.online/find-hospital"
                }
                schemaType="search"
                schemaData={[]}
                autoBreadcrumbs={true}
            />

            <Header />

            <main className={style.findSection}>
                <SEOHelmet
                    title={term ? `Hospitals in ${term}` : "Find Hospitals Near You"}
                    description={term ? `Discover verified hospitals in ${term}.` : "Search hospitals by name, city, or country."}
                    canonical={term ? `https://hospitofind.online/find-hospital?query=${encodeURIComponent(term)}` : "https://hospitofind.online/find-hospital"}
                    schemaType="search"
                    autoBreadcrumbs={true}
                />

                <Header />
                <h1 className={style['sr-only']}>Find Hospitals</h1>
                <Motion
                    className={style.search}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    as="section"
                    style={{ overflow: "visible", display: "flex" }}
                >
                    {/* LEFT SIDE: Sidebar containing Search and Results */}
                    <aside className={style.hospitals}>
                        <div className={style.searchContainer}>
                            <form onSubmit={handleSearch} className={style.form}>
                                <input className={style.input} value={term} onChange={(e) => setTerm(e.target.value)} />
                                <button className={style.cta}>Search</button>
                            </form>
                        </div>

                        {/* Scrollable Content Area */}
                        <div className={style.resultsContent}>
                            {hospitals.length > 0 ? (
                                <Motion variants={sectionReveal} initial="hidden" animate="visible" className={style.found}>
                                    <Motion variants={fadeUp}>
                                        <h2 className={style.heading}>
                                            {hospitals.length === 1 && hospitals[0].name.toLowerCase().includes(searchedTerm.toLowerCase()) ? (
                                                <>Result for <span className={style.highlight}>"{hospitals[0].name}"</span></>
                                            ) : searchMode === "nearby" ? (
                                                <>{hospitals.length} Hospitals found {locationName ? `near ${locationName}` : "near you"}</>
                                            ) : (
                                                <>{hospitals.length} Hospitals found in <span className={style.highlight}>"{searchedTerm || term}"</span></>
                                            )}
                                        </h2>
                                    </Motion>

                                    <Motion variants={fadeUp}>
                                        <p className={style.subtitle}>
                                            {hospitals.length === 1 && hospitals[0].name.toLowerCase().includes(term.toLowerCase())
                                                ? "We found the specific facility you were looking for."
                                                : `Browse verified healthcare facilities in ${searchedTerm || 'your area'} and connect with quality care faster.`
                                            }
                                        </p>
                                    </Motion>

                                    <div className={style.wrapper}>
                                        {hospitals.map((hospital, id) => (
                                            <Motion key={id} variants={fadeUp} className={style.card}>
                                                <div className={style.img}>
                                                    <Avatar
                                                        image={hospital.photoUrl || HospitalPic}
                                                        alt={`Photo of ${hospital.name}`}
                                                        style={{ width: "100%", height: "100%", borderRadius: "1.2rem", objectFit: "cover" }}
                                                    />
                                                </div>
                                                <div className={style.details}>
                                                    <h3 className={style.name}>{hospital.name}</h3>
                                                    <p>{hospital.address?.street}, {hospital.address?.city}</p>
                                                    <NavLink
                                                        to={`/hospital/${hospital.address.state}/${hospital.address.city}/${hospital.slug}`}
                                                        className={style.btn}
                                                    >
                                                        See more
                                                    </NavLink>
                                                </div>
                                            </Motion>
                                        ))}
                                    </div>
                                </Motion>
                            ) : message ? (
                                <Motion variants={fadeUp} className={style.noResults}>
                                    <div className={style.noResultsIcon}><FaHospital /></div>
                                    <p className={style.noResultsText}>{message}</p>
                                    <p className={style.retryLink} onClick={fetchNearbyHospitals}>
                                        Or view hospitals near you 📍
                                    </p>
                                </Motion>
                            ) : (
                                !searching && (
                                    <Motion as="div" variants={fadeUp} initial="hidden" animate="visible">
                                        <PopularHospitals />
                                    </Motion>
                                )
                            )}
                        </div>
                    </aside>

                    {/* RIGHT SIDE: Fixed Map */}
                    <Motion className={style.map} variants={zoomIn}>
                        <div ref={mapContainer} className={style.mapBox} />
                    </Motion>
                </Motion>
                <Footer />
            </main>
            <Footer />
        </>
    );
};

export default FindHospital;
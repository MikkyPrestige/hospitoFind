import axios from "axios";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTheme } from "@/context/themeContext";
import { accessToken } from "@/config/mapbox";
import { BASE_URL } from "@/context/userContext";
import { findHospitals } from "@/services/api";
import PopularHospitals from "@/components/popular";
import Motion from "@/components/motion";
import { fadeUp, sectionReveal, zoomIn } from "@/hooks/animations";
import { Hospital } from "@/services/hospital";
import { FaHospital } from "react-icons/fa";
import { Avatar } from "@/components/avatar";
import HospitalPic from "@/assets/images/hospital-logo.jpg";
import style from "./style/find.module.scss";
import { SEOHelmet } from "@/components/utils/seoUtils";

mapboxgl.accessToken = accessToken;

const FindHospital = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialQ = searchParams.get("q") || "";
    const initialCity = searchParams.get("city");
    const initialState = searchParams.get("state");
    const displayTerm = initialQ || (initialCity && initialState ? `${initialCity}, ${initialState}` : "");
    const [term, setTerm] = useState<string>(displayTerm);
    const [searchedTerm, setSearchedTerm] = useState<string>("");
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [, setError] = useState<string>("");
    const [searching, setSearching] = useState<boolean>(false);
    const [message, setMessage] = useState<React.ReactNode>(null);
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const [searchMode, setSearchMode] = useState<"term" | "nearby">("term");
    const [locationName, setLocationName] = useState<string | null>(null);
    const LIGHT_STYLE = "mapbox://styles/mapbox/streets-v11";
    const DARK_STYLE = "mapbox://styles/mapbox/navigation-night-v1";

    //  Initialize Map
    useEffect(() => {
        if (map) return;

        const mapInstance = new mapboxgl.Map({
            container: mapContainer.current!,
            style: theme === 'dark' ? DARK_STYLE : LIGHT_STYLE,
            // style: "mapbox://styles/mapbox/streets-v11",
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
                const res = await fetch(`${BASE_URL}/hospitals/nearby?lat=${latitude}&lng=${longitude}`);
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

    // Dynamic Theme Switcher Effect
    useEffect(() => {
        if (!map) return;
        map.setStyle(theme === 'dark' ? DARK_STYLE : LIGHT_STYLE);
    }, [theme, map]);

    // Helper function to update markers
    const updateMapMarkers = (data: Hospital[], mapInstance: mapboxgl.Map, userCoords?: [number, number]) => {
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];
        if (!mapInstance) return;

        const bounds = new mapboxgl.LngLatBounds();
        if (userCoords) bounds.extend(userCoords);

        data.forEach((hospital) => {
            if (hospital.longitude && hospital.latitude) {
                const marker = new mapboxgl.Marker({ color: "var(--color-blue-light)" })
                    .setLngLat([hospital.longitude, hospital.latitude])
                    .setPopup(
                        new mapboxgl.Popup({ offset: 16, className: theme === 'dark' ? 'dark-popup' : '' }).setHTML(`
                            <strong>${hospital.name}</strong><br/>
                            ${hospital.address?.street || ""}, ${hospital.address?.city || ""}<br/>
                            <a href="/hospital/${hospital.address.state}/${hospital.address.city}/${hospital.slug}" class="popup-link">View Details</a>
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

    // Search Function
    const performSearch = async (overrideParams?: { term?: string, city?: string, state?: string }) => {
        setSearchMode("term");
        setError("");
        setMessage(null);
        setSearching(true);

        try {
            let apiQuery = "";
            let displayString = "";

            // Prioritize Override Params (from URL)
            if (overrideParams?.city && overrideParams?.state) {
                apiQuery = `city=${encodeURIComponent(overrideParams.city)}&state=${encodeURIComponent(overrideParams.state)}`;
                displayString = `${overrideParams.city}, ${overrideParams.state}`;
            } else if (overrideParams?.term) {
                apiQuery = `term=${encodeURIComponent(overrideParams.term)}`;
                displayString = overrideParams.term;
            } else if (term.trim()) {
                // Fallback to State Term
                apiQuery = `term=${encodeURIComponent(term.trim())}`;
                displayString = term.trim();
            } else {
                return;
            }

            const data = await findHospitals(apiQuery);

            // No results found
            if (!data || data.length === 0) {
                setHospitals([]);
                setSearchedTerm("");
                setMessage(
                    <>
                        We couldn’t locate any verified facilities in <strong>{displayString}</strong>.
                        <br />
                        Know a hospital here? Help expand access by adding it via your{" "}
                        <span className={style.addLink} onClick={() => navigate("/dashboard")}>
                            Dashboard
                        </span>.
                    </>
                );

                // Geocode to move map
                try {
                    const geoRes = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(displayString)}.json?access_token=${accessToken}`);
                    const feature = geoRes.data.features?.[0];
                    if (feature && map) {
                        map.flyTo({ center: feature.center, zoom: 6 });
                    }
                } catch (e) { }
                return;
            }

            // Results found
            setHospitals(data);
            setSearchedTerm(displayString);

            if (map) {
                updateMapMarkers(data, map);
                // Zoom if single result
                if (data.length === 1 && data[0].longitude && data[0].latitude) {
                    map.flyTo({
                        center: [data[0].longitude, data[0].latitude],
                        zoom: 15,
                        duration: 2000
                    });
                }
            }

        } catch (err) {
            setError("We encountered an issue searching for hospitals. Please try again.");
        } finally {
            setSearching(false);
        }
    };

    // URL SYNC LOGIC (Handles both ?q=... AND ?city=...&state=...)
    useEffect(() => {
        const urlQ = searchParams.get("q");
        const urlCity = searchParams.get("city");
        const urlState = searchParams.get("state");

        if (urlCity && urlState) {
            // Precise Dropdown Search
            setTerm(`${urlCity}, ${urlState}`);
            performSearch({ city: urlCity, state: urlState });
        } else if (urlQ) {
            // Standard Text Search
            setTerm(urlQ);
            performSearch({ term: urlQ });
        }
    }, [searchParams]);

    // Form Submit Handler
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (term.trim() === "") {
            setHospitals([]);
            setSearchedTerm("");
            setMessage(null);
            return;
        }

        navigate(`/find-hospital?q=${encodeURIComponent(term.trim())}`);
    };

    const fetchNearbyHospitals = async () => {
        setSearching(true);
        setError("");
        setMessage(null);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    const response = await fetch(`${BASE_URL}/hospitals/nearby?lat=${latitude}&lng=${longitude}`);
                    const data = await response.json();
                    const results = data.results || [];

                    setHospitals(results);
                    setSearchMode("nearby");
                    setSearchedTerm("");

                    if (results.length > 0) {
                        const { city, state } = results[0].address;
                        setLocationName(`${city}, ${state}`);
                        if (map) updateMapMarkers(results, map, [longitude, latitude]);
                    }
                } catch (error) {
                    setError("We could not determine your location. Please check your permissions.");
                } finally {
                    setSearching(false);
                }
            });
        }
    };

    return (
        <>
            <SEOHelmet
                title={term ? `Hospitals in ${term}` : "Find Hospitals & Clinics"}
                description={term ? `Discover verified hospitals in ${term}.` : "Locate verified hospitals, clinics, and healthcare providers near you."}
                canonical={term ? `https://hospitofind.online/find-hospital?query=${encodeURIComponent(term)}` : "https://hospitofind.online/find-hospital"}
                schemaType="search"
                schemaData={[]}
                autoBreadcrumbs={true}
            />

            <main className={style.findSection}>
                <h1 className={style['sr-only']}>Find Hospitals and Healthcare Facilities</h1>
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
                                                <>Match found: <span className={style.highlight}>"{hospitals[0].name}"</span></>
                                            ) : searchMode === "nearby" ? (
                                                <>{hospitals.length} facilities found {locationName ? `near ${locationName}` : "near you"}</>
                                            ) : (
                                                <>{hospitals.length} facilities found in <span className={style.highlight}>"{searchedTerm || term}"</span></>
                                            )}
                                        </h2>
                                    </Motion>

                                    <Motion variants={fadeUp}>
                                        <p className={style.subtitle}>
                                            Connect with top-rated medical centers and verified healthcare providers in {searchedTerm || 'your area'}.
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
                                                        View Details
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
                                        <button className={style.retryBtn} onClick={fetchNearbyHospitals}>
                                            Browse verified facilities near you 📍
                                        </button>
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

                    {/* RIGHT SIDE: Map */}
                    <Motion className={style.map} variants={zoomIn}>
                        <div ref={mapContainer} className={style.mapBox} />
                    </Motion>
                </Motion>
            </main>
        </>
    );
};

export default FindHospital;
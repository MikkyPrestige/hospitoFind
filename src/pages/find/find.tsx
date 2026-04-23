import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTheme } from "@/context/ThemeProvider";
import { accessToken } from "@/config/mapbox";
import PopularHospitals from "@/components/hospital/PopularHospitals";
import Motion from "@/components/ui/Motion";
import { fadeUp, sectionReveal, zoomIn } from "@/utils/animations";
import { Hospital } from "@/types/hospital";
import { FaHospital, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { Avatar } from "@/components/ui/Avatar";
import HospitalPic from "@/assets/images/hospital-logo.jpg";
import style from "./styles/find.module.scss";
import { SEOHelmet } from "@/components/ui/SeoHelmet";
import { useHospitalDiscovery } from "@/hooks/useHospitalDiscovery";

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
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const LIGHT_STYLE = "mapbox://styles/mapbox/streets-v11";
    const DARK_STYLE = "mapbox://styles/mapbox/navigation-night-v1";

    const {
        hospitals, searching, error, searchMode, locationName,
        emptyResultQuery, geocodedCenter, performSearch, fetchNearby
    } = useHospitalDiscovery();

    useEffect(() => {
        if (map) return;

        const mapInstance = new mapboxgl.Map({
            container: mapContainer.current!,
            style: theme === 'dark' ? DARK_STYLE : LIGHT_STYLE,
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
            const results = await fetchNearby(latitude, longitude);
            if (results.length > 0) {
                updateMapMarkers(results, mapInstance, [longitude, latitude]);
            }
        });

        setMap(mapInstance);
        return () => mapInstance.remove();
    }, []);

    useEffect(() => {
        if (!map) return;
        map.setStyle(theme === 'dark' ? DARK_STYLE : LIGHT_STYLE);
    }, [theme, map]);

    // Handle map movement when geocodedCenter updates (for empty results)
    useEffect(() => {
        if (map && geocodedCenter) {
            map.flyTo({ center: geocodedCenter, zoom: 6 });
        }
    }, [geocodedCenter, map]);

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

    // URL Sync Logic
    useEffect(() => {
        const urlQ = searchParams.get("q");
        const urlCity = searchParams.get("city");
        const urlState = searchParams.get("state");

        const executeUrlSearch = async () => {
            let results: any = { data: [] };
            if (urlCity && urlState) {
                setTerm(`${urlCity}, ${urlState}`);
                results = await performSearch({ city: urlCity, state: urlState });
            } else if (urlQ) {
                setTerm(urlQ);
                results = await performSearch({ term: urlQ });
            }

            if (results.data.length > 0 && map) {
                updateMapMarkers(results.data, map);
                if (results.data.length === 1 && results.data[0].longitude && results.data[0].latitude) {
                    map.flyTo({
                        center: [results.data[0].longitude, results.data[0].latitude],
                        zoom: 15,
                        duration: 2000
                    });
                }
            }
            if (results.displayString) setSearchedTerm(results.displayString);
        };

        executeUrlSearch();
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (term.trim() === "") return;
        navigate(`/find-hospital?q=${encodeURIComponent(term.trim())}`);
    };

    const handleManualNearbySearch = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (pos) => {
                const { latitude, longitude } = pos.coords;
                const results = await fetchNearby(latitude, longitude);
                if (results.length > 0 && map) {
                    updateMapMarkers(results, map, [longitude, latitude]);
                }
            });
        }
    };

    return (
        <>
            <SEOHelmet
                title={term
                    ? `Hospitals in ${term} | Verified Healthcare Providers`
                    : "Find Hospitals & Clinics Near You"}
                description={term
                    ? `Discover verified hospitals, clinics, emergency centers, and doctors in ${term}. View services, contact info, directions, and real-time availability.`
                    : "Instantly locate verified hospitals, clinics, emergency centers, and doctors near you. Search by city, country, or specialty."}
                canonical={term
                    ? `https://hospitofind.online/find-hospital?query=${encodeURIComponent(term)}`
                    : "https://hospitofind.online/find-hospital"}
                schemaType="search"
                schemaData={hospitals}
                autoBreadcrumbs={true}
                lang="en"
            />

            <main className={style.findSection}>
                <h1 className={style['sr-only']}>Find Hospitals and Healthcare Facilities</h1>

                <Motion
                    className={style.searchLayout}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    as="section"
                >
                    <aside className={style.sidebar}>
                        <div className={style.searchHeader}>
                            <form onSubmit={handleSearch} className={style.form}>
                                <div className={style.inputWrapper}>
                                    <FaSearch className={style.searchIcon} />
                                    <input
                                        className={style.input}
                                        value={term}
                                        onChange={(e) => setTerm(e.target.value)}
                                        placeholder="Search by city, state, or facility name..."
                                    />
                                </div>
                                <button className={style.cta} disabled={searching}>
                                    {searching ? "..." : "Search"}
                                </button>
                            </form>
                        </div>

                        <div className={style.resultsArea}>
                            {hospitals.length > 0 ? (
                                <Motion variants={sectionReveal} initial="hidden" animate="visible" className={style.resultsList}>
                                    <div className={style.resultsMeta}>
                                        <h2 className={style.heading}>
                                            {hospitals.length === 1 && hospitals[0].name.toLowerCase().includes(searchedTerm.toLowerCase()) ? (
                                                <>Match found: <span className={style.highlight}>"{hospitals[0].name}"</span></>
                                            ) : searchMode === "nearby" ? (
                                                <>{hospitals.length} facilities near {locationName ? <span className={style.highlight}>{locationName}</span> : "you"}</>
                                            ) : (
                                                <>{hospitals.length} facilities in <span className={style.highlight}>"{searchedTerm || term}"</span></>
                                            )}
                                        </h2>
                                        <p className={style.subtitle}>
                                            Connect with top-rated medical centers and verified healthcare providers.
                                        </p>
                                    </div>

                                    <div className={style.cardsWrapper}>
                                        {hospitals.map((hospital, id) => (
                                            <Motion key={id} variants={fadeUp} className={style.card}>
                                                <div className={style.cardImageWrapper}>
                                                    <Avatar
                                                        image={hospital.photoUrl || HospitalPic}
                                                        alt={`Photo of ${hospital.name}`}
                                                        className={style.avatar}
                                                    />
                                                </div>
                                                <div className={style.cardDetails}>
                                                    <h3 className={style.cardName}>{hospital.name}</h3>
                                                    <p className={style.cardAddress}>
                                                        <FaMapMarkerAlt className={style.pinIcon} />
                                                        {hospital.address?.street}, {hospital.address?.city}
                                                    </p>
                                                    <NavLink
                                                        to={`/hospital/${hospital.address?.state}/${hospital.address?.city}/${hospital.slug}`}
                                                        className={style.viewBtn}
                                                    >
                                                        View Details
                                                    </NavLink>
                                                </div>
                                            </Motion>
                                        ))}
                                    </div>
                                </Motion>
                            ) : emptyResultQuery ? (
                                <Motion variants={fadeUp} className={style.emptyState}>
                                    <div className={style.emptyStateIcon}><FaHospital /></div>
                                    <p className={style.emptyStateText}>
                                        We couldn’t locate any verified facilities in <strong>{emptyResultQuery}</strong>.
                                        <br /><br />
                                        Know a hospital here? Help expand access by adding it via your{" "}
                                        <span className={style.addLink} onClick={() => navigate("/dashboard")}>
                                            Dashboard
                                        </span>.
                                    </p>
                                </Motion>
                            ) : error ? (
                                <Motion variants={fadeUp} className={style.emptyState}>
                                    <div className={style.emptyStateIcon}><FaHospital /></div>
                                    <p className={style.emptyStateText}>{error}</p>
                                    <button className={style.retryBtn} onClick={handleManualNearbySearch}>
                                        <FaMapMarkerAlt /> Browse facilities near me
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

                    <Motion className={style.mapWrapper} variants={zoomIn}>
                        <div ref={mapContainer} className={style.mapBox} />
                    </Motion>
                </Motion>
            </main>
        </>
    );
};

export default FindHospital;
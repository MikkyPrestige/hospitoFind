import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTheme } from "@/context/ThemeProvider";
import { accessToken } from "@/config/mapbox";
import { Hospital } from "@/types/hospital";
import { autocompleteHospitals } from "@/services/api";
import { useHospitalDiscovery } from "@/hooks/useHospitalDiscovery";
import { useGeolocation } from "@/hooks/useGeolocation";
import HospitalCard from "@/components/hospital/HospitalCard";
import PopularHospitals from "@/components/hospital/PopularHospitals";
import Motion from "@/components/ui/Motion";
import { SEOHelmet } from "@/components/ui/SeoHelmet";
import { fadeUp, sectionReveal, zoomIn } from "@/utils/animations";
import { FaHospital, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import style from "./styles/find.module.scss";
mapboxgl.accessToken = accessToken;

const FindHospital = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userCoords = useGeolocation();
    const initialQ = searchParams.get("q") || "";
    const initialCity = searchParams.get("city");
    const initialState = searchParams.get("state");
    const displayTerm = initialQ || (initialCity && initialState ? `${initialCity}, ${initialState}` : "");
    const [term, setTerm] = useState<string>(displayTerm);
    const [searchedTerm, setSearchedTerm] = useState<string>("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [suggestionsOpen, setSuggestionsOpen] = useState(false);
    const suggestionsRef = useRef<HTMLDivElement | null>(null);
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
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

        // Suppress noisy tile fetch errors in console
        mapInstance.on('error', (e) => {
            const isTileFetchError = e.error && e.error.message && e.error.message.startsWith('Failed to fetch');
            if (isTileFetchError) {
                e.preventDefault();
                return;
            }
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
                updateMapMarkers(results, mapInstance);
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

    // Plot markers when map becomes available with existing hospitals
    useEffect(() => {
        if (map && hospitals.length > 0) {
            updateMapMarkers(hospitals, map);
        }
    }, [map, hospitals]);

    const updateMapMarkers = (data: Hospital[], mapInstance: mapboxgl.Map) => {
        if (!mapInstance) return;

        const geojson: GeoJSON.FeatureCollection = {
            type: "FeatureCollection",
            features: data
                .filter((h) => h.longitude && h.latitude)
                .map((h) => ({
                    type: "Feature" as const,
                    geometry: {
                        type: "Point" as const,
                        coordinates: [h.longitude!, h.latitude!],
                    },
                    properties: {
                        id: h._id,
                        name: h.name,
                        street: h.address?.street || "",
                        city: h.address?.city || "",
                        state: h.address?.state || "",
                        slug: h.slug,
                    },
                })),
        };

        const source = mapInstance.getSource("hospitals") as mapboxgl.GeoJSONSource;
        if (source) {
            source.setData(geojson);
        } else {
            mapInstance.addSource("hospitals", {
                type: "geojson",
                data: geojson,
                cluster: true,
                clusterMaxZoom: 14,
                clusterRadius: 50,
            });

            // Cluster circles
            mapInstance.addLayer({
                id: "clusters",
                type: "circle",
                source: "hospitals",
                filter: ["has", "point_count"],
                paint: {
                    "circle-color": [
                        "step",
                        ["get", "point_count"],
                        "#08299b",
                        10,
                        "#2563eb",
                        30,
                        "#60a5fa",
                    ],
                    "circle-radius": ["step", ["get", "point_count"], 20, 10, 30, 30, 40],
                    "circle-stroke-width": 2,
                    "circle-stroke-color": "#ffffff",
                },
            });

            // Cluster counts
            mapInstance.addLayer({
                id: "cluster-count",
                type: "symbol",
                source: "hospitals",
                filter: ["has", "point_count"],
                layout: {
                    "text-field": "{point_count_abbreviated}",
                    "text-font": ["DIN Pro Medium", "Arial Unicode MS Bold"],
                    "text-size": 12,
                },
                paint: {
                    "text-color": "#ffffff",
                },
            });

            // Unclustered points
            mapInstance.addLayer({
                id: "unclustered-point",
                type: "circle",
                source: "hospitals",
                filter: ["!", ["has", "point_count"]],
                paint: {
                    "circle-color": "#08299b",
                    "circle-radius": 8,
                    "circle-stroke-width": 2,
                    "circle-stroke-color": "#ffffff",
                },
            });

            // Unified click handler for both clusters and points
            mapInstance.on("click", (e) => {
                const features = mapInstance.queryRenderedFeatures(e.point, {
                    layers: ["clusters", "cluster-count", "unclustered-point"],
                });
                if (features.length === 0) return;

                const feature = features[0];
                const layerId = feature.layer?.id;

                if (layerId === "clusters" || layerId === "cluster-count") {
                    const clusterId = feature.properties?.cluster_id;
                    const src = mapInstance.getSource("hospitals") as mapboxgl.GeoJSONSource;
                    src.getClusterExpansionZoom(clusterId, (err, zoom) => {
                        if (err) return;
                        const coords = (feature.geometry as GeoJSON.Point).coordinates as [
                            number,
                            number,
                        ];
                        mapInstance.flyTo({ center: coords, zoom: zoom ?? 12 });
                    });
                } else if (layerId === "unclustered-point") {
                    const props = feature.properties as Record<string, string>;
                    const html = `
            <strong class="popup-name">${props.name}</strong><br/>
            <span class="popup-address">${props.street}, ${props.city}</span><br/>
            <a href="/hospital/${props.state}/${props.city}/${props.slug}" class="popup-link">View Details</a>
        `;
                    new mapboxgl.Popup({
                        offset: 16,
                        className: theme === "dark" ? "dark-popup" : "",
                    })
                        .setLngLat(
                            (feature.geometry as GeoJSON.Point).coordinates as [number, number]
                        )
                        .setHTML(html)
                        .addTo(mapInstance);
                }
            });

            // Change cursor on hover
            mapInstance.on("mouseenter", "clusters", () => {
                mapInstance.getCanvas().style.cursor = "pointer";
            });
            mapInstance.on("mouseleave", "clusters", () => {
                mapInstance.getCanvas().style.cursor = "";
            });
            mapInstance.on("mouseenter", "unclustered-point", () => {
                mapInstance.getCanvas().style.cursor = "pointer";
            });
            mapInstance.on("mouseleave", "unclustered-point", () => {
                mapInstance.getCanvas().style.cursor = "";
            });
        }

        // Fit map to the new set of points
        if (geojson.features.length > 0) {
            const bounds = new mapboxgl.LngLatBounds();
            geojson.features.forEach((feature) => {
                const [lng, lat] = (feature.geometry as GeoJSON.Point).coordinates;
                bounds.extend([lng, lat]);
            });
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

    // Autocomplete suggestions
    useEffect(() => {
        if (term.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const data = await autocompleteHospitals(term);
                setSuggestions(data || []);
            } catch {
                setSuggestions([]);
            }
        }, 250);

        return () => clearTimeout(timer);
    }, [term]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
                setSuggestionsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

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
                    updateMapMarkers(results, map);
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
                                        onChange={(e) => {
                                            setTerm(e.target.value);
                                            setSuggestionsOpen(true);
                                        }}
                                        onFocus={() => setSuggestionsOpen(true)}
                                        placeholder="Search by city, state, or facility name..."
                                    />
                                    {suggestionsOpen && suggestions.length > 0 && (
                                        <div ref={suggestionsRef} className={style.suggestionsDropdown}>
                                            {suggestions.map((s: any, i: number) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    className={style.suggestionItem}
                                                    onMouseDown={() => {
                                                        setTerm(`${s.name}, ${s.city}, ${s.state}`);
                                                        setSuggestionsOpen(false);
                                                        navigate(`/find-hospital?q=${encodeURIComponent(s.name)}`);
                                                    }}
                                                >
                                                    <span className={style.suggestionName}>{s.name}</span>
                                                    <span className={style.suggestionLocation}>{s.city}, {s.state}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
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
                                            <Motion key={id} variants={fadeUp}>
                                                <HospitalCard hospital={hospital} userCoords={userCoords} />
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
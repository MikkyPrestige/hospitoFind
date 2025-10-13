import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { accessToken } from "@/config/mapbox";
import { AiOutlineSearch } from "react-icons/ai";
import { findHospitals } from "@/services/api";
import PopularHospitals from "@/components/popular";
import Header from "@/layouts/header/nav";
import { FindInput, Hospital } from "@/services/hospital";
import HospitalPic from "@/assets/images/hospital-logo.jpg";
import { Avatar } from "@/components/avatar";
import style from "./style/find.module.css";
import style2 from "../../components/style/popular.module.css";
import axios from "axios";

mapboxgl.accessToken = accessToken;

const FindHospital = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const [location, setLocation] = useState<FindInput>({
    street: "",
    cityState: "",
    name: "",
  });

  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);

  // store markers and user marker in refs so we can reliably remove them
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const cityMarkerRef = useRef<mapboxgl.Marker | null>(null);

  // initialize map once
  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [3.3792, 6.5244], // Nigeria (lng, lat) — Lagos approx
      zoom: 6,
    });

    mapRef.current = map;

    // add navigation controls (optional)
    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }));

    // show user location if allowed (do not block render)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { longitude, latitude } = pos.coords;
          // place (or update) user marker
          if (userMarkerRef.current) {
            userMarkerRef.current.setLngLat([longitude, latitude]);
          } else {
            userMarkerRef.current = new mapboxgl.Marker({ color: "#1E90FF" })
              .setLngLat([longitude, latitude])
              .setPopup(new mapboxgl.Popup().setText("You are here"))
              .addTo(map);
          }
          // fly to user
          map.flyTo({ center: [longitude, latitude], zoom: 11, essential: true });
        },
        (err) => {
          // user denied or error — keep default center
          // optionally you can log or set message
          // console.warn("Geolocation failed:", err.message);
        },
        { maximumAge: 60_000, timeout: 8000 }
      );
    }

    // cleanup when component unmounts
    return () => {
      // remove markers if any
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
      if (cityMarkerRef.current) {
        cityMarkerRef.current.remove();
        cityMarkerRef.current = null;
      }
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocation((prev) => ({ ...prev, [name]: value }));
  };

  // helper: remove old search markers (not the user marker)
  const clearMarkers = () => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    if (cityMarkerRef.current) {
      cityMarkerRef.current.remove();
      cityMarkerRef.current = null;
    }
  };

  // helper: geocode a place name (city/state/name)
  const geocodeLocation = async (place: string) => {
    try {
      const res = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(place)}.json`,
        {
          params: { access_token: accessToken, limit: 1, country: "NG" },
          timeout: 8000,
        }
      );
      return res.data.features?.[0]?.center || null; // [lng, lat] or null
    } catch (e) {
      return null;
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearching(true);
    setError("");
    setMessage("");

    clearMarkers(); // remove previous search markers immediately

    if (!location.street && !location.cityState && !location.name) {
      setError("Please enter a Hospital Address or Name");
      setHospitals([]);
      setSearching(false);
      return;
    }

    const query = `street=${encodeURIComponent(location.street || "")}&cityState=${encodeURIComponent(location.cityState || "")}&name=${encodeURIComponent(location.name || "")}`;


    try {
      const data = await findHospitals(query);
      setHospitals(data || []);

      const map = mapRef.current;
      if (!map) {
        setSearching(false);
        return;
      }

      // collect valid hospitals with numeric lon/lat and not 0,0
      const validHospitals = (data || []).filter((h: any) => {
        const lon = h.longitude;
        const lat = h.latitude;
        return (
          typeof lon === "number" &&
          typeof lat === "number" &&
          !(lon === 0 && lat === 0) &&
          !Number.isNaN(lon) &&
          !Number.isNaN(lat)
        );
      });

      if (validHospitals.length > 0) {
        // add markers and build bounds
        const bounds = new mapboxgl.LngLatBounds();

        validHospitals.forEach((hospital: any) => {
          const lng = hospital.longitude;
          const lat = hospital.latitude;

          const marker = new mapboxgl.Marker({ color: "#E63946" })
            .setLngLat([lng, lat])
            .setPopup(
              new mapboxgl.Popup().setHTML(
                `<strong>${hospital.name}</strong><br/>${hospital.address?.street || ""}<br/>${hospital.address?.city || ""}, ${hospital.address?.state || ""}`
              )
            )
            .addTo(map);

          markersRef.current.push(marker);
          bounds.extend([lng, lat]);
        });

        // only fit bounds if they contain valid points
        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, { padding: 80, maxZoom: 13, duration: 800 });
        }
        setMessage("");
      } else {
        // No valid hospital coordinates found
        setMessage(`No hospitals listed in "${location.cityState || location.name}". You can add hospitals in this area from your dashboard.`);

        // Geocode the city/state or name and zoom there
        const place = location.cityState || location.name || location.street;
        if (place) {
          const coords = await geocodeLocation(place);
          if (coords && coords.length === 2) {
            const [lng, lat] = coords;
            map.flyTo({ center: [lng, lat], zoom: 10, essential: true });

            // place a city marker to indicate searched location (orange)
            cityMarkerRef.current = new mapboxgl.Marker({ color: "#FFA500" })
              .setLngLat([lng, lat])
              .setPopup(new mapboxgl.Popup().setText("No hospitals listed yet"))
              .addTo(map);
          } else {
            // geocoding failed — fallback to country view (do not zoom to world)
            map.flyTo({ center: [3.3792, 6.5244], zoom: 6, essential: true });
          }
        }
      }
    } catch (err: any) {
      console.error("Search error:", err);
      setError(err.message || "Error searching for hospitals");
      setHospitals([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Find | Hospital Finder</title>
        <meta name="description" content="Find the nearest hospital to you" />
      </Helmet>

      <Header />

      <section className={style.findSection}>
        <div className={style.search}>
          <div className={style.map}>
            <div ref={mapContainer} style={{ width: "100%", height: "100%", borderRadius: "1rem" }} />
          </div>

          <div className={style.container}>
            <form onSubmit={handleSearch} className={style.form}>
              <input type="text" name="street" placeholder="Enter hospital Street Address" onChange={handleInput} className={style.input} value={location.street} />
              <input type="text" name="cityState" placeholder="Enter City or State" onChange={handleInput} className={style.input} value={location.cityState} />
              <input type="text" name="name" placeholder="Hospital Name" onChange={handleInput} className={style.input} value={location.name} />
              <button type="submit" disabled={searching} className={style.cta}>
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
                {hospitals.map((hospital, idx) => (
                  <li key={idx} className={style2.card}>
                    <div className={style2.img}>
                      <Avatar image={hospital.photoUrl || HospitalPic} alt="hospital" style={{ width: "100%", height: "100%", borderRadius: "1.2rem", objectFit: "cover" }} />
                    </div>
                    <div className={style2.details}>
                      <p className={style2.name}>{hospital.name}</p>
                      <p>{hospital.address?.street}</p>
                      <NavLink to={`${hospital.name}`} className={style2.btn}>See more</NavLink>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : message ? (
            <div className={style.noResults}>
              <p>{message}</p>
              <NavLink to="/dashboard/add-hospital" className={style.addLink}>➕ Add a hospital in this location</NavLink>
            </div>
          ) : (
            <PopularHospitals />
          )}
        </div>
      </section>
    </>
  );
};

export default FindHospital;


// import { NavLink } from "react-router-dom";
// import { Helmet } from "react-helmet-async";
// import { useState, useEffect, useRef } from "react";
// import mapboxgl from "mapbox-gl";
// import "mapbox-gl/dist/mapbox-gl.css";
// import { accessToken } from "@/config/mapbox";
// import { AiOutlineSearch } from "react-icons/ai";
// import { findHospitals } from "@/services/api";
// import PopularHospitals from "@/components/popular";
// import Header from "@/layouts/header/nav";
// import { FindInput, Hospital } from "@/services/hospital";
// import HospitalPic from "@/assets/images/hospital-logo.jpg";
// import { Avatar } from "@/components/avatar";
// import style from "./style/find.module.css";
// import style2 from "../../components/style/popular.module.css";

// const FindHospital = () => {
//   const [hospitals, setHospitals] = useState<Hospital[]>([]);
//   const [error, setError] = useState<string>("");
//   const [message, setMessage] = useState<string>("");
//   const [searching, setSearching] = useState<boolean>(false);
//   const [location, setLocation] = useState<FindInput>({
//     street: "",
//     cityState: "",
//     name: "",
//   });
//   const [map, setMap] = useState<null | mapboxgl.Map>(null);
//   const mapContainer = useRef<HTMLDivElement | null>(null);

//   // Initialize map
//   useEffect(() => {
//     const mapInstance = new mapboxgl.Map({
//       container: mapContainer.current!,
//       style: "mapbox://styles/mapbox/streets-v11",
//       center: [4.5, 8.5],
//       zoom: 6,
//       accessToken,
//     });

//     setMap(mapInstance);

//     // Try to use user location
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { longitude, latitude } = position.coords;
//           mapInstance.flyTo({
//             center: [longitude, latitude],
//             zoom: 10,
//             essential: true,
//           });

//           new mapboxgl.Marker({ color: "#1E90FF" })
//             .setLngLat([longitude, latitude])
//             .setPopup(new mapboxgl.Popup().setText("You are here"))
//             .addTo(mapInstance);
//         },
//         () => {
//           mapInstance.flyTo({
//             center: [4.5, 8.5],
//             zoom: 7,
//             essential: true,
//           });
//         }
//       );
//     }

//     return () => mapInstance.remove();
//   }, []);

//   // Handle user input
//   const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setLocation({ ...location, [name]: value });
//   };

//   // Search hospitals
//   const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setSearching(true);
//     setError("");
//     setMessage("");

//     if (!location.street && !location.cityState && !location.name) {
//       setError("Please enter a Hospital Address or Name");
//       setHospitals([]);
//       setSearching(false);
//       return;
//     }

//     const query = `street=${location.street}&cityState=${location.cityState}&name=${location.name}`;
//     try {
//       const data = await findHospitals(query);

//       if (data.length === 0) {
//         setHospitals([]);
//         setMessage(
//           `No hospitals found for "${location.cityState || location.name}". You can help others by adding hospitals in this area from your dashboard.`
//         );
//       } else {
//         setHospitals(data);
//         setError("");
//         setMessage("");
//       }
//     } catch (err: any) {
//       setError(err.message || "An error occurred while fetching hospitals.");
//       setHospitals([]);
//     } finally {
//       setSearching(false);
//     }
//   };

//   // Add markers to map
//   useEffect(() => {
//     if (!map || hospitals.length === 0) return;

//     const markers: mapboxgl.Marker[] = [];

//     hospitals.forEach((hospital) => {
//       if (hospital.longitude && hospital.latitude) {
//         const marker = new mapboxgl.Marker({ color: "#E63946" })
//           .setLngLat([hospital.longitude, hospital.latitude])
//           .setPopup(
//             new mapboxgl.Popup().setHTML(`
//               <strong>${hospital.name}</strong><br/>
//               ${hospital.address?.street || ""}<br/>
//               ${hospital.address?.city || ""}, ${hospital.address?.state || ""}
//             `)
//           )
//           .addTo(map);

//         markers.push(marker);
//       }
//     });

//     // Fit map to all markers
//     const bounds = new mapboxgl.LngLatBounds();
//     hospitals.forEach((h) => {
//       if (h.longitude && h.latitude) {
//         bounds.extend([h.longitude, h.latitude]);
//       }
//     });
//     if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 80 });

//     return () => markers.forEach((m) => m.remove());
//   }, [map, hospitals]);

//   return (
//     <>
//       <Helmet>
//         <title>Find | Hospital Finder</title>
//         <meta name="description" content="Find the nearest hospital to you" />
//       </Helmet>

//       <Header />

//       <section className={style.findSection}>
//         <div className={style.search}>
//           <div className={style.map}>
//             <div
//               ref={mapContainer}
//               style={{ width: "100%", height: "100%", borderRadius: "1rem" }}
//             ></div>
//           </div>

//           <div className={style.container}>
//             <form onSubmit={handleSearch} className={style.form}>
//               <input
//                 type="text"
//                 name="street"
//                 placeholder="Enter hospital Street Address"
//                 onChange={handleInput}
//                 className={style.input}
//                 value={location.street}
//               />
//               <input
//                 type="text"
//                 name="cityState"
//                 placeholder="Enter City or State"
//                 onChange={handleInput}
//                 className={style.input}
//                 value={location.cityState}
//               />
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Hospital Name"
//                 onChange={handleInput}
//                 className={style.input}
//                 value={location.name}
//               />
//               <button
//                 type="submit"
//                 disabled={searching}
//                 className={style.cta}
//               >
//                 {searching ? "Searching..." : <AiOutlineSearch className={style.icon} />}
//               </button>
//             </form>
//           </div>
//         </div>

//         <div className={style.hospitals}>
//           {hospitals.length > 0 ? (
//             <div className={style.found}>
//               <h2 className={style2.heading}>
//                 {hospitals.length} Hospitals found
//               </h2>
//               <ul className={style2.wrapper}>
//                 {hospitals.map((hospital, id) => (
//                   <li key={id} className={style2.card}>
//                     <div className={style2.img}>
//                       <Avatar
//                         image={hospital.photoUrl || HospitalPic}
//                         alt="hospital"
//                         style={{
//                           width: "100%",
//                           height: "100%",
//                           borderRadius: "1.2rem",
//                           objectFit: "cover",
//                         }}
//                       />
//                     </div>
//                     <div className={style2.details}>
//                       <p className={style2.name}>{hospital.name}</p>
//                       <p>
//                         {hospital.address.street}, {hospital.address.city},{" "}
//                         {hospital.address.state}
//                       </p>
//                       <NavLink to={`${hospital.name}`} className={style2.btn}>
//                         See more
//                       </NavLink>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ) : message ? (
//             <div className={style.noResults}>
//               <p>{message}</p>
//               <NavLink to="/dashboard/add-hospital" className={style.addLink}>
//                 ➕ Add a hospital in this location
//               </NavLink>
//             </div>
//           ) : (
//             <PopularHospitals />
//           )}
//         </div>
//       </section>
//     </>
//   );
// };

// export default FindHospital;




// import { NavLink } from "react-router-dom";
// import { Helmet } from "react-helmet-async";
// import { useState, useEffect, useRef } from "react";
// import mapboxgl from "mapbox-gl";
// import 'mapbox-gl/dist/mapbox-gl.css';
// import { accessToken } from "@/config/mapbox";
// import { AiOutlineSearch } from "react-icons/ai"
// import { findHospitals } from "@/services/api";
// import PopularHospitals from "@/components/popular";
// import Header from "@/layouts/header/nav";
// import { FindInput, Hospital } from "@/services/hospital";
// import HospitalPic from "@/assets/images/hospital-logo.jpg";
// import { Avatar } from "@/components/avatar";
// import style from "./style/find.module.css";
// import style2 from "../../components/style/popular.module.css";

// const FindHospital = () => {
//   const [hospitals, setHospitals] = useState<Hospital[]>([]);
//   const [error, setError] = useState<string>("");
//   const [searching, setSearching] = useState<boolean>(false);
//   const [location, setLocation] = useState<FindInput>({
//     street: "",
//     cityState: "",
//     name: ""
//   });
//   const [map, setMap] = useState<null | mapboxgl.Map>(null);
//   const mapContainer = useRef<HTMLDivElement | null>(null);

//   // useEffect(() => {
//   //   const map = new mapboxgl.Map({
//   //     container: mapContainer.current!,
//   //     style: "mapbox://styles/mapbox/streets-v11",
//   //     zoom: 6,
//   //     center: [9.081999, 8.675277],
//   //     accessToken
//   //   });

//   //   setMap(map);
//   // }, []);


//   const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setLocation({ ...location, [name]: value });
//   };


//   useEffect(() => {
//     const mapInstance = new mapboxgl.Map({
//       container: mapContainer.current!,
//       style: "mapbox://styles/mapbox/streets-v11",
//       center: [4.5, 8.5], // southwest Nigeria
//       zoom: 6,
//       accessToken,
//     });

//     setMap(mapInstance);

//     // Try to use user location
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { longitude, latitude } = position.coords;
//           mapInstance.flyTo({
//             center: [longitude, latitude],
//             zoom: 10,
//             essential: true,
//           });

//           // Optional: add a marker for user's location
//           new mapboxgl.Marker({ color: "#1E90FF" })
//             .setLngLat([longitude, latitude])
//             .setPopup(new mapboxgl.Popup().setText("You are here"))
//             .addTo(mapInstance);
//         },
//         () => {
//           mapInstance.flyTo({
//             center: [4.5, 8.5],
//             zoom: 7,
//             essential: true,
//           });
//         }
//       );
//     }

//     return () => mapInstance.remove();
//   }, []);


//   // useEffect(() => {
//   //   if (!map || hospitals.length === 0) return;

//   //   // Clear existing markers before adding new ones
//   //   const markers: mapboxgl.Marker[] = [];

//   //   hospitals.forEach((hospital) => {
//   //     if (hospital.location && Array.isArray(hospital.location)) {
//   //       const [lng, lat] = hospital.location;
//   //       const marker = new mapboxgl.Marker({ color: "#E63946" })
//   //         .setLngLat([lng, lat])
//   //         .setPopup(
//   //           new mapboxgl.Popup().setHTML(`
//   //           <strong>${hospital.name}</strong><br/>
//   //           ${hospital.address?.street || ""}<br/>
//   //           ${hospital.address?.city || ""}, ${hospital.address?.state || ""}
//   //         `)
//   //         )
//   //         .addTo(map);

//   //       markers.push(marker);
//   //     }
//   //   });

//   //   // Auto-fit map to show all hospitals
//   //   const bounds = new mapboxgl.LngLatBounds();
//   //   hospitals.forEach((h) => {
//   //     if (h.location && Array.isArray(h.location)) {
//   //       bounds.extend(h.location as [number, number]);
//   //     }
//   //   });
//   //   if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 80 });

//   //   // Cleanup markers when hospitals change
//   //   return () => markers.forEach((m) => m.remove());
//   // }, [map, hospitals]);


//   const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setSearching(true);
//     if (!location.street && !location.cityState && !location.name) {
//       setError('Please enter a Hospital Address or Name');
//       setHospitals([]);
//       setSearching(false);
//       return;
//     }
//     const query = `street=${location.street}&cityState=${location.cityState}&name=${location.name}`;
//     try {
//       const data = await findHospitals(query);
//       if (data.length === 0) {
//         setError('Sorry! We could not find any results matching your criteria.');
//         setHospitals([]);
//       } else {
//         setHospitals(data);
//         setError('');
//       }
//       // if (map && data.length > 0) {
//       //   const first = data[0];
//       //   // If your hospital objects include coordinates:
//       //   if (first.location && Array.isArray(first.location)) {
//       //     const [lng, lat] = first.location;
//       //     map.flyTo({
//       //       center: [lng, lat],
//       //       zoom: 10,
//       //       essential: true,
//       //     });
//       //   }
//       // }
//     } catch (err: any) {
//       if (err.data) {
//         setError(err.message);
//         setHospitals([]);
//       } else if (err.request) {
//         setError('Server did not respond');
//         setHospitals([]);
//       } else {
//         setError(err.message);
//         setHospitals([]);
//       }
//     } finally {
//       setSearching(false);
//     };
//   };

//   useEffect(() => {
//     if (map) {
//       map.on("load", () => {
//         map.on("mouseenter", "hospitals", () => {
//           map.getCanvas().style.cursor = "pointer";
//         });
//         map.on("mouseleave", "hospitals", () => {
//           map.getCanvas().style.cursor = "";
//         });
//       });
//     }
//   }, [map, hospitals]);

//   return (
//     <>
//       <Helmet>
//         <title>Find | Hospital Finder</title>
//         <meta name="description" content="Find the nearest hospital to you" />
//         <meta name="keywords" content="hospital, doctor, appointment, health, care, medical, clinic, find, search, nearby, nearest" />
//       </Helmet>
//       <Header />
//       <section className={style.findSection}>
//         <div className={style.search}>
//           <div className={style.map}>
//             <div ref={mapContainer} style={{ width: "100%", height: "100%", borderRadius: "1rem" }}></div>
//           </div>
//           <div className={style.container}>
//             <form onSubmit={handleSearch} className={style.form}>
//               <input
//                 type="text"
//                 name="street"
//                 placeholder="Enter hospital Street Address"
//                 onChange={handleInput}
//                 className={style.input}
//                 value={location.street}
//               />
//               <input
//                 type="text"
//                 name="cityState"
//                 placeholder=" Enter City or State"
//                 onChange={handleInput}
//                 className={style.input}
//                 value={location.cityState}
//               />
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Hospital Name"
//                 onChange={handleInput}
//                 className={style.input}
//                 value={location.name}
//               />
//               <button type="submit" disabled={searching} className={style.cta}>
//                 <AiOutlineSearch className={style.icon} />
//               </button>
//             </form>
//           </div>
//           {error && <p className={style.error}>{error}</p>}
//         </div>
//         <div className={style.hospitals}>
//           {hospitals.length > 0 ? (
//             <div className={style.found}>
//               <h2 className={style2.heading}>{hospitals.length} Hospitals found</h2>
//               <ul className={style2.wrapper}>
//                 {hospitals.length > 0 && hospitals.map((hospital, id) => (
//                   <li key={id} className={style2.card}>
//                     <div className={style2.img}>
//                       {hospital?.photoUrl ? <Avatar image={hospital.photoUrl} alt="hospital" style={{ width: "100%", height: "100%", borderRadius: "1.2rem", objectFit: "cover" }} /> : <Avatar image={HospitalPic} alt="hospital" style={{ width: "100%", height: "100%", borderRadius: "1.2rem", objectFit: "cover" }} />}
//                     </div>
//                     <div className={style2.details}>
//                       <p className={style2.name}>{hospital.name}</p>
//                       <p>{hospital.address.street}</p>
//                       <NavLink to={`${hospital.name}`} className={style2.btn}>See more</NavLink>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ) : (
//             <PopularHospitals />
//           )
//           }
//         </div>
//       </section >
//     </>
//   )
// }


// export default FindHospital;
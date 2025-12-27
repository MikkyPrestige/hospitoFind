import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart, AiOutlineSearch } from "react-icons/ai";
import { LocationInput, Hospital } from "@/services/hospital";
import { searchHospitals } from "@/services/api";
import { useAuthContext } from "@/context/userContext";
import { Avatar } from "@/components/avatar";
import Motion from "../components/motion";
import { fadeUp } from "@/hooks/animations";
import HospitalPic from "@/assets/images/hospital-logo.jpg";
import ExportButton from "@/hospitalsConfig/export";
import ShareButton from "@/hospitalsConfig/share";
import style from "./style/search/search.module.scss";
import AnimatedLoader from "../components/utils/AnimatedLoader";

export default function SearchForm({
  onSearchResultsChange,
  onFavoritesUpdate,
  onRecentUpdate,
  onWeeklyViewsChange,
}: {
  onSearchResultsChange?: (hasResults: boolean) => void;
  onFavoritesUpdate?: () => void;
  onRecentUpdate?: () => void;
  onWeeklyViewsChange?: (count: number) => void;
}) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState<LocationInput>({ address: "", city: "", state: "" });
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [error, setError] = useState<string>(""); // ✅ Now used in JSX
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<{ country: string; hospitals: Hospital[] }[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [favorites, setFavorites] = useState<Hospital[]>([]);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { state } = useAuthContext();

  const userPrefix = state?.username || "guest";
  const FAV_KEY = `${userPrefix}_favorites`;
  const REC_KEY = `${userPrefix}_recentlyViewed`;
  const WEEKLY_KEY = `${userPrefix}_weeklyStats`;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/hospitals/explore/top`);
        const data = await res.json();
        if (mounted) setCountries(Array.isArray(data) ? data : []);
      } catch { if (mounted) setCountries([]); } finally { if (mounted) setLoadingCountries(false); }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setFavorites(JSON.parse(localStorage.getItem(FAV_KEY) || "[]"));
  }, [FAV_KEY]);

  async function robustSearch({ typedQuery, city, country }: { typedQuery?: string; city?: string; country?: string; }) {
    setLoading(true);
    setError(""); // Reset error on new search
    setHospitals([]);

    const attempts: Array<{ call: () => Promise<any> }> = [];
    if (city && country) {
      attempts.push({ call: () => searchHospitals(`address=&city=${encodeURIComponent(city)}&state=${encodeURIComponent(country)}`) });
    }
    if (typedQuery && typedQuery.trim().length >= 3) {
      attempts.push({ call: () => searchHospitals(`address=${encodeURIComponent(typedQuery.trim())}`) });
    }

    for (const at of attempts) {
      try {
        const result = await at.call();
        const arr = Array.isArray(result) ? result : result?.hospitals || [];
        if (arr.length > 0) {
          setHospitals(arr);
          onSearchResultsChange?.(true);
          setLoading(false);
          return;
        }
      } catch { }
    }

    setHospitals([]);
    setError("No hospitals found matching your criteria."); // ✅ Sets the error state
    onSearchResultsChange?.(false);
    setLoading(false);
  }

  useEffect(() => {
    const shouldRun = (query && query.trim().length >= 3) || location.city || location.state;
    if (!shouldRun) {
      setHospitals([]);
      setError("");
      return;
    }
    const id = setTimeout(() => robustSearch({ typedQuery: query.trim(), city: location.city, country: location.state }), 350);
    return () => clearTimeout(id);
  }, [query, location.city, location.state]);

  const toggleFav = (h: Hospital) => {
    const raw = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
    const exists = raw.some((r: any) => r.name === h.name);
    const next = exists ? raw.filter((r: any) => r.name !== h.name) : [{ ...h }, ...raw].slice(0, 50);
    localStorage.setItem(FAV_KEY, JSON.stringify(next));
    setFavorites(next);
    onFavoritesUpdate?.();
  };

  const handleExplore = (hospital: Hospital) => {
    const raw = JSON.parse(localStorage.getItem(REC_KEY) || "[]");
    const next = [{ ...hospital, viewedAt: Date.now() }, ...raw.filter((h: any) => h.name !== hospital.name)].slice(0, 10);
    localStorage.setItem(REC_KEY, JSON.stringify(next));
    onRecentUpdate?.();

    const stored = JSON.parse(localStorage.getItem(WEEKLY_KEY) || "{}");
    const now = Date.now();
    let count = (now - (stored.lastReset || now) > 604800000) ? 1 : (stored.count || 0) + 1;
    localStorage.setItem(WEEKLY_KEY, JSON.stringify({ count, lastReset: stored.lastReset || now }));
    onWeeklyViewsChange?.(count);
  };

  const filteredCountries = countries.map(c => ({
    ...c, hospitals: (c.hospitals || []).filter(h => {
      const q = query.toLowerCase();
      return (h.address?.city || "").toLowerCase().includes(q) || (c.country || "").toLowerCase().includes(q);
    })
  })).filter(c => (c.hospitals || []).length > 0);

  return (
    <div className={style.searchContainer}>
      <div ref={dropdownRef} className={style.searchBox}>
        <div className={style.inputGroup}>
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setDropdownOpen(true); }}
            onFocus={() => setDropdownOpen(true)}
            placeholder="hospital name, city or country..."
            className={style.input}
          />
          <button className={style.searchBtn}><AiOutlineSearch /></button>
        </div>

        {dropdownOpen && (
          <div className={style.dropdown}>
            {loadingCountries ? (
              <AnimatedLoader message="Loading locations..." variant="dropdown" count={2} />
            ) : filteredCountries.length ? (
              filteredCountries.map((g) => (
                <div key={g.country} className={style.dropdownGroup}>
                  <div className={style.dropdownCountry}>{g.country}</div>
                  {Array.from(new Set((g.hospitals || []).map(h => h.address?.city).filter(Boolean))).map(city => (
                    <div key={city as string} className={style.dropdownCity} onMouseDown={() => {
                      setLocation({ city: city as string, state: g.country, address: "" });
                      setQuery(`${city}, ${g.country}`);
                      setDropdownOpen(false);
                      robustSearch({ city: city as string, country: g.country });
                    }}>
                      {city as string}
                    </div>
                  ))}
                </div>
              ))
            ) : <div className={style.dropdownItem}>No matching locations</div>}
          </div>
        )}
      </div>

      <div className={style.results}>
        {loading && <AnimatedLoader message="Searching..." variant="card" count={3} showImage imageHeight={150} />}

        {!loading && error && <div className={style.error}>{error}</div>}

        {!loading && hospitals.length > 0 && (
          <div className={style.resultsGrid}>
            {hospitals.map((h) => (
              <div key={h._id} className={style.hospitalCard}>
                <Avatar image={h.photoUrl || HospitalPic} alt={h.name} className={style.cardAvatar} />
                <div className={style.hospitalInfo}>
                  <h3>{h.name}</h3>
                  <p>{h.address?.city} — {h.address?.state}</p>
                  <div className={style.cardActions}>
                    <NavLink to={`/hospital/${h.address.state}/${h.address.city}/${h.slug}`} onClick={() => handleExplore(h)} className={style.exploreBtn}>Explore</NavLink>
                    <button onClick={() => toggleFav(h)} className={style.favBtn}>
                      {favorites.some(f => f.name === h.name) ? <AiFillHeart color="#f33" /> : <AiOutlineHeart />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!loading && hospitals.length > 0 && (
        <Motion variants={fadeUp} className={style.actionButtons}>
          <div className={style.utilityGroup}>
            <ShareButton searchParams={location} />
            <ExportButton searchParams={location} />
          </div>
          <button type="button" className={style.backBtn} onClick={() => { setHospitals([]); setQuery(""); onSearchResultsChange?.(false); }}>Dashboard</button>
        </Motion>
      )}
      <Outlet />
    </div>
  );
}

// import { useEffect, useRef, useState } from "react";
// import { NavLink, Outlet } from "react-router-dom";
// import { AiFillHeart, AiOutlineHeart, AiOutlineSearch } from "react-icons/ai";
// import { LocationInput, Hospital } from "@/services/hospital";
// import { searchHospitals } from "@/services/api";
// import { useAuthContext } from "@/context/userContext";
// import { Avatar } from "@/components/avatar";
// import Motion from "../components/motion";
// import { fadeUp } from "@/hooks/animations";
// import HospitalPic from "@/assets/images/hospital-logo.jpg";
// import ExportButton from "@/hospitalsConfig/export";
// import ShareButton from "@/hospitalsConfig/share";
// import style from "./style/search/search.module.scss";
// import AnimatedLoader from "../components/utils/AnimatedLoader";

// type StoredHospital = Hospital & { viewedAt?: number };

// export default function SearchForm({
//   onSearchResultsChange,
//   onFavoritesUpdate,
//   onRecentUpdate,
//   onWeeklyViewsChange,
// }: {
//   onSearchResultsChange?: (hasResults: boolean) => void;
//   onFavoritesUpdate?: () => void;
//   onRecentUpdate?: () => void;
//   onWeeklyViewsChange?: (count: number) => void;
// }) {
//   const [query, setQuery] = useState("");
//   const [location, setLocation] = useState<LocationInput>({ address: "", city: "", state: "" });
//   const [hospitals, setHospitals] = useState<Hospital[]>([]);
//   const [error, setError] = useState<string>("");
//   const [loading, setLoading] = useState(false);
//   const [countries, setCountries] = useState<{ country: string; hospitals: Hospital[] }[]>([]);
//   const [loadingCountries, setLoadingCountries] = useState(true);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [favorites, setFavorites] = useState<StoredHospital[]>([]);

//   const dropdownRef = useRef<HTMLDivElement | null>(null);
//   const { state } = useAuthContext();

//   // --- DYNAMIC KEYS ---
//   const userPrefix = state?.username || "guest";
//   const FAV_KEY = `${userPrefix}_favorites`;
//   const REC_KEY = `${userPrefix}_recentlyViewed`;
//   const WEEKLY_KEY = `${userPrefix}_weeklyStats`;

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const res = await fetch(`${import.meta.env.VITE_BASE_URL}/hospitals/explore/top`);
//         const data = await res.json();
//         if (mounted) setCountries(Array.isArray(data) ? data : []);
//       } catch { if (mounted) setCountries([]); } finally { if (mounted) setLoadingCountries(false); }
//     })();
//     return () => { mounted = false; };
//   }, []);

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   useEffect(() => {
//     setFavorites(JSON.parse(localStorage.getItem(FAV_KEY) || "[]"));
//   }, [FAV_KEY]);

//   async function robustSearch({ typedQuery, city, country }: { typedQuery?: string; city?: string; country?: string; }) {
//     setLoading(true); setError(""); setHospitals([]);
//     const tq = typedQuery?.trim() || "";
//     const c = (country || "").trim();
//     const ci = (city || "").trim();

//     const attempts: Array<{ call: () => Promise<any> }> = [];
//     if (ci && c) {
//       attempts.push({ call: () => searchHospitals(`address=&city=${encodeURIComponent(ci)}&state=${encodeURIComponent(c)}`) });
//     }
//     if (tq && tq.length >= 3) attempts.push({ call: () => searchHospitals(`address=${encodeURIComponent(tq)}`) });

//     for (const at of attempts) {
//       try {
//         const result = await at.call();
//         const arr = Array.isArray(result) ? result : result?.hospitals || [];
//         if (arr.length > 0) {
//           setHospitals(arr);
//           onSearchResultsChange?.(true);
//           setLoading(false);
//           return;
//         }
//       } catch { }
//     }
//     setHospitals([]); setError("No hospitals found"); onSearchResultsChange?.(false); setLoading(false);
//   }

//   useEffect(() => {
//     const shouldRun = (query && query.trim().length >= 3) || location.city || location.state;
//     if (!shouldRun) { setHospitals([]); return; }
//     const id = setTimeout(() => robustSearch({ typedQuery: query.trim(), city: location.city, country: location.state }), 350);
//     return () => clearTimeout(id);
//   }, [query, location.city, location.state]);

//   const toggleFav = (h: Hospital) => {
//     try {
//       const raw = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
//       const exists = raw.some((r: any) => r.name === h.name);
//       const next = exists ? raw.filter((r: any) => r.name !== h.name) : [{ ...h }, ...raw].slice(0, 50);
//       localStorage.setItem(FAV_KEY, JSON.stringify(next));
//       setFavorites(next);
//       onFavoritesUpdate?.();
//     } catch { }
//   };

//   const handleExplore = (hospital: Hospital) => {
//     try {
//       const raw = localStorage.getItem(REC_KEY) || "[]";
//       const existing = JSON.parse(raw) as Hospital[];
//       const next = [{ ...hospital, viewedAt: Date.now() }, ...existing.filter(h => h.name !== hospital.name)].slice(0, 10);
//       localStorage.setItem(REC_KEY, JSON.stringify(next));
//       onRecentUpdate?.(); // Sync with Dashboard
//     } catch { }

//     try {
//       const now = Date.now();
//       const stored = JSON.parse(localStorage.getItem(WEEKLY_KEY) || "{}");
//       const lastReset = stored.lastReset || now;
//       let count = stored.count || 0;
//       if (now - lastReset > 604800000) count = 0;
//       const newStats = { count: count + 1, lastReset: now };
//       localStorage.setItem(WEEKLY_KEY, JSON.stringify(newStats));
//       onWeeklyViewsChange?.(newStats.count);
//     } catch { }
//   };

//   const filteredCountries = countries.map(c => ({
//     ...c, hospitals: (c.hospitals || []).filter(h => {
//       const q = query.toLowerCase();
//       return (h.address?.city || "").toLowerCase().includes(q) || (c.country || "").toLowerCase().includes(q);
//     })
//   })).filter(c => (c.hospitals || []).length > 0);

//   return (
//     <div className={style.searchContainer}>
//       <div ref={dropdownRef} className={style.searchBox}>
//         <div className={style.inputGroup}>
//           <input
//             value={query}
//             onChange={(e) => { setQuery(e.target.value); setDropdownOpen(true); }}
//             onFocus={() => setDropdownOpen(true)}
//             placeholder="hospital name, city or country..."
//             className={style.input}
//           />
//           <button className={style.searchBtn}><AiOutlineSearch /></button>
//         </div>

//         {dropdownOpen && (
//           <div className={style.dropdown}>
//             {loadingCountries ? (
//               <AnimatedLoader message="Loading..." variant="dropdown" count={2} />
//             ) : filteredCountries.length ? (
//               filteredCountries.map((g) => (
//                 <div key={g.country} className={style.dropdownGroup}>
//                   <div className={style.dropdownCountry}>{g.country}</div>
//                   {Array.from(new Set((g.hospitals || []).map(h => h.address?.city).filter(Boolean))).map(city => (
//                     <div key={city as string} className={style.dropdownCity} onMouseDown={() => {
//                       setLocation({ city: city as string, state: g.country, address: "" });
//                       setQuery(`${city}, ${g.country}`);
//                       setDropdownOpen(false);
//                       robustSearch({ city: city as string, country: g.country });
//                     }}>
//                       {city as string}
//                     </div>
//                   ))}
//                 </div>
//               ))
//             ) : <div className={style.dropdownItem}>No matching locations</div>}
//           </div>
//         )}
//       </div>

//       <div className={style.results}>
//         {loading && <AnimatedLoader message="Searching..." variant="card" count={3} showImage imageHeight={150} />}
//         {!loading && hospitals.length > 0 && (
//           <div className={style.resultsGrid}>
//             {hospitals.map((h) => (
//               <div key={h._id} className={style.hospitalCard}>
//                 <Avatar image={h.photoUrl || HospitalPic} alt={h.name} className={style.cardAvatar} />
//                 <div className={style.hospitalInfo}>
//                   <h3>{h.name}</h3>
//                   <p>{h.address?.city} — {h.address?.state}</p>
//                   <div className={style.cardActions}>
//                     <NavLink to={`/hospital/${h.address.state}/${h.address.city}/${h.slug}`} onClick={() => handleExplore(h)} className={style.exploreBtn}>Explore</NavLink>
//                     <button onClick={() => toggleFav(h)} className={style.favBtn}>
//                       {favorites.some(f => f.name === h.name) ? <AiFillHeart color="#f33" /> : <AiOutlineHeart />}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {!loading && hospitals.length > 0 && (
//         <Motion variants={fadeUp} className={style.actionButtons}>
//           <div className={style.utilityGroup}>
//             <ShareButton searchParams={location} />
//             <ExportButton searchParams={location} />
//           </div>
//           <button type="button" className={style.backBtn} onClick={() => { setHospitals([]); onSearchResultsChange?.(false); }}>Dashboard</button>
//         </Motion>
//       )}
//       <Outlet />
//     </div>
//   );
// }
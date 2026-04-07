import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart, AiOutlineSearch } from "react-icons/ai";
import { LocationInput, Hospital } from "@/src/types/hospital";
import { findHospitals } from "@/services/api";
import { useAuthContext, BASE_URL } from "@/context/UserProvider";
import { getUniqueCities } from "@/utils/formatters"
import { Avatar } from "@/components/ui/Avatar";
import Motion from "@/components/ui/Motion";
import { fadeUp } from "@/utils/animations";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import HospitalPic from "@/assets/images/hospital-logo.jpg";
import ExportButton from "@/components/hospital/Export";
import ShareButton from "@/components/hospital/Share";
import style from "./styles/search.module.scss";
import AnimatedLoader from "@/components/ui/AnimatedLoader";

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
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<{ country: string; hospitals: Hospital[] }[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [favorites, setFavorites] = useState<Hospital[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { state } = useAuthContext();
  const axiosPrivate = useAxiosPrivate();

  const userPrefix = state?.username || "guest";
  const FAV_KEY = `${userPrefix}_favorites`;
  const REC_KEY = `${userPrefix}_recentlyViewed`;
  const WEEKLY_KEY = `${userPrefix}_weeklyStats`;

  // Fetch Location Data
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/hospitals/explore/top`);
        const data = await res.json();
        if (mounted) setCountries(Array.isArray(data) ? data : []);
      } catch {
        if (mounted) setCountries([]);
      } finally {
        if (mounted) setLoadingCountries(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Handle Click Outside Dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Load Favorites
  useEffect(() => {
    setFavorites(JSON.parse(localStorage.getItem(FAV_KEY) || "[]"));
  }, [FAV_KEY]);

  async function performSearch({ typedQuery, city, country }: { typedQuery?: string; city?: string; country?: string; }) {
    setLoading(true);
    setError("");
    setHospitals([]);

    try {
      let url = "";
      // Case A: Dropdown Click (Precise City + Country search)
      if (city && country) {
        url = `city=${encodeURIComponent(city)}&state=${encodeURIComponent(country)}`;
      }
      // Case B: Manual Typing (Smart text search)
      else if (typedQuery && typedQuery.trim().length >= 2) {
        url = `term=${encodeURIComponent(typedQuery.trim())}`;
      }

      if (url) {
        const data = await findHospitals(url);

        if (data && data.length > 0) {
          setHospitals(data);
          onSearchResultsChange?.(true);
        } else {
          setHospitals([]);
          setError("No facilities found matching your criteria.");
          onSearchResultsChange?.(false);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Unable to process search request.");
      onSearchResultsChange?.(false);
    } finally {
      setLoading(false);
    }
  }

  // Debounce Effect for Manual Typing
  useEffect(() => {
    const hasLocation = location.city && location.state;
    const hasText = query && query.trim().length >= 2;

    if (!hasText && !hasLocation) {
      setHospitals([]);
      setError("");
      return;
    }

    const id = setTimeout(() => {
      performSearch({
        typedQuery: query,
        city: location.city,
        country: location.state
      });
    }, 350);

    return () => clearTimeout(id);
  }, [query, location.city, location.state]);

  // --- ACTIONS ---
  const toggleFav = async (h: Hospital) => {
    const raw = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
    const exists = raw.some((r: any) => r._id === h._id);
    const next = exists
      ? raw.filter((r: any) => r._id !== h._id)
      : [{ ...h }, ...raw].slice(0, 50);

    localStorage.setItem(FAV_KEY, JSON.stringify(next));
    setFavorites(next);
    onFavoritesUpdate?.();

    if (state.accessToken) {
      try {
        await axiosPrivate.post(`/user/favorites-status/${h._id}`);
      } catch (error) {
        console.error("Sync failed");
      }
    }
  };

  const handleExplore = async (hospital: Hospital) => {
    // 1. Get current list
    const raw = JSON.parse(localStorage.getItem(REC_KEY) || "[]");

    // 2. Filter out duplicates (Ensure Strict String Comparison)
    // We convert both IDs to strings to be safe against number/string mismatches
    const filtered = raw.filter((h: any) => String(h._id) !== String(hospital._id));

    // 3. Add new view to top
    const next = [
      { ...hospital, viewedAt: Date.now() },
      ...filtered
    ].slice(0, 10);

    // 4. Update Local Storage & UI
    localStorage.setItem(REC_KEY, JSON.stringify(next));
    onRecentUpdate?.();

    // 5. Update Weekly Counts Locally
    const stored = JSON.parse(localStorage.getItem(WEEKLY_KEY) || "{}");
    const now = Date.now();
    const oneWeekMs = 604800000;

    // Check if week has passed since last reset
    let count = 1;
    let lastReset = now;

    if (stored.lastReset && (now - stored.lastReset < oneWeekMs)) {
      count = (stored.count || 0) + 1;
      lastReset = stored.lastReset;
    }

    localStorage.setItem(WEEKLY_KEY, JSON.stringify({ count, lastReset }));
    onWeeklyViewsChange?.(count);

    // 6. Sync with Backend
    if (state.accessToken) {
      try {
        await axiosPrivate.post("/user/view", { hospitalId: hospital._id });
      } catch (e) { }
    }
  };
  // const handleExplore = async (hospital: Hospital) => {
  //   const raw = JSON.parse(localStorage.getItem(REC_KEY) || "[]");
  //   const next = [
  //     { ...hospital, viewedAt: Date.now() },
  //     ...raw.filter((h: any) => h._id !== hospital._id)
  //   ].slice(0, 10);

  //   localStorage.setItem(REC_KEY, JSON.stringify(next));
  //   onRecentUpdate?.();

  //   const stored = JSON.parse(localStorage.getItem(WEEKLY_KEY) || "{}");
  //   const now = Date.now();
  //   let count = (now - (stored.lastReset || now) > 604800000) ? 1 : (stored.count || 0) + 1;
  //   localStorage.setItem(WEEKLY_KEY, JSON.stringify({ count, lastReset: stored.lastReset || now }));
  //   onWeeklyViewsChange?.(count);

  //   if (state.accessToken) {
  //     try {
  //       await axiosPrivate.post("/user/view", { hospitalId: hospital._id });
  //     } catch (e) { }
  //   }
  // };

  // Filter countries for the dropdown list based on query
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
            onChange={(e) => {
              setQuery(e.target.value);
              setLocation({ address: "", city: "", state: "" });
              setDropdownOpen(true);
            }}
            onFocus={() => setDropdownOpen(true)}
            placeholder="Search hospitals, clinics, or regions..."
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

                  {getUniqueCities(g.hospitals).map(city => (
                    <div
                      key={city as string}
                      className={style.dropdownCity}
                      onMouseDown={() => {
                        setLocation({ city: city as string, state: g.country, address: "" });
                        setQuery(`${city}, ${g.country}`);
                        setDropdownOpen(false);

                        // Trigger Search Immediately (Bypass Debounce)
                        performSearch({ city: city as string, country: g.country });
                      }}
                    >
                      {city as string}
                    </div>
                  ))}
                </div>
              ))
            ) : <div className={style.dropdownItem}>No matching locations found</div>}
          </div>
        )}
      </div>

      <div className={style.results}>
        {loading && <AnimatedLoader message="Locating facilities..." variant="card" count={3} showImage imageHeight={150} />}

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
                    <NavLink
                      to={`/hospital/${h.address.state}/${h.address.city}/${h.slug}`}
                      onClick={() => handleExplore(h)}
                      className={style.exploreBtn}
                    >
                      View Profile
                    </NavLink>
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

      {/* ... Utility Buttons ... */}
      {!loading && hospitals.length > 0 && (
        <Motion variants={fadeUp} className={style.actionButtons}>
          <div className={style.utilityGroup}>
            <ShareButton searchParams={location} />
            <ExportButton searchParams={location} />
          </div>
          <button
            type="button"
            className={style.backBtn}
            onClick={() => {
              setHospitals([]);
              setQuery("");
              setLocation({ address: "", city: "", state: "" });
              onSearchResultsChange?.(false);
            }}
          >
            Clear Results
          </button>
        </Motion>
      )}
      <Outlet />
    </div>
  );
}
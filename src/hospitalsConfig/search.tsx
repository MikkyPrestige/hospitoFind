import  { useEffect, useRef, useState } from "react";
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

type StoredHospital = Hospital & { viewedAt?: number };

const RECENTLY_KEY = "recentlyViewedHospitals";
const WEEKLY_KEY = "weeklyStats";

export default function SearchForm({
  onSearchResultsChange,
  onFavoritesUpdate,
}: {
  onSearchResultsChange?: (hasResults: boolean) => void;
  onFavoritesUpdate?: () => void;
}) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState<LocationInput>({ address: "", city: "", state: "" });
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<{ country: string; hospitals: Hospital[] }[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [favorites, setFavorites] = useState<StoredHospital[]>([]);
  const [weeklyViews, setWeeklyViews] = useState<number>(0); // ✅ added

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { state } = useAuthContext();

  const COUNTRY_ALIASES: Record<string, string[]> = {
    "United States": ["United States", "USA", "US", "America"],
    "United Kingdom": ["United Kingdom", "UK", "Britain", "England"],
    "South Korea": ["South Korea", "Korea", "Republic of Korea"],
    "China": ["China", "PRC", "People's Republic of China"],
  };

  const normalizeCountryAliases = (candidate: string) => {
    if (!candidate) return candidate;
    for (const canonical in COUNTRY_ALIASES) {
      const variants = COUNTRY_ALIASES[canonical].map(v => v.toLowerCase());
      if (variants.includes(candidate.toLowerCase())) return canonical;
    }
    return candidate;
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/hospitals/explore/top`);
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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    try {
      setFavorites(JSON.parse(localStorage.getItem("favoriteHospitals") || "[]"));
    } catch {
      setFavorites([]);
    }

    // ✅ Load weekly stats
    try {
      const stored = JSON.parse(localStorage.getItem(WEEKLY_KEY) || "{}");
      setWeeklyViews(stored.count || 0);
    } catch {
      setWeeklyViews(0);
    }
  }, []);

  async function robustSearch({ typedQuery, city, country }: { typedQuery?: string; city?: string; country?: string; }) {
    setLoading(true);
    setError("");
    setHospitals([]);
    const base = import.meta.env.VITE_BASE_URLLocal || import.meta.env.VITE_BASE_URL || "";
    const tq = typedQuery?.trim() || "";
    const c = (country || "").trim();
    const ci = (city || "").trim();

    const attempts: Array<{ call: () => Promise<any> }> = [];

    if (ci && c) {
      attempts.push({ call: () => searchHospitals(`address=&city=${encodeURIComponent(ci)}&state=${encodeURIComponent(c)}`) });
      attempts.push({ call: () => searchHospitals(`address=&city=${encodeURIComponent(ci.toLowerCase())}&state=${encodeURIComponent(c.toLowerCase())}`) });
      attempts.push({ call: () => searchHospitals(`address=&city=${encodeURIComponent(ci)}&state=`) });
    }

    if (tq && tq.length >= 3)
      attempts.push({ call: () => searchHospitals(`address=${encodeURIComponent(tq)}`) });

    if (c) {
      attempts.push({
        call: async () => {
          const resp = await fetch(`${base}/hospitals/country/${encodeURIComponent(c)}`);
          return resp.ok ? resp.json() : [];
        },
      });
      const normalized = normalizeCountryAliases(c);
      if (normalized && normalized !== c)
        attempts.push({
          call: async () => {
            const resp = await fetch(`${base}/hospitals/country/${encodeURIComponent(normalized)}`);
            return resp.ok ? resp.json() : [];
          },
        });
    }

    if (ci) attempts.push({ call: () => searchHospitals(`address=${encodeURIComponent(ci)}`) });

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
    setError("No hospitals found");
    onSearchResultsChange?.(false);
    setLoading(false);
  }

  useEffect(() => {
    let id: any;
    const shouldRun = (query && query.trim().length >= 3) || location.city || location.state;
    if (!shouldRun) {
      setHospitals([]);
      setError("");
      return;
    }
    id = setTimeout(async () => {
      await robustSearch({ typedQuery: query.trim(), city: location.city, country: location.state });
    }, 350);
    return () => clearTimeout(id);
  }, [query, location.city, location.state]);

  const filteredCountries = countries
    .map(c => {
      const matched = (c.hospitals || []).filter(h => {
        const city = (h.address?.city || "").toLowerCase();
        const country = (c.country || "").toLowerCase();
        const q = query.toLowerCase();
        return city.includes(q) || country.includes(q);
      });
      return { ...c, hospitals: matched };
    })
    .filter(c => (c.hospitals || []).length > 0);

  const handleInputChange = (v: string) => {
    setQuery(v);
    setDropdownOpen(true);
  };

  const handleSelectCity = (city: string, country: string) => {
    setLocation({ city, state: country, address: "" });
    setQuery(`${city}, ${country}`);
    setDropdownOpen(false);
    robustSearch({ city, country }).catch(console.error);
  };

  const toggleFav = (h: Hospital) => {
    try {
      const raw = JSON.parse(localStorage.getItem("favoriteHospitals") || "[]");
      const exists = raw.some((r: any) => r.name === h.name);
      const next = exists ? raw.filter((r: any) => r.name !== h.name) : [{ ...h }, ...raw].slice(0, 50);
      localStorage.setItem("favoriteHospitals", JSON.stringify(next));
      setFavorites(next);
      onFavoritesUpdate?.();
    } catch { }
  };

  const handleExplore = (hospital: Hospital) => {
    try {
      const raw = localStorage.getItem(RECENTLY_KEY) || "[]";
      const existing = JSON.parse(raw) as Hospital[];
      const filtered = existing.filter((h) => h.name !== hospital.name);
      const item = { ...hospital, viewedAt: Date.now() };
      const next = [item, ...filtered].slice(0, 10);
      localStorage.setItem(RECENTLY_KEY, JSON.stringify(next));
    } catch (err) {
      console.warn("Failed to update recently viewed:", err);
    }

    try {
      // ✅ Weekly stats update
      const now = Date.now();
      const stored = JSON.parse(localStorage.getItem(WEEKLY_KEY) || "{}");
      const lastReset = stored.lastReset || now;
      let count = stored.count || 0;
      if (now - lastReset > 7 * 24 * 60 * 60 * 1000) count = 0;
      const newStats = { count: count + 1, lastReset: now };
      localStorage.setItem(WEEKLY_KEY, JSON.stringify(newStats));
      setWeeklyViews(newStats.count);
    } catch (err) {
      console.warn("Failed to update weekly stats:", err);
    }
  };

  return (
    <div className={style.searchContainer}>
      <Motion variants={fadeUp} className={style.searchHeader}>
        <h1 className={style.heading}>
          Good to see you, <span className={style.name}>{state.username}</span>.
        </h1>
        <p className={style.subtext}>
          You’ve viewed <strong>{weeklyViews}</strong> hospitals this week.
        </p>
      </Motion>

      <div ref={dropdownRef} className={style.searchBox}>
        <div className={style.inputGroup}>
          <input
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setDropdownOpen(true)}
            placeholder="Search hospital, city or country..."
            className={style.input}
          />
          <button className={style.searchBtn}><AiOutlineSearch /></button>
        </div>

        {dropdownOpen && (
          <div className={style.dropdown}>
            {loadingCountries ? (
              <div className={style.dropdownItem}>Loading locations…</div>
            ) : filteredCountries.length ? (
              filteredCountries.map((g) => {
                const cities = Array.from(new Set((g.hospitals || []).map(h => h.address?.city).filter(Boolean)));
                return (
                  <div key={g.country} className={style.dropdownGroup}>
                    <div className={style.dropdownCountry}>{g.country}</div>
                    {cities.map(city => (
                      <div key={city} className={style.dropdownCity} onMouseDown={(ev) => { ev.preventDefault(); handleSelectCity(city, g.country); }}>
                        {city}
                      </div>
                    ))}
                  </div>
                );
              })
            ) : (
              <div className={style.dropdownItem}>No matching locations</div>
            )}
          </div>
        )}
      </div>

      <div className={style.results}>
        {loading && <div className={style.message}>Searching hospitals…</div>}
        {!loading && error && <div className={style.error}>{error}</div>}
        {!loading && hospitals.length > 0 && (
          <div className={style.resultsGrid}>
            {hospitals.map((h) => (
              <div key={h._id} className={style.hospitalCard}>
                <Avatar image={h.photoUrl || HospitalPic} alt={h.name} style={{ width: "100%", height: "150px", borderRadius: "12px", objectFit: "cover" }} />
                <div className={style.hospitalInfo}>
                  <h3>{h.name}</h3>
                  <p>{h.address?.city} — {h.address?.state}</p>
                  <div className={style.cardActions}>
                    <NavLink to={`${h._id}`} onClick={() => handleExplore(h)} className={style.exploreBtn}>
                      Explore
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

      {!loading && hospitals.length > 0 && (
        <Motion variants={fadeUp} className={style.container}>
          <ShareButton searchParams={location} />
          <ExportButton searchParams={location} />
          <button
            type="button"
            className={style.backBtn}
            onClick={() => {
              setHospitals([]);
              setLocation({ address: "", city: "", state: "" });
              onSearchResultsChange?.(false);
            }}
          >
            <span>Dashboard</span>
          </button>
        </Motion>
      )}

      <Outlet />
    </div>
  );
}
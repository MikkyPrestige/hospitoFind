import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart, AiOutlineSearch } from "react-icons/ai";
import { LocationInput } from "@/types/hospital";
import { getUniqueCities } from "@/utils/formatters";
import { Avatar } from "@/components/ui/Avatar";
import Motion from "@/components/ui/Motion";
import { fadeUp } from "@/utils/animations";
import HospitalPic from "@/assets/images/hospital-logo.jpg";
import ExportButton from "@/components/hospital/Export";
import ShareButton from "@/components/hospital/Share";
import AnimatedLoader from "@/components/ui/AnimatedLoader";
import style from "./styles/search.module.scss";
import { useHospitalSearch } from "@/hooks/useHospitalSearch";
import { useHospitalInteractions } from "@/hooks/useHospitalInteractions";

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const {
    hospitals,
    loading,
    error,
    countries,
    loadingCountries,
    performSearch,
    clearSearch
  } = useHospitalSearch();

  const { favorites, toggleFav, handleExplore } = useHospitalInteractions(
    onFavoritesUpdate,
    onRecentUpdate,
    onWeeklyViewsChange
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const hasLocation = location.city && location.state;
    const hasText = query && query.trim().length >= 2;

    if (!hasText && !hasLocation) {
      clearSearch();
      onSearchResultsChange?.(false);
      return;
    }

    const id = setTimeout(() => {
      performSearch(
        { typedQuery: query, city: location.city, country: location.state },
        onSearchResultsChange
      );
    }, 350);

    return () => clearTimeout(id);
  }, [query, location.city, location.state, performSearch, clearSearch, onSearchResultsChange]);

  const filteredCountries = countries.map(c => ({
    ...c, hospitals: (c.hospitals || []).filter(h => {
      const q = query.toLowerCase();
      return (h.address?.city || "").toLowerCase().includes(q) || (c.country || "").toLowerCase().includes(q);
    })
  })).filter(c => (c.hospitals || []).length > 0);

  const handleClearResults = () => {
    clearSearch();
    setQuery("");
    setLocation({ address: "", city: "", state: "" });
    onSearchResultsChange?.(false);
  };

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

                        performSearch(
                          { city: city as string, country: g.country },
                          onSearchResultsChange
                        );
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

      {!loading && hospitals.length > 0 && (
        <Motion variants={fadeUp} className={style.actionButtons}>
          <div className={style.utilityGroup}>
            <ShareButton searchParams={location} />
            <ExportButton searchParams={location} />
          </div>
          <button
            type="button"
            className={style.clearBtn}
            onClick={handleClearResults}
          >
            Clear Results
          </button>
        </Motion>
      )}
      <Outlet />
    </div>
  );
}
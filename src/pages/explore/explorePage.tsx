import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiMapPin, FiGlobe } from "react-icons/fi";
import CountryCard from "@/components/countryCard";
import { Hospital } from "@/services/hospital";
import Motion from "@/components/motion";
import { BASE_URL } from "@/context/userContext";
import { fadeUp, zoomIn, sectionReveal } from "@/hooks/animations";
import MapPin from "../../assets/images/mapPin.png"
import style from "./style/explore.module.css";
import { SEOHelmet } from "@/components/utils/seoUtils";
import AnimatedLoader from "@/components/utils/animatedLoader";
import { normalizeName } from "@/components/utils/helper"
import { countries as countriesData } from "countries-list";
import * as iso from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

// Register locale safely
// @ts-ignore
const isoLib = iso.default ? iso.default : iso;
isoLib.registerLocale(enLocale);

interface CountryData {
  country: string;
  continent?: string;
  hospitals: Hospital[];
}

interface CountryListEntry {
  name: string;
  continent: string;
}

const CONTINENTS = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"];

const ExplorePage = () => {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("All");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(`${BASE_URL}/hospitals/explore`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setCountries(data);
      } catch (err) {
        console.error("Atlas fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const getContinent = (countryName: string) => {
    const cleanName = countryName.trim();

    if (cleanName === "South Korea") return "Asia";
    if (cleanName === "UAE") return "Asia";

    const code = isoLib.getAlpha2Code(cleanName, "en");

    if (!code) return "Other";

    // @ts-ignore
    const data = countriesData[code] as CountryListEntry;
    const continentCode = data?.continent;

    switch (continentCode) {
      case "AF": return "Africa";
      case "NA":
      case "SA": return "Americas";
      case "AS": return "Asia";
      case "EU": return "Europe";
      case "OC": return "Oceania";
      default: return "Other";
    }
  };

  const unifiedCountries = useMemo(() => {
    const map = new Map<string, CountryData>();

    countries.forEach((item) => {
      const key = normalizeName(item.country);

      if (map.has(key)) {
        const existing = map.get(key)!;
        existing.hospitals = [...existing.hospitals, ...item.hospitals];

        if (item.country.match(/[^\w\s-]/)) {
          existing.country = item.country;
        }
      } else {
        map.set(key, { ...item, continent: getContinent(item.country) });
      }
    });

    return Array.from(map.values());
  }, [countries]);

  const filtered = useMemo(() => {
    return unifiedCountries.filter((c) => {
      const countryName = c.country.trim();
      const matchesSearch = countryName.toLowerCase().includes(query.trim().toLowerCase());

      const continent = c.continent || "Other";
      const matchesContinent = selectedContinent === "All" || continent === selectedContinent;

      return matchesSearch && matchesContinent;
    });
  }, [unifiedCountries, query, selectedContinent]);

  return (
    <>
      <SEOHelmet
        title="Global Directory"
        description="Navigate our worldwide index of verified healthcare facilities. Browse by country or continent to find medical care anywhere."
        canonical="https://hospitofind.online/directory"
        schemaType="global"
        schemaData={countries}
        autoBreadcrumbs={true}
      />

      <div className={style.pageWrapper}>
        <main className={style.explore}>
          <header className={style.hero}>
            <div className={style.heroContainer}>
              <Motion as="div" className={style.heroContent} variants={sectionReveal}>
                <span className={style.badge}><FiGlobe />Worldwide Healthcare Directory</span>
                <h1>Navigate Verified Care Globally</h1>
                <p>
                  Access our comprehensive index of accredited hospitals and medical centers,
                  organized by region to ensure you find trusted care wherever you go.
                </p>
              </Motion>

              <Motion
                as="div"
                className={style.heroVisual}
                variants={fadeUp}
              >
                <img src={MapPin} alt="3D Map illustration showing global hospital locations" className={style.tabletImg} />
              </Motion>
            </div>
          </header>

          <section className={style.controls}>
            <div className={style.searchBarWrapper}>
              <FiSearch className={style.searchIcon} />
              <input
                type="search"
                placeholder="Locate a country..."
                className={style.searchInput}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className={style.filterGroup}>
              {CONTINENTS.map((continent) => (
                <button
                  key={continent}
                  className={`${style.filterBtn} ${selectedContinent === continent ? style.active : ""}`}
                  onClick={() => setSelectedContinent(continent)}
                >
                  {continent}
                </button>
              ))}
            </div>
          </section>

          <section className={style.contentSection}>
            {loading ? (
              <div>
                <AnimatedLoader message="Retrieving global index..." variant="card" count={8} />
              </div>
            ) : filtered.length === 0 ? (
              <Motion as="div" className={style.emptyState} variants={fadeUp}>
                <div className={style.emptyIcon}><FiMapPin /></div>
                <h2>No Matching Regions Found</h2>
                <p>We couldn't locate "{query}" in {selectedContinent}. Please verify the spelling or try a broader region.</p>
                <button onClick={() => { setQuery(""); setSelectedContinent("All"); }} className={style.resetBtn}>
                  Reset Search Filters
                </button>
              </Motion>
            ) : (
              <div className={style.grid}>
                {filtered.map(({ country, hospitals }) => (
                  <Motion
                    as={Link}
                    key={country}
                    to={`/country/${encodeURIComponent(country.toLowerCase())}`}
                    className={style.cardLink}
                    variants={zoomIn}
                  >
                    <CountryCard country={country} count={hospitals.length} />
                  </Motion>
                ))}
              </div>
            )}
          </section>
        </main>
      </div >
    </>
  );
};

export default ExplorePage;
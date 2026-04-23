import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiMapPin, FiGlobe } from "react-icons/fi";
import { useGlobalDirectory } from "@/hooks/useGlobalDirectory";
import CountryCard from "@/components/hospital/CountryCard";
import Motion from "@/components/ui/Motion";
import { SEOHelmet } from "@/components/ui/SeoHelmet";
import AnimatedLoader from "@/components/ui/AnimatedLoader";
import { fadeUp, zoomIn, sectionReveal } from "@/utils/animations";
import style from "./styles/globalDirectory.module.css";

const CONTINENTS = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"];

const GlobalDirectory = () => {
  const [query, setQuery] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("All");
  const { unifiedCountries, loading } = useGlobalDirectory();

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
        title="Global Hospital Directory | Browse Healthcare Facilities Worldwide"
        description="Explore our comprehensive global directory of verified hospitals, clinics, and healthcare providers. Browse by country or continent to find trusted medical care anywhere in the world."
        canonical="https://hospitofind.online/directory"
        schemaType="global"
        schemaData={unifiedCountries}
        autoBreadcrumbs={true}
        lang="en"
      />

      <div className={style.pageWrapper}>
        <main className={style.directory}>
          <header className={style.hero}>
            <div className={style.heroContainer}>
              <Motion as="div" className={style.heroContent} variants={sectionReveal}>
                <span className={style.badge}><FiGlobe />Global Healthcare Directory</span>
                <h1 className={style.heroTitle}>Navigate Verified Care Globally</h1>
                <p className={style.heroSubtitle}>
                  Access our comprehensive index of accredited hospitals and medical centers,
                  organized by region to ensure you find trusted care wherever you go.
                </p>
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
              <div className={style.loaderWrapper}>
                <AnimatedLoader message="Retrieving global index..." variant="card" count={8} />
              </div>
            ) : filtered.length === 0 ? (
              <Motion as="div" className={style.emptyState} variants={fadeUp}>
                <div className={style.emptyIcon}><FiMapPin /></div>
                <h2 className={style.emptyStateTitle}>No Matching Regions Found</h2>
                <p className={style.emptyStateSubtitle}>We couldn't locate <strong>{query}</strong> in {selectedContinent}. Please verify the spelling or try a broader region.</p>
                <button onClick={() => { setQuery(""); setSelectedContinent("All"); }} className={style.resetBtn}>
                  Clear Search
                </button>
              </Motion>
            ) : (
              <div className={style.grid}>
                {filtered.map(({ country, hospitals }) => (
                  <Motion
                    as={Link}
                    key={country}
                    to={`/directory/${encodeURIComponent(country.toLowerCase())}`}
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
      </div>
    </>
  );
};

export default GlobalDirectory;
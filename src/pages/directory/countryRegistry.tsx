import React, {
  useState,
  useRef,
  useCallback,
  useMemo
} from "react";
import { useParams, Link } from "react-router-dom";
import { useCountryHospitals } from "@/hooks/useCountryHospitals";
import HospitalCard from "@/components/hospital/HospitalCard";
import { FiArrowLeft, FiSearch } from "react-icons/fi";
import Motion from "@/components/ui/Motion";
import { fadeUp } from "@/utils/animations";
import { SEOHelmet } from "@/components/ui/SeoHelmet";
import AnimatedLoader from "@/components/ui/AnimatedLoader";
import style from "./styles/countryRegistry.module.css";

const CountryRegistry: React.FC = () => {
  const { country } = useParams<{ country: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState("All");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const {
    hospitals,
    loading,
    fetchingMore,
    totalPages,
    page,
    decodedCountry,
    loadMore
  } = useCountryHospitals(country);


  // Infinite Scroll Observer
  const lastItemRef = useCallback(
    (node: Element | null) => {
      if (loading || fetchingMore || page >= totalPages) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) loadMore();
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, fetchingMore, page, totalPages, loadMore]
  );

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = activeType === "All" || h.type === activeType;
      return matchesSearch && matchesType;
    });
  }, [hospitals, searchTerm, activeType]);

  return (
    <>
      <SEOHelmet
        title={`Verified Hospitals in ${decodedCountry} | HospitoFind`}
        description={`Browse ${hospitals.length}+ verified hospitals, clinics, and emergency centers in ${decodedCountry}. Find detailed services, contact info, directions, opening hours, and real-time availability.`}
        canonical={`https://hospitofind.online/directory/${decodedCountry.toLowerCase()}`}
        schemaType="country"
        schemaData={hospitals}
        autoBreadcrumbs={false}
        lang="en"
      />

      <div className={style.layoutContainer}>
        <main className={style.page}>
          <header className={style.header}>
            <div className={style.headerContainer}>
              <div className={style.headerContent}>
                <Link to="/directory" className={style.backBtn}>
                  <FiArrowLeft /> Back to Directory
                </Link>
                <Motion variants={fadeUp} as="div">
                  <h1 className={style.title}>
                    Healthcare in <span className={style.accent}>{decodedCountry}</span>
                  </h1>
                  <p className={style.resultCount}>
                    Showing <span>{filteredHospitals.length}</span> verified healthcare providers in the region.
                  </p>
                </Motion>
              </div>
            </div>
          </header>

          <section className={style.controls}>
            <div className={style.searchWrapper}>
              <FiSearch className={style.searchIcon} />
              <input
                type="text"
                placeholder={`Search ${decodedCountry} medical centers...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={style.searchInput}
              />
            </div>

            <div className={style.filterGroup}>
              {["All", "Public", "Private", "Missionary", "Primary"].map((type) => (
                <button
                  key={type}
                  className={`${style.chip} ${activeType === type ? style.activeChip : ""}`}
                  onClick={() => setActiveType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </section>

          <section className={style.contentSection}>
            {loading && page === 1 ? (
              <AnimatedLoader message={`Syncing ${decodedCountry} records...`} variant="card" count={6} />
            ) : filteredHospitals.length === 0 ? (
              <div className={style.emptyState}>
                <FiSearch size={40} className={style.emptyIcon} />
                <h2 className={style.emptyStateTitle}>No Facilities Found</h2>
                <p className={style.emptyStateSubtitle}>No results for <strong>{searchTerm}</strong>. Try another keyword.</p>
                <button onClick={() => { setSearchTerm(""); setActiveType("All"); }} className={style.resetBtn}>
                  Clear Search/Filter
                </button>
              </div>
            ) : (
              <div className={style.grid}>
                {filteredHospitals.map((h, i) => (
                  <div
                    key={h._id || i}
                    ref={i === hospitals.length - 1 ? lastItemRef : null}
                    className={style.cardWrapper}
                  >
                    <Motion variants={fadeUp}>
                      <HospitalCard hospital={h} />
                    </Motion>
                  </div>
                ))}
              </div>
            )}
          </section>

          {fetchingMore && <div className={style.loadingMore}>Fetching more records...</div>}
        </main>
      </div>
    </>
  );
};

export default CountryRegistry;
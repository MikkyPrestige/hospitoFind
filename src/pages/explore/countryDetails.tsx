import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo
} from "react";
import { useParams, Link } from "react-router-dom";
import HospitalCard from "../../components/hospitalCard";
import { Hospital } from "@/services/hospital";
import Footer from "../../layouts/footer/footer";
import Header from "../../layouts/header/nav";
import { FiArrowLeft, FiSearch } from "react-icons/fi";
import style from "./style/countryDetails.module.css";
import Motion from "@/components/motion";
import { fadeUp } from "@/hooks/animations";
import { SEOHelmet } from "@/components/utils/seoUtils";
import AnimatedLoader from "@/components/utils/animatedLoader";
import MapPin from "../../assets/images/mapPin.png"

interface HospitalResponse {
  hospitals?: Hospital[];
  totalPages?: number;
}

const CountryDetailPage: React.FC = () => {
  const { country } = useParams<{ country: string }>();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [fetchingMore, setFetchingMore] = useState<boolean>(false);

  // Local Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState("All");

  const observerRef = useRef<IntersectionObserver | null>(null);
  const decodedCountry = useMemo(() => decodeURIComponent(country || ""), [country]);

  const fetchHospitals = useCallback(async () => {
    try {
      if (page === 1) setLoading(true);
      else setFetchingMore(true);

      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/hospitals/country/${encodeURIComponent(
          decodedCountry
        )}?page=${page}&limit=9`
      );

      if (!res.ok) throw new Error("Fetch failed");

      const data: HospitalResponse | Hospital[] = await res.json();
      const hospitalData = Array.isArray(data) ? data : data.hospitals || [];
      const total = Array.isArray(data) ? 1 : data.totalPages || 1;

      setHospitals((prev) => (page === 1 ? hospitalData : [...prev, ...hospitalData]));
      setTotalPages(total);
    } catch (err) {
      console.error("Error fetching:", err);
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  }, [page, decodedCountry]);

  useEffect(() => {
    fetchHospitals();
  }, [fetchHospitals]);

  // Infinite Scroll Observer
  const lastItemRef = useCallback(
    (node: Element | null) => {
      if (loading || fetchingMore || page >= totalPages) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) setPage((p) => p + 1);
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, fetchingMore, page, totalPages]
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
        title={`Verified Hospitals in ${decodedCountry}`}
        description={`Browse ${hospitals.length}+ verified hospitals and clinics in ${decodedCountry}. View services, contact info, and directions.`}
        canonical={`https://hospitofind.online/directory/${decodedCountry.toLowerCase()}`}
        schemaType="country"
        schemaData={hospitals}
        autoBreadcrumbs={true}
      />

      <Header />

      <div className={style.layoutContainer}>
        <main className={style.page}>
          <header className={style.header}>
            <div className={style.headerContainer}>
              <div className={style.headerContent}>
                <Link to="/directory" className={style.backBtn}>
                  <FiArrowLeft /> Back to Global Directory
                </Link>
                <Motion variants={fadeUp} as="div">
                  <h1 className={style.title}>
                    Healthcare in <span className={style.accent}>{decodedCountry}</span>
                  </h1>
                  <p className={style.resultCount}>
                    Access {filteredHospitals.length} verified healthcare providers and medical centers in the {decodedCountry} region.
                  </p>
                </Motion>
              </div>

              <Motion
                as="div"
                className={style.heroVisual}
                variants={fadeUp}
              >
                <img src={MapPin} alt={`Map pin illustration for ${decodedCountry}`} className={style.tabletImg} />
              </Motion>
            </div>
          </header>

          <section className={style.toolbar}>
            <div className={style.searchWrapper}>
              <FiSearch className={style.searchIcon} />
              <input
                type="text"
                placeholder={`Search for a hospital or clinic in ${decodedCountry}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              <AnimatedLoader message={`Syncing ${decodedCountry} medical records...`} variant="card" count={6} />
            ) : filteredHospitals.length === 0 ? (
              <div className={style.empty}>
                <h3>No Match Found</h3>
                <p>We couldn't find any facilities matching "{searchTerm}" in {decodedCountry}. Try adjusting your filters.</p>
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

          {fetchingMore && <div className={style.loadingMore}>Loading additional records...</div>}
        </main>
      </div>

      <Footer />
    </>
  );
};

export default CountryDetailPage;
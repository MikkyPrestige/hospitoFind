import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { useParams, Link } from "react-router-dom";
import HospitalCard from "../../components/hospitalCard";
import { Hospital } from "@/src/services/hospital";
import Footer from "../../layouts/footer/footer";
import Header from "../../layouts/header/nav";
import { Button } from "../../components/button";
import style from "./style/countryDetails.module.css";
import Motion from "@/components/motion";
import { fadeUp, sectionReveal } from "@/hooks/animations";

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

  const shuffleArray = (arr: Hospital[]): Hospital[] =>
    arr.sort(() => Math.random() - 0.5);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const countryRef = useRef<string | undefined>(country);
  countryRef.current = country;

  const fetchHospitals = useCallback(async () => {
    const c = decodeURIComponent(countryRef.current || "");
    try {
      if (page === 1) setLoading(true);
      else setFetchingMore(true);

      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/hospitals/country/${encodeURIComponent(
          c
        )}?page=${page}&limit=9`
      );

      if (!res.ok) {
        console.error("Fetch failed", res.status);
        setLoading(false);
        setFetchingMore(false);
        return;
      }

      const data: HospitalResponse | Hospital[] = await res.json();
      console.debug("Fetched page:", page, data);

      if (Array.isArray((data as HospitalResponse).hospitals)) {
        const randomized = shuffleArray((data as HospitalResponse).hospitals!);
        setHospitals((prev) =>
          page === 1 ? randomized : [...prev, ...randomized]
        );
        setTotalPages((data as HospitalResponse).totalPages || 1);
      } else if (Array.isArray(data)) {
        const randomized = shuffleArray(data);
        setHospitals((prev) =>
          page === 1 ? randomized : [...prev, ...randomized]
        );
      }
    } catch (err) {
      console.error("Error fetching:", err);
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  }, [page]);

  useEffect(() => {
    fetchHospitals();
  }, [fetchHospitals, page]);

  const lastItemRef = useCallback(
    (node: Element | null) => {
      if (loading || fetchingMore) return;
      if (observerRef.current) observerRef.current.disconnect();
      if (!node || page >= totalPages) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((p) => p + 1);
          }
        },
        { threshold: 0.4 }
      );

      observerRef.current.observe(node);
    },
    [loading, fetchingMore, page, totalPages]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return (
    <>
      <Header />
      <div className={style.page}>
        <header className={style.header}>
          <h2>{decodeURIComponent(country || "")}</h2>
          <p>{hospitals.length} hospitals</p>
        </header>

        {loading && page === 1 ? (
          <div className={style.loading}>Loading hospitals…</div>
        ) : hospitals.length === 0 ? (
          <div className={style.empty}>
            No hospitals listed for {decodeURIComponent(country || "")}.
          </div>
        ) : (
          <Motion variants={sectionReveal} className={style.list}>
            {hospitals.map((h, i) => {
              const isLast = i === hospitals.length - 1;
              return (
                <div
                  key={h._id || `${i}-${h.name}`}
                  ref={isLast ? lastItemRef : null}
                  style={{ width: "100%" }}
                >
                  <Motion variants={fadeUp}>
                    <HospitalCard hospital={h} />
                  </Motion>
                </div>
              );
            })}
          </Motion>
        )}

        {fetchingMore && (
          <div className={style.loadingMore}>Loading more hospitals…</div>
        )}

        <Button>
          <Link to="/explore" className={style.cta}>
            ← Back
          </Link>
        </Button>
      </div>
      <Footer />
    </>
  );
};

export default CountryDetailPage;


// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useParams, Link } from "react-router-dom";
// import HospitalCard from "../../components/hospitalCard";
// import Footer from "../../layouts/footer/footer";
// import Header from "../../layouts/header/nav";
// import { Button } from "../../components/button";
// import style from "./style/countryDetails.module.css";
// import Motion from "@/components/motion";
// import { fadeUp, sectionReveal } from "@/hooks/animations";

// const CountryDetailPage = () => {
//   const { country } = useParams();
//   const [hospitals, setHospitals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [fetchingMore, setFetchingMore] = useState(false);

//   const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

//   const observerRef = useRef(null);
//   const countryRef = useRef(country);
//   countryRef.current = country;

//   const fetchHospitals = useCallback(async () => {
//     const c = decodeURIComponent(countryRef.current || "");
//     try {
//       if (page === 1) setLoading(true);
//       else setFetchingMore(true);

//       const res = await fetch(
//         `${import.meta.env.VITE_BASE_URL}/hospitals/country/${encodeURIComponent(
//           c
//         )}?page=${page}&limit=9`
//       );

//       if (!res.ok) {
//         console.error("Fetch failed", res.status);
//         setLoading(false);
//         setFetchingMore(false);
//         return;
//       }

//       const data = await res.json();
//       console.debug("Fetched page:", page, data);

//    if (Array.isArray(data.hospitals)) {
//   const randomized = shuffleArray(data.hospitals);
//   setHospitals((prev) =>
//     page === 1 ? randomized : [...prev, ...randomized]
//   );
//   setTotalPages(data.totalPages || 1);
// } else if (Array.isArray(data)) {
//   const randomized = shuffleArray(data);
//   setHospitals((prev) =>
//     page === 1 ? randomized : [...prev, ...randomized]
//   );
// } else if (Array.isArray(data)) {
//         setHospitals((prev) => (page === 1 ? data : [...prev, ...data]));
//       }
//     } catch (err) {
//       console.error("Error fetching:", err);
//     } finally {
//       setLoading(false);
//       setFetchingMore(false);
//     }
//   }, [page]);

//   useEffect(() => {
//     fetchHospitals();
//   }, [fetchHospitals, page]);

//   const lastItemRef = useCallback(
//     (node) => {
//       if (loading || fetchingMore) return;
//       if (observerRef.current) observerRef.current.disconnect();
//       if (!node || page >= totalPages) return;

//       observerRef.current = new IntersectionObserver(
//         (entries) => {
//           if (entries[0].isIntersecting) {
//             setPage((p) => p + 1);
//           }
//         },
//         { threshold: 0.4 }
//       );

//       observerRef.current.observe(node);
//     },
//     [loading, fetchingMore, page, totalPages]
//   );

//   useEffect(() => {
//     return () => {
//       if (observerRef.current) observerRef.current.disconnect();
//     };
//   }, []);

//   return (
//     <>
//       <Header />
//       <div className={style.page}>
//         <header className={style.header}>
//           <h2>{decodeURIComponent(country || "")}</h2>
//           <p>{hospitals.length} hospitals</p>
//         </header>

//         {loading && page === 1 ? (
//           <div className={style.loading}>Loading hospitals…</div>
//         ) : hospitals.length === 0 ? (
//           <div className={style.empty}>
//             No hospitals listed for {decodeURIComponent(country || "")}.
//           </div>
//         ) : (
//           <Motion variants={sectionReveal} className={style.list}>
//             {hospitals.map((h, i) => {
//               const isLast = i === hospitals.length - 1;
//               return (
//                 <div
//                   key={h._id || `${i}-${h.name}`}
//                   ref={isLast ? lastItemRef : null}
//                   style={{ width: "100%" }}
//                 >
//                   <Motion variants={fadeUp}>
//                     <HospitalCard hospital={h} />
//                   </Motion>
//                 </div>
//               );
//             })}
//           </Motion>
//         )}

//         {fetchingMore && (
//           <div className={style.loadingMore}>Loading more hospitals…</div>
//         )}

//         <Button>
//           <Link to="/explore" className={style.cta}>
//             ← Back
//           </Link>
//         </Button>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default CountryDetailPage;
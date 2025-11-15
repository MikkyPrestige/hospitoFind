import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import CountryCard from "../../components/countryCard";
import { Hospital } from "@/src/services/hospital";
import Header from "../../layouts/header/nav";
import Footer from "../../layouts/footer/footer";
import Motion from "@/components/motion";
import { fadeUp, zoomIn } from "@/hooks/animations";
import style from "./style/explore.module.css";

interface CountryData {
  country: string;
  hospitals: Hospital[];
}


const ExplorePage = () => {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/hospitals/explore`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setCountries(data);
      } catch (err) {
        console.error("Explore fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const filtered = countries.filter((c) =>
    c.country.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Explore hospitals by country | HospitoFind</title>
      </Helmet>

      <Header />

      <div className={style.explore}>
        <Motion as="section" className={style.hero} variants={fadeUp}>
          <h1>Your Gateway to Hospitals Worldwide</h1>
        </Motion>

        <Motion as="div" className={style.searchBar} variants={fadeUp}>
          <input
            type="search"
            placeholder="Search country..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Motion>

        {loading ? (
          <Motion as="div" className={style.loading} variants={fadeUp}>
            <div className={style.spinner}></div>
            <p>Getting hospitals globally…</p>
          </Motion>
        ) : filtered.length === 0 ? (
          <Motion as="div" className={style.empty} variants={fadeUp}>
            <h3>No results found</h3>
            <p>Try searching another country or check back soon.</p>
          </Motion>
        ) : (
          // <Motion as="div" className={style.grid} variants={staggerChildren}>
          <div className={style.grid}>
            {filtered.map(({ country, hospitals }) => (
              <Motion
                as={Link}
                key={country}
                to={`/explore/${encodeURIComponent(country.toLowerCase())}`}
                className={style.cardLink}
                variants={zoomIn}
              >
                <CountryCard country={country} count={hospitals.length} />
              </Motion>
            ))}
              </div>
          // </Motion>
        )}
      </div >
      <Footer />
    </>
  );
};

export default ExplorePage;
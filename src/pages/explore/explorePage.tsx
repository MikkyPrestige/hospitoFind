import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CountryCard from "../../components/countryCard";
import { Hospital } from "@/src/services/hospital";
import Header from "../../layouts/header/nav";
import Footer from "../../layouts/footer/footer";
import Motion from "@/components/motion";
import { fadeUp, zoomIn } from "@/hooks/animations";
import style from "./style/explore.module.css";
import { SEOHelmet } from "@/components/utils/seoUtils";
import AnimatedLoader from "@/components/utils/AnimatedLoader";

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
        console.error("Atlas fetch error:", err);
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
      <SEOHelmet
        title="Explore Hospitals by Country"
        description="Browse hospitals across the globe with HospitoFind. Search by country to find verified healthcare facilities and services worldwide."
        canonical="https://hospitofind.online/country"
        schemaType="global"
        schemaData={countries}
        autoBreadcrumbs={true}
      />
      <Header />

      <main className={style.explore}>
        <Motion as="section" className={style.hero} variants={fadeUp}>
          <h1>Explore Hospitals Around the World</h1>
          <p>Browse hospitals grouped by country and discover healthcare options wherever you are.</p>
        </Motion>

        <Motion as="div" className={style.searchBar} variants={fadeUp}>
          <input
            type="search"
            placeholder="Search by country..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Motion>

        {loading ? (
          <Motion as="div" className={style.loading} variants={fadeUp}>
            <AnimatedLoader message="Getting hospitals globally…" variant="card" count={6} />
          </Motion>
        ) : filtered.length === 0 ? (
          <Motion as="div" className={style.empty} variants={fadeUp}>
            <h2>No results found</h2>
            <p>Try searching another country or check back soon.</p>
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
        </main>
          <Footer />
        </>
        );
};

        export default ExplorePage;
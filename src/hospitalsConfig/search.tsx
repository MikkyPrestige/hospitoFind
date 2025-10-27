import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AiOutlineSearch, AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import Motion from "@/components/motion";
import { fadeUp, sectionReveal } from "@/hooks/animations";
import { LocationInput, Hospital } from '@/services/hospital';
import { statesAndCities } from '@/services/location';
import { searchHospitals } from '@/services/api';
import { useAuthContext } from '@/context/userContext';
import ExportButton from '@/hospitalsConfig/export';
import ShareButton from '@/hospitalsConfig/share';
import { Avatar } from '@/components/avatar';
import HospitalPic from '@/assets/images/hospital-logo.jpg';
import style from './style/search/search.module.css';
import style2 from '../components/style/popular.module.css';
import { AiOutlineArrowLeft } from 'react-icons/ai';

const RECENTLY_KEY = 'recentlyViewedHospitals';
const FAVORITES_KEY = 'favoriteHospitals';
const WEEKLY_KEY = 'weeklyStats';

type StoredHospital = Hospital & { viewedAt?: number };

const SearchForm = ({
  onSearchResultsChange,
  onFavoritesUpdate,
}: {
  onSearchResultsChange?: (hasResults: boolean) => void;
  onFavoritesUpdate?: () => void;
}) => {
  const [location, setLocation] = useState<LocationInput>({ address: '', city: '', state: '' });
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [error, setError] = useState<string>('');
  const [searching, setSearching] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<StoredHospital[]>([]);
  const [weeklyViews, setWeeklyViews] = useState<number>(0);
  const { state } = useAuthContext();

  // load favorites & weekly on mount (favorites are Hospital objects)
  useEffect(() => {
    try {
      const favRaw = localStorage.getItem(FAVORITES_KEY);
      const favs = favRaw ? (JSON.parse(favRaw) as StoredHospital[]) : [];
      setFavorites(favs);
    } catch {
      setFavorites([]);
    }

    try {
      const stats = JSON.parse(localStorage.getItem(WEEKLY_KEY) || '{}');
      setWeeklyViews(stats.count || 0);
    } catch {
      setWeeklyViews(0);
    }
  }, []);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [city, state] = e.target.value.split(',');
    setLocation({ ...location, city, state });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocation({ ...location, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearching(true);
    if (!location.address && !location.city && !location.state) {
      setError('Enter a hospital name or location to begin your search.');
      setHospitals([]);
      setSearching(false);
      return;
    }
    const query = `address=${location.address}&city=${location.city}&state=${location.state}`;
    try {
      const data = await searchHospitals(query);
      if (!data || data.length === 0) {
        setError('No hospital found for your search. try a nearby city.');
        setHospitals([]);
        onSearchResultsChange?.(false); // no results
      } else {
        setHospitals(data);
        setError('');
        onSearchResultsChange?.(true); // results exist
      }
    } catch (err: any) {
      if (err.data) setError(err.message);
      else if (err.request) setError('We couldn’t reach the server. Please check your connection and try again.');
      else setError(err.message);
      setHospitals([]);
      onSearchResultsChange?.(false);
    } finally {
      setSearching(false);
    }
  };

  // explore: add recently viewed (full object) and update weekly count
  const handleExplore = (hospital: Hospital) => {
    // recently viewed storing full object with viewedAt
    try {
      const raw = localStorage.getItem(RECENTLY_KEY) || '[]';
      const existing = JSON.parse(raw) as StoredHospital[];
      const filtered = existing.filter((h) => h.name !== hospital.name);
      const item: StoredHospital = { ...hospital, viewedAt: Date.now() };
      const next = [item, ...filtered].slice(0, 10);
      localStorage.setItem(RECENTLY_KEY, JSON.stringify(next));
    } catch {
      // ignore localStorage failures
    }

    // weekly stats
    try {
      const now = Date.now();
      const stored = JSON.parse(localStorage.getItem(WEEKLY_KEY) || '{}');
      const lastReset = stored.lastReset || now;
      let count = stored.count || 0;
      if (now - lastReset > 7 * 24 * 60 * 60 * 1000) count = 0;
      const newStats = { count: count + 1, lastReset: now };
      localStorage.setItem(WEEKLY_KEY, JSON.stringify(newStats));
      setWeeklyViews(newStats.count);
    } catch {
      setWeeklyViews((v) => v + 1);
    }
  };

  // favorites: store full object (Hospital)
  const toggleFavorite = (hospital: Hospital) => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY) || '[]';
      const existing: StoredHospital[] = JSON.parse(raw);
      const exists = existing.find((h) => h.name === hospital.name);
      let next: StoredHospital[];
      if (exists) {
        next = existing.filter((h) => h.name !== hospital.name);
      } else {
        // keep max 50
        next = [{ ...hospital }, ...existing].slice(0, 50);
      }
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      onFavoritesUpdate?.();
      setFavorites(next);
    } catch {
      // fallback local state update
      const exists = favorites.some((h) => h.name === hospital.name);
      const next = exists ? favorites.filter((h) => h.name !== hospital.name) : [{ ...hospital }, ...favorites];
      setFavorites(next);
      try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(next)); } catch { }
    }
  };

  useEffect(() => {
    if (hospitals.length === 0) {
      onSearchResultsChange?.(false);
    }
  }, [hospitals]);


  // check saved by name
  const isSaved = (hospital: Hospital) => favorites.some((f) => f.name === hospital.name);

  return (
    <Motion variants={sectionReveal} className={style.search}>
      <Motion variants={fadeUp}>
        <h1 className={style.heading}>
          Welcome back <span className={style.name}>{state.name}</span> 👋
        </h1>
        <p className={style.subtext}>
          You’ve viewed <strong>{weeklyViews}</strong> hospitals this week.
        </p>
      </Motion>

      <Motion variants={fadeUp} className={style.wrapper}>
        <form onSubmit={handleSubmit} className={style.form}>
          <div className={style.box}>
            <input
              type="text"
              name="address"
              value={location.address}
              onChange={handleInput}
              placeholder="Enter Hospital address or Name"
              className={style.input}
            />
            {error && <p className={style.error}>{error}</p>}
          </div>
          <select onChange={handleSelect} className={style.select}>
            <option value="">City, State</option>
            {statesAndCities.map((name) => (
              <option key={`${name.city},${name.state}`} value={`${name.city},${name.state}`}>
                {`${name.city}, ${name.state}`}
              </option>
            ))}
          </select>
          <button type="submit" disabled={searching} className={style.cta}>
            {searching ? <div /> : <AiOutlineSearch className={style.icon} />}
          </button>
        </form>
      </Motion>

      <ul className={style.hospitals}>
        {hospitals.length > 0 ? (
          <Motion variants={sectionReveal}>
            <h1 className={style.title}>
              {hospitals.length} {hospitals.length === 1 ? "Hospital" : "Hospitals"} found
            </h1>
            <div className={style.wrapper}>
              {hospitals.map((hospital, id) => (
                <Motion key={id} variants={fadeUp} className={style.card}>
                  <div className={style2.img}>
                    <Avatar
                      image={hospital.photoUrl || HospitalPic}
                      alt="hospital"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "1.2rem",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className={style2.details}>
                    <h3 className={style2.name}>{hospital.name}</h3>
                    <h3 className={style2.address}>
                      {hospital?.address.street}, {hospital?.address.city}
                    </h3>
                    <div className={style.actions}>
                      <NavLink
                        to={`${hospital._id}`}
                        className={style2.btn}
                        onClick={() => handleExplore(hospital)}
                      >
                        Explore Hospital
                      </NavLink>
                      <button
                        className={style.heart}
                        onClick={() => toggleFavorite(hospital)}
                        aria-label={isSaved(hospital) ? "Unsave hospital" : "Save hospital"}
                      >
                        {isSaved(hospital) ? <AiFillHeart color="#ff033e" /> : <AiOutlineHeart />}
                      </button>
                    </div>
                  </div>
                </Motion>
              ))}
            </div>
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
                <AiOutlineArrowLeft className={style.backIcon} />
                <span>Back to Dashboard</span>
              </button>
            </Motion>
          </Motion>
        ) : null }
      </ul>
      <Outlet />
    </Motion>
  );
};

export default SearchForm;
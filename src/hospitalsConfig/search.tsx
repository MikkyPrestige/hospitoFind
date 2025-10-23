import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { LocationInput, Hospital } from '@/services/hospital'
import { statesAndCities } from '@/services/location'
import { searchHospitals } from '@/services/api'
import { useAuthContext } from '@/context/userContext'
import ExportButton from '@/hospitalsConfig/export'
import ShareButton from '@/hospitalsConfig/share'
import PopularHospitals from '@/components/popular'
import { Avatar } from '@/components/avatar'
import HospitalPic from '@/assets/images/hospital-logo.jpg'
import style from './style/search/search.module.css'
import style2 from '../components/style/popular.module.css'

const Search = () => {
  const [location, setLocation] = useState<LocationInput>({
    address: '',
    city: '',
    state: '',
  });

  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [error, setError] = useState<string>('');
  const [searching, setSearching] = useState<boolean>(false);
  const { state } = useAuthContext();

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [city, state] = e.target.value.split(',')
    setLocation({ ...location, city, state })
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLocation({ ...location, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSearching(true)
    if (!location.address && !location.city && !location.state) {
      setError('Please Enter/Select a Hospital address or Name')
      setHospitals([])
      setSearching(false)
      return
    }
    const query = `address=${location.address}&city=${location.city}&state=${location.state}`
    try {
      const data = await searchHospitals(query)
      if (data.length === 0) {
        setError('Sorry! We could not find any results matching your search.\nPlease try again with different search parameter.')
        setHospitals([])
      } else {
        setHospitals(data)
        setError('')
      }
    } catch (err: any) {
      if (err.data) {
        setError(err.message)
        setHospitals([])
      } else if (err.request) {
        setError('Server did not respond')
        setHospitals([])
      } else {
        setError(err.message)
        setHospitals([])
      }
    } finally {
      setSearching(false)
    }
  }

  return (
    <section className={style.search}>
      <h1 className={style.heading}>Welcome back <span className={style.name}>{state.name}</span>👋</h1>
      <section className={style.wrapper}>
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
          <option
            key={`${name.city},${name.state}`}
            value={`${name.city},${name.state}`}
          >
            {`${name.city}, ${name.state}`}
          </option>
        ))}
      </select>
      <button type="submit" disabled={searching} className={style.cta}>
        {searching ? (
          <div></div>
        ) : (
          <AiOutlineSearch className={style.icon} />
        )}
      </button>
    </form>
      </section >
      <ul className={style.hospitals}>
        <h1 className={style.title}>
          {hospitals.length > 0 ? (
            `${hospitals.length} ${hospitals.length === 1 ? 'Hospital' : 'Hospitals'
            } found
          `
          ) : (
            <PopularHospitals />
          )}
        </h1>
        <div className={style2.wrapper}>
          {hospitals.length > 0 &&
            hospitals.map((hospital, id) => (
              <li key={id} className={style2.card}>
                <div className={style2.img}>
                  {hospital?.photoUrl ? (
                    <Avatar
                      image={hospital.photoUrl}
                      alt="hospital"
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '1.2rem',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <Avatar
                      image={HospitalPic}
                      alt="hospital"
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '1.2rem',
                        objectFit: 'cover',
                      }}
                    />
                  )}
                </div>
                <div className={style2.details}>
                  <h3 className={style2.name}>{hospital.name}</h3>
                  <h3 className={style2.address}>{hospital?.address.street}, {hospital?.address.city}</h3>
                  <NavLink to={`${hospital.name}`} className={style2.btn}>
                    Explore Hospital
                  </NavLink>
                </div>
              </li>
            ))}
        </div>
        {hospitals.length > 0 && (
          <div className={style.container}>
            <ShareButton searchParams={location} />
            <ExportButton searchParams={location} />
          </div>
        )}
      </ul>
      <Outlet />
    </section >
  )
}

export default Search

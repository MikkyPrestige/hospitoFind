import React from "react";
import ReactCountryFlag from "react-country-flag";
import style from "./style/countryCard.module.css";

interface CountryCardProps {
  country: string;
  count: number;
}


const CountryCard: React.FC<CountryCardProps> = ({ country, count }) => {
  return (
    <div className={style.card} role="button" aria-label={`Explore ${country}`}>
      <div className={style.flagWrap}>
        <ReactCountryFlag
          svg
          style={{ width: "2.2rem", height: "2.2rem" }}
          countryCode={getFlagCode(country) ?? ""}
          title={country}
        />
      </div>

      <h3 className={style.name}>{country}</h3>
      <p className={style.count}>{count} hospitals</p>
    </div>
  );
};

function getFlagCode(country: string): string | undefined {
  const map: Record<string, string> = {
    Nigeria: "NG",
    Ghana: "GH",
    "United States": "US",
    "United Kingdom": "GB",
    "South Korea": "KR",
    China: "CN",
    Japan: "JP",
    Germany: "DE",
    Kenya: "KE",
    "South Africa": "ZA",
    Uganda: "UG",
    Sweden: "SE",
    Belgium: "BE",
    India: "IN",
    "Saudi Arabia": "SA",
    Egypt: "EG",
    Morocco: "MA",
    Spain: "ES",
    Angola: "AO",
    Australia: "AU",
    Botswana: "BW",
    Canada: "CA",
    Denmark: "DK",
    Eritrea: "ER",
    France: "FR",
    Italy: "IT",
    Malta: "MT",
    Netherlands: "NL",
    "New Zealand": "NZ",
    Singapore: "SG",
    Switzerland: "CH",
    Thailand: "TH",
    "UAE": "AE",
    Niger: "NE"
  };

  // direct lookup then some heuristics
  const direct = map[country] || map[country.trim()];
  if (direct) return direct;

  // attempt simple ISO lookup by name fallback: take first two letters
  // Prefer explicit mapping; return undefined to let react-country-flag show empty
  return undefined;
}

export default CountryCard;

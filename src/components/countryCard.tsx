import React from "react";
import ReactCountryFlag from "react-country-flag";
import * as countries from "i18n-iso-countries";
import style from "./style/countryCard.module.css";
import enLocale from "i18n-iso-countries/langs/en.json";

// @ts-ignore
const iso = countries.default ? countries.default : countries;
iso.registerLocale(enLocale);

interface CountryCardProps {
  country: string;
  count: number;
}


const CountryCard: React.FC<CountryCardProps> = ({ country, count }) => {
  const getCountryCode = (name: string) => {
    const cleanName = name.trim();

    return iso.getAlpha2Code(cleanName, "en");
  };

  const code = getCountryCode(country);

  return (
    <div className={style.card} role="button" aria-label={`Explore ${country}`}>
      <div className={style.flagWrap}>
        {code ? (
          <ReactCountryFlag
            svg
            style={{ width: "2.2rem", height: "2.2rem", objectFit: "cover", borderRadius: "50%" }}
            countryCode={code}
            title={country}
          />
        ) : (
            <span style={{ fontSize: "1.5rem" }} role="img" aria-label="Globe">🌍</span>
        )}
      </div>

      <h3 className={style.name}>{country}</h3>
      <p className={style.count}>{count} hospitals</p>
    </div>
  );
};


export default CountryCard;
import { useState, useEffect, useMemo } from "react";
import { CountryData, CountryListEntry, } from "@/types/hospital";
import { BASE_URL } from "@/context/UserProvider";
import { normalizeName } from "@/utils/formatters";
import { countries as countriesData } from "countries-list";
import * as iso from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

// ISO setup
// @ts-ignore
const isoLib = iso.default ? iso.default : iso;
isoLib.registerLocale(enLocale);

export const useGlobalDirectory = () => {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/hospitals/explore`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setCountries(data);
      } catch (err: any) {
        console.error("Atlas fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const getContinent = (countryName: string) => {
    const cleanName = countryName.trim();
    if (cleanName === "South Korea") return "Asia";
    if (cleanName === "UAE") return "Asia";

    const code = isoLib.getAlpha2Code(cleanName, "en");
    if (!code) return "Other";

    const data = countriesData[code as keyof typeof countriesData] as unknown as CountryListEntry;
    const continentCode = data?.continent;

    switch (continentCode) {
      case "AF": return "Africa";
      case "NA":
      case "SA": return "Americas";
      case "AS": return "Asia";
      case "EU": return "Europe";
      case "OC": return "Oceania";
      default: return "Other";
    }
  };

  const unifiedCountries = useMemo(() => {
    const map = new Map<string, CountryData>();

    countries.forEach((item) => {
      const key = normalizeName(item.country);
      if (map.has(key)) {
        const existing = map.get(key)!;
        existing.hospitals = [...existing.hospitals, ...item.hospitals];
        if (item.country.match(/[^\w\s-]/)) {
          existing.country = item.country;
        }
      } else {
        map.set(key, { ...item, continent: getContinent(item.country) });
      }
    });

    return Array.from(map.values());
  }, [countries]);

  return { unifiedCountries, loading, error };
};
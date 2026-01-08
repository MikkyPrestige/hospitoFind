import { Hospital } from "@/services/hospital";

const toSlug = (text: string | undefined | null) => {
  if (!text) return "";

  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const standardizeText = (text: string) => {
    if (!text) return "";
    return text
        .trim()
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// Helper to remove duplicates from the dropdown
const getUniqueCities = (hospitals: Hospital[]) => {
  const seen = new Set();
  return (hospitals || [])
    .map(h => h.address?.city?.trim())
    .filter(city => {
      if (!city) return false;
      const lower = city.toLowerCase();
      if (seen.has(lower)) return false;
      seen.add(lower);
      return true;
    });
};

const normalizeName = (name: string) => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

export { toSlug, standardizeText, getUniqueCities, normalizeName };

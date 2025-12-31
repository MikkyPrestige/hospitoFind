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

export { toSlug, standardizeText };

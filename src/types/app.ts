export interface SEOProps {
    title: string;
    description?: string;
    canonical?: string;
    image?: string;
    includeBrand?: boolean;
    schemaType?: "homepage" | "about" | "global" | "country" | "hospital" | "sharedList" | "search" | "healthTips" | "healthNews" | "outbreaks" | "faq" | "policy" | "terms";
    schemaData?: any;
    autoBreadcrumbs?: boolean;
    extraSchema?: Record<string, any>[];
    lang?: string;
    hreflang?: Array<{ lang: string; url: string }>;
    searchTerm?: string;
    robots?: string;
}

export interface GlobalStats {
  totalHospitals: number | null;
  totalCountries: number | null;
}
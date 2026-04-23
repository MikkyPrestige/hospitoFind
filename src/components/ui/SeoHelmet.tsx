import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useLocation } from "react-router-dom";
import { SEOProps } from "@/types/app";

const BRAND = "HospitoFind";
const SITE_URL = "https://hospitofind.online";

//  OG IMAGE MAPPING
const OG_IMAGES = {
    default: "https://hospitofind.online/og-default.jpg",
    hospital: "https://hospitofind.online/og-hospital.jpg",
    wellness: "https://hospitofind.online/og-wellness.jpg",
    news: "https://hospitofind.online/og-news.jpg",
    alerts: "https://hospitofind.online/og-alerts.jpg",
    about: "https://hospitofind.online/og-about.jpg",
    directory: "https://hospitofind.online/og-directory.jpg",
    share: "https://hospitofind.online/og-share.jpg",
} as const;

export const SEOHelmet: React.FC<SEOProps> = ({
    title,
    description = "Find hospitals, clinics, and healthcare services near you with HospitoFind.",
    canonical,
    image,
    includeBrand = true,
    schemaType,
    schemaData,
    autoBreadcrumbs = false,
    extraSchema,
    lang = "en",
    hreflang = [],
    searchTerm,
    robots = "index, follow",
}) => {
    const location = useLocation();
    const fullTitle = includeBrand ? `${title} | ${BRAND}` : title;
    const currentCanonical = canonical || `${SITE_URL}${location.pathname}`;

    // Smart default image based on schemaType
    const getDefaultImage = (): string => {
        switch (schemaType) {
            case "hospital":
                return OG_IMAGES.hospital;
            case "healthTips":
                return OG_IMAGES.wellness;
            case "healthNews":
                return OG_IMAGES.news;
            case "outbreaks":
                return OG_IMAGES.alerts;
            case "about":
                return OG_IMAGES.about;
            case "global":
            case "country":
                return OG_IMAGES.directory;
            case "sharedList":
                return OG_IMAGES.share;
            default:
                return OG_IMAGES.default;
        }
    };

    const ogImage = image || getDefaultImage();

    // Auto Breadcrumbs
    const buildBreadcrumbs = (): any => {
        if (!autoBreadcrumbs) return null;

        const { country } = useParams();
        const crumbs = [{ name: "Home", url: SITE_URL }];

        if (country) {
            crumbs.push({
                name: country,
                url: `${SITE_URL}/country/${country.toLowerCase().replace(/\s+/g, "-")}`,
            });
        }
        if (title) {
            crumbs.push({ name: title, url: currentCanonical });
        }

        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: crumbs.map((crumb, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: crumb.name,
                item: crumb.url,
            })),
        };
    };

    const buildJsonLd = (): any => {
        switch (schemaType) {
            case "homepage":
                return {
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    name: title,
                    description,
                    url: currentCanonical,
                    publisher: {
                        "@type": "Organization",
                        name: BRAND,
                        url: SITE_URL,
                        logo: { "@type": "ImageObject", url: "https://hospitofind.online/logo.png", width: 512, height: 512 },
                    },
                    mainEntity: {
                        "@type": "WebSite",
                        name: BRAND,
                        url: SITE_URL,
                        potentialAction: {
                            "@type": "SearchAction",
                            target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/find-hospital?query={search_term_string}` },
                            "query-input": "required name=search_term_string",
                        },
                    },
                };

            case "about":
                return {
                    "@context": "https://schema.org",
                    "@type": "AboutPage",
                    name: title,
                    description,
                    url: currentCanonical,
                    mainEntity: {
                        "@type": "Organization",
                        name: BRAND,
                        description,
                        url: currentCanonical,
                        logo: { "@type": "ImageObject", url: "https://hospitofind.online/logo.png", width: 512, height: 512 },
                        areaServed: { "@type": "Country", name: "Global" },
                        contactPoint: { "@type": "ContactPoint", contactType: "customer service", url: `${SITE_URL}/contact` },
                    },
                };

            case "search":
                return {
                    "@context": "https://schema.org",
                    "@type": "SearchResultsPage",
                    name: title,
                    description,
                    url: currentCanonical,
                    mainEntity: {
                        "@type": "ItemList",
                        name: searchTerm ? `Hospitals in ${searchTerm}` : title,
                        numberOfItems: schemaData?.length || 0,
                        itemListElement: schemaData?.map((hospital: any, index: number) => ({
                            "@type": "ListItem",
                            position: index + 1,
                            name: hospital.name,
                            url: `https://hospitofind.online/hospital/${encodeURIComponent(
                                hospital.name.toLowerCase().replace(/\s+/g, "-")
                            )}`,
                        })) || [],
                    },
                    potentialAction: {
                        "@type": "SearchAction",
                        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/find-hospital?query={search_term_string}` },
                        "query-input": "required name=search_term_string",
                    },
                };

            case "hospital":
                if (!schemaData) return null;
                const h = schemaData;
                return {
                    "@context": "https://schema.org",
                    "@type": "Hospital",
                    name: h.name,
                    description,
                    url: currentCanonical,
                    image: h.photoUrl || ogImage,
                    telephone: h.phoneNumber,
                    email: h.email,
                    address: h.address ? {
                        "@type": "PostalAddress",
                        streetAddress: h.address.street,
                        addressLocality: h.address.city,
                        addressRegion: h.address.state,
                        addressCountry: h.address.country,
                        postalCode: h.address.postalCode,
                    } : undefined,
                    geo: h.latitude && h.longitude ? {
                        "@type": "GeoCoordinates",
                        latitude: h.latitude,
                        longitude: h.longitude,
                    } : undefined,
                    openingHours: h.openingHours,
                    department: h.services?.length
                        ? h.services.map((service: string) => ({ "@type": "MedicalDepartment", name: service }))
                        : undefined,
                    medicalSpecialty: h.specialties || h.services,
                    ...(h.rating ? {
                        aggregateRating: {
                            "@type": "AggregateRating",
                            ratingValue: h.rating,
                            reviewCount: h.reviewCount || 0,
                        },
                    } : {}),
                    priceRange: h.priceRange || "$$",
                    sameAs: h.website ? [h.website] : undefined,
                    hasMap: h.googleMapsUrl,
                    areaServed: h.address?.city ? { "@type": "City", name: h.address.city } : undefined,
                };

            case "sharedList":
                return {
                    "@context": "https://schema.org",
                    "@type": "ItemList",
                    name: title,
                    description,
                    url: currentCanonical,
                    numberOfItems: schemaData?.length || 0,
                    itemListElement: schemaData?.map((hospital: any, index: number) => ({
                        "@type": "ListItem",
                        position: index + 1,
                        name: hospital.name,
                        url: `https://hospitofind.online/hospital/${hospital.address?.state?.toLowerCase()}/${hospital.address?.city?.toLowerCase()}/${hospital.slug}`,
                    })) || [],
                };

            case "global":
            case "country":
            case "healthTips":
            case "healthNews":
            case "outbreaks":
                return {
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    name: title,
                    description,
                    url: currentCanonical,
                    mainEntity: {
                        "@type": "ItemList",
                        name: title,
                        numberOfItems: schemaData?.length || 0,
                        itemListElement: schemaData?.map((item: any, index: number) => ({
                            "@type": "ListItem",
                            position: index + 1,
                            name: item.name || item.country || item.title || item.Title,
                            url: item.url || item.link || item.Link,
                            image: item.image_url || item.ImageUrl || undefined,
                            datePublished: item.pubDate || item.date || undefined,
                        })) || [],
                    },
                };

            case "faq":
                return {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    name: title,
                    description,
                    url: currentCanonical,
                    mainEntity: schemaData?.map((item: any) => ({
                        "@type": "Question",
                        name: item.question,
                        acceptedAnswer: { "@type": "Answer", text: item.answer },
                    })) || [],
                };

            case "policy":
            case "terms":
                return {
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    name: title,
                    description,
                    url: currentCanonical,
                    mainEntity: {
                        "@type": "Organization",
                        name: BRAND,
                        url: SITE_URL,
                        logo: { "@type": "ImageObject", url: "https://hospitofind.online/logo.png", width: 512, height: 512 },
                    },
                    about: {
                        "@type": "Thing",
                        name: schemaType === "policy" ? "Privacy Policy" : "Terms of Service",
                        description: schemaType === "policy"
                            ? "How HospitoFind collects, uses, and protects user data"
                            : "Rules and guidelines for using HospitoFind's global hospital directory",
                    },
                };

            default:
                return schemaData ? { "@context": "https://schema.org", ...schemaData } : null;
        }
    };

    const jsonLd = buildJsonLd();
    const breadcrumbsLd = buildBreadcrumbs();

    return (
        <Helmet htmlAttributes={{ lang }}>
            <title>{fullTitle}</title>

            {description && <meta name="description" content={description} />}
            <link rel="canonical" href={currentCanonical} />
            <meta name="robots" content={robots} />

            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            {description && <meta property="og:description" content={description} />}
            <meta property="og:url" content={currentCanonical} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:secure_url" content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={fullTitle} />
            <meta property="og:site_name" content={BRAND} />

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            {description && <meta name="twitter:description" content={description} />}
            <meta name="twitter:image" content={ogImage} />

            {/* Hreflang */}
            {hreflang.length > 0 && (
                <>
                    {hreflang.map((item, index) => (
                        <link key={index} rel="alternate" hrefLang={item.lang} href={item.url} />
                    ))}
                    <link rel="alternate" hrefLang={lang} href={currentCanonical} />
                    <link rel="alternate" hrefLang="x-default" href={currentCanonical} />
                </>
            )}

            {/* Structured Data */}
            {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
            {breadcrumbsLd && <script type="application/ld+json">{JSON.stringify(breadcrumbsLd)}</script>}
            {extraSchema?.map((schema, index) => (
                <script key={index} type="application/ld+json">{JSON.stringify(schema)}</script>
            ))}
        </Helmet>
    );
};
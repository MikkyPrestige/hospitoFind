import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

interface SEOProps {
    title: string;
    description?: string;
    canonical?: string;
    image?: string;
    includeBrand?: boolean;
    schemaType?: "about" | "global" | "country" | "hospital" | "search";
    schemaData?: any;
    autoBreadcrumbs?: boolean;
    extraSchema?: Record<string, any>[];
}

const BRAND = "HospitoFind";

export const SEOHelmet: React.FC<SEOProps> = ({
    title,
    description,
    canonical,
    image,
    includeBrand = true,
    schemaType,
    schemaData,
    autoBreadcrumbs = false,
    extraSchema,

}) => {
    const fullTitle = includeBrand ? `${title} | ${BRAND}` : title;

    // Auto breadcrumbs
    let breadcrumbsLd: any = null;
    if (autoBreadcrumbs) {
        const { country, slug } = useParams();
        const crumbs: { name: string; url: string }[] = [
            { name: "Home", url: "https://hospitofind.online" },
        ];
        if (country) {
            crumbs.push({
                name: country,
                url: `https://hospitofind.online/country/${country
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`,
            });
        }
        if (slug) {
            crumbs.push({
                name: title,
                url: canonical || "",
            });
        }
        breadcrumbsLd = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: crumbs.map((b, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: b.name,
                item: b.url,
            })),
        };
    }

    // JSON-LD with fallbacks
    let jsonLd: any = null;

    switch (schemaType) {
        case "about":
            jsonLd = {
                "@context": "https://schema.org",
                "@type": "AboutPage",
                name: "About Hospital Finder",
                description: description || "HospitoFind is a trusted hospital finder and healthcare directory connecting users with verified medical facilities worldwide. Learn more about our mission to provide easy access to healthcare information and services.",
                url: canonical,
            };
            break;

        case "search":
            jsonLd = {
                "@context": "https://schema.org",
                "@type": "SearchResultsPage",
                name: "Find Hospitals Near You",
                description: description || "Use HospitoFind’s hospital finder to search hospitals by name, city, or country. Connect with verified healthcare facilities worldwide.",
                url: canonical,
            };
            break;

        case "hospital":
            if (schemaData) {
                jsonLd = {
                    "@context": "https://schema.org",
                    "@type": "Hospital",
                    name: schemaData.name,
                    ...(description ? { description } : {}),
                    ...(canonical ? { url: canonical } : {}),
                    ...(schemaData.photoUrl ? { image: schemaData.photoUrl } : {}),
                    ...(schemaData.phoneNumber ? { telephone: schemaData.phoneNumber } : {}),
                    ...(schemaData.address
                        ? {
                            address: {
                                "@type": "PostalAddress",
                                ...(schemaData.address.street ? { streetAddress: schemaData.address.street } : {}),
                                ...(schemaData.address.city ? { addressLocality: schemaData.address.city } : {}),
                                ...(schemaData.address.state ? { addressRegion: schemaData.address.state } : {}),
                                ...(schemaData.address.country ? { addressCountry: schemaData.address.country } : {}),
                            },
                        }
                        : {}),
                    ...(schemaData.services?.length ? { medicalSpecialty: schemaData.services } : {}),
                    ...(schemaData.website ? { sameAs: [schemaData.website] } : {}),
                };
            }
            break;

        case "country":
            if (schemaData) {
                jsonLd = {
                    "@context": "https://schema.org",
                    "@type": "ItemList",
                    name: `Hospitals in ${schemaData.country}`,
                    description: description || `Browse hospitals and medical centers in ${schemaData.country}.`,
                    url: canonical,
                    numberOfItems: schemaData.hospitals?.length || 0,
                    itemListElement: schemaData.hospitals?.map((h: any, index: number) => ({
                        "@type": "ListItem",
                        position: index + 1,
                        name: h.name,
                        url: `https://hospitofind.online/hospital/${encodeURIComponent(
                            h.name.toLowerCase().replace(/\s+/g, "-")
                        )}`,
                    })),
                };
            }
            break;

        case "global":
            if (schemaData) {
                jsonLd = {
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    name: "Browse Hospitals by Country",
                    description:
                        description ||
                        "Explore hospitals worldwide, organized by country. Find verified healthcare facilities.",
                    url: canonical,
                    mainEntity: {
                        "@type": "ItemList",
                        itemListElement: schemaData.map((c: any, index: number) => ({
                            "@type": "ListItem",
                            position: index + 1,
                            name: c.country,
                            url: `https://hospitofind.online/country/${encodeURIComponent(
                                c.country.toLowerCase().replace(/\s+/g, "-")
                            )}`,
                        })),
                    },
                };
            }
            break;

        default:
            jsonLd = null;
    }

    return (
        <Helmet>
            <title>{fullTitle}</title>
            {description && <meta name="description" content={description} />}
            {canonical && <link rel="canonical" href={canonical} />}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            {description && <meta property="og:description" content={description} />}
            {canonical && <meta property="og:url" content={canonical} />}
            {image && <meta property="og:image" content={image} />}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            {description && (
                <meta name="twitter:description" content={description} />
            )}
            {image && <meta name="twitter:image" content={image} />}
            {jsonLd && (
                <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
            )}
            {breadcrumbsLd && (
                <script type="application/ld+json">{JSON.stringify(breadcrumbsLd)}</script>
            )}
            {extraSchema &&
                extraSchema.map((schema, index) => (
                    <script key={index} type="application/ld+json">{JSON.stringify(schema)}</script>
                ))
            }
        </Helmet>
    );
};
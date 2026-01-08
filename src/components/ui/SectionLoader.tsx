import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type Variant = "card" | "list" | "image" | "text";

interface SectionLoaderProps {
    message?: string;
    variant?: Variant;
    count?: number;
}

const SectionLoader: React.FC<SectionLoaderProps> = ({
    message = "Loading...",
    variant = "text",
    count = 1,
}) => {
    const renderSkeleton = (variant: Variant, i: number) => {
        switch (variant) {
            case "card":
                return (
                    <div
                        key={i}
                        style={{
                            border: "1px solid var(--color-border)",
                            borderRadius: "12px",
                            padding: "1rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.75rem",
                        }}
                    >
                        <Skeleton height={150} /> {/* image */}
                        <Skeleton height={20} width="70%" /> {/* title */}
                        <Skeleton height={15} width="90%" /> {/* text line */}
                        <Skeleton height={15} width="60%" /> {/* text line */}
                        <Skeleton height={30} width={100} /> {/* button */}
                    </div>
                );
            case "list":
                return (
                    <div key={i} style={{ marginBottom: "1rem" }}>
                        <Skeleton height={20} width="80%" /> {/* title */}
                        <Skeleton height={15} width="40%" style={{ marginTop: "0.5rem" }} /> {/* date */}
                        <Skeleton height={15} width="95%" style={{ marginTop: "0.5rem" }} /> {/* summary */}
                        <Skeleton height={15} width="85%" style={{ marginTop: "0.5rem" }} /> {/* summary */}
                    </div>
                );
            case "image":
                return <Skeleton key={i} height={200} />;
            case "text":
            default:
                return <Skeleton key={i} height={20} style={{ marginBottom: "0.5rem" }} />;
        }
    };

    return (
        <div style={{ padding: "1rem" }}>
            {message && <p style={{ marginBottom: "1rem", color: "var(--color-ash)" }}>{message}</p>}
            {Array.from({ length: count }).map((_, i) => renderSkeleton(variant, i))}
        </div>
    );
};

export default SectionLoader;
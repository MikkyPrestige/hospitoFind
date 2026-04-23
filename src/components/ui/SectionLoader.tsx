import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Variant, SectionLoaderProps } from "@/src/types/app"
import styles from "./styles/sectionLoader.module.css";


const SectionLoader: React.FC<SectionLoaderProps> = ({
    message = "Loading...",
    variant = "text",
    count = 1,
}) => {
    const renderSkeleton = (variant: Variant, i: number) => {
        switch (variant) {
            case "card":
                return (
                    <div key={i} className={styles.cardVariant}>
                        <Skeleton height={150} borderRadius="8px" />
                        <Skeleton height={20} width="70%" />
                        <Skeleton height={15} width="90%" />
                        <Skeleton height={15} width="60%" />
                        <Skeleton height={32} width={100} borderRadius="6px" />
                    </div>
                );
            case "list":
                return (
                    <div key={i} className={styles.listVariant}>
                        <Skeleton height={20} width="80%" />
                        <Skeleton height={15} width="40%" className={styles.marginTopSmall} />
                        <Skeleton height={15} width="95%" className={styles.marginTopSmall} />
                        <Skeleton height={15} width="85%" className={styles.marginTopSmall} />
                    </div>
                );
            case "image":
                return <Skeleton key={i} height={200} borderRadius="12px" />;
            case "text":
            default:
                return <Skeleton key={i} height={20} className={styles.textVariant} />;
        }
    };

    return (
        <div className={styles.container}>
            {message && <p className={styles.message}>{message}</p>}
            <div className={variant === "card" ? "grid-layout" : ""}>
                {Array.from({ length: count }).map((_, i) => renderSkeleton(variant, i))}
            </div>
        </div>
    );
};

export default SectionLoader;
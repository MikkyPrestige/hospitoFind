import React from "react";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AnimatedLoaderProps } from "@/types/ui";
import styles from "./styles/animatedLoader.module.css";

const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

const AnimatedLoader: React.FC<AnimatedLoaderProps> = ({
    message = "Loading...",
    variant = "text",
    count = 1,
    delayStep = 0.1,
    showImage = false,
    imageHeight = 150,
    showButtons = false,
}) => {
    const renderSkeleton = (i: number) => {
        switch (variant) {
            case "card":
                return (
                    <div key={i} className={styles.cardVariant}>
                        {showImage && (
                            <Skeleton
                                height={imageHeight}
                                className={styles.skeletonBorderRadius}
                            />
                        )}
                        <Skeleton height={20} width="70%" />
                        <Skeleton height={15} width="90%" />
                        <Skeleton height={15} width="60%" />
                        {showButtons && (
                            <div className={styles.buttonGroup}>
                                <Skeleton height={30} width={100} />
                                <Skeleton height={30} width={40} />
                            </div>
                        )}
                    </div>
                );
            case "dropdown":
                return (
                    <div key={i} className={styles.dropdownVariant}>
                        <Skeleton height={18} width="60%" />
                        <Skeleton height={15} width="40%" className={styles.marginTopSmall} />
                        <Skeleton height={15} width="50%" className={styles.marginTopSmall} />
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
                return <Skeleton key={i} height={200} />;
            case "text":
            default:
                return <Skeleton key={i} height={20} className={styles.textVariant} />;
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeVariants}
            transition={{ duration: 0.5 }}
            className={styles.loaderContainer}
        >
            {message && <p className={styles.loadingMessage}>{message}</p>}
            {Array.from({ length: count }).map((_, i) => (
                <motion.div
                    key={i}
                    variants={fadeVariants}
                    transition={{ duration: 0.5, delay: i * delayStep }}
                >
                    {renderSkeleton(i)}
                </motion.div>
            ))}
        </motion.div>
    );
};

export default AnimatedLoader;
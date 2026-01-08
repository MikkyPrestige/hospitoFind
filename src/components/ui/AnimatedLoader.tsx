import React from "react";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type Variant = "card" | "list" | "image" | "text" | "dropdown";

interface AnimatedLoaderProps {
    message?: string;
    variant?: Variant;
    count?: number;
    delayStep?: number;
    showImage?: boolean;
    imageHeight?: number;
    showButtons?: boolean;
}

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
const renderSkeleton = (
    variant: Variant,
    i: number,
    opts?: {
        showImage?: boolean;
        imageHeight?: number;
        showButtons?: boolean
    }) => {
    switch (variant) {
        case "card":
            return (
                <div key={i} style={{ border: "1px solid #eee", borderRadius: "12px", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem", }} >
                    {opts?.showImage && (<Skeleton height={opts.imageHeight || 150} style={{ borderRadius: "12px" }} />)}
                    <Skeleton height={20} width="70%" /> {/* title */}
                    <Skeleton height={15} width="90%" /> {/* line */}
                    <Skeleton height={15} width="60%" /> {/* line */}
                    {opts?.showButtons && (<div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                        <Skeleton height={30} width={100} /> {/* button */}
                        <Skeleton height={30} width={40} />  {/* icon button */}
                    </div>
                    )}
                </div>
            );
        case "dropdown":
            return (
                <div key={i} style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #eee", }} >
                    <Skeleton height={18} width="60%" />     {/* Country placeholder */}
                    {/* City placeholders */}
                    <Skeleton height={15} width="40%" style={{ marginTop: "0.5rem" }} />
                    <Skeleton height={15} width="50%" style={{ marginTop: "0.5rem" }} />
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
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeVariants}
            transition={{ duration: 0.5 }}
            style={{ width: "100%" }}
        >
            {message && <p style={{ marginBottom: "1rem", color: "#555" }}>{message}</p>}
            {Array.from({ length: count }).map((_, i) => (
                <motion.div
                    key={i}
                    variants={fadeVariants}
                    transition={{ duration: 0.5, delay: i * delayStep }}
                >
                    {renderSkeleton(variant, i, { showImage, imageHeight, showButtons })}
                </motion.div>
            ))}
        </motion.div>
    );
};

export default AnimatedLoader;
import { motion, Variants, MotionProps } from "framer-motion";
import { fadeUp } from "@/hooks/animations";
import { ElementType, useMemo } from "react";

interface MotionWrapperProps extends MotionProps {
    children: React.ReactNode;
    className?: string;
    variants?: Variants;
    once?: boolean;
    as?: ElementType;
    initial?: string;
    animate?: string;
    onClick?: (e: React.MouseEvent) => void;
}


const Motion: React.FC<MotionWrapperProps> = ({
    children,
    className,
    variants = fadeUp,
    once = false,
    as: Tag = "div",
    initial,
    animate,
    ...rest
}) => {
    // Memoize motion tag to avoid recreation on re-render
    const MotionTag = useMemo(() => {
        return typeof Tag === "string"
            ? (motion as any)[Tag] || motion.div
            : motion(Tag);
    }, [Tag]);

    const shouldUseViewport = !animate;

    return (
        <MotionTag
            className={className}
            variants={variants}
            initial={initial || "hidden"}
            whileInView={animate || "visible"}
            viewport={shouldUseViewport ? { once, amount: 0.2 } : undefined}
            style={{ overflow: "hidden", contain: "paint" }}
            {...rest}
        >
            {children}
        </MotionTag>
    );
};

export default Motion;
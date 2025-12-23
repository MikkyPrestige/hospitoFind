import { motion, Variants, MotionProps } from "framer-motion";
import { fadeUp } from "@/hooks/animations";
import { ElementType, useMemo } from "react";

interface MotionWrapperProps extends MotionProps {
    children: React.ReactNode;
    className?: string;
    variants?: Variants;
    once?: boolean;
    to?: string;
    as?: ElementType;
    initial?: string;
    animate?: string;
    alwaysVisible?: boolean;
    onClick?: (e: React.MouseEvent) => void;
}

const Motion: React.FC<MotionWrapperProps> = ({
    children,
    className,
    variants = fadeUp,
    once = false,
    to,
    as: Tag = "div",
    initial,
    animate,
    alwaysVisible = false,
    style,
    ...rest
}) => {
    const MotionTag = useMemo(() => {
        return typeof Tag === "string"
            ? (motion as any)[Tag] || motion.div
            : motion.create(Tag);
    }, [Tag]);

    const shouldUseViewport = !animate && !alwaysVisible;

    const motionProps = {
        ...(to ? { to } : {}),
    };

    return (
        <MotionTag
            {...motionProps}
            className={className}
            variants={variants}
            initial={initial || "hidden"}
            whileInView={!alwaysVisible ? animate || "visible" : undefined}
            animate={alwaysVisible ? animate || "visible" : undefined}
            viewport={shouldUseViewport ? { once, amount: 0.2 } : undefined}
            style={{
                overflow: "hidden",
                ...style
            }}
            {...rest}
        >
            {children}
        </MotionTag>
    );
};

export default Motion;
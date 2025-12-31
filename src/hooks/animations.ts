import { Variants } from "framer-motion";

/* 💫 Standard fade + slight upward slide */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const sectionReveal: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

/* 🎞️ Stagger for child animations (e.g. cards or items) */
export const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

/* 🧭 From left */
 export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

/* 🧭 From right */
export const slideRight: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

/* ⚡ Small zoom-in (for icons, logos, cards) */
export const zoomIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const settingsTabVariants: Variants = {
    hidden: { opacity: 0, x: -10, transition: { duration: 0.2 } },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, x: 10, transition: { duration: 0.2 } }
};

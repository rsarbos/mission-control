import type { Variants } from "motion/react";

/** RSARBOS brand easing (cubic-bezier(0.34, 1.21, 0.43, 1)) — mirrors the value
 * already used by the hand-rolled globals.css entrance animations. */
export const RSARBOS_EASE: [number, number, number, number] = [0.34, 1.21, 0.43, 1];

/** Base scroll-reveal variant (21st.dev "container scroll animation"). */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: RSARBOS_EASE },
  },
};

/** SVG path "draw" variant — for the hero waveform lines. */
export const drawPath: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.2, ease: "easeOut" },
      opacity: { duration: 0.45 },
    },
  },
};

/** Floating orb ambient loop — for HeroBackdrop. */
export const floatOrb: Variants = {
  animate: {
    y: [0, -22, 0],
    x: [0, 10, -8, 0],
    opacity: [0.45, 0.72, 0.45],
    transition: { duration: 13, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
  },
};

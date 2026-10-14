import { motion, useReducedMotion } from "motion/react";
import { cn } from "../../lib/utils";

/**
 * 21st.dev "draw path" — animates an SVG <path> stroke in on scroll.
 * Drop-in for <path d="..." className="..." />; stroke/fill kept via the
 * existing .hero-lines CSS so the brand blue/red waveform is preserved.
 */
export function AnimatedPath({
  d,
  className,
}: {
  d: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.path
      d={d}
      fill="none"
      className={cn(className)}
      initial={reduced ? undefined : { pathLength: 0, opacity: 0 }}
      whileInView={reduced ? undefined : { pathLength: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        pathLength: { duration: 1.3, ease: "easeOut" },
        opacity: { duration: 0.45 },
      }}
    />
  );
}

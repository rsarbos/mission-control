import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../../lib/utils";
import { RSARBOS_EASE } from "../../lib/animations";

/** Floating "particle / neural" backdrop (21st.dev animated background) — a set
 * of soft blue/red orbs that breathe behind the hero. pointer-events:none, z-1
 * (above the waveform lines, below the z-2 hero content). */
export function HeroBackdrop({ count = 6, className }: { count?: number; className?: string }) {
  const reduced = useReducedMotion();
  const orbs = Array.from({ length: count });

  return (
    <div className={cn("hero-orbs", className)} aria-hidden="true">
      {orbs.map((_, i) => {
        const size = 120 + (i % 4) * 48;
        const isBlue = i % 2 === 0;
        const left = 4 + (i * 23) % 78;
        const top = 12 + (i * 37) % 64;
        return (
          <motion.div
            key={i}
            className="hero-orb"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
              background: isBlue
                ? "radial-gradient(circle, rgba(58,118,240,0.32) 0%, transparent 62%)"
                : "radial-gradient(circle, rgba(255,59,56,0.2) 0%, transparent 62%)",
            }}
            initial={reduced ? undefined : { opacity: 0, scale: 0.88 }}
            animate={
              reduced
                ? undefined
                : { opacity: [0.5, 0.82, 0.5], scale: [0.9, 1.0, 0.9] }
            }
            transition={{
              duration: 13 + i * 2,
              repeat: Infinity,
              repeatType: "mirror",
              ease: RSARBOS_EASE,
              delay: i * 0.5,
            }}
          />
        );
      })}
    </div>
  );
}

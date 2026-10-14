import React, { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../../lib/utils";
import { RSARBOS_EASE } from "../../lib/animations";

/** 21st.dev "spotlight card" — a card whose surface darkens around the cursor
 * via a CSS-var radial gradient, plus a subtle lift on hover.
 * Renders a <motion.article> and forwards className + all article props so it is
 * a drop-in replacement for any existing <article className="glass-panel ...">. */
export function SpotlightCard({
  className,
  children,
  ...props
}: React.ComponentProps<"article">) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const onPointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (reduced) return;
      const el = ref.current;
      if (!el) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      el.style.setProperty("--spot-x", `${x}%`);
      el.style.setProperty("--spot-y", `${y}%`);
    },
    [reduced]
  );

  return (
    <motion.article
      ref={ref as any}
      className={cn("spotlight-card", className)}
      data-spotlight
      onPointerMove={onPointerMove}
      whileHover={reduced ? undefined : { scale: 1.035, y: -4 }}
      transition={{ duration: 0.18, ease: RSARBOS_EASE }}
      {...props}
    >
      {children}
    </motion.article>
  );
}

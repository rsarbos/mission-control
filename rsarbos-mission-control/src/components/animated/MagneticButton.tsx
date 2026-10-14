import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../../lib/utils";
import { RSARBOS_EASE } from "../../lib/animations";

type MagneticButtonProps = Omit<React.ComponentProps<"button">, "ref" | "key">;

/**
 * 21st.dev "magnetic button" — a motion.button that adds a hover lift + blue
 * glow while preserving the existing .primary-action shimmer / disabled styles.
 * Animation is gated behind prefers-reduced-motion and the `disabled` flag.
 */
export function MagneticButton({ className, children, disabled, ...props }: MagneticButtonProps) {
  const reduced = useReducedMotion();
  return (
    <motion.button
      className={cn(className)}
      disabled={disabled}
      whileHover={disabled || reduced ? undefined : { scale: 1.03, boxShadow: "0 0 28px rgba(58, 118, 240, 0.45)" }}
      whileTap={disabled || reduced ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.18, ease: RSARBOS_EASE }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

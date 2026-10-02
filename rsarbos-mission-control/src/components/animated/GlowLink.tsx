import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../../lib/utils";
import { RSARBOS_EASE } from "../../lib/animations";

type GlowLinkProps = Omit<React.ComponentProps<"a">, "ref" | "key">;

/** 21st.dev "interactive glowing border / magnetic button" — drop-in <motion.a>
 * that preserves every anchor prop (href, onClick tracking, target, rel). */
export function GlowLink({ className, children, ...props }: GlowLinkProps) {
  const reduced = useReducedMotion();
  return (
    <motion.a
      className={cn(className)}
      whileHover={
        reduced
          ? undefined
          : {
              scale: 1.03,
              boxShadow: "0 0 28px rgba(58, 118, 240, 0.45)",
            }
      }
      whileTap={reduced ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.18, ease: RSARBOS_EASE }}
      {...props}
    >
      {children}
    </motion.a>
  );
}

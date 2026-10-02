import React from "react";
import { motion, useReducedMotion } from "motion/react";
import type { MotionProps } from "motion/react";
import { cn } from "../../lib/utils";
import { RSARBOS_EASE } from "../../lib/animations";

export type RevealProps = { delay?: number };

/* Scroll-triggered reveal (21st.dev container scroll animation).
   Honours prefers-reduced-motion; otherwise fades + slides up once. */
function useReveal(
  delay = 0
): Partial<Pick<MotionProps, "initial" | "whileInView" | "viewport" | "transition">> {
  const reduced = useReducedMotion();
  if (reduced === true) return {};
  return {
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: 0.55, ease: RSARBOS_EASE, delay },
  };
}

type SectionProps = Omit<React.ComponentProps<"section"> & RevealProps, "ref" | "key">;
type DivProps = Omit<React.ComponentProps<"div"> & RevealProps, "ref" | "key">;
type ArticleProps = Omit<React.ComponentProps<"article"> & RevealProps, "ref" | "key">;
type FooterProps = Omit<React.ComponentProps<"footer"> & RevealProps, "ref" | "key">;

export function AnimatedSection({ className, delay, children, ...props }: SectionProps) {
  return (
    <motion.section className={cn(className)} {...useReveal(delay)} {...props}>
      {children}
    </motion.section>
  );
}

export function AnimatedDiv({ className, delay, children, ...props }: DivProps) {
  return (
    <motion.div className={cn(className)} {...useReveal(delay)} {...props}>
      {children}
    </motion.div>
  );
}

export function AnimatedArticle({ className, delay, children, ...props }: ArticleProps) {
  return (
    <motion.article className={cn(className)} {...useReveal(delay)} {...props}>
      {children}
    </motion.article>
  );
}

export function AnimatedFooter({ className, delay, children, ...props }: FooterProps) {
  return (
    <motion.footer className={cn(className)} {...useReveal(delay)} {...props}>
      {children}
    </motion.footer>
  );
}

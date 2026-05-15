'use client';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from './cn';

export type HeroProps = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  /** Optional decorative element rendered on the right (e.g., illustration). */
  visual?: ReactNode;
  className?: string;
};

const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.36, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Hero — entrance animation: stagger fade-up of eyebrow/title/subtitle/CTAs.
 * Uses transform+opacity only (GPU layer). Falls back to static render when
 * prefers-reduced-motion is set.
 */
export function Hero({ eyebrow, title, subtitle, actions, visual, className }: HeroProps) {
  const reduce = useReducedMotion();
  return (
    <section
      className={cn(
        'from-brand-50 relative isolate overflow-hidden bg-gradient-to-b to-white',
        'px-6 pb-20 pt-16 sm:pt-24 lg:px-8',
        className,
      )}
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        <motion.div
          variants={container}
          initial={reduce ? 'visible' : 'hidden'}
          animate="visible"
          className="max-w-2xl"
        >
          {eyebrow && (
            <motion.p
              variants={item}
              className="text-brand-600 mb-3 text-sm font-medium uppercase tracking-widest"
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.h1
            variants={item}
            className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p variants={item} className="mt-5 text-lg text-neutral-600">
              {subtitle}
            </motion.p>
          )}
          {actions && (
            <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
              {actions}
            </motion.div>
          )}
        </motion.div>
        {visual && (
          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            className="relative"
          >
            {visual}
          </motion.div>
        )}
      </div>
    </section>
  );
}

'use client';
import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AirplaneScene } from './AirplaneScene';
import { fadeUp, heroStagger } from './motion-presets';
import { cn } from './cn';

export type CinematicHeroProps = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  /** Optional badge above the title (e.g. live status pill). */
  badge?: ReactNode;
  /** Optional licensed photo behind the SVG layers. */
  image?: string | undefined;
  /** Right-side editorial slot — stat card, animated detail, etc. */
  aside?: ReactNode;
  className?: string;
};

/**
 * CinematicHero — full-bleed dark hero. Editorial typography, single primary
 * CTA, optional aside, photo-ready, never cartoonish.
 *
 * Composition rules:
 *   - One primary action (orange). One secondary action (ghost).
 *   - Title at text-6xl on mobile, scaling to text-8xl on lg.
 *   - Min height: 80vh on desktop, content-driven on mobile.
 *   - Background swap-in path: pass `image` for a licensed photo.
 */
export function CinematicHero({
  eyebrow,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  badge,
  image,
  aside,
  className,
}: CinematicHeroProps) {
  const reduce = useReducedMotion();
  return (
    <section
      className={cn(
        'relative isolate overflow-hidden',
        // Pull the hero up under the fixed nav (nav is transparent over hero).
        '-mt-16 pt-16 lg:-mt-20 lg:pt-20',
        'from-brand-950 via-brand-900 to-brand-800 bg-gradient-to-b text-white',
        className,
      )}
    >
      <AirplaneScene image={image} />

      <div className="relative mx-auto grid min-h-[78vh] max-w-7xl items-center gap-12 px-6 pb-24 pt-16 sm:pb-32 lg:grid-cols-[1.4fr_1fr] lg:gap-16 lg:px-8 lg:pt-24">
        <motion.div
          variants={heroStagger}
          initial={reduce ? 'visible' : 'hidden'}
          animate="visible"
        >
          {badge && (
            <motion.div variants={fadeUp} className="mb-8">
              {badge}
            </motion.div>
          )}
          {eyebrow && (
            <motion.p
              variants={fadeUp}
              className="text-brand-200 text-xs font-semibold uppercase tracking-[0.22em]"
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.h1
            variants={fadeUp}
            className={cn(
              'font-display mt-5 font-semibold tracking-[-0.02em] text-white',
              'text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-7xl xl:text-[5.5rem]',
            )}
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              variants={fadeUp}
              className="text-brand-100 mt-7 max-w-xl text-lg leading-relaxed sm:text-xl"
            >
              {subtitle}
            </motion.p>
          )}
          {(primaryAction || secondaryAction) && (
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-3">
              {primaryAction}
              {secondaryAction}
            </motion.div>
          )}
        </motion.div>

        {aside && (
          <motion.div
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="hidden lg:block"
          >
            {aside}
          </motion.div>
        )}
      </div>

      {/* Bottom fade into the next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white"
      />
    </section>
  );
}

'use client';
import type { ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { cn } from './cn';
import { fadeUp, heroStagger } from './motion-presets';

export type EditorialFeatureProps = {
  /** Path to the image (e.g. `/hero/warehouse-airplane.webp`). */
  image: string;
  /** Alt text — describe what's in the image, not "image of". */
  imageAlt: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Bulleted highlights rendered below the description. */
  points?: readonly string[];
  /** Call-to-action link. */
  cta?: { href: string; label: string };
  /** Side the image renders on. Alternates by section in good design. */
  imageSide?: 'left' | 'right';
  /** Tone — light section bg or dark. */
  tone?: 'light' | 'dark';
  className?: string;
};

/**
 * EditorialFeature — full-bleed, alternating image + text editorial section.
 *
 * Composition:
 *   - Image fills its column at 4:5 aspect on mobile, 1:1 on desktop
 *   - Subtle parallax: image translates -32px as the section scrolls past
 *   - Soft accent corner-mark on the image (top-right)
 *   - Text column stagger-fades in once on first view
 *
 * Performance:
 *   - Uses native `<img loading="lazy" decoding="async">` for off-screen sections
 *   - Set `loading="eager"` manually if placing this above the fold
 */
export function EditorialFeature({
  image,
  imageAlt,
  eyebrow,
  title,
  description,
  points,
  cta,
  imageSide = 'right',
  tone = 'light',
  className,
}: EditorialFeatureProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [32, -32]);

  return (
    <section
      ref={ref}
      className={cn(
        'overflow-hidden',
        tone === 'dark' ? 'bg-brand-950 text-white' : 'bg-white text-neutral-900',
        className,
      )}
    >
      <div
        className={cn(
          'mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 lg:gap-20 lg:px-8 lg:py-32',
          'lg:grid-cols-2',
        )}
      >
        <div className={cn('relative', imageSide === 'left' ? 'lg:order-1' : 'lg:order-2')}>
          {/* Accent corner-mark — small frame overlay top-right of the photo */}
          <div
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute -right-3 -top-3 z-10 h-20 w-20 rounded-tr-2xl border-2 border-b-0 border-l-0',
              tone === 'dark' ? 'border-accent-500/70' : 'border-accent-500',
            )}
          />
          <motion.div
            style={reduce ? {} : { y: imageY }}
            className="shadow-brand-950/10 relative aspect-[4/5] overflow-hidden rounded-2xl shadow-xl sm:aspect-square"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={imageAlt}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Subtle bottom-up gradient for tonal control */}
            <div
              aria-hidden="true"
              className={cn(
                'absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t to-transparent',
                tone === 'dark' ? 'from-brand-950/70' : 'from-black/15',
              )}
            />
          </motion.div>
        </div>

        <motion.div
          variants={heroStagger}
          initial={reduce ? 'visible' : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className={cn(imageSide === 'left' ? 'lg:order-2' : 'lg:order-1')}
        >
          {eyebrow && (
            <motion.p
              variants={fadeUp}
              className={cn(
                'text-xs font-semibold uppercase tracking-[0.22em]',
                tone === 'dark' ? 'text-brand-200' : 'text-brand-600',
              )}
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.h2
            variants={fadeUp}
            className={cn(
              'font-display mt-3 text-4xl font-semibold tracking-tight sm:text-5xl',
              tone === 'dark' ? 'text-white' : 'text-neutral-900',
            )}
          >
            {title}
          </motion.h2>
          {description && (
            <motion.p
              variants={fadeUp}
              className={cn(
                'mt-5 text-lg leading-relaxed',
                tone === 'dark' ? 'text-brand-100' : 'text-neutral-600',
              )}
            >
              {description}
            </motion.p>
          )}
          {points && points.length > 0 && (
            <motion.ul variants={fadeUp} className="mt-8 space-y-3">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full',
                      tone === 'dark' ? 'bg-accent-400' : 'bg-accent-500',
                    )}
                  />
                  <span className={tone === 'dark' ? 'text-brand-100' : 'text-neutral-700'}>
                    {p}
                  </span>
                </li>
              ))}
            </motion.ul>
          )}
          {cta && (
            <motion.div variants={fadeUp} className="mt-10">
              <a
                href={cta.href}
                className={cn(
                  'inline-flex items-center gap-2 text-sm font-semibold',
                  tone === 'dark'
                    ? 'text-accent-400 hover:text-accent-300'
                    : 'text-brand-700 hover:text-brand-800',
                )}
              >
                {cta.label}
                <span aria-hidden="true">→</span>
              </a>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

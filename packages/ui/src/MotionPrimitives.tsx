'use client';
import { useRef, type ElementType, type ReactNode, type CSSProperties } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
  type Variants,
} from 'framer-motion';
import { fadeUp, heroStagger, transition } from './motion-presets';
import { cn } from './cn';

/**
 * MotionPrimitives — declarative wrappers around Framer Motion that consume
 * the design-system motion tokens. Use these instead of writing one-off
 * <motion.div initial=... animate=...> blocks in feature components.
 *
 * Every primitive honors `prefers-reduced-motion: reduce` automatically.
 */

/* ───────────────────────── <MotionFadeUp /> ──────────────────────── */

export type MotionFadeUpProps = {
  children: ReactNode;
  /** Element to render. Defaults to <div>. */
  as?: ElementType;
  /** Delay before this element animates in (seconds). */
  delay?: number;
  /**
   * When to start the animation:
   *  - 'mount'    : as soon as the component mounts
   *  - 'in-view'  : when scrolled into the viewport (default)
   *  - 'stagger'  : inherit from a parent <MotionStagger>
   */
  trigger?: 'mount' | 'in-view' | 'stagger';
  className?: string;
};

export function MotionFadeUp({
  children,
  as: Tag = 'div',
  delay = 0,
  trigger = 'in-view',
  className,
}: MotionFadeUpProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion(Tag as 'div');

  if (trigger === 'stagger') {
    return (
      <MotionTag variants={fadeUp} className={className}>
        {children}
      </MotionTag>
    );
  }

  const initialState = reduce ? 'visible' : 'hidden';
  const triggerProp =
    trigger === 'in-view'
      ? { whileInView: 'visible' as const, viewport: { once: true, margin: '-80px' } }
      : { animate: 'visible' as const };

  return (
    <MotionTag
      className={className}
      variants={fadeUp}
      initial={initialState}
      {...triggerProp}
      transition={{ ...transition.base, delay }}
    >
      {children}
    </MotionTag>
  );
}

/* ───────────────────────── <MotionStagger /> ────────────────────── */

export type MotionStaggerProps = {
  children: ReactNode;
  as?: ElementType;
  /** Per-child delay in seconds. */
  stagger?: number;
  /** Delay before the first child animates. */
  delayChildren?: number;
  /** When to trigger — mount (default) or scroll into view. */
  trigger?: 'mount' | 'in-view';
  className?: string;
};

export function MotionStagger({
  children,
  as: Tag = 'div',
  stagger = 0.08,
  delayChildren = 0.05,
  trigger = 'in-view',
  className,
}: MotionStaggerProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion(Tag as 'div');
  const variants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: stagger, delayChildren } },
  };
  const trig =
    trigger === 'in-view'
      ? { whileInView: 'visible' as const, viewport: { once: true, margin: '-80px' } }
      : { animate: 'visible' as const };

  return (
    <MotionTag
      className={className}
      variants={reduce ? heroStagger : variants}
      initial={reduce ? 'visible' : 'hidden'}
      {...trig}
    >
      {children}
    </MotionTag>
  );
}

/* ───────────────────────── <MotionParallax /> ───────────────────── */

export type MotionParallaxProps = {
  children: ReactNode;
  /** Pixels of vertical travel as the section scrolls past. */
  range?: number;
  /** Direction: 'up' (default — moves up as the page scrolls down) or 'down'. */
  direction?: 'up' | 'down';
  className?: string;
  style?: CSSProperties;
};

/**
 * MotionParallax — slides a layer at a different speed than the page scroll.
 * Wrap the parent of the layer (e.g., the section). The child translates
 * inside its container; no fixed positioning needed.
 *
 * Performance: hooks into `scrollYProgress` of the wrapper, computes one
 * `useTransform` per render. Cheap; no scroll-listener bookkeeping in
 * userland.
 */
export function MotionParallax({
  children,
  range = 48,
  direction = 'up',
  className,
  style,
}: MotionParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const sign = direction === 'up' ? -1 : 1;
  const y = useTransform(scrollYProgress, [0, 1], [sign * range * -0.5, sign * range * 0.5]);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <motion.div
        style={reduce ? ((style ?? {}) as MotionStyle) : ({ ...(style ?? {}), y } as MotionStyle)}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ───────────────────────── <AnimatedImage /> ────────────────────── */

export type AnimatedImageProps = {
  src: string;
  alt: string;
  /** Aspect ratio CSS string, e.g. '4/5', '16/9', '1/1'. */
  aspect?: string;
  /** Parallax travel in px. 0 disables. Default 32. */
  parallax?: number;
  /** Round the image. Defaults to 'lg' (20px). */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Eager-load above-the-fold images; lazy below. */
  priority?: boolean;
  /** Overlay tone — adds a bottom-up gradient for tonal control. */
  overlay?: 'none' | 'light' | 'dark';
  className?: string;
};

/**
 * AnimatedImage — image with built-in fade-in + parallax + accent corner mark.
 * Plain `<img>` on purpose: keeps `@seal/ui` framework-neutral. For host apps
 * on Next.js, swap with `next/image` at the call site for AVIF/WebP serving.
 */
export function AnimatedImage({
  src,
  alt,
  aspect = '4/5',
  parallax = 32,
  radius = 'lg',
  priority = false,
  overlay = 'none',
  className,
}: AnimatedImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [parallax / 2, -parallax / 2]);

  const radiusClass =
    radius === 'none'
      ? 'rounded-none'
      : radius === 'sm'
        ? 'rounded-sm'
        : radius === 'md'
          ? 'rounded-md'
          : radius === 'xl'
            ? 'rounded-xl'
            : 'rounded-lg';

  return (
    <div ref={ref} className={cn('relative', className)}>
      <div
        aria-hidden="true"
        className="border-accent-500 pointer-events-none absolute -right-2 -top-2 z-10 h-5 w-5 rounded-tr-md border-r-2 border-t-2"
      />
      <motion.div
        style={reduce || parallax === 0 ? {} : { y }}
        className={cn('shadow-medium relative overflow-hidden', radiusClass)}
        initial={reduce ? { opacity: 1 } : { opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={transition.slow}
      >
        <div style={{ aspectRatio: aspect }} className="relative w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {overlay !== 'none' && (
            <div
              aria-hidden="true"
              className={cn(
                'absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t to-transparent',
                overlay === 'dark' ? 'from-primary-950/65' : 'from-black/15',
              )}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}

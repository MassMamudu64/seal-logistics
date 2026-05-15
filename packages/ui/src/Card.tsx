'use client';
import type { ReactNode } from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { fadeUp, transition } from './motion-presets';
import { cn } from './cn';

const card = cva(
  'relative overflow-hidden rounded-2xl border transition-colors will-change-transform',
  {
    variants: {
      tone: {
        plain: 'border-neutral-200 bg-white',
        soft: 'border-neutral-200 bg-neutral-50',
        glass:
          // Backdrop blur is GPU-expensive — use sparingly.
          'border-white/15 bg-white/10 backdrop-blur-md',
        ink: 'border-brand-800 bg-gradient-to-br from-brand-900 to-brand-950 text-white',
      },
      pad: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      hover: {
        lift: 'hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5',
        none: '',
      },
    },
    defaultVariants: { tone: 'plain', pad: 'md', hover: 'lift' },
  },
);

type CardProps = VariantProps<typeof card> &
  Omit<HTMLMotionProps<'div'>, 'children'> & {
    className?: string;
    children?: ReactNode;
    /** Animate on mount with fadeUp. Disabled inside lists that handle stagger. */
    animateIn?: boolean;
  };

/**
 * Card — themed surface with optional fade-up entrance.
 * On hover, the `lift` variant raises the card 2px (transform only, no layout shift).
 */
export function Card({
  tone,
  pad,
  hover,
  animateIn = false,
  className,
  children,
  ...rest
}: CardProps) {
  const reduce = useReducedMotion();
  const animProps: HTMLMotionProps<'div'> = animateIn
    ? {
        initial: reduce ? 'visible' : 'hidden',
        whileInView: 'visible',
        viewport: { once: true, margin: '-80px' },
        variants: fadeUp,
      }
    : {};
  const interaction: HTMLMotionProps<'div'> =
    hover === 'lift' && !reduce ? { whileHover: { y: -2 }, transition: transition.fast } : {};
  return (
    <motion.div
      className={cn(card({ tone, pad, hover }), className)}
      {...animProps}
      {...interaction}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

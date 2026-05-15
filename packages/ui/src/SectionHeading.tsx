'use client';
import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, heroStagger } from './motion-presets';
import { cn } from './cn';

export type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
};

/**
 * SectionHeading — the eyebrow + title + description block used at the top of
 * every marketing section. Animates in once on first view.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'light',
  className,
}: SectionHeadingProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={heroStagger}
      className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}
    >
      {eyebrow && (
        <motion.p
          variants={fadeUp}
          className={cn(
            'text-sm font-medium uppercase tracking-widest',
            tone === 'dark' ? 'text-brand-300' : 'text-brand-600',
          )}
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        variants={fadeUp}
        className={cn(
          'font-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl',
          tone === 'dark' ? 'text-white' : 'text-neutral-900',
        )}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          variants={fadeUp}
          className={cn('mt-4 text-lg', tone === 'dark' ? 'text-brand-100' : 'text-neutral-600')}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}

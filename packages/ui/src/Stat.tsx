'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { cn } from './cn';

export type StatProps = {
  value: number;
  label: string;
  /** Suffix, e.g. "+", "K", "%". */
  suffix?: string;
  /** Prefix, e.g. "$". */
  prefix?: string;
  /** Format the value (e.g. for thousands separators). */
  format?: (n: number) => string;
  className?: string;
};

/**
 * Stat — animated count-up when scrolled into view.
 * - Runs once per page load
 * - Honors prefers-reduced-motion (jumps to final value)
 * - Uses requestAnimationFrame; no setInterval
 */
export function Stat({ value, label, suffix, prefix, format, className }: StatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const start = performance.now();
    const duration = 900;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value]);

  const display = format ? format(n) : n.toLocaleString();

  return (
    <div ref={ref} className={cn('flex flex-col gap-1', className)}>
      <p className="font-display text-4xl font-semibold tabular-nums tracking-tight sm:text-5xl">
        {prefix}
        {display}
        {suffix}
      </p>
      <p className="text-sm font-medium uppercase tracking-wider text-neutral-500">{label}</p>
    </div>
  );
}

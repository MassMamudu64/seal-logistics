import type { ReactNode } from 'react';
import { cn } from './cn';
import { MotionStagger, MotionFadeUp } from './MotionPrimitives';

export type TimelineStep = {
  number?: string;
  title: string;
  description: string;
  icon?: ReactNode;
};

export type TimelineProps = {
  steps: readonly TimelineStep[];
  tone?: 'light' | 'dark';
  /** Layout — vertical (default) reads like a story; horizontal for compact 4-up. */
  orientation?: 'vertical' | 'horizontal';
  className?: string;
};

/**
 * Timeline — process visualization used on /process and the homepage process
 * strip. Vertical layout reads top-to-bottom with a connecting rail;
 * horizontal layout works for short 3-5 step strips inside a section.
 */
export function Timeline({
  steps,
  tone = 'light',
  orientation = 'vertical',
  className,
}: TimelineProps) {
  const dark = tone === 'dark';

  if (orientation === 'horizontal') {
    return (
      <MotionStagger
        stagger={0.06}
        className={cn('grid gap-3 sm:grid-cols-2 lg:grid-cols-4', className)}
      >
        {steps.map((s, i) => (
          <MotionFadeUp key={s.title} trigger="stagger">
            <article
              className={cn(
                'h-full rounded-md p-5',
                dark
                  ? 'bg-primary-950/60 ring-1 ring-white/5 backdrop-blur-sm'
                  : 'border border-neutral-200 bg-white',
              )}
            >
              <div className="flex items-center justify-between">
                {s.number && (
                  <p
                    className={cn(
                      'font-display text-3xl font-semibold',
                      dark ? 'text-accent-400' : 'text-primary-600',
                    )}
                  >
                    {s.number}
                  </p>
                )}
                {s.icon && (
                  <span className={dark ? 'text-primary-300' : 'text-neutral-400'}>{s.icon}</span>
                )}
                {!s.number && !s.icon && (
                  <span
                    className={cn(
                      'text-xs font-semibold uppercase tracking-wider',
                      dark ? 'text-primary-300' : 'text-neutral-400',
                    )}
                  >
                    Step {i + 1}
                  </span>
                )}
              </div>
              <h3
                className={cn(
                  'font-display mt-5 text-xl font-semibold',
                  dark ? 'text-white' : 'text-neutral-900',
                )}
              >
                {s.title}
              </h3>
              <p
                className={cn(
                  'mt-2 text-sm leading-relaxed',
                  dark ? 'text-primary-100' : 'text-neutral-600',
                )}
              >
                {s.description}
              </p>
            </article>
          </MotionFadeUp>
        ))}
      </MotionStagger>
    );
  }

  return (
    <ol className={cn('space-y-4', className)}>
      {steps.map((s, i) => (
        <MotionFadeUp key={s.title} as="li" trigger="in-view">
          <div className="grid grid-cols-[auto_1fr] gap-5">
            <div className="relative flex flex-col items-center">
              <div
                className={cn(
                  'font-display flex h-7 w-7 items-center justify-center rounded-full text-lg font-semibold',
                  dark ? 'bg-accent text-primary-950' : 'bg-primary text-white',
                  'shadow-soft',
                )}
                style={{ height: '48px', width: '48px' }}
              >
                {s.number ?? i + 1}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    'mt-3 w-px flex-1 bg-gradient-to-b to-transparent',
                    dark ? 'from-primary-700' : 'from-primary-200',
                  )}
                />
              )}
            </div>
            <div className="pb-7">
              <h3
                className={cn(
                  'font-display text-2xl font-semibold tracking-tight',
                  dark ? 'text-white' : 'text-neutral-900',
                )}
              >
                {s.title}
              </h3>
              <p className={cn('mt-2', dark ? 'text-primary-100' : 'text-neutral-700')}>
                {s.description}
              </p>
            </div>
          </div>
        </MotionFadeUp>
      ))}
    </ol>
  );
}

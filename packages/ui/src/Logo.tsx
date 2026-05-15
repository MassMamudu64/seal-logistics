import { cn } from './cn';

/**
 * Logo — Seal Logistics brand mark.
 *
 * Uses the official "Shipt Et Al LLC" carton + arrow mark exported from the
 * supplied brand PDF. Text is kept live so the header remains readable at
 * compact navigation sizes.
 *
 * Variants:
 *   - `lockup` (default): mark + wordmark
 *   - `mark`            : carton mark only
 *   - `wordmark`        : type only
 */

type LogoProps = {
  variant?: 'lockup' | 'mark' | 'wordmark';
  tone?: 'default' | 'invert';
  className?: string;
};

export function Logo({ variant = 'lockup', tone = 'default', className }: LogoProps) {
  const wordmarkColor = tone === 'invert' ? 'text-white' : 'text-[#2e3092]';
  const subColor = tone === 'invert' ? 'text-accent-300' : 'text-[#9f4100]';

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)} aria-label="Seal Logistics">
      {variant !== 'wordmark' && (
        <img
          src="/logo-mark.svg"
          alt=""
          aria-hidden="true"
          className={cn('block h-10 w-auto shrink-0 sm:h-11', variant === 'mark' && 'h-12 sm:h-12')}
        />
      )}
      {variant !== 'mark' && (
        <span className="flex flex-col leading-tight">
          <span
            className={cn('font-display text-sm font-bold uppercase sm:text-base', wordmarkColor)}
          >
            Shipt Et Al LLC
          </span>
          <span className={cn('text-[0.68rem] font-semibold sm:text-xs', subColor)}>
            Logistics and Cargo Services
          </span>
        </span>
      )}
    </span>
  );
}

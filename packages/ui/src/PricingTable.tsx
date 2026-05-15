import { cn } from './cn';
import { ArrowRightIcon, ClockIcon } from './Icon';
import { MotionFadeUp } from './MotionPrimitives';

export type PricingRow = {
  from: string;
  to: string;
  fromLabel: string;
  toLabel: string;
  rate: number;
  unit: 'lb' | 'kg';
  minWeight: number;
  serviceFee: number;
  transitDays: string;
  href?: string;
};

export type PricingTableProps = {
  rows: readonly PricingRow[];
  /** Show the “View all lanes” link at the top right. */
  trailing?: React.ReactNode;
  /** Tone — keeps the table readable on light or dark surfaces. */
  tone?: 'light' | 'dark';
  caption?: string;
  className?: string;
};

/**
 * PricingTable — rate card used on the marketing site and pricing page.
 * Renders as a sortable-looking table on desktop, stacks to cards on mobile
 * (`<640px`). Single source of truth for how lane rates are presented.
 */
export function PricingTable({
  rows,
  trailing,
  tone = 'light',
  caption,
  className,
}: PricingTableProps) {
  const isDark = tone === 'dark';
  return (
    <div className={cn('flex flex-col gap-5', className)}>
      {trailing && <div className="flex justify-end">{trailing}</div>}

      {/* Desktop table */}
      <MotionFadeUp className="hidden md:block">
        <div
          className={cn(
            'overflow-hidden rounded-md border',
            isDark ? 'border-primary-800' : 'border-neutral-200',
          )}
        >
          <table className="w-full text-left text-sm">
            {caption && <caption className="sr-only">{caption}</caption>}
            <thead
              className={cn(
                'text-xs uppercase tracking-wider',
                isDark ? 'bg-primary-900 text-primary-200' : 'bg-neutral-50 text-neutral-500',
              )}
            >
              <tr>
                <Th>Route</Th>
                <Th>Rate</Th>
                <Th>Minimum</Th>
                <Th>Transit</Th>
                <Th>Service fee</Th>
                <Th align="right">&nbsp;</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={`${r.from}-${r.to}`}
                  className={cn(
                    'duration-fast border-t transition-colors',
                    isDark
                      ? 'border-primary-800/60 hover:bg-primary-900/50'
                      : 'border-neutral-200 hover:bg-neutral-50/60',
                  )}
                >
                  <td className="px-3 py-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <CodeChip dark={isDark}>{r.from}</CodeChip>
                      <ArrowRightIcon
                        size={14}
                        className={isDark ? 'text-primary-300' : 'text-neutral-400'}
                      />
                      <CodeChip dark={isDark}>{r.to}</CodeChip>
                      <span className={isDark ? 'text-primary-100' : 'text-neutral-700'}>
                        {r.fromLabel} → {r.toLabel}
                      </span>
                    </div>
                  </td>
                  <td
                    className={cn(
                      'font-display px-3 py-4 text-lg font-semibold tabular-nums',
                      isDark ? 'text-white' : 'text-neutral-900',
                    )}
                  >
                    ${r.rate.toFixed(2)}
                    <span
                      className={cn(
                        'text-sm font-normal',
                        isDark ? 'text-primary-300' : 'text-neutral-500',
                      )}
                    >
                      /{r.unit}
                    </span>
                  </td>
                  <td
                    className={cn(
                      'px-3 py-4 tabular-nums',
                      isDark ? 'text-primary-100' : 'text-neutral-700',
                    )}
                  >
                    {r.minWeight} {r.unit}
                  </td>
                  <td className={cn('px-3 py-4', isDark ? 'text-primary-100' : 'text-neutral-700')}>
                    <span className="inline-flex items-center gap-2">
                      <ClockIcon
                        size={14}
                        className={isDark ? 'text-primary-300' : 'text-neutral-400'}
                      />
                      {r.transitDays}
                    </span>
                  </td>
                  <td className={cn('px-3 py-4', isDark ? 'text-primary-100' : 'text-neutral-700')}>
                    {r.serviceFee === 0 ? '—' : `$${r.serviceFee}`}
                  </td>
                  <td className="px-3 py-4 text-right">
                    {r.href && (
                      <a
                        href={r.href}
                        className={cn(
                          'inline-flex items-center gap-1 text-sm font-semibold',
                          isDark
                            ? 'text-accent-400 hover:text-accent-300'
                            : 'text-primary-600 hover:text-primary-700',
                        )}
                      >
                        Details <ArrowRightIcon size={14} />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MotionFadeUp>

      {/* Mobile cards */}
      <ul className="grid gap-3 md:hidden">
        {rows.map((r) => (
          <li
            key={`${r.from}-${r.to}-card`}
            className={cn(
              'rounded-md border p-4',
              isDark ? 'border-primary-800 bg-primary-900/50' : 'border-neutral-200 bg-white',
            )}
          >
            <div className="flex items-center gap-2">
              <CodeChip dark={isDark}>{r.from}</CodeChip>
              <ArrowRightIcon
                size={14}
                className={isDark ? 'text-primary-300' : 'text-neutral-400'}
              />
              <CodeChip dark={isDark}>{r.to}</CodeChip>
            </div>
            <p className={cn('mt-2 text-sm', isDark ? 'text-primary-100' : 'text-neutral-700')}>
              {r.fromLabel} → {r.toLabel}
            </p>
            <p
              className={cn(
                'font-display mt-3 text-2xl font-semibold tabular-nums',
                isDark ? 'text-white' : 'text-neutral-900',
              )}
            >
              ${r.rate.toFixed(2)}
              <span
                className={cn(
                  'text-sm font-normal',
                  isDark ? 'text-primary-300' : 'text-neutral-500',
                )}
              >
                /{r.unit}
              </span>
            </p>
            <dl className="mt-3 grid grid-cols-3 gap-3 text-xs">
              <Cell label="Min" value={`${r.minWeight}${r.unit}`} dark={isDark} />
              <Cell label="Transit" value={r.transitDays} dark={isDark} />
              <Cell
                label="Fee"
                value={r.serviceFee === 0 ? '—' : `$${r.serviceFee}`}
                dark={isDark}
              />
            </dl>
            {r.href && (
              <a
                href={r.href}
                className={cn(
                  'mt-4 inline-flex items-center gap-1 text-sm font-semibold',
                  isDark ? 'text-accent-400' : 'text-primary-600',
                )}
              >
                Details <ArrowRightIcon size={14} />
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Th({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  return (
    <th scope="col" className={cn('px-3 py-3 font-semibold', align === 'right' && 'text-right')}>
      {children}
    </th>
  );
}

function CodeChip({ children, dark }: { children: React.ReactNode; dark: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center rounded-sm px-2 font-mono text-xs font-bold',
        dark ? 'bg-primary-800 text-primary-100' : 'bg-primary-50 text-primary-700',
      )}
    >
      {children}
    </span>
  );
}

function Cell({ label, value, dark }: { label: string; value: string; dark: boolean }) {
  return (
    <div>
      <dt
        className={cn(
          'text-[10px] font-semibold uppercase tracking-wider',
          dark ? 'text-primary-300' : 'text-neutral-500',
        )}
      >
        {label}
      </dt>
      <dd className={cn('mt-0.5 font-medium', dark ? 'text-white' : 'text-neutral-900')}>
        {value}
      </dd>
    </div>
  );
}

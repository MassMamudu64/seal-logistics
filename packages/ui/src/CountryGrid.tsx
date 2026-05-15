import { cn } from './cn';
import { ArrowRightIcon, GlobeIcon } from './Icon';
import { MotionStagger, MotionFadeUp } from './MotionPrimitives';

export type CountryEntry = {
  code: string; // e.g., 'NG'
  name: string; // e.g., 'Nigeria'
  cities: readonly string[];
  /** Inbound lanes count (we ship to this country). */
  inboundLanes: number;
  /** Outbound lanes (this country ships from). */
  outboundLanes?: number;
  /** Best advertised rate (display string). */
  bestRate?: string;
  href?: string;
};

export type CountryGridProps = {
  countries: readonly CountryEntry[];
  className?: string;
};

/**
 * CountryGrid — the canonical "Countries we ship to" surface.
 * Card grid, stagger-fade entry, hover lift. Uses only design tokens.
 */
export function CountryGrid({ countries, className }: CountryGridProps) {
  return (
    <MotionStagger
      stagger={0.05}
      className={cn('grid gap-3 sm:grid-cols-2 lg:grid-cols-4', className)}
    >
      {countries.map((c) => (
        <MotionFadeUp key={c.code} trigger="stagger">
          <article
            className={cn(
              'group relative h-full rounded-md border border-neutral-200 bg-white p-4',
              'duration-fast hover:shadow-medium transition-shadow',
            )}
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="bg-primary-50 text-primary-700 inline-flex h-8 w-8 items-center justify-center rounded-sm font-mono text-xs font-bold"
              >
                {c.code}
              </span>
              <h3 className="font-display text-xl font-semibold text-neutral-900">{c.name}</h3>
            </div>

            <dl className="mt-4 space-y-2 text-sm">
              <Row label="Cities" value={c.cities.join(', ')} />
              <Row label="Inbound" value={String(c.inboundLanes)} />
              {c.outboundLanes !== undefined && (
                <Row label="Outbound" value={c.outboundLanes > 0 ? String(c.outboundLanes) : '—'} />
              )}
              {c.bestRate && <Row label="Best rate" value={c.bestRate} />}
            </dl>

            {c.href && (
              <a
                href={c.href}
                className="text-primary-600 group-hover:text-primary-700 mt-4 inline-flex items-center gap-1 text-sm font-semibold"
              >
                See lanes <ArrowRightIcon size={14} />
              </a>
            )}

            <GlobeIcon
              size={32}
              className="text-primary-100 pointer-events-none absolute right-3 top-3 opacity-50"
            />
          </article>
        </MotionFadeUp>
      ))}
    </MotionStagger>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="text-right font-medium text-neutral-900">{value}</dd>
    </div>
  );
}

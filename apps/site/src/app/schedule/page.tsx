import type { Metadata } from 'next';
import {
  ArrowRightIcon,
  Card,
  ClockIcon,
  MotionFadeUp,
  MotionStagger,
  SectionHeading,
} from '@seal/ui';
import { pageMeta } from '@/lib/seo';
import { LANES, type CountryCode } from '@/lib/pricing';

export const metadata: Metadata = pageMeta({
  title: 'Weekly air cargo schedule',
  description:
    'Weekly departure days, transit times, and cut-off windows for every Seal Logistics route.',
  path: '/schedule',
});

const NAMES: Record<CountryCode, string> = {
  US: 'USA',
  NG: 'Nigeria',
  LR: 'Liberia',
  GH: 'Ghana',
  TG: 'Togo',
  ZA: 'South Africa',
  GN: 'Guinea Conakry',
  GM: 'Gambia',
};

// Departure day per origin — kept here so the office team can update it without
// touching the pricing rate card.
const DEPARTURE_DAYS: Record<CountryCode, string> = {
  US: 'Wednesday',
  NG: 'Friday',
  LR: 'Friday',
  GH: 'Friday',
  TG: 'Friday',
  ZA: 'Friday',
  GN: 'Friday',
  GM: 'Friday',
};

export default function SchedulePage() {
  return (
    <>
      <section className="from-brand-50 relative isolate overflow-hidden bg-gradient-to-b via-white to-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <MotionFadeUp trigger="mount">
            <SectionHeading
              eyebrow="Schedule"
              title="Weekly air cargo departures."
              description="Submit your package by the day before departure to make the next flight. Same-day intake possible at the origin office for an additional handling fee."
            />
          </MotionFadeUp>
        </div>
      </section>

      <section className="bg-white pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <MotionStagger stagger={0.05} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {LANES.map((l) => (
              <MotionFadeUp key={`${l.from}-${l.to}`} trigger="stagger">
                <Card pad="lg" hover="lift" className="h-full">
                  <div className="flex items-center gap-3">
                    <span className="bg-brand-50 text-brand-700 inline-flex h-7 items-center rounded-md px-2 text-xs font-bold">
                      {l.from}
                    </span>
                    <ArrowRightIcon size={14} className="text-neutral-400" />
                    <span className="bg-brand-50 text-brand-700 inline-flex h-7 items-center rounded-md px-2 text-xs font-bold">
                      {l.to}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-neutral-600">
                    {NAMES[l.from]} → {NAMES[l.to]}
                  </p>
                  <p className="font-display mt-4 text-2xl font-semibold tracking-tight text-neutral-900">
                    {DEPARTURE_DAYS[l.from]} departures
                  </p>
                  <dl className="mt-5 space-y-2.5 text-sm">
                    <Row
                      label="Transit"
                      value={
                        <span className="inline-flex items-center gap-1.5">
                          <ClockIcon size={14} className="text-neutral-400" />
                          {l.transitDays}
                        </span>
                      }
                    />
                    <Row label="Cut-off" value="Day before departure, 5 PM local" />
                    <Row label="Rate" value={`$${l.rate.toFixed(2)} / ${l.unit}`} />
                    <Row label="Minimum" value={`${l.minWeight} ${l.unit}`} />
                    {l.serviceFee > 0 && <Row label="Service fee" value={`$${l.serviceFee}`} />}
                  </dl>
                </Card>
              </MotionFadeUp>
            ))}
          </MotionStagger>

          <MotionFadeUp className="mt-16 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-700">
            <p className="font-semibold text-neutral-900">Cut-off and holidays</p>
            <p className="mt-2">
              Cut-off times shift one business day earlier in the week of any local public holiday
              at either origin or destination. We post holiday calendars on the{' '}
              <a href="/blog" className="text-brand-700 underline">
                blog
              </a>{' '}
              before each quarter.
            </p>
          </MotionFadeUp>
        </div>
      </section>
    </>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="text-right font-medium text-neutral-900">{value}</dd>
    </div>
  );
}

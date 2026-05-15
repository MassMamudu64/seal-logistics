import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import {
  ArrowRightIcon,
  Button,
  ClockIcon,
  PackageIcon,
  PricingTable,
  SectionHeading,
  ShieldCheckIcon,
  type PricingRow,
} from '@seal/ui';
import { LANES } from '@/lib/pricing';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Trade lanes',
  description: 'Air cargo rates and transit times for every Seal Logistics shipping lane.',
  path: '/trade-lanes',
});

const NAMES: Record<string, string> = {
  US: 'USA',
  NG: 'Nigeria',
  LR: 'Liberia',
  GH: 'Ghana',
  TG: 'Togo',
  ZA: 'South Africa',
  GN: 'Guinea Conakry',
  GM: 'Gambia',
};

const rows: readonly PricingRow[] = LANES.map((l) => ({
  from: l.from,
  to: l.to,
  fromLabel: NAMES[l.from]!,
  toLabel: NAMES[l.to]!,
  rate: l.rate,
  unit: l.unit,
  minWeight: l.minWeight,
  serviceFee: l.serviceFee,
  transitDays: l.transitDays,
  href: `/trade-lanes/${l.from.toLowerCase()}-to-${l.to.toLowerCase()}`,
}));

const originCount = new Set(LANES.map((l) => l.from)).size;
const destinationCount = new Set(LANES.map((l) => l.to)).size;

export default function TradeLanesIndex() {
  return (
    <>
      <section className="bg-brand-950 relative isolate overflow-hidden py-24 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(120deg,rgba(37,99,235,0.22),transparent_42%),linear-gradient(180deg,rgba(10,15,44,0.2),#0a0f2c)]"
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-end lg:px-8">
          <div>
            <p className="text-brand-200 text-xs font-semibold uppercase tracking-[0.22em]">
              Trade lanes
            </p>
            <h1 className="font-display mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
              Published air cargo rates on every active route.
            </h1>
            <p className="text-brand-100 mt-5 max-w-2xl text-lg leading-relaxed">
              Compare lane rates, minimum chargeable weights, service fees, and transit windows
              before you send anything to the office.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/quote" intent="accent" size="lg">
                Get a quote <ArrowRightIcon size={18} />
              </Button>
              <Button
                href="/calculator"
                intent="ghost"
                size="lg"
                className="text-white hover:bg-white/10"
              >
                Estimate cost
              </Button>
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-md bg-white/10 ring-1 ring-white/10">
            <Metric label="Origins" value={originCount} />
            <Metric label="Destinations" value={destinationCount} />
            <Metric label="Active lanes" value={LANES.length} />
          </dl>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Rate card"
              title="Transparent pricing, lane by lane."
              description="USA-origin cargo is priced per pound. Nigeria-origin cargo is priced per kilogram. Electronics use flat per-item rates and are confirmed at intake."
            />
            <Button href="/schedule" intent="outline">
              See schedule <ClockIcon size={16} />
            </Button>
          </div>

          <PricingTable
            rows={rows}
            caption="Seal Logistics active air cargo trade lanes, rates, minimum weights, service fees, and transit times."
            className="mt-12"
          />
        </div>
      </section>

      <section className="bg-neutral-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Operating rules"
            title="Simple rules before you ship."
            description="Every rate is easy to quote because intake follows the same process on every lane."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <Rule
              icon={<PackageIcon size={22} />}
              title="Minimums apply"
              body="If a lane has a 10 lb or 10 kg minimum, lighter general cargo is still charged at that minimum."
            />
            <Rule
              icon={<ShieldCheckIcon size={22} />}
              title="Electronics are itemized"
              body="Phones, laptops, tablets, watches, and earbuds use flat per-item pricing so declared items are clear."
            />
            <Rule
              icon={<ClockIcon size={22} />}
              title="Transit is a window"
              body="Transit windows begin after departure and can move around holidays, customs holds, or receiver availability."
            />
          </div>
        </div>
      </section>
    </>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white/[0.06] p-4 text-center">
      <dt className="text-brand-200 text-[10px] font-semibold uppercase tracking-widest">
        {label}
      </dt>
      <dd className="font-display mt-1 text-3xl font-semibold text-white">{value}</dd>
    </div>
  );
}

function Rule({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <article className="rounded-md border border-neutral-200 bg-white p-6">
      <div className="bg-brand-50 text-brand-700 inline-flex h-10 w-10 items-center justify-center rounded-md">
        {icon}
      </div>
      <h2 className="font-display mt-4 text-xl font-semibold text-neutral-900">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">{body}</p>
    </article>
  );
}

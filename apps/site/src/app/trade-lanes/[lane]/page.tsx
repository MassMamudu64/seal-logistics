import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { Button } from '@seal/ui';
import { LANES, type CountryCode } from '@/lib/pricing';
import { pageMeta, serviceJsonLd, breadcrumbsJsonLd } from '@/lib/seo';
import { SITE } from '@/lib/site';

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

function parseLane(slug: string): { from: CountryCode; to: CountryCode } | null {
  const m = /^([a-z]{2})-to-([a-z]{2})$/.exec(slug);
  if (!m) return null;
  const from = m[1]!.toUpperCase() as CountryCode;
  const to = m[2]!.toUpperCase() as CountryCode;
  if (!(from in NAMES) || !(to in NAMES)) return null;
  return { from, to };
}

export function generateStaticParams() {
  return LANES.map((l) => ({ lane: `${l.from.toLowerCase()}-to-${l.to.toLowerCase()}` }));
}

export async function generateMetadata({
  params,
}: {
  params: { lane: string };
}): Promise<Metadata> {
  const parsed = parseLane(params.lane);
  if (!parsed) return {};
  const fromName = NAMES[parsed.from];
  const toName = NAMES[parsed.to];
  const lane = LANES.find((l) => l.from === parsed.from && l.to === parsed.to);
  if (!lane) return {};
  return pageMeta({
    title: `Ship from ${fromName} to ${toName}`,
    description: `Weekly air cargo from ${fromName} to ${toName} at $${lane.rate}/${lane.unit}. Transit ${lane.transitDays}. Doorstep pickup, secure handling, real-time tracking.`,
    path: `/trade-lanes/${params.lane}`,
  });
}

export default function TradeLanePage({ params }: { params: { lane: string } }) {
  const parsed = parseLane(params.lane);
  if (!parsed) notFound();
  const lane = LANES.find((l) => l.from === parsed.from && l.to === parsed.to);
  if (!lane) notFound();

  const fromName = NAMES[parsed.from];
  const toName = NAMES[parsed.to];
  const url = `${SITE.url}/trade-lanes/${params.lane}`;
  const nonce = headers().get('x-nonce') ?? undefined;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
      <nav aria-label="Breadcrumb" className="text-sm text-neutral-500">
        <a href="/" className="hover:text-brand-700">
          Home
        </a>{' '}
        ·{' '}
        <a href="/trade-lanes" className="hover:text-brand-700">
          Trade lanes
        </a>{' '}
        ·{' '}
        <span aria-current="page" className="text-neutral-700">
          {fromName} → {toName}
        </span>
      </nav>

      <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
        Ship from {fromName} to {toName}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-neutral-600">
        Weekly air cargo at{' '}
        <strong>
          ${lane.rate.toFixed(2)}/{lane.unit}
        </strong>{' '}
        · transit <strong>{lane.transitDays}</strong> · minimum {lane.minWeight}
        {lane.unit}
        {lane.serviceFee > 0 && <> · service fee ${lane.serviceFee}</>}.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button href={`/quote?from=${parsed.from}&to=${parsed.to}`} intent="accent" size="lg">
          Get a quote for this lane
        </Button>
        <Button href="/portal" intent="outline" size="lg">
          Track a shipment
        </Button>
      </div>

      <section className="prose prose-neutral mt-12 max-w-none">
        <h2>What is included</h2>
        <ul>
          <li>Pickup or office drop-off in {fromName}</li>
          <li>Inspection, verification, and protective packaging where needed</li>
          <li>Air freight on weekly departures with documented chain of custody</li>
          <li>Customs handling at destination</li>
          <li>Doorstep delivery in {toName} (or pickup at our office)</li>
        </ul>
        <h2>Pricing notes</h2>
        <ul>
          <li>
            Charged per {lane.unit} on actual weight, with a {lane.minWeight}
            {lane.unit} minimum.
          </li>
          <li>Electronics ship at flat per-item rates — see the rate card on the quote form.</li>
          {lane.serviceFee > 0 ? (
            <li>A ${lane.serviceFee} service fee is added per invoice on this lane.</li>
          ) : (
            <li>No additional service fee on this lane.</li>
          )}
        </ul>
      </section>

      <script
        nonce={nonce}
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceJsonLd({ from: fromName, to: toName, rate: String(lane.rate), url }),
          ),
        }}
      />
      <script
        nonce={nonce}
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbsJsonLd([
              { name: 'Home', url: SITE.url },
              { name: 'Trade lanes', url: `${SITE.url}/trade-lanes` },
              { name: `${fromName} → ${toName}`, url },
            ]),
          ),
        }}
      />
    </div>
  );
}

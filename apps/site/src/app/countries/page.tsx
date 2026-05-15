import type { Metadata } from 'next';
import {
  ArrowRightIcon,
  Button,
  CountryGrid,
  MotionFadeUp,
  SectionHeading,
  type CountryEntry,
} from '@seal/ui';
import { pageMeta } from '@/lib/seo';
import { LANES, type CountryCode } from '@/lib/pricing';
import { SITE } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: 'Countries we ship to',
  description:
    'Seal Logistics serves the USA, Nigeria, Liberia, Ghana, Togo, South Africa, Guinea Conakry, and Gambia with weekly air cargo.',
  path: '/countries',
});

type Row = {
  code: CountryCode;
  name: string;
  cities: readonly string[];
  bestRate: string;
};

const COUNTRIES_DATA: readonly Row[] = [
  {
    code: 'US',
    name: 'United States',
    cities: ['Minneapolis', 'Brooklyn Center'],
    bestRate: 'See lanes',
  },
  { code: 'NG', name: 'Nigeria', cities: ['Lagos', 'Ogba'], bestRate: '$6.50/lb from USA' },
  { code: 'GH', name: 'Ghana', cities: ['Accra', 'Panteng West'], bestRate: '$11.57/lb from USA' },
  {
    code: 'LR',
    name: 'Liberia',
    cities: ['Monrovia', 'Congo Town'],
    bestRate: '$11.57/lb from USA',
  },
  { code: 'TG', name: 'Togo', cities: ['Lomé'], bestRate: '$8.60/lb from USA' },
  { code: 'ZA', name: 'South Africa', cities: ['Johannesburg'], bestRate: '$11.57/lb from USA' },
  { code: 'GN', name: 'Guinea Conakry', cities: ['Conakry'], bestRate: '$7.50/lb from USA' },
  { code: 'GM', name: 'Gambia', cities: ['Banjul'], bestRate: '$9.60/lb from USA' },
];

export default function CountriesPage() {
  const entries: CountryEntry[] = COUNTRIES_DATA.map((c) => ({
    code: c.code,
    name: c.name,
    cities: c.cities,
    inboundLanes: LANES.filter((l) => l.to === c.code).length,
    outboundLanes: LANES.filter((l) => l.from === c.code).length,
    bestRate: c.bestRate,
    href: '/trade-lanes',
  }));

  return (
    <>
      <section className="from-brand-50 relative isolate overflow-hidden bg-gradient-to-b via-white to-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <MotionFadeUp trigger="mount">
            <SectionHeading
              eyebrow="Network"
              title="Countries we ship to."
              description="Weekly air cargo, customs handling, and doorstep delivery across eight countries."
            />
          </MotionFadeUp>
        </div>
      </section>

      <section className="bg-white pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <CountryGrid countries={entries} />

          <MotionFadeUp className="mt-16 grid gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-8 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <h3 className="font-display text-xl font-semibold text-neutral-900">
                Need another destination?
              </h3>
              <p className="mt-1 text-sm text-neutral-600">
                We are expanding lanes regularly. Send us your destination and we will quote a route
                through our nearest partner hub.
              </p>
            </div>
            <Button href="/contact" intent="primary" size="lg">
              Contact us <ArrowRightIcon size={18} />
            </Button>
          </MotionFadeUp>
        </div>
      </section>

      <section className="bg-brand-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading eyebrow="Offices" title="Where to find us on the ground." tone="dark" />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SITE.offices.map((o) => (
              <li
                key={o.country}
                className="border-brand-800 bg-brand-900/40 rounded-xl border p-5 backdrop-blur-sm"
              >
                <p className="font-display text-lg font-semibold text-white">{o.country}</p>
                <address className="text-brand-100 mt-2 text-sm not-italic">{o.address}</address>
                <a
                  href={`tel:${o.phone.replace(/\s+/g, '')}`}
                  className="text-accent-400 hover:text-accent-300 mt-3 inline-block text-sm font-medium"
                >
                  {o.phone}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

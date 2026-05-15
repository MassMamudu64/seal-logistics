import type { Metadata } from 'next';
import {
  ArrowRightIcon,
  Button,
  CinematicHero,
  ClockIcon,
  EditorialFeature,
  HomeIcon,
  PackageIcon,
  PlaneIcon,
  RouteMap,
  SectionHeading,
  ShieldCheckIcon,
  Stat,
  TruckIcon,
} from '@seal/ui';
import type { ReactNode, SVGProps } from 'react';
import { pageMeta } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { LANES } from '@/lib/pricing';

export const metadata: Metadata = pageMeta({
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  path: '/',
});

const COUNTRY_NAMES: Record<string, string> = {
  US: 'USA',
  NG: 'Nigeria',
  LR: 'Liberia',
  GH: 'Ghana',
  TG: 'Togo',
  ZA: 'South Africa',
  GN: 'Guinea Conakry',
  GM: 'Gambia',
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <FlightNetwork />
      <EditorialFeature
        eyebrow="Chain of custody"
        title="Every shipment, documented end to end."
        description="From intake at our office to wheels-up on the weekly cargo flight, your package moves under documented handling. We photograph, weigh, and verify at every checkpoint."
        points={[
          'Intake inspection and weight verification on arrival',
          'Protective packaging for fragile and high-value items',
          'Sorted, labeled, and consolidated for the next departure',
          'Tracking ID emailed with a private portal link',
        ]}
        cta={{ href: '/process', label: 'See the full process' }}
        image="/hero/warehouse-airplane.webp"
        imageAlt="Cargo aircraft inside a warehouse surrounded by stacked shipment boxes ready for departure"
        imageSide="left"
      />
      <ServicesGrid />
      <EditorialFeature
        eyebrow="Built for volume"
        title="The conveyor never stops."
        description="Whether you're shipping one phone or a thousand orders, we run the same disciplined intake. E-commerce vendors get consolidation, sorting, and customs paperwork built around their schedule."
        points={[
          'Vendor-friendly consolidation rates on weekly cargo',
          'Sorting and labeling by destination country',
          'Customs paperwork handled at both ends of the lane',
          'API/webhook integration for high-volume sellers (post-launch)',
        ]}
        cta={{ href: '/services', label: 'E-commerce logistics' }}
        image="/hero/conveyor-boxes.webp"
        imageAlt="A line of sealed cardboard cargo boxes moving along a conveyor belt at the sorting facility"
        imageSide="right"
        tone="dark"
      />
      <ProcessStrip />
      <LaneTable />
      <FinalCta />
    </>
  );
}

/* ---------------------------------------------------------------- HERO */

function Hero() {
  return (
    <CinematicHero
      image="/hero/airplane-loading.webp"
      badge={
        <span className="text-brand-100 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="bg-accent-500 absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" />
            <span className="bg-accent-500 relative inline-flex h-2 w-2 rounded-full" />
          </span>
          <span className="uppercase tracking-wider">Weekly departures · USA → Africa</span>
        </span>
      }
      eyebrow="Air cargo · doorstep · e-commerce"
      title={
        <>
          Cargo that moves like
          <br />
          <span className="from-accent-400 via-accent-500 to-brand-200 bg-gradient-to-r bg-clip-text text-transparent">
            clockwork.
          </span>
        </>
      }
      subtitle="Weekly air freight from Minneapolis to Lagos in 7–10 days. Doorstep pickup, secure handling, real-time tracking — for individuals, vendors, and e-commerce."
      primaryAction={
        <Button href="/quote" intent="accent" size="lg" className="group">
          Get an instant quote
          <ArrowRightIcon size={18} className="transition-transform group-hover:translate-x-0.5" />
        </Button>
      }
      secondaryAction={
        <a
          href="/portal"
          className="text-brand-100 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:text-white"
        >
          Track a shipment
          <ArrowRightIcon size={16} />
        </a>
      }
      aside={
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
          <p className="text-brand-200 text-xs font-semibold uppercase tracking-widest">
            Next departure
          </p>
          <p className="font-display mt-3 text-3xl font-semibold text-white">
            Wednesday <span className="text-accent-400">→</span> Lagos
          </p>
          <p className="text-brand-100 mt-2 text-sm">
            Cut-off Tuesday 5 PM CT · 7–10 day transit · $6.50/lb · 10 lb min
          </p>
          <a
            href="/schedule"
            className="text-accent-400 hover:text-accent-300 mt-6 inline-flex items-center gap-1.5 text-sm font-medium"
          >
            Full weekly schedule
            <ArrowRightIcon size={14} />
          </a>
        </div>
      }
    />
  );
}

/* ------------------------------------------------------------ TRUST BAR */

function TrustBar() {
  return (
    <section className="border-y border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-10 px-6 py-14 sm:grid-cols-4 lg:px-8">
        <Stat value={8} label="Countries served" />
        <Stat value={52} label="Departures / year" />
        <Stat value={10000} label="Shipments handled" suffix="+" />
        <Stat value={7} label="Days transit USA→NG" />
      </div>
    </section>
  );
}

/* ----------------------------------------------------- FLIGHT NETWORK */

function FlightNetwork() {
  return (
    <section className="relative bg-neutral-50 py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:items-end">
          <SectionHeading
            eyebrow="Network"
            title="Weekly cargo, every direction."
            description="Minneapolis is our western hub. Lagos is our African hub. Onward delivery reaches Liberia, Ghana, Togo, Guinea, Gambia, and South Africa — all on documented schedules."
          />
          <div className="grid grid-cols-3 gap-2 self-end text-xs text-neutral-500">
            <div className="rounded-lg border border-neutral-200 bg-white p-3">
              <p className="text-brand-600 text-[10px] font-semibold uppercase tracking-widest">
                Hub
              </p>
              <p className="font-display mt-1.5 text-lg font-semibold text-neutral-900">MSP</p>
              <p className="text-neutral-500">Minneapolis</p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-3">
              <p className="text-brand-600 text-[10px] font-semibold uppercase tracking-widest">
                Hub
              </p>
              <p className="font-display mt-1.5 text-lg font-semibold text-neutral-900">LOS</p>
              <p className="text-neutral-500">Lagos</p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-3">
              <p className="text-brand-600 text-[10px] font-semibold uppercase tracking-widest">
                Partners
              </p>
              <p className="font-display mt-1.5 text-lg font-semibold text-neutral-900">6+</p>
              <p className="text-neutral-500">Onward</p>
            </div>
          </div>
        </div>

        <div className="mt-14 overflow-hidden rounded-3xl border border-neutral-200 bg-white p-2 shadow-sm sm:p-4">
          <RouteMap />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- SERVICES GRID */

function ServicesGrid() {
  const services: {
    icon: (p: SVGProps<SVGSVGElement> & { size?: number }) => ReactNode;
    title: string;
    body: string;
  }[] = [
    {
      icon: PlaneIcon,
      title: 'Air cargo',
      body: 'Weekly air freight on every core lane. Submit before deadline for the next departure.',
    },
    {
      icon: HomeIcon,
      title: 'Doorstep delivery',
      body: 'Pickup from your home, office, or warehouse. Delivery to the receiver — no office queue.',
    },
    {
      icon: PackageIcon,
      title: 'E-commerce logistics',
      body: 'Vendor-friendly consolidation, sorting, and customs paperwork built for online stores.',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Specialized cargo',
      body: 'Fragile, oversized, and high-value items get protective packaging and chain-of-custody.',
    },
  ];
  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Services"
          title="Built for cross-border peace of mind."
          description="Every shipment — single phone or a pallet of orders — moves through the same disciplined process."
        />
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-neutral-200 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <article
              key={s.title}
              className="group relative bg-white p-7 transition-colors hover:bg-neutral-50"
            >
              <div className="bg-brand-50 text-brand-700 group-hover:bg-brand-600 inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors group-hover:text-white">
                <s.icon size={22} />
              </div>
              <h3 className="font-display mt-5 text-xl font-semibold text-neutral-900">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{s.body}</p>
              <a
                href="/services"
                className="text-brand-700 hover:text-brand-800 mt-5 inline-flex items-center gap-1 text-sm font-semibold"
              >
                Learn more <ArrowRightIcon size={14} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- PROCESS STRIP */

function ProcessStrip() {
  const steps = [
    {
      n: '01',
      icon: TruckIcon,
      title: 'Drop-off or pickup',
      body: 'Bring it to our office or schedule a pickup at your address.',
    },
    {
      n: '02',
      icon: ShieldCheckIcon,
      title: 'Inspect & package',
      body: 'We verify contents, package for transit, document the shipment.',
    },
    {
      n: '03',
      icon: PlaneIcon,
      title: 'Fly weekly',
      body: 'Cargo moves on our weekly air freight schedule.',
    },
    {
      n: '04',
      icon: HomeIcon,
      title: 'Doorstep delivery',
      body: 'Pickup at our destination office or doorstep delivery — your choice.',
    },
  ];
  return (
    <section className="bg-brand-950 relative isolate overflow-hidden py-28 text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.18), transparent 70%)',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Process"
          title="Four steps. Every shipment."
          description="A disciplined process from intake to delivery — the same whether you're shipping one box or a hundred."
          tone="dark"
        />
        <ol className="bg-brand-800/40 mt-14 grid gap-px overflow-hidden rounded-2xl ring-1 ring-white/5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li key={s.n} className="bg-brand-950/50 p-7 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <p className="font-display text-accent-400 text-3xl font-semibold">{s.n}</p>
                <s.icon size={22} className="text-brand-300" />
              </div>
              <h3 className="font-display mt-5 text-xl font-semibold text-white">{s.title}</h3>
              <p className="text-brand-100 mt-2 text-sm leading-relaxed">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12">
          <a
            href="/process"
            className="text-brand-100 inline-flex items-center gap-2 text-sm font-medium hover:text-white"
          >
            Read the full shipping process
            <ArrowRightIcon size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- LANE TABLE */

function LaneTable() {
  const featured = LANES.slice(0, 6);
  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Trade lanes"
            title="Transparent rates on every route."
            description="No hidden surcharges. Weight pricing per pound or kilogram. Electronics priced per item."
          />
          <Button href="/trade-lanes" intent="outline" size="md">
            View all lanes <ArrowRightIcon size={16} />
          </Button>
        </div>

        <div className="mt-14 overflow-hidden rounded-2xl border border-neutral-200">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
              <tr>
                <th scope="col" className="px-5 py-4 text-left font-semibold">
                  Route
                </th>
                <th scope="col" className="px-5 py-4 text-left font-semibold">
                  Rate
                </th>
                <th scope="col" className="px-5 py-4 text-left font-semibold">
                  Minimum
                </th>
                <th scope="col" className="px-5 py-4 text-left font-semibold">
                  Transit
                </th>
                <th scope="col" className="px-5 py-4 text-left font-semibold">
                  Service fee
                </th>
                <th scope="col" className="px-5 py-4 text-right font-semibold" />
              </tr>
            </thead>
            <tbody>
              {featured.map((l) => (
                <tr
                  key={`${l.from}-${l.to}`}
                  className="border-t border-neutral-200 transition-colors hover:bg-neutral-50/60"
                >
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      <span className="bg-brand-50 text-brand-700 inline-flex h-7 items-center rounded-md px-2 text-xs font-bold">
                        {l.from}
                      </span>
                      <ArrowRightIcon size={14} className="text-neutral-400" />
                      <span className="bg-brand-50 text-brand-700 inline-flex h-7 items-center rounded-md px-2 text-xs font-bold">
                        {l.to}
                      </span>
                      <span className="text-neutral-700">
                        {COUNTRY_NAMES[l.from]} → {COUNTRY_NAMES[l.to]}
                      </span>
                    </div>
                  </td>
                  <td className="font-display px-5 py-5 text-lg font-semibold tabular-nums text-neutral-900">
                    ${l.rate.toFixed(2)}
                    <span className="text-sm font-normal text-neutral-500">/{l.unit}</span>
                  </td>
                  <td className="px-5 py-5 tabular-nums text-neutral-700">
                    {l.minWeight} {l.unit}
                  </td>
                  <td className="px-5 py-5">
                    <span className="inline-flex items-center gap-1.5 text-neutral-700">
                      <ClockIcon size={14} className="text-neutral-400" /> {l.transitDays}
                    </span>
                  </td>
                  <td className="px-5 py-5 text-neutral-700">
                    {l.serviceFee === 0 ? '—' : `$${l.serviceFee}`}
                  </td>
                  <td className="px-5 py-5 text-right">
                    <a
                      href={`/trade-lanes/${l.from.toLowerCase()}-to-${l.to.toLowerCase()}`}
                      className="text-brand-700 hover:text-brand-800 inline-flex items-center gap-1 text-sm font-semibold"
                    >
                      Details <ArrowRightIcon size={14} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- FINAL CTA */

function FinalCta() {
  return (
    <section className="from-brand-900 via-brand-800 to-brand-950 relative isolate overflow-hidden bg-gradient-to-br py-24 text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 60% 50% at 80% 100%, rgba(249,115,22,0.22), transparent 60%)',
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[2fr_1fr] lg:items-center lg:px-8">
        <div>
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Ready to ship?
          </h2>
          <p className="text-brand-100 mt-4 max-w-xl text-lg">
            Get an instant quote in 60 seconds. We will email you a tracking ID and a private link
            to your shipment portal.
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-3">
          <Button href="/quote" intent="accent" size="lg" full>
            Get my quote <ArrowRightIcon size={18} />
          </Button>
          <Button
            href="/calculator"
            intent="ghost"
            size="lg"
            full
            className="text-white hover:bg-white/10"
          >
            Try the calculator
          </Button>
        </div>
      </div>
    </section>
  );
}

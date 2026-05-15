import type { Metadata } from 'next';
import type { SVGProps, ReactNode } from 'react';
import {
  ArrowRightIcon,
  Button,
  Card,
  HomeIcon,
  MotionFadeUp,
  MotionStagger,
  PackageIcon,
  PlaneIcon,
  SectionHeading,
  ShieldCheckIcon,
  TruckIcon,
} from '@seal/ui';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Services',
  description:
    'Air cargo, doorstep delivery, e-commerce logistics, and specialized cargo handling across the USA, Nigeria, Liberia, Ghana, Togo, South Africa, Guinea, and Gambia.',
  path: '/services',
});

type IconComponent = (p: SVGProps<SVGSVGElement> & { size?: number }) => ReactNode;

type Service = {
  icon: IconComponent;
  title: string;
  body: string;
  highlights: readonly string[];
};

const SERVICES: readonly Service[] = [
  {
    icon: PlaneIcon,
    title: 'Air cargo',
    body: 'Weekly air freight on every core lane — fast, secure, and tracked end to end.',
    highlights: [
      'Cut-off published one week ahead of each departure',
      'Weight-priced per pound or kilogram (lane-specific)',
      'Real-time tracking from intake to wheels-down',
    ],
  },
  {
    icon: HomeIcon,
    title: 'Doorstep delivery & pickup',
    body: 'Scheduled pickup from your home, office, or warehouse — and last-mile delivery to the receiver.',
    highlights: [
      'No office queues at either end of the lane',
      'Pickup windows confirmed by SMS the day before',
      'Receiver gets a delivery photo + signature',
    ],
  },
  {
    icon: PackageIcon,
    title: 'E-commerce logistics',
    body: 'Vendor-friendly consolidation, sorting, and customs paperwork built for online stores.',
    highlights: [
      'Consolidation rates on weekly cargo',
      'Sort and label by destination country',
      'Customs paperwork handled both ends of the lane',
    ],
  },
  {
    icon: ShieldCheckIcon,
    title: 'Specialized cargo',
    body: 'Fragile, oversized, and high-value items get protective packaging and chain-of-custody.',
    highlights: [
      'Reinforced packaging for electronics, glass, ceramics',
      'Photographed at intake, in transit, and on delivery',
      'Insured at declared value (terms apply)',
    ],
  },
  {
    icon: TruckIcon,
    title: 'Packaging & consolidation',
    body: 'We sort, label, and combine multiple shipments to reduce per-unit cost.',
    highlights: [
      'Weight-saving packing methods on request',
      'Combine multiple senders into one waybill',
      'Vendor-priced rate cards for repeat shippers',
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="from-brand-50 relative isolate overflow-hidden bg-gradient-to-b via-white to-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <MotionFadeUp trigger="mount">
            <p className="text-brand-600 text-xs font-semibold uppercase tracking-[0.22em]">
              Services
            </p>
            <h1 className="font-display mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-neutral-900 sm:text-6xl">
              Built for cross-border peace of mind.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-neutral-600">
              Every shipment — single phone or a pallet of e-commerce orders — moves through the
              same disciplined process. Five services, one operating standard.
            </p>
          </MotionFadeUp>
        </div>
      </section>

      <section className="bg-white pb-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <MotionStagger stagger={0.06} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <MotionFadeUp key={s.title} trigger="stagger">
                <Card
                  pad="lg"
                  hover="lift"
                  className="hover:shadow-medium group h-full transition-shadow"
                >
                  <div className="bg-brand-50 text-brand-700 group-hover:bg-brand-600 inline-flex h-12 w-12 items-center justify-center rounded-lg transition-colors group-hover:text-white">
                    <s.icon size={24} />
                  </div>
                  <h2 className="font-display mt-5 text-2xl font-semibold tracking-tight text-neutral-900">
                    {s.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{s.body}</p>
                  <ul className="mt-5 space-y-2 text-sm">
                    {s.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-neutral-700">
                        <span
                          aria-hidden="true"
                          className="bg-accent-500 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </MotionFadeUp>
            ))}
          </MotionStagger>

          <MotionFadeUp className="mt-16 flex flex-col items-start gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-xl font-semibold text-neutral-900">
                Not sure which service fits?
              </h3>
              <p className="mt-1 text-sm text-neutral-600">
                Send us your shipment details — we will match the right lane and service in one
                reply.
              </p>
            </div>
            <Button href="/quote" intent="primary" size="lg">
              Get a quote <ArrowRightIcon size={18} />
            </Button>
          </MotionFadeUp>
        </div>
      </section>

      <section className="bg-brand-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Process"
            title="Same discipline. Every shipment."
            description="From intake to doorstep delivery, every package follows a documented seven-step process — see how it works."
            tone="dark"
          />
          <MotionFadeUp className="mt-10">
            <a
              href="/process"
              className="text-brand-100 inline-flex items-center gap-2 text-sm font-medium hover:text-white"
            >
              See the full shipping process
              <ArrowRightIcon size={16} />
            </a>
          </MotionFadeUp>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import {
  ArrowRightIcon,
  Button,
  MotionFadeUp,
  SectionHeading,
  Timeline,
  type TimelineStep,
} from '@seal/ui';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Shipping process',
  description: 'The seven-step Seal Logistics shipping process — from intake to doorstep delivery.',
  path: '/process',
});

const STEPS: readonly TimelineStep[] = [
  {
    number: '01',
    title: 'Package drop-off or pickup',
    description:
      'Bring your shipment to our office, or schedule a pickup at your home, office, or warehouse. We verify sender and receiver details on intake.',
  },
  {
    number: '02',
    title: 'Inspection & verification',
    description:
      'Every package is inspected: contents confirmed, packaging condition checked, shipping details verified, fragile items flagged for protective handling.',
  },
  {
    number: '03',
    title: 'Professional packaging & labeling',
    description:
      'We seal, label, and secure your shipment for transit. Fragile or sensitive items get additional protection. We advise on packaging methods that reduce weight and cost.',
  },
  {
    number: '04',
    title: 'Cargo sorting & processing',
    description:
      'Shipments are sorted by destination, category, and priority, then organized for the next weekly air departure. All handling is monitored and documented.',
  },
  {
    number: '05',
    title: 'Shipment dispatch',
    description:
      'Packages are dispatched via our trusted air cargo channels across the USA, Nigeria, Liberia, Ghana, Togo, South Africa, Guinea, and Gambia.',
  },
  {
    number: '06',
    title: 'Real-time tracking',
    description:
      'You receive a tracking ID and a private portal link. You can monitor movement, transit progress, and delivery status anytime. Our team is reachable for questions.',
  },
  {
    number: '07',
    title: 'Secure delivery',
    description:
      "On arrival, your shipment is delivered to the receiver's doorstep or held at our destination office for pickup — whichever you chose at intake.",
  },
];

export default function ProcessPage() {
  return (
    <>
      <section className="from-brand-50 relative isolate overflow-hidden bg-gradient-to-b via-white to-white py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <MotionFadeUp trigger="mount">
            <p className="text-brand-600 text-xs font-semibold uppercase tracking-[0.22em]">
              Process
            </p>
            <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-6xl">
              From intake to doorstep — every step documented.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-neutral-600">
              A disciplined process built around trust, speed, and security. The same whether you
              are shipping one box or a hundred.
            </p>
          </MotionFadeUp>
        </div>
      </section>

      <section className="bg-white pb-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <Timeline steps={STEPS} />
        </div>
      </section>

      <section className="bg-neutral-50 py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Assurance"
            title="Security & customer assurance."
            description="Secure handling procedures, careful cargo management, professional logistics staff, organized shipment documentation, and reliable communication with customers. Every shipment is treated with the same care — because every package matters."
          />
          <MotionFadeUp className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button href="/quote" intent="primary" size="lg">
              Get a quote <ArrowRightIcon size={18} />
            </Button>
            <a
              href="/portal"
              className="text-brand-700 hover:text-brand-800 inline-flex items-center gap-2 text-sm font-medium"
            >
              Track an existing shipment
              <ArrowRightIcon size={16} />
            </a>
          </MotionFadeUp>
        </div>
      </section>
    </>
  );
}

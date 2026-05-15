import type { Metadata } from 'next';
import {
  ArrowRightIcon,
  Button,
  Card,
  MotionFadeUp,
  MotionStagger,
  SectionHeading,
  Stat,
} from '@seal/ui';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'About Seal Logistics',
  description:
    'Seal Logistics & Cargo Services is a professional air freight company connecting the USA and Africa with secure, weekly shipments.',
  path: '/about',
});

const VALUES = [
  {
    title: 'Speed & reliability',
    body: 'Weekly air freight on every core lane. Cut-offs published in advance. Customers can plan around our schedule, not the other way around.',
  },
  {
    title: 'Secure handling',
    body: 'Every shipment is inspected, documented, and tracked. Fragile and high-value items receive protective packaging and chain-of-custody documentation.',
  },
  {
    title: 'Customer-focused',
    body: 'We communicate at every stage. You always know where your shipment is and what happens next.',
  },
  {
    title: 'Transparent pricing',
    body: 'Published rates per pound or kilogram. Flat per-item pricing for electronics. No hidden fees beyond the documented service fee.',
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <section className="from-brand-50 relative isolate overflow-hidden bg-gradient-to-b to-white py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <MotionFadeUp trigger="mount">
            <p className="text-brand-600 text-xs font-semibold uppercase tracking-[0.22em]">
              About
            </p>
            <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-6xl">
              A logistics company built around{' '}
              <span className="from-brand-700 via-brand-600 to-accent-500 bg-gradient-to-r bg-clip-text text-transparent">
                trust
              </span>
              .
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-neutral-600">
              Seal Logistics & Cargo Services is a professional logistics and cargo company
              dedicated to providing fast, secure, and reliable shipping solutions for individuals,
              businesses, and e-commerce customers.
            </p>
          </MotionFadeUp>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-white py-16">
        <div className="mx-auto grid max-w-5xl gap-12 px-6 sm:grid-cols-3 lg:px-8">
          <Stat value={8} label="Countries served" />
          <Stat value={52} label="Departures / year" />
          <Stat value={10000} label="Shipments handled" suffix="+" />
        </div>
      </section>

      <section className="bg-neutral-50 py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Mission"
            title="Connecting people, businesses, and communities across borders."
            description="Our mission is to provide seamless, affordable, and dependable logistics solutions. We aim to deliver every package safely and on time while maintaining the highest standards of customer satisfaction, transparency, and trust."
          />

          <MotionStagger stagger={0.06} className="mt-12 grid gap-6 sm:grid-cols-2">
            {VALUES.map((v) => (
              <MotionFadeUp key={v.title} trigger="stagger">
                <Card pad="lg" hover="lift" className="h-full">
                  <h3 className="font-display text-xl font-semibold text-neutral-900">{v.title}</h3>
                  <p className="mt-2 text-neutral-700">{v.body}</p>
                </Card>
              </MotionFadeUp>
            ))}
          </MotionStagger>
        </div>
      </section>

      <section className="from-brand-900 via-brand-800 to-brand-950 relative isolate overflow-hidden bg-gradient-to-br py-24 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 60% 50% at 80% 100%, rgba(249,115,22,0.22), transparent 60%)',
          }}
        />
        <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
          <MotionFadeUp>
            <h2 className="font-display max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Ready to put us to work?
            </h2>
            <p className="text-brand-100 mt-4 max-w-xl text-lg">
              Get an instant quote in 60 seconds. We will email you a tracking ID and a private link
              to your shipment portal.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/quote" intent="accent" size="lg">
                Get my quote <ArrowRightIcon size={18} />
              </Button>
              <Button
                href="/contact"
                intent="ghost"
                size="lg"
                className="text-white hover:bg-white/10"
              >
                Talk to an office
              </Button>
            </div>
          </MotionFadeUp>
        </div>
      </section>
    </>
  );
}

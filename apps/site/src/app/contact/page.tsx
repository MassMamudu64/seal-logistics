import type { Metadata } from 'next';
import {
  ArrowRightIcon,
  Button,
  Card,
  GlobeIcon,
  MotionFadeUp,
  MotionStagger,
  SectionHeading,
} from '@seal/ui';
import { pageMeta } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: 'Contact',
  description: 'Reach Seal Logistics offices in the USA, Nigeria, Ghana, and Liberia.',
  path: '/contact',
});

const PAYMENTS = [
  { label: 'Zenith Bank (Nigeria)', detail: 'SEAL Logistics — 1310883156' },
  { label: 'GTB (Liberia)', detail: 'SEAL Logistics — 007001328463201022' },
  { label: 'Cash App', detail: '952-607-0580' },
  { label: 'Zelle', detail: 'shiptetal.llc@gmail.com' },
] as const;

export default function ContactPage() {
  return (
    <>
      <section className="from-brand-50 relative isolate overflow-hidden bg-gradient-to-b via-white to-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <MotionFadeUp trigger="mount">
            <p className="text-brand-600 text-xs font-semibold uppercase tracking-[0.22em]">
              Contact
            </p>
            <h1 className="font-display mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-neutral-900 sm:text-6xl">
              Talk to someone at the office closest to you.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-neutral-600">
              Four offices across two continents, all reachable by phone. For a written response
              with a quote, use the quote form.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/quote" intent="primary" size="lg">
                Get a written quote <ArrowRightIcon size={18} />
              </Button>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex h-12 items-center gap-2 rounded-md border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
              >
                Email ops directly
              </a>
            </div>
          </MotionFadeUp>
        </div>
      </section>

      <section className="bg-white pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading eyebrow="Offices" title="Find us on the ground." />
          <MotionStagger stagger={0.06} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SITE.offices.map((o) => (
              <MotionFadeUp key={o.country} trigger="stagger">
                <Card pad="lg" hover="lift" className="group relative h-full overflow-hidden">
                  <GlobeIcon
                    size={36}
                    className="text-brand-100 group-hover:text-brand-300 pointer-events-none absolute right-4 top-4 transition-colors"
                  />
                  <p className="text-brand-600 text-xs font-semibold uppercase tracking-wider">
                    {o.country}
                  </p>
                  <h3 className="font-display mt-3 text-xl font-semibold text-neutral-900">
                    Seal Logistics, {o.country}
                  </h3>
                  <address className="mt-3 text-sm not-italic leading-relaxed text-neutral-600">
                    {o.address}
                  </address>
                  <a
                    href={`tel:${o.phone.replace(/\s+/g, '')}`}
                    className="text-brand-700 hover:text-brand-800 mt-5 inline-flex items-center gap-1.5 text-sm font-semibold"
                  >
                    {o.phone}
                    <ArrowRightIcon size={14} />
                  </a>
                </Card>
              </MotionFadeUp>
            ))}
          </MotionStagger>
        </div>
      </section>

      <section className="bg-neutral-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Payment"
            title="Accepted payment channels."
            description="We never ask for payment outside these channels. Always double-check the account name before sending."
          />
          <MotionStagger stagger={0.05} className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PAYMENTS.map((p) => (
              <MotionFadeUp key={p.label} trigger="stagger">
                <div className="h-full rounded-xl border border-neutral-200 bg-white p-5">
                  <p className="text-brand-600 text-xs font-semibold uppercase tracking-wider">
                    {p.label}
                  </p>
                  <p className="mt-2 font-mono text-sm text-neutral-900">{p.detail}</p>
                </div>
              </MotionFadeUp>
            ))}
          </MotionStagger>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import { MotionFadeUp } from '@seal/ui';
import { pageMeta } from '@/lib/seo';
import { PricingCalculator } from '@/components/PricingCalculator';

export const metadata: Metadata = pageMeta({
  title: 'Shipping calculator',
  description:
    'Calculate your air cargo cost instantly — per lb or kg, with electronics priced per item.',
  path: '/calculator',
});

export default function CalculatorPage() {
  return (
    <>
      <section className="from-brand-50 relative isolate overflow-hidden bg-gradient-to-b via-white to-white py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <MotionFadeUp trigger="mount">
            <p className="text-brand-600 text-xs font-semibold uppercase tracking-[0.22em]">
              Calculator
            </p>
            <h1 className="font-display mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
              Estimate your shipping cost.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-neutral-600">
              Choose your route, add weight or electronics, see the total update live.
            </p>
          </MotionFadeUp>
        </div>
      </section>

      <section className="bg-white pb-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <PricingCalculator />
        </div>
      </section>
    </>
  );
}

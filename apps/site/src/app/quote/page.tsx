import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { BookingForm } from '@/components/BookingForm';

export const metadata: Metadata = pageMeta({
  title: 'Get a quote',
  description:
    'Get an instant air cargo quote — choose your route, enter weight or electronics, and we will email you a tracking ID within minutes.',
  path: '/quote',
});

export default function QuotePage({
  searchParams,
}: {
  searchParams: { from?: string; to?: string };
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <h1 className="font-display text-4xl font-semibold tracking-tight">Get an instant quote</h1>
      <p className="mt-3 text-lg text-neutral-600">
        Fill in the basics. We will email you a tracking ID and detailed quote — usually within a
        few minutes during business hours.
      </p>
      <BookingForm initialFrom={searchParams.from} initialTo={searchParams.to} />
    </div>
  );
}

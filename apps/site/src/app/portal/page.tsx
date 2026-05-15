import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { Button, Input } from '@seal/ui';

export const metadata: Metadata = pageMeta({
  title: 'Track a shipment',
  description:
    'Enter your Seal Logistics tracking ID to see real-time status and shipment history.',
  path: '/portal',
});

export default function PortalLanding({ searchParams }: { searchParams: { error?: string } }) {
  const invalid = searchParams.error === 'invalid';

  return (
    <div className="mx-auto max-w-xl px-6 py-16 lg:px-8">
      <h1 className="font-display text-4xl font-semibold tracking-tight">Track a shipment</h1>
      <p className="mt-3 text-lg text-neutral-600">
        Enter the tracking ID we sent you, or open the personal link from your email.
      </p>
      <form action="/portal/lookup" method="get" className="mt-8 flex flex-col gap-4">
        <Input
          label="Tracking ID"
          name="id"
          placeholder="SEAL-XXXXXXXX-XX"
          required
          autoComplete="off"
          hint="Format: SEAL-YYWWXXXX-CC. Case-sensitive."
          {...(invalid
            ? { error: 'That tracking ID could not be verified. Check the format and try again.' }
            : {})}
        />
        <Button type="submit" intent="primary" size="lg">
          View shipment
        </Button>
      </form>
    </div>
  );
}

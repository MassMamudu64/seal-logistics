import type { ReactNode } from 'react';
import { Section, SectionHeading, Button, Input, ArrowRightIcon } from '@seal/ui';

/**
 * TrackingPage — shipment lookup landing.
 * Heading + tracking-ID form + (optional) status panel slot when an ID is found.
 *
 * The page is intentionally minimal: portal entry should feel safe and fast,
 * not marketing-y. No hero photo.
 */
export type TrackingPageProps = {
  /** Optional shipment panel when an ID is resolved. */
  shipmentSlot?: ReactNode;
  /** Action URL for the lookup form (e.g., '/portal/lookup'). */
  lookupAction: string;
  /** Error string surfaced from the query (e.g., ?error=invalid). */
  error?: string;
};

export function TrackingPage({ shipmentSlot, lookupAction, error }: TrackingPageProps) {
  return (
    <>
      <Section tone="light" padY="xl">
        <div className="max-w-xl">
          <SectionHeading
            eyebrow="Portal"
            title="Track a shipment."
            description="Enter the tracking ID we sent you, or open the private link from your confirmation email."
          />
          <form action={lookupAction} method="get" className="mt-7 flex flex-col gap-4">
            <Input
              label="Tracking ID"
              name="id"
              placeholder="SEAL-XXXXXXXX-XX"
              required
              autoComplete="off"
              hint="Format: SEAL-YYWWXXXX-CC. Case-sensitive."
              {...(error
                ? { error: 'That tracking ID could not be verified. Check the format.' }
                : {})}
            />
            <Button type="submit" intent="primary" size="lg">
              View shipment <ArrowRightIcon size={18} />
            </Button>
          </form>
        </div>
      </Section>

      {shipmentSlot && (
        <Section tone="soft" padY="lg">
          {shipmentSlot}
        </Section>
      )}
    </>
  );
}

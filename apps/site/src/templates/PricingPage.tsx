import type { ReactNode } from 'react';
import { Section, SectionHeading, PricingTable, type PricingRow } from '@seal/ui';

/**
 * PricingPage — rate-card-centric layout.
 * Hero (no photo, restrained) + PricingTable + optional content slot.
 */
export type PricingPageProps = {
  title: ReactNode;
  description: ReactNode;
  rows: readonly PricingRow[];
  /** Slot for the interactive calculator. */
  calculator?: ReactNode;
  /** Optional FAQ / notes block. */
  notes?: ReactNode;
};

export function PricingPage({ title, description, rows, calculator, notes }: PricingPageProps) {
  return (
    <>
      <Section tone="light" padY="xl">
        <SectionHeading eyebrow="Pricing" title={title} description={description} />
      </Section>

      {calculator && (
        <Section tone="soft" padY="lg">
          <SectionHeading eyebrow="Calculator" title="Estimate your shipping cost." />
          <div className="mt-7">{calculator}</div>
        </Section>
      )}

      <Section tone="light" padY="lg">
        <SectionHeading eyebrow="Rate card" title="Transparent rates on every lane." />
        <div className="mt-7">
          <PricingTable rows={rows} />
        </div>
      </Section>

      {notes && (
        <Section tone="soft" padY="md">
          {notes}
        </Section>
      )}
    </>
  );
}

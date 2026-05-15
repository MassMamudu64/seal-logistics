import type { ReactNode } from 'react';
import { Section, SectionHeading, CountryGrid, type CountryEntry } from '@seal/ui';

/**
 * CountryListPage — "Countries we ship to" canonical page.
 * Title + CountryGrid + optional CTA bar.
 */
export type CountryListPageProps = {
  title: ReactNode;
  description: ReactNode;
  countries: readonly CountryEntry[];
  /** Bottom CTA strip (e.g., "Don't see your country? Contact us"). */
  ctaSlot?: ReactNode;
};

export function CountryListPage({ title, description, countries, ctaSlot }: CountryListPageProps) {
  return (
    <>
      <Section tone="light" padY="xl">
        <SectionHeading eyebrow="Network" title={title} description={description} />
        <div className="mt-7">
          <CountryGrid countries={countries} />
        </div>
      </Section>
      {ctaSlot && (
        <Section tone="soft" padY="md">
          {ctaSlot}
        </Section>
      )}
    </>
  );
}

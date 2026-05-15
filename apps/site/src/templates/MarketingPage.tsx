import type { ReactNode } from 'react';
import { Section, SectionHeading } from '@seal/ui';

/**
 * MarketingPage — the standard marketing/content page layout.
 * Consumes only design-system components. Eyebrow + title + description
 * at top; arbitrary children below in a `wide` content container.
 *
 * Usage:
 *   <MarketingPage eyebrow="About" title="Built around trust.">
 *     <Section tone="soft">...</Section>
 *     <Section>...</Section>
 *   </MarketingPage>
 */
export type MarketingPageProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
};

export function MarketingPage({ eyebrow, title, description, children }: MarketingPageProps) {
  return (
    <>
      <Section tone="light" padY="xl">
        <SectionHeading eyebrow={eyebrow ?? ''} title={title} description={description} />
      </Section>
      {children}
    </>
  );
}

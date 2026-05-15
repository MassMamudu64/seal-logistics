import type { ReactNode } from 'react';
import { Section, SectionHeading, Card } from '@seal/ui';

/**
 * BookingFormPage — single-task layout: get the user through the quote form
 * with minimum distraction. Title + brief + form slot + trust strip.
 */
export type BookingFormPageProps = {
  title: ReactNode;
  description: ReactNode;
  /** The actual form component (client component supplied by the host). */
  formSlot: ReactNode;
  /** Reassurance bullets shown beside the form on desktop. */
  reassurances?: readonly { title: string; body: string }[];
};

export function BookingFormPage({
  title,
  description,
  formSlot,
  reassurances,
}: BookingFormPageProps) {
  return (
    <Section tone="light" padY="xl">
      <SectionHeading eyebrow="Quote" title={title} description={description} />

      <div className="mt-7 grid gap-7 lg:grid-cols-[1.6fr_1fr]">
        <div>{formSlot}</div>

        {reassurances && reassurances.length > 0 && (
          <aside className="space-y-3">
            {reassurances.map((r) => (
              <Card key={r.title} pad="md" hover="none">
                <p className="font-semibold text-neutral-900">{r.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-neutral-600">{r.body}</p>
              </Card>
            ))}
          </aside>
        )}
      </div>
    </Section>
  );
}

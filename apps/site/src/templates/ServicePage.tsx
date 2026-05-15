import type { ReactNode } from 'react';
import { Section, SectionHeading, AnimatedImage, Card, Button, ArrowRightIcon } from '@seal/ui';

/**
 * ServicePage — single-service detail layout.
 * Hero photo + headline + 3-up "what's included" + CTA.
 */
export type ServicePageProps = {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  /** Hero image path (e.g., '/hero/airplane-loading.webp'). */
  image: string;
  imageAlt: string;
  includes: readonly { title: string; body: string }[];
  primaryCta?: { href: string; label: string };
};

export function ServicePage({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  includes,
  primaryCta,
}: ServicePageProps) {
  return (
    <>
      <Section tone="light" padY="xl">
        <div className="grid items-center gap-7 lg:grid-cols-2">
          <div>
            <p className="text-primary-600 text-xs font-semibold uppercase tracking-widest">
              {eyebrow}
            </p>
            <h1 className="font-display mt-3 text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl">
              {title}
            </h1>
            <p className="mt-5 text-lg text-neutral-600">{description}</p>
            {primaryCta && (
              <div className="mt-7">
                <Button href={primaryCta.href} intent="primary" size="lg">
                  {primaryCta.label} <ArrowRightIcon size={18} />
                </Button>
              </div>
            )}
          </div>
          <AnimatedImage src={image} alt={imageAlt} aspect="4/3" priority />
        </div>
      </Section>

      <Section tone="soft" padY="lg">
        <SectionHeading eyebrow="What's included" title="Every box gets the same care." />
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {includes.map((it) => (
            <Card key={it.title} animateIn pad="lg">
              <h3 className="font-display text-xl font-semibold text-neutral-900">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{it.body}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}

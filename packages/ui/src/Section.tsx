import type { ElementType, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './cn';

const section = cva('relative w-full', {
  variants: {
    tone: {
      light: 'bg-white text-neutral-900',
      soft: 'bg-neutral-50 text-neutral-900',
      dark: 'bg-primary-950 text-white',
      ink: 'bg-gradient-to-b from-primary-950 via-primary-900 to-primary-800 text-white',
    },
    padY: {
      sm: 'py-6 sm:py-7',
      md: 'py-7 sm:py-8',
      lg: 'py-8 sm:py-9',
      xl: 'py-9 sm:py-10',
    },
    bleed: {
      // When true, the section's children manage their own horizontal padding.
      true: '',
      false: '',
    },
  },
  defaultVariants: { tone: 'light', padY: 'lg', bleed: false },
});

const inner = cva('mx-auto w-full', {
  variants: {
    width: {
      content: 'max-w-content px-4 sm:px-5 lg:px-6',
      prose: 'max-w-prose px-4 sm:px-5 lg:px-6',
      wide: 'max-w-[80rem] px-4 sm:px-5 lg:px-6',
      bleed: '',
    },
  },
  defaultVariants: { width: 'content' },
});

export type SectionProps = VariantProps<typeof section> & {
  /** HTML element. Defaults to <section>. Use <header>/<footer> when semantic. */
  as?: ElementType;
  /** Content container width. */
  width?: VariantProps<typeof inner>['width'];
  /** Skip the inner container entirely (e.g., for full-bleed photo sections). */
  noContainer?: boolean;
  id?: string;
  className?: string;
  innerClassName?: string;
  children?: ReactNode;
};

/**
 * Section — the standard page slice. Pairs a tone (background) with vertical
 * padding from the 8-pt scale and a max-width container.
 *
 * Examples:
 *   <Section tone="soft" padY="xl">{...}</Section>
 *   <Section tone="ink" width="wide">{...}</Section>
 *   <Section noContainer>{...}</Section>  // for hero / route map full bleed
 */
export function Section({
  as: Tag = 'section',
  tone,
  padY,
  width,
  noContainer,
  id,
  className,
  innerClassName,
  children,
}: SectionProps) {
  return (
    <Tag id={id} className={cn(section({ tone, padY }), className)}>
      {noContainer ? (
        children
      ) : (
        <div className={cn(inner({ width }), innerClassName)}>{children}</div>
      )}
    </Tag>
  );
}

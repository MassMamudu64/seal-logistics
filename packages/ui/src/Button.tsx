'use client';
import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type Ref } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { cn } from './cn';

const button = cva(
  // Base — focus-visible ring uses accent (cyan); min ~44px hit target on touch.
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'rounded-md font-semibold tracking-tight',
    'transition-colors duration-fast ease-out-expo',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-60',
    'select-none',
  ],
  {
    variants: {
      intent: {
        primary: 'bg-primary text-white hover:bg-primary-700 active:bg-primary-800',
        accent: 'bg-accent text-neutral-950 hover:bg-accent-600 active:bg-accent-700',
        secondary:
          'bg-white text-primary-700 ring-1 ring-inset ring-primary-200 hover:bg-primary-50',
        ghost: 'bg-transparent text-primary-700 hover:bg-primary-50',
        outline: 'border border-primary-600 text-primary-700 hover:bg-primary-50',
      },
      size: {
        // 8-pt sizing: sm = 32, md = 40, lg = 48
        sm: 'h-[32px] px-3 text-sm',
        md: 'h-[44px] px-4 text-sm',
        lg: 'h-[48px] px-5 text-base min-w-[11rem]',
      },
      full: { true: 'w-full', false: '' },
    },
    defaultVariants: { intent: 'primary', size: 'md', full: false },
  },
);

type CommonProps = VariantProps<typeof button> & {
  className?: string;
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  CommonProps & {
    /** Set false to disable the micro-interaction (used inside lists or beneath modals). */
    animate?: boolean;
    href?: never;
  };

export type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  CommonProps & {
    /** Set false to disable the micro-interaction (used inside lists or beneath modals). */
    animate?: boolean;
    href: string;
  };

/**
 * Button — primary CTA primitive. GPU-friendly micro-interaction:
 * we animate only `transform` (scale) and rely on Tailwind for color states.
 * Reduces to no-op when `prefers-reduced-motion: reduce`.
 */
export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps | ButtonLinkProps
>(function Button({ className, intent, size, full, animate = true, ...rest }, ref) {
  const reduce = useReducedMotion();
  const motionProps: HTMLMotionProps<'button'> =
    animate && !reduce
      ? {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] },
        }
      : {};

  if ('href' in rest && rest.href) {
    const anchorProps = rest as ButtonLinkProps;
    return (
      <motion.a
        ref={ref as Ref<HTMLAnchorElement>}
        className={cn(button({ intent, size, full }), className)}
        {...(motionProps as unknown as HTMLMotionProps<'a'>)}
        {...(anchorProps as unknown as HTMLMotionProps<'a'>)}
      />
    );
  }

  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <motion.button
      ref={ref as Ref<HTMLButtonElement>}
      type={buttonProps.type ?? 'button'}
      className={cn(button({ intent, size, full }), className)}
      {...motionProps}
      {...(buttonProps as unknown as HTMLMotionProps<'button'>)}
    />
  );
});

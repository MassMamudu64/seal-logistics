import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from './cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: ReactNode;
  error?: string;
  /** Visually hide the label but keep it accessible. */
  hiddenLabel?: boolean;
};

/**
 * Input — accessible text input with explicit label, hint, and error wiring.
 * - Label is always rendered (visually hidden via class when `hiddenLabel`)
 * - `aria-describedby` links hint + error so screen readers announce both
 * - `aria-invalid` toggled on error; ring switches to danger
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, hiddenLabel, id, className, required, ...rest },
  ref,
) {
  const auto = useId();
  const inputId = id ?? auto;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className={cn('text-sm font-medium text-neutral-800', hiddenLabel && 'sr-only')}
      >
        {label}
        {required && (
          <span aria-hidden="true" className="text-danger ml-0.5">
            *
          </span>
        )}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        className={cn(
          'h-11 rounded-lg border bg-white px-3 text-base text-neutral-900',
          'placeholder:text-neutral-400',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
          error
            ? 'border-danger focus-visible:ring-danger'
            : 'focus-visible:ring-brand-500 border-neutral-300',
          'disabled:cursor-not-allowed disabled:bg-neutral-50',
          className,
        )}
        {...rest}
      />
      {hint && !error && (
        <p id={hintId} className="text-xs text-neutral-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-danger text-xs font-medium">
          {error}
        </p>
      )}
    </div>
  );
});

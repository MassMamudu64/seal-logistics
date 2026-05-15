import { forwardRef, useId, type TextareaHTMLAttributes, type ReactNode } from 'react';
import { cn } from './cn';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: ReactNode;
  error?: string;
  hiddenLabel?: boolean;
};

/**
 * Textarea — accessible multiline input. Matches Input/Select API for
 * predictable form composition.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, hiddenLabel, id, className, required, rows = 4, ...rest },
  ref,
) {
  const auto = useId();
  const tid = id ?? auto;
  const hintId = hint ? `${tid}-hint` : undefined;
  const errorId = error ? `${tid}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={tid}
        className={cn('text-sm font-medium text-neutral-800', hiddenLabel && 'sr-only')}
      >
        {label}
        {required && (
          <span aria-hidden="true" className="text-danger ml-1">
            *
          </span>
        )}
      </label>
      <textarea
        ref={ref}
        id={tid}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        className={cn(
          'w-full resize-y rounded-md border bg-white px-3 py-2 text-base text-neutral-900',
          'duration-fast transition-colors placeholder:text-neutral-400',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
          error
            ? 'border-danger focus-visible:ring-danger'
            : 'focus-visible:ring-accent border-neutral-300',
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

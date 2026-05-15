import { forwardRef, useId, type SelectHTMLAttributes, type ReactNode } from 'react';
import { cn } from './cn';
import { ChevronDownIcon } from './Icon';

export type SelectOption = { value: string; label: string };

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: ReactNode;
  error?: string;
  hiddenLabel?: boolean;
  options: readonly SelectOption[];
};

/**
 * Select — accessible native <select> wrapped with the system styling.
 * Native on purpose: mobile UX is best with the OS picker; ARIA-comboboxes
 * are heavy and exclusionary on screen readers when no payoff justifies it.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, hiddenLabel, options, id, className, required, ...rest },
  ref,
) {
  const auto = useId();
  const selectId = id ?? auto;
  const hintId = hint ? `${selectId}-hint` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={selectId}
        className={cn('text-sm font-medium text-neutral-800', hiddenLabel && 'sr-only')}
      >
        {label}
        {required && (
          <span aria-hidden="true" className="text-danger ml-1">
            *
          </span>
        )}
      </label>
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          className={cn(
            'h-5 w-full appearance-none rounded-md border bg-white pl-3 pr-9 text-base text-neutral-900',
            'h-[44px]', // 44px hit target
            'duration-fast transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
            error
              ? 'border-danger focus-visible:ring-danger'
              : 'focus-visible:ring-accent border-neutral-300',
            'disabled:cursor-not-allowed disabled:bg-neutral-50',
            className,
          )}
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          size={18}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
        />
      </div>
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

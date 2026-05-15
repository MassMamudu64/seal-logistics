import { cn } from './cn';

export type Testimonial = {
  quote: string;
  authorName: string;
  authorRole?: string;
  /** Optional small portrait — falls back to a monogram avatar. */
  avatarSrc?: string;
  /** Optional rating 1–5; rendered as filled accent dots. */
  rating?: number;
};

export type TestimonialCardProps = Testimonial & {
  tone?: 'light' | 'dark';
  className?: string;
};

/**
 * TestimonialCard — social-proof block. One quote, one face, optional rating.
 * Tonal variants for use on both light and dark sections without restyling.
 */
export function TestimonialCard({
  quote,
  authorName,
  authorRole,
  avatarSrc,
  rating,
  tone = 'light',
  className,
}: TestimonialCardProps) {
  const dark = tone === 'dark';
  return (
    <figure
      className={cn(
        'duration-fast hover:shadow-medium rounded-md border p-5 transition-shadow',
        dark
          ? 'border-primary-800 bg-primary-950/60 backdrop-blur-sm'
          : 'border-neutral-200 bg-white',
        className,
      )}
    >
      {rating !== undefined && (
        <div aria-label={`${rating} out of 5`} className="mb-3 flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={cn(
                'h-1.5 w-5 rounded-full',
                i < rating
                  ? dark
                    ? 'bg-accent'
                    : 'bg-accent'
                  : dark
                    ? 'bg-primary-800'
                    : 'bg-neutral-200',
              )}
            />
          ))}
        </div>
      )}

      <blockquote
        className={cn(
          'font-display text-xl leading-snug',
          dark ? 'text-white' : 'text-neutral-900',
        )}
      >
        <span aria-hidden="true" className={dark ? 'text-accent-400' : 'text-primary-400'}>
          “
        </span>
        {quote}
        <span aria-hidden="true" className={dark ? 'text-accent-400' : 'text-primary-400'}>
          ”
        </span>
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-3">
        {avatarSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarSrc}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold',
              dark ? 'bg-primary-800 text-accent-300' : 'bg-primary-50 text-primary-700',
            )}
          >
            {authorName
              .split(' ')
              .map((p) => p[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </span>
        )}
        <div>
          <p className={cn('text-sm font-semibold', dark ? 'text-white' : 'text-neutral-900')}>
            {authorName}
          </p>
          {authorRole && (
            <p className={cn('text-xs', dark ? 'text-primary-200' : 'text-neutral-500')}>
              {authorRole}
            </p>
          )}
        </div>
      </figcaption>
    </figure>
  );
}

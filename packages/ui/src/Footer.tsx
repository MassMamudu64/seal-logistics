import type { ReactNode } from 'react';
import { Logo } from './Logo';
import { cn } from './cn';

export type FooterOffice = {
  country: string;
  address: string;
  phone: string;
};

export type FooterColumn = {
  heading: string;
  links: readonly { href: string; label: string }[];
};

export type FooterProps = {
  /** Lead-in paragraph below the logo. */
  description: string;
  /** Payment-method chips (text labels). */
  paymentMethods?: readonly string[];
  /** Three link columns. */
  columns: readonly FooterColumn[];
  /** Office contact blocks. */
  offices?: readonly FooterOffice[];
  /** Bottom legal links. */
  legalLinks?: readonly { href: string; label: string }[];
  /** Tagline shown next to copyright (e.g., "Seamless shipping. Every time."). */
  legalTagline?: ReactNode;
  /** Company display name for copyright. */
  companyName: string;
  className?: string;
};

/**
 * Footer — global site footer. Pure presentation; the host app passes in
 * content. Uses only design tokens.
 */
export function Footer({
  description,
  paymentMethods,
  columns,
  offices,
  legalLinks,
  legalTagline,
  companyName,
  className,
}: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer
      className={cn('bg-primary-950 text-primary-100 relative isolate overflow-hidden', className)}
    >
      <div
        className="via-primary-700 absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent"
        aria-hidden="true"
      />
      <div className="container-content py-8 lg:py-9">
        <div className="grid gap-7 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo tone="invert" />
            <p className="text-primary-200 mt-4 max-w-sm text-sm leading-relaxed">{description}</p>
            {paymentMethods && paymentMethods.length > 0 && (
              <div className="mt-5">
                <p className="text-primary-300 text-[10px] font-semibold uppercase tracking-widest">
                  Payment
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {paymentMethods.map((p) => (
                    <li
                      key={p}
                      className="border-primary-700 text-primary-100 rounded-sm border px-2 py-1 text-xs"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-primary-300 text-xs font-semibold uppercase tracking-wider">
                {col.heading}
              </h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="text-primary-100 duration-fast text-sm transition-colors hover:text-white"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {offices && offices.length > 0 && (
          <div className="border-primary-800 mt-7 border-t pt-5">
            <h3 className="text-primary-300 text-xs font-semibold uppercase tracking-wider">
              Offices
            </h3>
            <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {offices.map((o) => (
                <li key={o.country} className="text-sm">
                  <p className="font-semibold text-white">{o.country}</p>
                  <p className="text-primary-200 mt-0.5">{o.address}</p>
                  <p className="mt-0.5">
                    <a
                      href={`tel:${o.phone.replace(/\s+/g, '')}`}
                      className="text-primary-100 underline-offset-4 hover:text-white hover:underline"
                    >
                      {o.phone}
                    </a>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border-primary-800 text-primary-300 mt-7 flex flex-col items-start justify-between gap-2 border-t pt-4 text-xs sm:flex-row sm:items-center">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
            <span>
              © {year} {companyName}.
            </span>
            {legalTagline && <span className="text-primary-200">{legalTagline}</span>}
          </div>
          {legalLinks && legalLinks.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {legalLinks.map((l) => (
                <a key={l.href} href={l.href} className="hover:text-white">
                  {l.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

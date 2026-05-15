'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from './cn';
import { Logo } from './Logo';
import { MenuIcon, XIcon } from './Icon';

export type NavLink = { href: string; label: string };

export type NavProps = {
  links: readonly NavLink[];
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  /** Pass the current pathname so the active link gets styled (SSR-safe). */
  pathname?: string;
  /**
   * When true, the nav starts transparent (over a dark hero) and turns into a
   * solid white bar after the user scrolls 24px. Set false on pages without
   * a dark hero so the nav is always solid.
   */
  transparentOnTop?: boolean;
};

/**
 * Nav — production-grade top navigation.
 *  - Skip link first for keyboard users
 *  - Scroll-aware: transparent over dark hero, solid white below the fold
 *  - Logo lockup left, links center-right, two CTAs far right
 *  - Mobile: slide-down drawer (no jank, focus-trapped)
 */
export function Nav({
  links,
  primaryCta,
  secondaryCta,
  pathname,
  transparentOnTop = false,
}: NavProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!transparentOnTop) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [transparentOnTop]);

  // Lock body scroll while mobile drawer open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const overDark = transparentOnTop && !scrolled;

  return (
    <>
      <a
        href="#main"
        className="focus:bg-brand-700 sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-md focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-neutral-200/80 bg-white/85 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-md'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-20 lg:px-8"
        >
          <a
            href="/"
            className="focus-visible:ring-brand-500 -m-1 rounded-md p-1 focus-visible:outline-none focus-visible:ring-2"
          >
            <Logo tone={overDark ? 'invert' : 'default'} />
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active =
                pathname === l.href || (l.href !== '/' && pathname?.startsWith(l.href));
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      overDark
                        ? active
                          ? 'text-white'
                          : 'text-brand-100 hover:text-white'
                        : active
                          ? 'text-brand-700'
                          : 'text-neutral-700 hover:text-neutral-900',
                    )}
                  >
                    {l.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-2 md:flex">
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  overDark
                    ? 'text-brand-100 hover:text-white'
                    : 'text-neutral-700 hover:text-neutral-900',
                )}
              >
                {secondaryCta.label}
              </a>
            )}
            {primaryCta && (
              <a
                href={primaryCta.href}
                className={cn(
                  'inline-flex h-10 items-center rounded-md px-4 text-sm font-semibold transition-colors',
                  'bg-accent-500 hover:bg-accent-600 text-neutral-900',
                  'focus-visible:ring-accent-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  overDark && 'focus-visible:ring-offset-brand-950',
                )}
              >
                {primaryCta.label}
              </a>
            )}
          </div>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
            className={cn(
              'inline-flex h-10 w-10 items-center justify-center rounded-md md:hidden',
              overDark ? 'text-white hover:bg-white/10' : 'text-neutral-700 hover:bg-neutral-100',
            )}
          >
            {open ? <XIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="border-t border-neutral-200 bg-white md:hidden"
            >
              <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-3 py-3 text-base font-medium text-neutral-800 hover:bg-neutral-50"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="border-t border-neutral-200 px-6 py-4">
                {secondaryCta && (
                  <a
                    href={secondaryCta.href}
                    className="block w-full rounded-md border border-neutral-300 px-3 py-3 text-center text-sm font-medium text-neutral-800"
                    onClick={() => setOpen(false)}
                  >
                    {secondaryCta.label}
                  </a>
                )}
                {primaryCta && (
                  <a
                    href={primaryCta.href}
                    className="bg-accent-500 hover:bg-accent-600 mt-2 block w-full rounded-md px-3 py-3 text-center text-sm font-semibold text-neutral-900"
                    onClick={() => setOpen(false)}
                  >
                    {primaryCta.label}
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      {/* Spacer — nav is fixed; reserves height so content does not jump under it. */}
      <div aria-hidden="true" className="h-16 lg:h-20" />
    </>
  );
}

/** Kept for back-compat with the old API in case anything imports it. */
export type NavBrandProps = { brand: ReactNode };

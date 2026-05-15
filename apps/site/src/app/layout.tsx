import './globals.css';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Nav, Footer } from '@seal/ui';
import Script from 'next/script';
import { SITE } from '@/lib/site';
import { organizationJsonLd } from '@/lib/seo';
import { CookieConsent } from '@/components/CookieConsent';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s · ${SITE.shortName}` },
  description: SITE.description,
  applicationName: SITE.shortName,
  authors: [{ name: SITE.shortName }],
  manifest: '/site.webmanifest',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0f2c',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

const NAV_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/trade-lanes', label: 'Trade lanes' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/calculator', label: 'Calculator' },
  { href: '/about', label: 'About' },
] as const;

const FOOTER_COLUMNS = [
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/process', label: 'Shipping process' },
      { href: '/services', label: 'Services' },
      { href: '/blog', label: 'Blog' },
    ],
  },
  {
    heading: 'Ship',
    links: [
      { href: '/quote', label: 'Get a quote' },
      { href: '/calculator', label: 'Calculator' },
      { href: '/schedule', label: 'Weekly schedule' },
      { href: '/trade-lanes', label: 'Trade lanes' },
      { href: '/countries', label: 'Countries' },
      { href: '/portal', label: 'Track shipment' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { href: '/resources', label: 'Customer resources' },
      { href: '/contact', label: 'Contact' },
      { href: '/blog/rss.xml', label: 'RSS' },
      { href: '/sitemap.xml', label: 'Sitemap' },
    ],
  },
] as const;

const FOOTER_LEGAL = [{ href: '/legal/privacy', label: 'Privacy' }] as const;

const FOOTER_OFFICES = SITE.offices.map((o) => ({
  country: o.country,
  address: o.address,
  phone: o.phone,
}));

export default function RootLayout({ children }: { children: ReactNode }) {
  const requestHeaders = headers();
  const pathname = requestHeaders.get('x-pathname') ?? '/';
  const nonce = requestHeaders.get('x-nonce') ?? undefined;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const isHome = pathname === '/';

  return (
    <html lang="en">
      <body className="bg-white text-neutral-900 antialiased">
        <Nav
          links={NAV_LINKS}
          pathname={pathname}
          transparentOnTop={isHome}
          secondaryCta={{ href: '/portal', label: 'Track shipment' }}
          primaryCta={{ href: '/quote', label: 'Get a quote' }}
        />
        <main id="main">{children}</main>
        <Footer
          description="Professional air cargo and doorstep delivery connecting the USA, West Africa, and Southern Africa. Weekly departures. Documented chain of custody. Transparent rates."
          paymentMethods={['Zenith Bank', 'GTB Liberia', 'Cash App', 'Zelle']}
          columns={FOOTER_COLUMNS}
          offices={FOOTER_OFFICES}
          legalLinks={FOOTER_LEGAL}
          legalTagline={SITE.tagline}
          companyName={SITE.name}
        />
        <CookieConsent />
        <script
          nonce={nonce}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        {gaId && (
          <>
            <Script
              nonce={nonce}
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script
              nonce={nonce}
              id="ga-config"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied'});gtag('js',new Date());gtag('config','${gaId}',{send_page_view:false});`,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { SITE } from './site';

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
};

export function pageMeta({ title, description, path, ogImage }: PageMetaInput): Metadata {
  const url = `${SITE.url}${path}`;
  const image = ogImage ?? `${SITE.url}/og/default.png`;
  const fullTitle = title === SITE.name ? title : `${title} · ${SITE.shortName}`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: fullTitle,
      description,
      siteName: SITE.name,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

/** Organization JSON-LD — emit once in the root layout. */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/logo.svg`,
    sameAs: Object.values(SITE.social),
    contactPoint: SITE.offices.map((o) => ({
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: o.phone,
      areaServed: o.countryCode,
      availableLanguage: ['en'],
    })),
  };
}

/** Service JSON-LD — emit on each trade-lane page. */
export function serviceJsonLd(params: { from: string; to: string; rate: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'International Air Cargo',
    provider: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    areaServed: [params.from, params.to],
    name: `Air cargo: ${params.from} → ${params.to}`,
    url: params.url,
    offers: { '@type': 'Offer', priceCurrency: 'USD', price: params.rate },
  };
}

/** BreadcrumbList helper. */
export function breadcrumbsJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

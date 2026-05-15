/**
 * Site-wide config — single source of truth for company facts that appear
 * in JSON-LD, footer, contact pages, and meta tags. Sourced from the brief.
 */

export const SITE = {
  name: 'Seal Logistics & Cargo Services',
  shortName: 'Seal Logistics',
  tagline: 'Seamless Shipping. Every Time.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://seallogistics.com',
  description:
    'Fast, secure international air cargo, doorstep delivery, and e-commerce logistics across the USA, Nigeria, Liberia, Ghana, Togo, South Africa, Guinea Conakry, and Gambia.',
  email: 'ops@seallogistics.com',
  social: {
    // Add real handles before launch
    instagram: 'https://instagram.com/seallogistics',
  },
  offices: [
    {
      country: 'USA',
      countryCode: 'US',
      address: '3300 County Rd 10 Ste 206, Brooklyn Center, MN 55429',
      phone: '+1 952 607 0580',
    },
    {
      country: 'Nigeria',
      countryCode: 'NG',
      address: 'Shop i005 Ogba Multipurpose Shopping Complex, Off Wemco Road, Beside Sunday Market',
      phone: '+234 803 716 0560',
    },
    {
      country: 'Ghana',
      countryCode: 'GH',
      address: 'GM 1116544 Panteng West, Accra',
      phone: '+233 535 083 305',
    },
    {
      country: 'Liberia',
      countryCode: 'LR',
      address: 'Behind Duncan Gas Station, Catholic Junction, Congo Town, Monrovia',
      phone: '+231 886 578 583',
    },
  ],
} as const;

export type Office = (typeof SITE.offices)[number];

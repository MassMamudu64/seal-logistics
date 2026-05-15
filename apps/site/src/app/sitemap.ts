import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { LANES } from '@/lib/pricing';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/services',
    '/trade-lanes',
    '/schedule',
    '/countries',
    '/calculator',
    '/about',
    '/process',
    '/resources',
    '/contact',
    '/quote',
    '/blog',
  ].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: p === '' ? 1 : 0.7,
  }));

  const lanes: MetadataRoute.Sitemap = LANES.map((l) => ({
    url: `${base}/trade-lanes/${l.from.toLowerCase()}-to-${l.to.toLowerCase()}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...lanes];
}

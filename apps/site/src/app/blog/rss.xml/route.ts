import { listPosts } from '@/lib/blog';
import { SITE } from '@/lib/site';

export const revalidate = 3600; // 1 hour

export function GET() {
  const posts = listPosts();
  const items = posts
    .map(
      (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE.url}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE.url}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
    </item>`,
    )
    .join('');

  const body = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE.name)} — Blog</title>
    <link>${SITE.url}/blog</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>en-US</language>
    ${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

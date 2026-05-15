/**
 * Minimal in-repo blog. Replace with MDX/CMS post-launch.
 * Keeping posts in-code for v1 avoids paid SaaS and stays inside the budget.
 */
export type Post = {
  slug: string;
  title: string;
  date: string; // ISO
  excerpt: string;
  body: string;
};

const posts: readonly Post[] = [
  {
    slug: 'packing-electronics',
    title: 'How to pack electronics for international air cargo',
    date: '2026-02-04',
    excerpt:
      'A short checklist that has saved hundreds of phones, laptops, and tablets from in-transit damage.',
    body: `Use original boxes whenever possible. Bubble wrap displays, fill voids with paper, and tape every seam.
Remove batteries from loose accessories where airline rules allow. Label fragile in red on three sides.`,
  },
  {
    slug: 'customs-nigeria',
    title: 'What customs requires when receiving cargo in Nigeria',
    date: '2026-02-18',
    excerpt:
      'A plain-language guide to clearing your shipment at Lagos and what documentation to prepare.',
    body: `Have a valid ID, the tracking ID we send, and a phone reachable on arrival day. Electronics may attract
duty depending on declared value. We handle the paperwork — you provide the recipient ID.`,
  },
  {
    slug: 'lb-vs-kg',
    title: 'Why some lanes price in lb and others in kg',
    date: '2026-03-02',
    excerpt: "A quick explainer on Seal's pricing units across our trade lanes.",
    body: `US-origin shipments are priced per pound because US shippers measure in pounds. NG-origin shipments
are priced per kilogram because Nigerian shippers measure in kilograms. We do not convert silently — the
quote always shows the unit so there are no surprises.`,
  },
];

export function listPosts(): readonly Post[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

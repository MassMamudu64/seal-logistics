import type { Metadata } from 'next';
import {
  ArrowRightIcon,
  Button,
  Card,
  PackageIcon,
  SectionHeading,
  ShieldCheckIcon,
  TruckIcon,
} from '@seal/ui';
import { pageMeta } from '@/lib/seo';
import { listPosts } from '@/lib/blog';

export const metadata: Metadata = pageMeta({
  title: 'Resources',
  description: 'Shipping guides, packaging tips, and customs information from Seal Logistics.',
  path: '/resources',
});

const CHECKLISTS = [
  {
    icon: PackageIcon,
    title: 'Before drop-off',
    items: [
      'Receiver name and phone',
      'Destination office or doorstep address',
      'Declared item list',
    ],
  },
  {
    icon: ShieldCheckIcon,
    title: 'For electronics',
    items: [
      'Original box if available',
      'Wrapped screen and corners',
      'Clear new or used condition',
    ],
  },
  {
    icon: TruckIcon,
    title: 'For pickup',
    items: ['Packed before driver arrival', 'Accessible loading area', 'Sender photo ID ready'],
  },
] as const;

export default function Resources() {
  const posts = listPosts();

  return (
    <>
      <section className="from-brand-50 bg-gradient-to-b via-white to-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Resources"
            title="Ship prepared, not surprised."
            description="Practical guides for packaging, documentation, customs expectations, and the small details that keep cargo moving."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/quote" intent="primary" size="lg">
              Start a quote <ArrowRightIcon size={18} />
            </Button>
            <Button href="/contact" intent="outline" size="lg">
              Ask an office
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {CHECKLISTS.map((group) => (
              <Card key={group.title} pad="lg" className="h-full">
                <div className="bg-brand-50 text-brand-700 inline-flex h-11 w-11 items-center justify-center rounded-md">
                  <group.icon size={22} />
                </div>
                <h2 className="font-display mt-5 text-xl font-semibold text-neutral-900">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span
                        aria-hidden="true"
                        className="bg-accent-500 mt-1.5 h-1.5 w-1.5 rounded-full"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          <div className="mt-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Guides"
              title="Customer guides and lane notes."
              description="Short references your sender and receiver can read before cargo reaches the counter."
            />
            <a
              href="/blog/rss.xml"
              className="text-brand-700 hover:text-brand-800 text-sm font-semibold"
            >
              RSS feed <ArrowRightIcon size={14} />
            </a>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="rounded-md border border-neutral-200 bg-white p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <h2 className="font-display mt-3 text-xl font-semibold text-neutral-900">
                  <a href={`/blog/${post.slug}`} className="hover:text-brand-700">
                    {post.title}
                  </a>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">{post.excerpt}</p>
                <a
                  href={`/blog/${post.slug}`}
                  className="text-brand-700 hover:text-brand-800 mt-5 inline-flex items-center gap-1 text-sm font-semibold"
                >
                  Read guide <ArrowRightIcon size={14} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

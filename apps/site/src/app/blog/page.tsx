import type { Metadata } from 'next';
import { ArrowRightIcon, SectionHeading } from '@seal/ui';
import { pageMeta } from '@/lib/seo';
import { listPosts } from '@/lib/blog';

export const metadata: Metadata = pageMeta({
  title: 'Blog',
  description: 'Shipping tips, lane updates, and company news from Seal Logistics.',
  path: '/blog',
});

export default function BlogIndex() {
  const posts = listPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <section className="from-brand-50 bg-gradient-to-b via-white to-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Blog"
            title="Shipping guides from the operations desk."
            description="Packaging advice, customs notes, pricing explainers, and lane updates written for customers who want fewer surprises."
          />
        </div>
      </section>

      <section className="bg-white pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {featured && (
            <article className="grid gap-8 rounded-md border border-neutral-200 bg-neutral-50 p-6 md:grid-cols-[0.9fr_1.1fr] md:p-8">
              <div className="bg-brand-950 flex min-h-44 flex-col justify-between rounded-md p-6 text-white">
                <p className="text-brand-200 text-xs font-semibold uppercase tracking-widest">
                  Featured guide
                </p>
                <p className="font-display text-accent-400 text-5xl font-semibold">
                  {new Date(featured.date).toLocaleDateString('en-US', { month: 'short' })}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {new Date(featured.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-neutral-900">
                  <a href={`/blog/${featured.slug}`} className="hover:text-brand-700">
                    {featured.title}
                  </a>
                </h2>
                <p className="mt-4 max-w-2xl text-neutral-600">{featured.excerpt}</p>
                <a
                  href={`/blog/${featured.slug}`}
                  className="text-brand-700 hover:text-brand-800 mt-6 inline-flex items-center gap-1 text-sm font-semibold"
                >
                  Read guide <ArrowRightIcon size={14} />
                </a>
              </div>
            </article>
          )}

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {rest.map((post) => (
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
                <h2 className="font-display mt-3 text-2xl font-semibold text-neutral-900">
                  <a href={`/blog/${post.slug}`} className="hover:text-brand-700">
                    {post.title}
                  </a>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">{post.excerpt}</p>
              </article>
            ))}
          </div>

          <p className="mt-10 text-sm text-neutral-500">
            Subscribe via the{' '}
            <a href="/blog/rss.xml" className="text-brand-700 font-medium underline">
              RSS feed
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}

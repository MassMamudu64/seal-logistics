import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowRightIcon, Button } from '@seal/ui';
import { getPost, listPosts } from '@/lib/blog';
import { pageMeta } from '@/lib/seo';

export function generateStaticParams() {
  return listPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getPost(params.slug);
  if (!post) return {};
  return pageMeta({ title: post.title, description: post.excerpt, path: `/blog/${post.slug}` });
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();
  const paragraphs = post.body.split(/\n+/).filter(Boolean);

  return (
    <>
      <article className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <a href="/blog" className="text-brand-700 hover:text-brand-800 text-sm font-semibold">
          Back to blog
        </a>
        <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          {new Date(post.date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-5 text-xl leading-relaxed text-neutral-600">{post.excerpt}</p>

        <div className="prose prose-neutral mt-10">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>

      <section className="bg-neutral-50 py-16">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <p className="font-display text-2xl font-semibold text-neutral-900">
              Ready to price your shipment?
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              Turn this guide into a lane-specific quote in under a minute.
            </p>
          </div>
          <Button href="/quote" intent="primary">
            Get a quote <ArrowRightIcon size={16} />
          </Button>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Privacy notice',
  description: 'How Seal Logistics collects, uses, and protects your personal data.',
  path: '/legal/privacy',
});

export default function PrivacyPage() {
  return (
    <div className="prose prose-neutral mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <h1>Privacy notice</h1>
      <p>Last updated: 2026-05-14.</p>
      <h2>What we collect</h2>
      <ul>
        <li>Quote submissions: name, email, phone, route, shipment description, hashed IP.</li>
        <li>Analytics (only after consent): page views, referrer, anonymized IP.</li>
      </ul>
      <h2>How we use it</h2>
      <p>
        We respond to your quote, ship your cargo, and improve the site. We do not sell your data.
      </p>
      <h2>Retention</h2>
      <p>Lead records: 24 months. Shipment records: 7 years (legal/customs requirement).</p>
      <h2>Your rights</h2>
      <p>
        Email <a href="mailto:privacy@seallogistics.com">privacy@seallogistics.com</a> to request
        access or deletion.
      </p>
    </div>
  );
}

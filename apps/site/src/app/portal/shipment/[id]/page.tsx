import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { isValidTrackingId } from '@/lib/tracking';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Shipment status',
  robots: { index: false, follow: false }, // Don't index user-specific URLs
};

type Shipment = {
  tracking_id: string;
  status: 'received' | 'in_transit' | 'arrived' | 'delivered';
  lane_from: string;
  lane_to: string;
  weight: { value: number; unit: string };
  eta: string;
  events: { at: string; label: string; location: string }[];
};

const STATUS_LABEL: Record<Shipment['status'], string> = {
  received: 'Received',
  in_transit: 'In transit',
  arrived: 'Arrived at destination',
  delivered: 'Delivered',
};

const STATUS_INDEX: Record<Shipment['status'], number> = {
  received: 0,
  in_transit: 1,
  arrived: 2,
  delivered: 3,
};

export default async function ShipmentPage({ params }: { params: { id: string } }) {
  if (!isValidTrackingId(params.id)) notFound();

  const requestHeaders = headers();
  const host = requestHeaders.get('host');
  const protocol = requestHeaders.get('x-forwarded-proto') ?? 'http';
  const origin = host ? `${protocol}://${host}` : 'http://localhost:3000';

  const res = await fetch(`${origin}/api/track/${params.id}`, { cache: 'no-store' });
  if (!res.ok) notFound();
  const json = (await res.json()) as { ok: true; shipment: Shipment } | { ok: false };
  if (!json.ok) notFound();
  const s = json.shipment;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <p className="text-brand-600 text-sm font-medium uppercase tracking-widest">Shipment</p>
      <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
        {s.tracking_id}
      </h1>
      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Status" value={STATUS_LABEL[s.status]} />
        <Stat label="Route" value={`${s.lane_from} → ${s.lane_to}`} />
        <Stat label="ETA" value={new Date(s.eta).toLocaleDateString()} />
      </dl>

      <ProgressBar status={s.status} />

      <h2 className="font-display mt-12 text-2xl font-semibold">Timeline</h2>
      <ol className="mt-4 space-y-4 border-l-2 border-neutral-200 pl-6">
        {s.events.map((e, i) => (
          <li key={i} className="relative">
            <span
              aria-hidden="true"
              className="bg-brand-600 absolute -left-[33px] top-1.5 h-3 w-3 rounded-full ring-4 ring-white"
            />
            <p className="text-sm text-neutral-500">{new Date(e.at).toLocaleString()}</p>
            <p className="font-medium text-neutral-900">{e.label}</p>
            <p className="text-sm text-neutral-600">{e.location}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <dt className="text-xs font-medium uppercase tracking-wider text-neutral-500">{label}</dt>
      <dd className="font-display mt-1 text-xl font-semibold">{value}</dd>
    </div>
  );
}

function ProgressBar({ status }: { status: Shipment['status'] }) {
  const idx = STATUS_INDEX[status];
  const steps = ['received', 'in_transit', 'arrived', 'delivered'] as const;
  return (
    <ol className="mt-8 grid grid-cols-4 gap-2" aria-label="Shipment progress">
      {steps.map((s, i) => (
        <li key={s} className="flex flex-col gap-2">
          <div
            className={`h-2 rounded-full ${i <= idx ? 'bg-brand-600' : 'bg-neutral-200'}`}
            aria-current={i === idx ? 'step' : undefined}
          />
          <span className="text-xs font-medium text-neutral-700">{STATUS_LABEL[s]}</span>
        </li>
      ))}
    </ol>
  );
}

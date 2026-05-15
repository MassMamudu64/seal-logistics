'use client';
import { useMemo, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Button, Card } from '@seal/ui';
import {
  COUNTRIES,
  ELECTRONICS,
  LANES,
  quote,
  type CountryCode,
  type ElectronicSku,
} from '@/lib/pricing';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};
const ease = [0.16, 1, 0.3, 1] as const;

const NAMES: Record<CountryCode, string> = {
  US: 'USA',
  NG: 'Nigeria',
  LR: 'Liberia',
  GH: 'Ghana',
  TG: 'Togo',
  ZA: 'South Africa',
  GN: 'Guinea Conakry',
  GM: 'Gambia',
};

const ELECTRONIC_LABELS: Record<ElectronicSku, string> = {
  iphone_new: 'iPhone (new)',
  iphone_used: 'iPhone (used)',
  phone_new: 'Other phone (new)',
  phone_used: 'Other phone (used)',
  ipad_new: 'iPad (new)',
  ipad_used: 'iPad (used)',
  tablet_new: 'Tablet (new)',
  tablet_used: 'Tablet (used)',
  mac_new: 'Mac laptop (new)',
  mac_used: 'Mac laptop (used)',
  laptop_new: 'Other laptop (new)',
  laptop_used: 'Other laptop (used)',
  apple_watch_new: 'Apple Watch (new)',
  apple_watch_used: 'Apple Watch (used)',
  airpods_new: 'AirPods (new)',
  airpods_used: 'AirPods (used)',
};

/**
 * PricingCalculator — interactive UI on top of `lib/pricing.ts`.
 * - Quote computed client-side, in real time
 * - No API call until the user clicks "Send me this quote"
 * - All errors surface inline; calculator never silently hides bad input
 */
export function PricingCalculator() {
  const reduce = useReducedMotion();
  const [from, setFrom] = useState<CountryCode>('US');
  const [to, setTo] = useState<CountryCode>('NG');
  const [weight, setWeight] = useState<string>('');
  const [electronics, setElectronics] = useState<Partial<Record<ElectronicSku, number>>>({});

  const result = useMemo(() => {
    const weightNum = weight === '' ? undefined : Number(weight);
    try {
      return {
        ok: true as const,
        quote: quote({
          from,
          to,
          ...(weightNum !== undefined && Number.isFinite(weightNum) && { weight: weightNum }),
          electronics,
        }),
      };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [from, to, weight, electronics]);

  function setSku(sku: ElectronicSku, qty: number) {
    setElectronics((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[sku];
      else next[sku] = qty;
      return next;
    });
  }

  const total = result.ok ? result.quote.total : null;

  return (
    <motion.div
      initial={reduce ? 'visible' : 'hidden'}
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
      }}
      className="grid gap-8 lg:grid-cols-[1fr_22rem]"
    >
      {/* Inputs */}
      <motion.div variants={fadeUp} transition={{ duration: 0.32, ease }}>
        <Card pad="lg" className="shadow-soft space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="From" value={from} onChange={setFrom} />
            <SelectField label="To" value={to} onChange={setTo} />
          </div>

          <div>
            <label htmlFor="weight" className="text-sm font-medium text-neutral-800">
              Weight (lane unit)
            </label>
            <input
              id="weight"
              type="number"
              inputMode="decimal"
              step="0.1"
              min={0}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 20"
              className="duration-fast focus-visible:ring-brand-500 mt-1.5 h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 text-base transition-shadow focus:outline-none focus-visible:ring-2"
            />
            <p className="mt-1 text-xs text-neutral-500">
              Leave blank if you are only shipping electronics.
            </p>
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-neutral-800">
              Electronics (flat per-item rates)
            </legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {(Object.keys(ELECTRONICS) as ElectronicSku[]).map((sku) => {
                const selected = (electronics[sku] ?? 0) > 0;
                return (
                  <div
                    key={sku}
                    className={
                      'duration-fast flex items-center justify-between gap-2 rounded-lg border px-3 py-2 transition-colors ' +
                      (selected
                        ? 'border-brand-300 bg-brand-50/60'
                        : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/60')
                    }
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-neutral-800">
                        {ELECTRONIC_LABELS[sku]}
                      </p>
                      <p className="text-xs text-neutral-500">${ELECTRONICS[sku]} / item</p>
                    </div>
                    <QtyStepper value={electronics[sku] ?? 0} onChange={(v) => setSku(sku, v)} />
                  </div>
                );
              })}
            </div>
          </fieldset>
        </Card>
      </motion.div>

      {/* Summary */}
      <motion.div variants={fadeUp} transition={{ duration: 0.32, ease, delay: 0.05 }}>
        <Card
          tone="ink"
          pad="lg"
          hover="none"
          className="shadow-glow sticky top-24 self-start ring-1 ring-white/5"
        >
          <p className="text-brand-200 text-xs font-medium uppercase tracking-[0.22em]">
            Estimated total
          </p>
          {result.ok && total !== null ? (
            <>
              <AnimatePresence mode="popLayout">
                <motion.p
                  key={total}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.24, ease }}
                  className="font-display mt-3 text-5xl font-semibold tabular-nums tracking-tight"
                >
                  ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </motion.p>
              </AnimatePresence>
              <ul className="text-brand-100 mt-6 space-y-2 text-sm">
                {result.quote.weight.chargeable > 0 && (
                  <Line
                    label={`Weight: ${result.quote.weight.chargeable}${result.quote.weight.unit} × $${result.quote.lane.rate}`}
                    value={result.quote.weight.cost}
                  />
                )}
                {result.quote.electronics.map((e) => (
                  <Line
                    key={e.sku}
                    label={`${ELECTRONIC_LABELS[e.sku]} × ${e.qty}`}
                    value={e.subtotal}
                  />
                ))}
                {result.quote.serviceFee > 0 && (
                  <Line label="Service fee" value={result.quote.serviceFee} />
                )}
              </ul>
              <p className="text-brand-200 mt-6 text-xs">
                Transit time: {result.quote.lane.transitDays}. Quote is an estimate; final invoice
                confirmed at intake.
              </p>
              <Button
                href={buildQuoteHref(from, to)}
                intent="accent"
                size="lg"
                full
                className="mt-6"
              >
                Send me this quote
              </Button>
            </>
          ) : (
            <div className="text-brand-100 mt-4 rounded-lg bg-white/5 p-4 text-sm">
              {'error' in result ? result.error : ''}
            </div>
          )}

          <LaneList />
        </Card>
      </motion.div>
    </motion.div>
  );
}

function SelectField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: CountryCode;
  onChange: (v: CountryCode) => void;
}) {
  return (
    <div>
      <label htmlFor={label} className="text-sm font-medium text-neutral-800">
        {label}
      </label>
      <select
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value as CountryCode)}
        className="focus-visible:ring-brand-500 mt-1.5 h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 text-base focus:outline-none focus-visible:ring-2"
      >
        {COUNTRIES.map((c) => (
          <option key={c} value={c}>
            {NAMES[c]}
          </option>
        ))}
      </select>
    </div>
  );
}

function QtyStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value === 0}
        aria-label="Decrease"
        className="h-7 w-7 rounded-md border border-neutral-300 text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
      >
        –
      </button>
      <span className="w-6 text-center text-sm font-medium tabular-nums">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label="Increase"
        className="h-7 w-7 rounded-md border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
      >
        +
      </button>
    </div>
  );
}

function Line({ label, value }: { label: string; value: number }) {
  return (
    <li className="flex items-baseline justify-between gap-3">
      <span className="text-brand-100">{label}</span>
      <span className="font-mono text-white">
        ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </span>
    </li>
  );
}

function LaneList() {
  return (
    <details className="mt-8 text-sm">
      <summary className="text-brand-200 cursor-pointer hover:text-white">
        See all lane rates
      </summary>
      <ul className="text-brand-100 mt-3 space-y-1 text-xs">
        {LANES.map((l) => (
          <li key={`${l.from}-${l.to}`}>
            {NAMES[l.from]} → {NAMES[l.to]}: ${l.rate}/{l.unit}
            {l.serviceFee > 0 ? ` (+$${l.serviceFee} fee)` : ''}
          </li>
        ))}
      </ul>
    </details>
  );
}

function buildQuoteHref(from: CountryCode, to: CountryCode): string {
  return `/quote?from=${from}&to=${to}`;
}

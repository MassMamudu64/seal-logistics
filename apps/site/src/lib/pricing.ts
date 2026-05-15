/**
 * Pricing engine — derived directly from the rate sheet in the brief.
 * Pure functions; covered by unit tests. UI calls `quote(...)` only.
 *
 * Two pricing modes:
 *   1. Per-weight (default for general cargo)
 *   2. Per-item (electronics — phones, laptops, tablets, watches, earbuds)
 *
 * All currency in USD. Service fee logic: $30 on every invoice EXCEPT
 * the USA → Nigeria lane (per brief).
 */

export const COUNTRIES = ['US', 'NG', 'LR', 'GH', 'TG', 'ZA', 'GN', 'GM'] as const;
export type CountryCode = (typeof COUNTRIES)[number];

export type WeightUnit = 'lb' | 'kg';

export type Lane = {
  from: CountryCode;
  to: CountryCode;
  rate: number;
  unit: WeightUnit;
  /** Minimum chargeable weight (in `unit`). */
  minWeight: number;
  /** Service fee applied to every invoice for this lane (USD). */
  serviceFee: number;
  /** Typical transit time. */
  transitDays: string;
};

/**
 * Lane rate card. Keep ordered: from → to.
 * NOTE: USA outbound is $/lb. Nigeria outbound is $/kg.
 *       Liberia → USA is $/lb. Adjust here, not in components.
 */
export const LANES: readonly Lane[] = [
  // Outbound from USA
  {
    from: 'US',
    to: 'NG',
    rate: 6.5,
    unit: 'lb',
    minWeight: 10,
    serviceFee: 0,
    transitDays: '7–10 days',
  },
  {
    from: 'US',
    to: 'LR',
    rate: 11.57,
    unit: 'lb',
    minWeight: 10,
    serviceFee: 30,
    transitDays: '10–14 days',
  },
  {
    from: 'US',
    to: 'GH',
    rate: 11.57,
    unit: 'lb',
    minWeight: 10,
    serviceFee: 30,
    transitDays: '10–14 days',
  },
  {
    from: 'US',
    to: 'TG',
    rate: 8.6,
    unit: 'lb',
    minWeight: 10,
    serviceFee: 30,
    transitDays: '10–14 days',
  },
  {
    from: 'US',
    to: 'GN',
    rate: 7.5,
    unit: 'lb',
    minWeight: 10,
    serviceFee: 30,
    transitDays: '10–14 days',
  },
  {
    from: 'US',
    to: 'GM',
    rate: 9.6,
    unit: 'lb',
    minWeight: 10,
    serviceFee: 30,
    transitDays: '10–14 days',
  },
  {
    from: 'US',
    to: 'ZA',
    rate: 11.57,
    unit: 'lb',
    minWeight: 10,
    serviceFee: 30,
    transitDays: '10–14 days',
  },
  // Outbound from Nigeria
  {
    from: 'NG',
    to: 'US',
    rate: 12.75,
    unit: 'kg',
    minWeight: 5,
    serviceFee: 30,
    transitDays: '7–12 days',
  },
  {
    from: 'NG',
    to: 'LR',
    rate: 10.0,
    unit: 'kg',
    minWeight: 10,
    serviceFee: 30,
    transitDays: '3–5 days',
  },
  {
    from: 'NG',
    to: 'GH',
    rate: 10.0,
    unit: 'kg',
    minWeight: 10,
    serviceFee: 30,
    transitDays: '3–7 days',
  },
  {
    from: 'NG',
    to: 'TG',
    rate: 10.0,
    unit: 'kg',
    minWeight: 10,
    serviceFee: 30,
    transitDays: '3–7 days',
  },
  // Outbound from Liberia
  {
    from: 'LR',
    to: 'US',
    rate: 25.0,
    unit: 'lb',
    minWeight: 10,
    serviceFee: 30,
    transitDays: '10–14 days',
  },
] as const;

/** Electronics flat-rate price list (USD per item). */
export const ELECTRONICS = {
  iphone_new: 85,
  iphone_used: 55,
  phone_new: 75,
  phone_used: 50,
  ipad_new: 85,
  ipad_used: 50,
  tablet_new: 75,
  tablet_used: 45,
  mac_new: 105,
  mac_used: 85,
  laptop_new: 85,
  laptop_used: 70,
  apple_watch_new: 50,
  apple_watch_used: 35,
  airpods_new: 50,
  airpods_used: 35,
} as const;

export type ElectronicSku = keyof typeof ELECTRONICS;

export type QuoteInput = {
  from: CountryCode;
  to: CountryCode;
  weight?: number;
  electronics?: Partial<Record<ElectronicSku, number>>;
};

export type QuoteBreakdown = {
  lane: Lane;
  weight: { input: number; chargeable: number; unit: WeightUnit; cost: number };
  electronics: { sku: ElectronicSku; qty: number; unitPrice: number; subtotal: number }[];
  serviceFee: number;
  total: number;
};

export class QuoteError extends Error {
  constructor(
    public code: 'LANE_UNAVAILABLE' | 'EMPTY_SHIPMENT' | 'INVALID_WEIGHT',
    message: string,
  ) {
    super(message);
    this.name = 'QuoteError';
  }
}

export function findLane(from: CountryCode, to: CountryCode): Lane | undefined {
  return LANES.find((l) => l.from === from && l.to === to);
}

/**
 * Compute a price quote. Throws QuoteError for invalid inputs so callers
 * (route handler + form) can map to user-facing messages.
 */
export function quote(input: QuoteInput): QuoteBreakdown {
  const lane = findLane(input.from, input.to);
  if (!lane) {
    throw new QuoteError(
      'LANE_UNAVAILABLE',
      `We do not currently service ${input.from} → ${input.to}.`,
    );
  }

  const weightInput = input.weight ?? 0;
  if (weightInput < 0 || !Number.isFinite(weightInput)) {
    throw new QuoteError('INVALID_WEIGHT', 'Weight must be a non-negative number.');
  }

  const electronics: QuoteBreakdown['electronics'] = [];
  for (const [sku, qty] of Object.entries(input.electronics ?? {})) {
    if (!qty || qty <= 0) continue;
    const unitPrice = ELECTRONICS[sku as ElectronicSku];
    electronics.push({
      sku: sku as ElectronicSku,
      qty,
      unitPrice,
      subtotal: unitPrice * qty,
    });
  }

  const hasWeight = weightInput > 0;
  const hasElectronics = electronics.length > 0;
  if (!hasWeight && !hasElectronics) {
    throw new QuoteError('EMPTY_SHIPMENT', 'Add at least one item or shipment weight.');
  }

  const chargeable = hasWeight ? Math.max(weightInput, lane.minWeight) : 0;
  const weightCost = round2(chargeable * lane.rate);
  const electronicsTotal = electronics.reduce((sum, e) => sum + e.subtotal, 0);
  const total = round2(weightCost + electronicsTotal + lane.serviceFee);

  return {
    lane,
    weight: { input: weightInput, chargeable, unit: lane.unit, cost: weightCost },
    electronics,
    serviceFee: lane.serviceFee,
    total,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

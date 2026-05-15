import { quote, QuoteError, findLane, LANES } from '../pricing';

describe('pricing.findLane', () => {
  it('returns the lane when serviced', () => {
    expect(findLane('US', 'NG')?.rate).toBe(6.5);
  });
  it('returns undefined when not serviced', () => {
    expect(findLane('GH', 'TG')).toBeUndefined();
  });
});

describe('pricing.quote — weight pricing', () => {
  it('charges by weight at the lane rate above the minimum', () => {
    const q = quote({ from: 'US', to: 'NG', weight: 20 });
    expect(q.weight.cost).toBe(130); // 20 lb * 6.50
    expect(q.serviceFee).toBe(0); // USA→NG: no service fee
    expect(q.total).toBe(130);
  });

  it('snaps weight up to the minimum when input is below', () => {
    const q = quote({ from: 'US', to: 'NG', weight: 3 });
    expect(q.weight.chargeable).toBe(10);
    expect(q.weight.cost).toBe(65);
  });

  it('adds the $30 service fee on lanes that require it', () => {
    const q = quote({ from: 'US', to: 'LR', weight: 12 });
    expect(q.serviceFee).toBe(30);
    expect(q.total).toBe(12 * 11.57 + 30);
  });

  it('prices Nigeria→USA per kg', () => {
    const q = quote({ from: 'NG', to: 'US', weight: 6 });
    expect(q.weight.unit).toBe('kg');
    expect(q.weight.chargeable).toBe(6); // min is 5
    expect(q.weight.cost).toBe(round2(6 * 12.75));
    expect(q.total).toBe(round2(6 * 12.75 + 30));
  });
});

describe('pricing.quote — electronics pricing', () => {
  it('charges flat rates per item independent of weight', () => {
    const q = quote({ from: 'US', to: 'NG', electronics: { iphone_new: 2, mac_used: 1 } });
    // 2 * 85 + 1 * 85 = 255
    expect(q.electronics).toHaveLength(2);
    expect(q.total).toBe(255);
  });

  it('combines weight and electronics totals', () => {
    const q = quote({ from: 'US', to: 'GH', weight: 15, electronics: { iphone_used: 1 } });
    const expected = round2(15 * 11.57 + 55 + 30);
    expect(q.total).toBe(expected);
  });
});

describe('pricing.quote — error cases', () => {
  it('rejects unserviced lanes', () => {
    expect(() => quote({ from: 'GH', to: 'TG', weight: 10 })).toThrow(QuoteError);
  });

  it('rejects empty shipments', () => {
    expect(() => quote({ from: 'US', to: 'NG' })).toThrow(/at least one item/);
  });

  it('rejects negative weight', () => {
    expect(() => quote({ from: 'US', to: 'NG', weight: -5 })).toThrow(/non-negative/);
  });
});

describe('pricing — rate card sanity', () => {
  it.each(LANES.map((l) => [`${l.from}→${l.to}`, l] as const))(
    '%s has plausible config',
    (_label, l) => {
      expect(l.rate).toBeGreaterThan(0);
      expect(l.minWeight).toBeGreaterThan(0);
      expect(['lb', 'kg']).toContain(l.unit);
    },
  );
});

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

import { BookingSchema } from '../validation';

const baseValid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  phone: '+1 555 123 4567',
  from: 'US',
  to: 'NG',
  weight: 20,
  description: 'Two laptops, packed in original boxes.',
  company_website: '',
  consent: true,
};

describe('BookingSchema', () => {
  it('accepts a fully-formed valid payload', () => {
    expect(BookingSchema.safeParse(baseValid).success).toBe(true);
  });

  it('rejects same origin and destination', () => {
    const r = BookingSchema.safeParse({ ...baseValid, to: 'US' });
    expect(r.success).toBe(false);
  });

  it('rejects when honeypot is filled', () => {
    const r = BookingSchema.safeParse({ ...baseValid, company_website: 'http://evil.example' });
    expect(r.success).toBe(false);
  });

  it('requires consent', () => {
    const r = BookingSchema.safeParse({ ...baseValid, consent: false });
    expect(r.success).toBe(false);
  });

  it('rejects malformed phone numbers', () => {
    const r = BookingSchema.safeParse({ ...baseValid, phone: 'abc' });
    expect(r.success).toBe(false);
  });

  it('rejects malformed emails', () => {
    const r = BookingSchema.safeParse({ ...baseValid, email: 'not-an-email' });
    expect(r.success).toBe(false);
  });

  it('accepts shipments without a weight (electronics only)', () => {
    const rest = { ...baseValid };
    Reflect.deleteProperty(rest, 'weight');
    expect(BookingSchema.safeParse(rest).success).toBe(true);
  });
});

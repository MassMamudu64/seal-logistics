import {
  generateTrackingId,
  isValidTrackingId,
  signPortalToken,
  verifyPortalToken,
} from '../tracking';

describe('tracking IDs', () => {
  it('generates an ID that validates against its own checksum', () => {
    for (let i = 0; i < 50; i++) {
      const id = generateTrackingId();
      expect(isValidTrackingId(id)).toBe(true);
    }
  });

  it('rejects malformed IDs', () => {
    expect(isValidTrackingId('NOT-A-VALID-ID')).toBe(false);
    expect(isValidTrackingId('')).toBe(false);
    expect(isValidTrackingId('SEAL-2620XXXX-AA')).toBe(false);
  });

  it('rejects IDs with a tampered checksum', () => {
    const id = generateTrackingId();
    const tampered = id.slice(0, -2) + 'ZZ';
    expect(isValidTrackingId(tampered)).toBe(false);
  });
});

describe('portal tokens', () => {
  it('round-trips a valid token', () => {
    const id = generateTrackingId();
    const exp = Date.now() + 60_000;
    const t = signPortalToken({ trackingId: id, exp });
    const payload = verifyPortalToken(t);
    expect(payload).not.toBeNull();
    expect(payload?.trackingId).toBe(id);
  });

  it('rejects expired tokens', () => {
    const id = generateTrackingId();
    const t = signPortalToken({ trackingId: id, exp: Date.now() - 1 });
    expect(verifyPortalToken(t)).toBeNull();
  });

  it('rejects tokens with a tampered signature', () => {
    const id = generateTrackingId();
    const t = signPortalToken({ trackingId: id, exp: Date.now() + 60_000 });
    expect(verifyPortalToken(t + 'X')).toBeNull();
  });

  it('rejects tokens with a tampered body', () => {
    const id = generateTrackingId();
    const t = signPortalToken({ trackingId: id, exp: Date.now() + 60_000 });
    const [body, sig] = t.split('.');
    const tampered = body!.slice(0, -1) + 'A' + '.' + sig;
    expect(verifyPortalToken(tampered)).toBeNull();
  });
});

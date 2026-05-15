import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

/**
 * Tracking-ID format: SEAL-YYWWXXXX-CC
 *   YYWW  : 2-digit year + ISO week
 *   XXXX  : 4 random base32 chars (no I/L/O/0/1)
 *   CC    : 2-char HMAC checksum (truncated SHA-256 over secret + id)
 *
 * Why not just UUID? Customers read these aloud and quote them in WhatsApp/SMS.
 * Short, scannable, and tamper-evident.
 *
 * The checksum lets the tracking API reject typos/guessing without a DB hit.
 */

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function getSecret(): string {
  const s = process.env.PORTAL_TOKEN_SECRET;
  if (!s && process.env.NODE_ENV !== 'production') {
    return 'dev-only-portal-token-secret-please-replace';
  }
  if (!s || s.length < 32) {
    throw new Error('PORTAL_TOKEN_SECRET missing or too short (need >= 32 bytes).');
  }
  return s;
}

function checksum(id: string): string {
  const digest = createHmac('sha256', getSecret()).update(id).digest();
  return `${ALPHABET[digest[0]! % ALPHABET.length]}${ALPHABET[digest[1]! % ALPHABET.length]}`;
}

function isoWeek(d: Date): { yy: string; ww: string } {
  const dt = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = dt.getUTCDay() || 7;
  dt.setUTCDate(dt.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((dt.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return {
    yy: String(dt.getUTCFullYear()).slice(-2),
    ww: String(week).padStart(2, '0'),
  };
}

function randomBlock(n: number): string {
  const bytes = randomBytes(n);
  let out = '';
  for (let i = 0; i < n; i++) {
    out += ALPHABET[bytes[i]! % ALPHABET.length];
  }
  return out;
}

export function generateTrackingId(now: Date = new Date()): string {
  const { yy, ww } = isoWeek(now);
  const random = randomBlock(4);
  const base = `SEAL-${yy}${ww}${random}`;
  return `${base}-${checksum(base)}`;
}

/** Validate format + checksum. Use BEFORE looking up in the DB. */
export function isValidTrackingId(id: string): boolean {
  if (!/^SEAL-\d{4}[A-Z2-9]{4}-[A-Z0-9]{2}$/.test(id)) return false;
  const [prefix, suffix] = [id.slice(0, id.length - 3), id.slice(-2)];
  const expected = checksum(prefix);
  const a = Buffer.from(suffix);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Magic-link portal token — short-lived JWT-ish signed payload.
 * { trackingId, exp } base64url'd then HMAC'd. Used to authorize portal access.
 */
export type PortalToken = { trackingId: string; exp: number };

export function signPortalToken(payload: PortalToken): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = createHmac('sha256', getSecret()).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function verifyPortalToken(token: string): PortalToken | null {
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = createHmac('sha256', getSecret()).update(body).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as PortalToken;
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
    if (!isValidTrackingId(payload.trackingId)) return null;
    return payload;
  } catch {
    return null;
  }
}

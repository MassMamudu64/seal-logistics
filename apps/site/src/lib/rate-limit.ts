import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * IP-based rate limiter for the booking endpoint.
 * Defaults: 5 requests / 10 min per IP. Sliding window.
 *
 * Falls back to in-memory limiter if Upstash env vars are missing
 * (dev/test) — never silently disabled.
 */

type Limiter = { limit: (key: string) => Promise<{ success: boolean; reset: number }> };

let _limiter: Limiter | null = null;

export function getLimiter(): Limiter {
  if (_limiter) return _limiter;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    const rl = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(5, '10 m'),
      analytics: true,
      prefix: 'seal:booking',
    });
    _limiter = {
      limit: (key) => rl.limit(key).then((r) => ({ success: r.success, reset: r.reset })),
    };
    return _limiter;
  }

  // In-memory fallback — single-process only, fine for tests.
  const hits = new Map<string, { count: number; reset: number }>();
  _limiter = {
    async limit(key: string) {
      const now = Date.now();
      const window = 10 * 60 * 1000;
      const entry = hits.get(key);
      if (!entry || entry.reset < now) {
        hits.set(key, { count: 1, reset: now + window });
        return { success: true, reset: now + window };
      }
      entry.count += 1;
      return { success: entry.count <= 5, reset: entry.reset };
    },
  };
  return _limiter;
}

export function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

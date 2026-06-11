/**
 * Lightweight in-memory sliding-window rate limiter for API routes.
 *
 * Suitable as a baseline (single-instance / dev / low-traffic). For multi-instance
 * production, back this with Redis/Upstash — the call sites won't change.
 */
import type { NextRequest } from 'next/server'

interface Hit { count: number; resetAt: number }
const buckets = new Map<string, Hit>()

export function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}

/**
 * Returns { ok, remaining, retryAfter }. Call at the top of a route handler:
 *   const rl = rateLimit(`login:${clientIp(req)}`, 10, 15 * 60_000)
 *   if (!rl.ok) return NextResponse.json({error:'Too many requests'}, {status:429})
 */
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const hit = buckets.get(key)

  if (!hit || hit.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1, retryAfter: 0 }
  }
  hit.count++
  if (hit.count > limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((hit.resetAt - now) / 1000) }
  }
  return { ok: true, remaining: limit - hit.count, retryAfter: 0 }
}

/**
 * CSRF defense-in-depth for state-changing requests: reject cross-origin POSTs.
 * Cookies are already SameSite=Lax; this rejects requests whose Origin host
 * doesn't match the request Host. Returns true if the request is same-origin.
 */
export function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return true // non-browser / same-origin server calls have no Origin
  try {
    return new URL(origin).host === req.headers.get('host')
  } catch {
    return false
  }
}

// Opportunistic cleanup so the map doesn't grow unbounded.
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k)
  }, 10 * 60_000).unref?.()
}

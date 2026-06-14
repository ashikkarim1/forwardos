/**
 * Email tracking signatures.
 *
 * We sign the userId so an attacker can't bump someone else's
 * lastEmailEngagedAt by guessing IDs. HMAC-SHA256 over
 * (userId|sendId), truncated to 16 hex chars — plenty for an open-
 * tracking pixel (we're not protecting money, just a timestamp).
 *
 * Signs at email-send time, verifies at pixel-load time.
 */
import crypto from 'crypto'

const SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production'

export function signTrackingToken(userId: string, sendId: string): string {
  return crypto
    .createHmac('sha256', SECRET)
    .update(`${userId}|${sendId}`)
    .digest('hex')
    .slice(0, 16)
}

export function verifyTrackingToken(userId: string, sendId: string, token: string): boolean {
  const expected = signTrackingToken(userId, sendId)
  // Constant-time compare to avoid timing attacks.
  if (token.length !== expected.length) return false
  try {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))
  } catch {
    return false
  }
}

/**
 * Build the pixel URL for a given (user, send). The send-window helper
 * passes a stable sendId so multiple opens of the same digest count as
 * the same engagement (not noisy).
 */
export function trackingPixelUrl(opts: { userId: string; sendId: string; site?: string }): string {
  const site = opts.site || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.forwardos.ai'
  const t = signTrackingToken(opts.userId, opts.sendId)
  return `${site}/api/notifications/open?u=${encodeURIComponent(opts.userId)}&s=${encodeURIComponent(opts.sendId)}&t=${t}`
}

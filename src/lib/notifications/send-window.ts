/**
 * Send window — the retention discipline lives here.
 *
 * Reads PendingAlert, decides who to email NOW, sends one digest per
 * user (not per match), clears sent rows.
 *
 * Hard rules (never bypassed):
 *   1. Daily cap (default 2 emails/day) — even INSTANT tier respects.
 *   2. Quiet hours (default 9pm–7am local) — queues, never sends.
 *   3. Dedup — same deal in 3 of user's searches = 1 mention, not 3.
 *   4. Engagement decay — no opens in 14d → cadence steps down.
 *   5. Category opt-out — disabled categories drop silently.
 *
 * Why one function, not a swarm? Because the discipline only works if
 * EVERY send goes through the same gate. Side paths around this gate
 * are the unsubscribe risk.
 */
import { prisma } from '@/lib/prisma'
import { AlertFrequency } from '@prisma/client'
import { sendEmail } from '@/lib/services/email'
import {
  getPreferences,
  isInQuietHours,
  isUnderDailyCap,
  decayedCadence,
  recordEmailSent,
} from '@/lib/notifications/preferences'
import { renderMatchDigest } from '@/lib/notifications/templates'

interface RunOptions {
  /** Skip the cadence check — used by the weekly-digest cron. */
  forceCadence?: AlertFrequency
  /** Only consider these user IDs (used by tests). Defaults to all eligible. */
  onlyUserIds?: string[]
  /** Don't actually send — return what would have been sent. */
  dryRun?: boolean
}

interface SendResult {
  sentCount: number
  skipped: Record<string, number>  // reason → count
  digests: Array<{ userId: string; email: string; dealCount: number }>
}

const CADENCE_MIN_INTERVAL_MS: Record<AlertFrequency, number> = {
  INSTANT: 15 * 60_000,         // 15 min batch window
  DAILY:   23 * 3_600_000,      // ~1/day
  WEEKLY:  6 * 86_400_000,      // ~1/week
}

export async function runSendWindow(opts: RunOptions = {}): Promise<SendResult> {
  const skipped: Record<string, number> = {}
  const bump = (r: string) => { skipped[r] = (skipped[r] ?? 0) + 1 }

  // Find users who have pending alerts. Group by user.
  const groups = await prisma.pendingAlert.groupBy({
    by: ['userId'],
    where: opts.onlyUserIds ? { userId: { in: opts.onlyUserIds } } : {},
    _count: { _all: true },
  })

  const digests: SendResult['digests'] = []
  let sent = 0

  for (const g of groups) {
    const userId = g.userId

    // Load user + prefs together. Skip users with no email (shouldn't
    // happen — every account has one — but defensive).
    const [user, prefs, prefRecord] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true, buyerPlanTier: true, brokerPlanTier: true },
      }),
      getPreferences(userId),
      prisma.notificationPreference.findUnique({ where: { userId }, select: { createdAt: true } }),
    ])
    if (!user?.email) { bump('no_email'); continue }

    // Engagement-decay: a user who hasn't opened in 14d steps down.
    const effectiveCadence = opts.forceCadence ??
      decayedCadence({ matchAlertCadence: prefs.matchAlertCadence, lastEmailEngagedAt: prefs.lastEmailEngagedAt, createdAt: prefRecord?.createdAt })

    // Hard rule: quiet hours block sends until window opens.
    if (isInQuietHours(prefs)) { bump('quiet_hours'); continue }

    // Hard rule: daily cap (default 2/day) applies to every tier.
    if (!isUnderDailyCap(prefs)) { bump('daily_cap'); continue }

    // Cadence pacing: did we send recently enough that we shouldn't yet?
    const minInterval = CADENCE_MIN_INTERVAL_MS[effectiveCadence]
    const sinceLast = prefs.lastNonTxEmailSentAt
      ? Date.now() - prefs.lastNonTxEmailSentAt.getTime()
      : Infinity
    if (sinceLast < minInterval) { bump('cadence_too_soon'); continue }

    // Pull this user's pending alerts. Skip ones in disabled categories.
    const pending = await prisma.pendingAlert.findMany({
      where: { userId },
      orderBy: [{ importance: 'desc' }, { createdAt: 'asc' }],
      take: 50,  // any one digest is capped at 50 listings
      include: { deal: { select: { id: true, slug: true, industry: true, city: true, country: true, askingPrice: true, heatScore: true } } },
    })
    const activeCategories = pending.filter((a) => !prefs.disabledCategories.includes(a.category as never))
    if (activeCategories.length === 0) { bump('all_categories_off'); continue }

    // Dedup: collapse same deal across multiple of the user's searches.
    const seen = new Set<string>()
    const deals: typeof activeCategories = []
    for (const a of activeCategories) {
      if (seen.has(a.dealId)) continue
      seen.add(a.dealId)
      deals.push(a)
    }
    if (deals.length === 0) { bump('all_deduped'); continue }

    // Build + send the digest.
    const isPaid =
      user.buyerPlanTier  === 'PREMIUM_BUYER' ||
      user.brokerPlanTier === 'BROKER_PRO'
    const html = renderMatchDigest({
      cadence: effectiveCadence,
      isPaid,
      userName: user.name?.split(' ')[0],
      deals: deals.map((a) => ({
        id: a.deal.id,
        slug: a.deal.slug,
        industry: String(a.deal.industry),
        city: a.deal.city,
        country: a.deal.country,
        askingPriceCents: a.deal.askingPrice ? Number(a.deal.askingPrice) : null,
        heatScore: a.deal.heatScore,
      })),
    })
    const subject =
      effectiveCadence === 'WEEKLY' ? `Your weekly Forward digest — ${deals.length} new ${deals.length === 1 ? 'match' : 'matches'}` :
      effectiveCadence === 'DAILY'  ? `Today on Forward — ${deals.length} new ${deals.length === 1 ? 'match' : 'matches'}` :
                                      `${deals.length} new ${deals.length === 1 ? 'match' : 'matches'} just landed on Forward`

    if (!opts.dryRun) {
      const result = await sendEmail({ to: user.email, subject, html })
      if (!result.success && !('mocked' in result)) {
        bump('send_failed')
        continue
      }
      // Clear the alerts we just sent, bump the counter.
      const sentIds = activeCategories.filter((a) => seen.has(a.dealId)).map((a) => a.id)
      await prisma.pendingAlert.deleteMany({ where: { id: { in: sentIds } } })
      await recordEmailSent(userId)
      // Resend free tier caps at 2/sec. Pause 600ms between sends so a
      // queue of 50 digests doesn't fail half the batch.
      await new Promise((r) => setTimeout(r, 600))
    }

    digests.push({ userId, email: user.email, dealCount: deals.length })
    sent++
  }

  return { sentCount: sent, skipped, digests }
}

/**
 * Notification preferences — get with auto-default-creation.
 *
 * Single source of truth for retention guardrails:
 *   - Default cadence by tier (free: WEEKLY, premium: DAILY)
 *   - Quiet hours (9pm–7am local by default)
 *   - Hard daily email cap (2 by default)
 *   - Per-category opt-outs (transactional NEVER on this list)
 *   - Engagement decay timestamp
 */
import { prisma } from '@/lib/prisma'
import { AlertFrequency } from '@prisma/client'

export type NonTxCategory =
  | 'match'           // new listing matches saved search
  | 'price-change'    // saved/watched listing price moved
  | 'pre-listing'     // succession event / distress signal
  | 'heat-spike'      // sudden demand on a saved deal
  | 'comparable'      // comparable deal closed in your sector

// Transactional categories — never opt-out-able. Documented here so we
// remember to NEVER thread them through the gating logic.
export const TRANSACTIONAL_CATEGORIES = [
  'security',          // login, password, suspicious activity
  'billing',           // renewal, failed payment, receipt
  'inquiry-response',  // someone replied to your inquiry
  'nda',               // NDA signed / required
  'kyc',               // verification status
  'data-room-access',  // approval / denial / expiry
  'legal',             // T&C / privacy updates
] as const

interface Prefs {
  matchAlertCadence:   AlertFrequency
  quietHoursStart:     number
  quietHoursEnd:       number
  timezoneOffsetMin:   number
  maxDailyEmails:      number
  disabledCategories:  NonTxCategory[]
  lastEmailEngagedAt:  Date | null
  lastNonTxEmailSentAt: Date | null
  emailsSentToday:     number
  emailsSentTodayDate: Date | null
}

/**
 * Get preferences for a user — creating defaults if none exist. Default
 * cadence depends on tier so a new Premium subscriber gets Smart Daily
 * out of the box, not the conservative free Weekly.
 */
export async function getPreferences(userId: string): Promise<Prefs> {
  const existing = await prisma.notificationPreference.findUnique({ where: { userId } })
  if (existing) {
    return {
      matchAlertCadence:    existing.matchAlertCadence,
      quietHoursStart:      existing.quietHoursStart,
      quietHoursEnd:        existing.quietHoursEnd,
      timezoneOffsetMin:    existing.timezoneOffsetMin,
      maxDailyEmails:       existing.maxDailyEmails,
      disabledCategories:   safeParseCategories(existing.disabledCategories),
      lastEmailEngagedAt:   existing.lastEmailEngagedAt,
      lastNonTxEmailSentAt: existing.lastNonTxEmailSentAt,
      emailsSentToday:      existing.emailsSentToday,
      emailsSentTodayDate:  existing.emailsSentTodayDate,
    }
  }

  // Default cadence by tier — Premium gets Smart Daily, free gets Weekly.
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { buyerPlanTier: true, brokerPlanTier: true },
  })
  const isPaid =
    user?.buyerPlanTier  === 'PREMIUM_BUYER' ||
    user?.brokerPlanTier === 'BROKER_PRO'
  const defaultCadence: AlertFrequency = isPaid ? 'DAILY' : 'WEEKLY'

  const created = await prisma.notificationPreference.create({
    data: { userId, matchAlertCadence: defaultCadence },
  })
  return {
    matchAlertCadence:    created.matchAlertCadence,
    quietHoursStart:      created.quietHoursStart,
    quietHoursEnd:        created.quietHoursEnd,
    timezoneOffsetMin:    created.timezoneOffsetMin,
    maxDailyEmails:       created.maxDailyEmails,
    disabledCategories:   [],
    lastEmailEngagedAt:   null,
    lastNonTxEmailSentAt: null,
    emailsSentToday:      0,
    emailsSentTodayDate:  null,
  }
}

export async function setCadence(userId: string, cadence: AlertFrequency) {
  await prisma.notificationPreference.upsert({
    where: { userId },
    update: { matchAlertCadence: cadence },
    create: { userId, matchAlertCadence: cadence },
  })
}

export async function setCategoryDisabled(userId: string, category: NonTxCategory, disabled: boolean) {
  const prefs = await getPreferences(userId)
  const next = disabled
    ? Array.from(new Set([...prefs.disabledCategories, category]))
    : prefs.disabledCategories.filter((c) => c !== category)
  await prisma.notificationPreference.upsert({
    where: { userId },
    update: { disabledCategories: JSON.stringify(next) },
    create: { userId, disabledCategories: JSON.stringify(next) },
  })
}

/**
 * Mark engagement when a user opens or clicks an email. Resets the
 * decay timer so the send-window doesn't step them down.
 */
export async function recordEngagement(userId: string) {
  await prisma.notificationPreference.upsert({
    where: { userId },
    update: { lastEmailEngagedAt: new Date() },
    create: { userId, lastEmailEngagedAt: new Date() },
  })
}

/**
 * Increment daily-send counter. Rolls over date when the calendar day
 * changes (in user's tz). The send-window reads this to enforce the
 * maxDailyEmails cap.
 */
export async function recordEmailSent(userId: string) {
  const prefs = await getPreferences(userId)
  const today = startOfLocalDay(new Date(), prefs.timezoneOffsetMin)
  const sameDay = prefs.emailsSentTodayDate &&
    startOfLocalDay(prefs.emailsSentTodayDate, prefs.timezoneOffsetMin).getTime() === today.getTime()
  const nextCount = sameDay ? prefs.emailsSentToday + 1 : 1
  await prisma.notificationPreference.upsert({
    where: { userId },
    update: {
      lastNonTxEmailSentAt: new Date(),
      emailsSentToday: nextCount,
      emailsSentTodayDate: today,
    },
    create: {
      userId,
      lastNonTxEmailSentAt: new Date(),
      emailsSentToday: 1,
      emailsSentTodayDate: today,
    },
  })
}

/** Is the current moment inside the user's local quiet hours? */
export function isInQuietHours(prefs: Pick<Prefs, 'quietHoursStart' | 'quietHoursEnd' | 'timezoneOffsetMin'>, now = new Date()): boolean {
  const local = new Date(now.getTime() + prefs.timezoneOffsetMin * 60_000)
  const hour = local.getUTCHours()
  const { quietHoursStart: s, quietHoursEnd: e } = prefs
  // Quiet window crosses midnight when start > end (e.g. 21 → 7).
  return s > e ? (hour >= s || hour < e) : (hour >= s && hour < e)
}

/** Daily cap check — true if this user can still receive a non-tx email today. */
export function isUnderDailyCap(prefs: Pick<Prefs, 'maxDailyEmails' | 'emailsSentToday' | 'emailsSentTodayDate' | 'timezoneOffsetMin'>, now = new Date()): boolean {
  if (!prefs.emailsSentTodayDate) return true
  const today = startOfLocalDay(now, prefs.timezoneOffsetMin)
  const counterDay = startOfLocalDay(prefs.emailsSentTodayDate, prefs.timezoneOffsetMin)
  if (counterDay.getTime() !== today.getTime()) return true  // new day, counter resets
  return prefs.emailsSentToday < prefs.maxDailyEmails
}

/**
 * Engagement-decay check. If a user hasn't engaged with an email in
 * the past 14 days, the send-window auto-steps them down a tier:
 *   INSTANT → DAILY → WEEKLY → (stays WEEKLY; never silently disabled)
 */
export function decayedCadence(prefs: Pick<Prefs, 'matchAlertCadence' | 'lastEmailEngagedAt'> & { createdAt?: Date | null }): AlertFrequency {
  const cadence = prefs.matchAlertCadence
  if (cadence === 'WEEKLY') return 'WEEKLY'
  // Grace period: never decay until the account is at least 14 days old.
  if (prefs.createdAt && Date.now() - prefs.createdAt.getTime() < 14 * 86_400_000) return cadence
  if (!prefs.lastEmailEngagedAt) return cadence
  const daysSince = (Date.now() - prefs.lastEmailEngagedAt.getTime()) / 86_400_000
  if (daysSince <= 14) return cadence
  return cadence === 'INSTANT' ? 'DAILY' : 'WEEKLY'
}

function safeParseCategories(raw: string): NonTxCategory[] {
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed.filter((c) => typeof c === 'string') as NonTxCategory[]
  } catch {}
  return []
}

function startOfLocalDay(date: Date, tzOffsetMin: number): Date {
  const local = new Date(date.getTime() + tzOffsetMin * 60_000)
  local.setUTCHours(0, 0, 0, 0)
  return new Date(local.getTime() - tzOffsetMin * 60_000)
}

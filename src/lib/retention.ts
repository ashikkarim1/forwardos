/**
 * Data-retention enforcement (GDPR storage-limitation, Art. 5(1)(e)). Deletes
 * time-bound, non-legally-required data past its retention window. Conservative
 * by design: records with AML/tax/legal retention duties are left untouched.
 *
 * Shared by the cron endpoint (/api/cron/retention) and the CLI
 * (prisma/data-retention.ts). Pass a PrismaClient-like `db`.
 */

// Retention windows (months). Keep in sync with compliance/DATA_RETENTION.md.
export const RETENTION = {
  feedbackMonths: 24,
  consentLogMonths: 36,
  alertDeliveryMonths: 12,
  expiredEmailTokensDays: 7,
}

function monthsAgo(n: number): Date {
  const d = new Date()
  d.setMonth(d.getMonth() - n)
  return d
}

export interface PurgeResult {
  feedback: number
  consentLogs: number
  alertDeliveries: number
  expiredTokens: number
}

export async function purgeExpired(db: any): Promise<PurgeResult> {
  const result: PurgeResult = { feedback: 0, consentLogs: 0, alertDeliveries: 0, expiredTokens: 0 }

  const r1 = await db.feedback.deleteMany({ where: { createdAt: { lt: monthsAgo(RETENTION.feedbackMonths) } } }).catch(() => ({ count: 0 }))
  result.feedback = r1.count

  const r2 = await db.consentLog.deleteMany({ where: { createdAt: { lt: monthsAgo(RETENTION.consentLogMonths) } } }).catch(() => ({ count: 0 }))
  result.consentLogs = r2.count

  const r3 = await db.alertDelivery.deleteMany({ where: { sentAt: { lt: monthsAgo(RETENTION.alertDeliveryMonths) } } }).catch(() => ({ count: 0 }))
  result.alertDeliveries = r3.count

  // Expired email-verification tokens are transient — clear once well past expiry.
  const tokenCutoff = new Date()
  tokenCutoff.setDate(tokenCutoff.getDate() - RETENTION.expiredEmailTokensDays)
  const r4 = await db.emailVerificationToken.deleteMany({ where: { expiresAt: { lt: tokenCutoff } } }).catch(() => ({ count: 0 }))
  result.expiredTokens = r4.count

  return result
}

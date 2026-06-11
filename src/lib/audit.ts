/**
 * Accountability logging (GDPR Art. 5(2)) — records privacy-relevant actions
 * (data exports, erasures, DSRs, consent changes) to the AuditLog. Best-effort:
 * never throws into the calling request.
 */
import { prisma } from '@/lib/prisma'
import type { NextRequest } from 'next/server'

export async function logAudit(opts: {
  req?: NextRequest
  userId?: string | null
  action: string
  resourceType: string
  resourceId?: string | null
  changes?: unknown
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: opts.userId ?? null,
        action: opts.action,
        resourceType: opts.resourceType,
        resourceId: opts.resourceId ?? null,
        changes: opts.changes ? JSON.stringify(opts.changes) : null,
        ipAddress: opts.req?.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
        userAgent: opts.req?.headers.get('user-agent')?.slice(0, 300) ?? null,
      },
    })
  } catch {
    /* auditing must never break the request */
  }
}

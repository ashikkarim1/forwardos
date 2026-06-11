// Admin decision on a verification case. Approving flips the linked user's
// verificationStatus to VERIFIED so the "Verified" badge becomes real.
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { sendEmail } from '@/lib/services/email'
import { logAudit } from '@/lib/audit'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireRole(['ADMIN'])
  if (!admin) return NextResponse.json({ error: 'Forbidden — admin access required' }, { status: 403 })

  try {
    const { action, notes } = await req.json()
    const vc = await prisma.verificationCase.findUnique({ where: { id: params.id } })
    if (!vc) return NextResponse.json({ error: 'Case not found' }, { status: 404 })

    const map: Record<string, 'APPROVED' | 'REJECTED' | 'NEEDS_INFO'> = { approve: 'APPROVED', reject: 'REJECTED', request_info: 'NEEDS_INFO' }
    const status = map[action]
    if (!status) return NextResponse.json({ error: 'Unknown action' }, { status: 400 })

    await prisma.verificationCase.update({
      where: { id: params.id },
      data: { status, reviewerNotes: notes || null, reviewedAt: new Date() },
    })

    // On approval, make the user's verification real.
    if (status === 'APPROVED' && vc.userId) {
      await prisma.user.update({
        where: { id: vc.userId },
        data: { verificationStatus: 'VERIFIED', kycStatus: 'VERIFIED', kycVerifiedAt: new Date() },
      }).catch(() => {})
    }

    await logAudit({ req, userId: admin.userId, action: `verification.${action}`, resourceType: 'verificationCase', resourceId: params.id })
    if (vc.contactEmail) {
      const msg = status === 'APPROVED'
        ? 'Your business has been verified — your listing now carries the Verified badge.'
        : status === 'NEEDS_INFO' ? `We need a bit more information to verify your business.${notes ? ' ' + notes : ''}`
        : 'We were unable to verify your business at this time.'
      await sendEmail({ to: vc.contactEmail, subject: `Forward Intelligence verification: ${status.replace('_', ' ').toLowerCase()}`, html: `<p>${msg}</p>` }).catch(() => {})
    }

    return NextResponse.json({ success: true, status })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed' }, { status: 500 })
  }
}

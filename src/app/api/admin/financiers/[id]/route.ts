// Admin: approve or reject a financier application. Approval emails the partner
// a link to sign the referral agreement; it does NOT market them yet (that
// happens once they sign).
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
    const lender = await prisma.lender.findUnique({ where: { id: params.id } })
    if (!lender) return NextResponse.json({ error: 'Application not found' }, { status: 404 })

    if (action === 'approve') {
      await prisma.lender.update({
        where: { id: params.id },
        data: { status: 'APPROVED', adminNotes: notes || null },
      })
      const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/financier/agreement/${params.id}`
      await sendEmail({
        to: lender.contactEmail || '',
        subject: 'Your Forward Intelligence partner application is approved — sign your referral agreement',
        html: `<p>Good news — your application to join the Forward Intelligence lender network has been approved.</p>
          <p>The final step is to review and digitally sign your <strong>referral agreement with UpCapital Global FZCO</strong> (Forward OS platform). Once signed, you&apos;ll be listed and actively marketed to qualified buyers.</p>
          <p><a href="${url}">Review &amp; sign your referral agreement →</a></p>`,
      }).catch(() => {})
      await logAudit({ req, userId: admin.userId, action: 'financier.approve', resourceType: 'lender', resourceId: params.id })
      return NextResponse.json({ success: true, status: 'APPROVED' })
    }

    if (action === 'reject') {
      await prisma.lender.update({ where: { id: params.id }, data: { status: 'REJECTED', isActive: false, adminNotes: notes || null } })
      await logAudit({ req, userId: admin.userId, action: 'financier.reject', resourceType: 'lender', resourceId: params.id })
      return NextResponse.json({ success: true, status: 'REJECTED' })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed' }, { status: 500 })
  }
}

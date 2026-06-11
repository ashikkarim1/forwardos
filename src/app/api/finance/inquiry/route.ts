import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/services/email'

/**
 * POST /api/finance/inquiry
 * Body: { userId?, dealId?, lenderId?, requestedAmount (USD cents), currency,
 *         downPaymentPct, termMonths?, region, contactName?, contactEmail?, message? }
 *
 * Records a financing inquiry and notifies admin. Degrades gracefully when no DB
 * is connected (still returns success so the UX completes in preview).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.region || body.requestedAmount == null) {
      return NextResponse.json({ error: 'region and requestedAmount are required' }, { status: 400 })
    }

    let inquiryId: string | null = null
    try {
      const inquiry = await prisma.financingInquiry.create({
        data: {
          userId: body.userId || null,
          dealId: body.dealId || null,
          lenderId: body.lenderId || null,
          requestedAmount: BigInt(Math.round(Number(body.requestedAmount))),
          currency: body.currency || 'USD',
          downPaymentPct: Number(body.downPaymentPct) || 0,
          termMonths: body.termMonths ? Number(body.termMonths) : null,
          region: body.region,
          contactName: body.contactName || null,
          contactEmail: body.contactEmail || null,
          message: body.message || null,
        },
      })
      inquiryId = inquiry.id
    } catch (dbErr) {
      // No DB connected — log and continue so preview UX still completes.
      console.warn('[finance/inquiry] DB unavailable, inquiry not persisted:', (dbErr as Error).message)
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@forward.com'
    await sendEmail({
      to: adminEmail,
      subject: `[FINANCE] New financing inquiry — ${body.region}`,
      html: `<p>New financing inquiry received.</p>
        <ul>
          <li><strong>Region:</strong> ${body.region}</li>
          <li><strong>Requested:</strong> ${body.currency || 'USD'} ${Math.round(Number(body.requestedAmount) / 100).toLocaleString()}</li>
          <li><strong>Down payment:</strong> ${body.downPaymentPct || 0}%</li>
          <li><strong>Contact:</strong> ${body.contactName || '—'} (${body.contactEmail || '—'})</li>
          <li><strong>Deal:</strong> ${body.dealId || '—'}</li>
        </ul>`,
    })

    return NextResponse.json({ success: true, inquiryId }, { status: 201 })
  } catch (error) {
    console.error('[API] Finance inquiry error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Inquiry failed' },
      { status: 500 },
    )
  }
}

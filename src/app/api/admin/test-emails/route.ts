// Admin-only: fire one of every transactional email to a chosen address so you
// can verify deliverability + that all CTA links resolve. Requires Resend to be
// configured (RESEND_API_KEY); otherwise reports what *would* be sent.
import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import {
  sendEmail, sendEmailVerification, sendApprovalNotification,
  sendPremiumPaymentLink, sendAdminReviewNotification,
} from '@/lib/services/email'
import { stripeEnabled } from '@/lib/services/stripe'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!(await requireRole(['ADMIN']))) {
    return NextResponse.json({ error: 'Forbidden — admin access required' }, { status: 403 })
  }
  const { to } = await req.json().catch(() => ({ to: '' }))
  if (!to || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
    return NextResponse.json({ error: 'Provide a valid "to" email.' }, { status: 400 })
  }

  const configured = Boolean(process.env.RESEND_API_KEY)
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // One representative email per template/notification, all sent to `to`.
  const jobs: { type: string; run: () => Promise<unknown> }[] = [
    { type: 'email_verification', run: () => sendEmailVerification(to, 'TEST-TOKEN-123') },
    { type: 'account_approved', run: () => sendApprovalNotification(to, 'Test Seller', 'Acme Coffee Co.') },
    { type: 'premium_payment_link', run: () => sendPremiumPaymentLink(to, 'Test Seller', `${base}/seller/checkout?planTier=premium`) },
    { type: 'admin_review_notice', run: () => sendAdminReviewNotification(to, 'Test Seller', to, 'deal-ca-saas') },
    { type: 'financier_approved', run: () => sendEmail({ to, subject: 'Your partner application is approved — sign your referral agreement', html: `<p>Approved! <a href="${base}/financier/agreement/test-id">Review &amp; sign your referral agreement →</a></p>` }) },
    { type: 'verification_admin', run: () => sendEmail({ to, subject: '[Verification] New UAE case — Test Co', html: `<p>New case. <a href="${base}/admin/verifications">Review →</a></p>` }) },
    { type: 'feedback_admin', run: () => sendEmail({ to, subject: '[Feedback · feature] new submission', html: `<p>New feedback received.</p>` }) },
    { type: 'saved_search_alert', run: () => sendEmail({ to, subject: '3 new businesses match "Canada SaaS"', html: `<p>New matches. <a href="${base}/saved-searches">Manage your alerts →</a></p>` }) },
  ]

  const results: { type: string; ok: boolean; detail?: string }[] = []
  for (const j of jobs) {
    try {
      const r = (await j.run()) as { success?: boolean; mocked?: boolean } | undefined
      results.push({ type: j.type, ok: r?.success !== false, detail: r?.mocked ? 'mocked (no Resend key)' : 'sent' })
    } catch (e) {
      results.push({ type: j.type, ok: false, detail: (e as Error).message })
    }
  }

  return NextResponse.json({
    configured,
    stripeConfigured: stripeEnabled,
    to,
    note: configured
      ? `Sent ${results.filter((r) => r.ok).length}/${results.length} emails to ${to}. Check the inbox (and spam) and click each CTA.`
      : 'RESEND_API_KEY is not set — emails were logged, not delivered. Add the key + a verified forwardos.ai domain, then re-run to truly send.',
    results,
  })
}

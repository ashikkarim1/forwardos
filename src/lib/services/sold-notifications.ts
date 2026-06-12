/**
 * Deal-sold follower notifications — closes the loop on saved listings.
 *
 * When a Deal flips to CLOSED, every user who saved (followed) it gets an
 * anonymized email: "A business you saved has sold." We never name the
 * company; the email shows industry + region + asking range + a link to
 * find similar opportunities on the marketplace.
 *
 * Idempotent: we only email saves where notifiedAt is null and never email
 * the seller about their own listing.
 */
import { prisma } from '@/lib/prisma'
import { sendEmail } from './email'
import { industryLabel } from '@/lib/listing-narrative'
import { maskCity } from '@/lib/listing-helpers'
import { formatAskingRange } from '@/lib/public-listing'
import { luxuryEmail } from '@/lib/email-templates'

interface NotifyOptions {
  /** Optional override — useful in tests so the email arrives at one address. */
  toOverride?: string
}

export async function notifySoldFollowers(dealId: string, opts: NotifyOptions = {}) {
  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
    select: {
      id: true, sellerId: true, status: true, industry: true, country: true, city: true,
      askingPrice: true, closedAt: true,
    },
  })
  if (!deal) return { error: 'deal-not-found' as const }
  if (deal.status !== 'CLOSED') return { error: 'deal-not-closed' as const }

  // Everyone who saved the deal — minus the seller themselves.
  const followers = await prisma.savedDeal.findMany({
    where: { dealId, NOT: { userId: deal.sellerId } },
    include: { user: { select: { id: true, email: true, name: true } } },
  })
  if (followers.length === 0 && !opts.toOverride) {
    return { sent: 0, followers: 0 }
  }

  const indLabel = industryLabel(deal.industry)
  const region = maskCity(deal.city, deal.country)
  const askRange = formatAskingRange(deal.askingPrice ?? null)
  const closedDate = (deal.closedAt ?? new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.forwardos.ai'
  const marketplaceUrl = `${SITE}/marketplace?industry=${deal.industry}`

  const subject = `A confidential ${indLabel} business you saved has sold`
  const html = (firstName?: string) => luxuryEmail({
    preheader: `A confidential ${indLabel} business you saved has just closed.`,
    eyebrow: 'Closing the loop',
    title: 'A listing you saved has sold.',
    greetingName: firstName,
    intro: `A confidential business you saved on Forward has just closed. We don't reveal the identity even after sale — but here's what we can share:`,
    innerHtml: `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #E5E7EB;border-radius:12px;margin:0 0 16px;background:#FFFFFF">
        <tr><td style="padding:18px 22px">
          <p style="margin:0 0 4px;font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:16px;font-weight:800;color:#1A1A1A">Confidential ${indLabel} business</p>
          <p style="margin:0 0 6px;font-family:-apple-system,Helvetica,Arial,sans-serif;color:#717171;font-size:13px">${region} · Asking ${askRange}</p>
          <p style="margin:0;font-family:-apple-system,Helvetica,Arial,sans-serif;color:#2D7A5F;font-size:13px;font-weight:800">Sold ${closedDate}</p>
        </td></tr>
      </table>
      <p style="margin:0;font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:14px;color:#1A1A1A">Want to find similar opportunities in <strong>${indLabel}</strong>?</p>`,
    cta: { label: 'Browse similar listings →', href: marketplaceUrl },
    secondaryCta: { label: 'Manage saved listings →', href: `${SITE}/saved` },
    footerNote: `You're receiving this because you saved this listing on Forward Intelligence.`,
  })

  let sent = 0
  if (opts.toOverride) {
    // Test path — single anonymized email to a fixed address.
    await sendEmail({ to: opts.toOverride, subject, html: html('Ashik') })
    sent = 1
  } else {
    for (const f of followers) {
      try {
        const firstName = (f.user.name || '').split(' ')[0] || undefined
        await sendEmail({ to: f.user.email, subject, html: html(firstName) })
        sent++
      } catch (e) {
        console.error('[sold-notification] send failed for', f.user.email, e)
      }
    }
  }

  return { sent, followers: followers.length }
}

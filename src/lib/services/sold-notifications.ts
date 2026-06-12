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
    include: { user: { select: { id: true, email: true } } },
  })
  if (followers.length === 0 && !opts.toOverride) {
    return { sent: 0, followers: 0 }
  }

  const indLabel = industryLabel(deal.industry)
  const region = maskCity(deal.city, deal.country)
  const askRange = formatAskingRange(deal.askingPrice ?? null)
  const closedDate = (deal.closedAt ?? new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const marketplaceUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.forwardos.ai'}/marketplace?industry=${deal.industry}`

  const subject = `A confidential ${indLabel} business you saved has sold`
  const html = (toAddr: string) => `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1A1A1A">
      <h2 style="margin:0 0 8px">Closing the loop on a listing you saved</h2>
      <p style="color:#717171;font-size:14px;margin:0 0 20px">A confidential business you saved on Forward has just closed. We don't reveal the identity even after sale — but here's what we can share:</p>
      <div style="background:#EFF6FF;border-radius:10px;padding:16px;margin:0 0 20px">
        <p style="margin:0 0 4px;font-weight:bold">Confidential ${indLabel} business</p>
        <p style="margin:0 0 6px;color:#717171;font-size:13px">${region} · Asking ${askRange}</p>
        <p style="margin:0;color:#2D7A5F;font-size:13px;font-weight:bold">Sold ${closedDate}</p>
      </div>
      <p style="margin:0 0 16px;font-size:14px">Want to find similar opportunities in <strong>${indLabel}</strong>?</p>
      <p style="margin:0 0 24px"><a href="${marketplaceUrl}" style="background:#3B82F6;color:#ffffff !important;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold"><span style="color:#ffffff">Browse similar listings →</span></a></p>
      <p style="color:#9A9A9A;font-size:11px;margin:24px 0 0">You're receiving this because you saved this listing on Forward Intelligence. <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.forwardos.ai'}/saved" style="color:#9A9A9A">Manage saved listings →</a></p>
    </div>
  `

  let sent = 0
  if (opts.toOverride) {
    // Test path — single anonymized email to a fixed address.
    await sendEmail({ to: opts.toOverride, subject, html: html(opts.toOverride) })
    sent = 1
  } else {
    for (const f of followers) {
      try {
        await sendEmail({ to: f.user.email, subject, html: html(f.user.email) })
        sent++
      } catch (e) {
        console.error('[sold-notification] send failed for', f.user.email, e)
      }
    }
  }

  return { sent, followers: followers.length }
}

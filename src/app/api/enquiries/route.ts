/**
 * POST /api/enquiries
 *
 * Buyer-to-seller introduction request. Creates (or attaches to) the buyer's
 * User row, writes an Enquiry record (binding introduction — Forward's fee
 * applies if the deal closes through this introduction), and sends three
 * emails: buyer confirmation, seller notification, Forward audit copy.
 *
 * Identity flow: the BUYER's details are passed to the seller via Forward
 * (so we can audit + earn the intro fee). The seller's identity is NOT
 * revealed back to the buyer until both sides explicitly engage further.
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, clientIp, isSameOrigin } from '@/lib/rate-limit'
import { sendEmail } from '@/lib/services/email'
import { industryLabel } from '@/lib/listing-narrative'
import { maskCity } from '@/lib/listing-helpers'
import { formatAskingRange } from '@/lib/public-listing'
import { luxuryEmail } from '@/lib/email-templates'
import crypto from 'crypto'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.forwardos.ai'
const FORWARD_AUDIT_EMAIL = process.env.ADMIN_EMAIL || 'ceo@theupcapital.com'

const VALID_TIMELINES = new Set(['immediate', '1-3mo', '3-6mo', '6-12mo', 'exploring'])
const VALID_FINANCING = new Set(['no', 'maybe', 'yes'])
const VALID_BUYER_TYPES = new Set(['individual', 'family-office', 'pe', 'strategic', 'broker'])

export async function POST(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) return NextResponse.json({ error: 'Cross-origin blocked' }, { status: 403 })

    const rl = rateLimit(`enquiry:${clientIp(request)}`, 6, 60 * 60_000)
    if (!rl.ok) {
      return NextResponse.json({ error: 'Too many submissions — try again later.' }, {
        status: 429, headers: { 'Retry-After': String(rl.retryAfter) },
      })
    }

    const body = await request.json().catch(() => ({}))
    const {
      dealId, firstName, lastName, email, phone, country,
      capitalAvailableRange, timeline, financingNeed, buyerType,
      message, bindingAcknowledged,
    } = body as Record<string, string | boolean>

    // ─── validate ──────────────────────────────────────────────────────────
    const errors: string[] = []
    if (!dealId || typeof dealId !== 'string') errors.push('Listing required')
    if (!firstName || !String(firstName).trim()) errors.push('First name')
    if (!lastName || !String(lastName).trim()) errors.push('Last name')
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) errors.push('Valid email')
    if (!phone || String(phone).replace(/\D/g, '').length < 6) errors.push('Phone')
    if (!country || !String(country).trim()) errors.push('Country')
    if (!timeline || !VALID_TIMELINES.has(String(timeline))) errors.push('Timeline')
    if (!buyerType || !VALID_BUYER_TYPES.has(String(buyerType))) errors.push('Buyer type')
    if (!message || String(message).trim().length < 10) errors.push('Message (min 10 chars)')
    if (!bindingAcknowledged) errors.push('Binding acknowledgment')
    if (errors.length) return NextResponse.json({ error: `Missing or invalid: ${errors.join(', ')}` }, { status: 400 })

    const normalizedEmail = String(email).toLowerCase().trim()

    // ─── load the listing ──────────────────────────────────────────────────
    const deal = await prisma.deal.findUnique({
      where: { id: String(dealId) },
      select: {
        id: true, slug: true, industry: true, country: true, city: true,
        askingPrice: true, sellerId: true, status: true,
        seller: { select: { email: true, name: true } },
      },
    })
    if (!deal) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    if (deal.status !== 'ACTIVE' && deal.status !== 'PUBLISHED') {
      return NextResponse.json({ error: 'This listing is no longer accepting inquiries.' }, { status: 410 })
    }

    // ─── upsert buyer User ────────────────────────────────────────────────
    let buyer = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (!buyer) {
      buyer = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: `${String(firstName).trim()} ${String(lastName).trim()}`,
          password: crypto.randomBytes(24).toString('hex'),
          role: 'BUYER',
          phone: String(phone).trim(),
          referralCode: crypto.createHash('sha256').update(normalizedEmail + 'forward2026').digest('hex').slice(0, 24),
        },
      })
    } else if (!buyer.phone) {
      // Backfill phone if we didn't already have it.
      await prisma.user.update({ where: { id: buyer.id }, data: { phone: String(phone).trim() } })
    }

    // Don't allow a seller to inquire on their own listing.
    if (buyer.id === deal.sellerId) {
      return NextResponse.json({ error: 'You cannot inquire on your own listing.' }, { status: 400 })
    }

    // ─── create Enquiry ────────────────────────────────────────────────────
    const buyerDetailsJson = JSON.stringify({
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      phone: String(phone).trim(),
      country: String(country).trim(),
      capitalAvailableRange: capitalAvailableRange || null,
      timeline,
      financingNeed: VALID_FINANCING.has(String(financingNeed)) ? financingNeed : 'maybe',
      buyerType,
    })

    const enquiry = await prisma.enquiry.create({
      data: {
        dealId: deal.id,
        inquirerId: buyer.id,
        inquiryType: 'general',
        message: String(message).trim().slice(0, 4000),
        buyerDetails: buyerDetailsJson,
        bindingAcknowledged: true,
      },
      select: { id: true, createdAt: true },
    })

    // ─── format display helpers ───────────────────────────────────────────
    const indLabel = industryLabel(deal.industry)
    const region = maskCity(deal.city, deal.country)
    const askRange = formatAskingRange(deal.askingPrice ?? null)
    const listingHref = `${SITE}/listing/${deal.slug ?? deal.id}`
    const buyerName = `${String(firstName).trim()} ${String(lastName).trim()}`
    const refId = enquiry.id.slice(-8).toUpperCase()

    // ─── email 1: buyer confirmation ──────────────────────────────────────
    sendEmail({
      to: normalizedEmail,
      subject: `Your introduction has been received — Forward · Ref ${refId}`,
      html: luxuryEmail({
        preheader: `Forward is verifying your details and facilitating the introduction. Reference ${refId}.`,
        eyebrow: 'Introduction received',
        title: 'Thank you — your introduction is being verified.',
        intro: `Forward Intelligence has received your inquiry on a confidential ${indLabel} business in ${region}. We facilitate every introduction personally to protect both sides.`,
        innerHtml: `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #E8E4DC;border-radius:4px;margin:8px 0 16px">
            <tr><td style="padding:20px 24px">
              <p style="margin:0 0 6px;font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.22em;color:#B8956A;text-transform:uppercase;font-weight:bold">Listing of interest</p>
              <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#1A1A1A">Confidential ${indLabel} Business</p>
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#6B6760">${region} · Asking ${askRange}</p>
              <p style="margin:8px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;color:#9A938A">Reference · ${refId}</p>
            </td></tr>
          </table>
          <p style="margin:0 0 12px;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.7;color:#4A463F">What happens next:</p>
          <ol style="margin:0 0 16px;padding-left:18px;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.7;color:#4A463F">
            <li style="margin-bottom:6px">A Forward analyst verifies your details (typically within 24 hours).</li>
            <li style="margin-bottom:6px">We notify the seller and present your profile.</li>
            <li style="margin-bottom:6px">If the seller agrees to engage, we open a confidential channel and share next steps.</li>
          </ol>
          <p style="margin:0 0 16px;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.7;color:#6B6760;font-style:italic">By submitting this request, you acknowledged that Forward facilitates the introduction and a success fee applies if the transaction closes through Forward.</p>`,
        cta: { label: 'View listing on Forward', href: listingHref },
        secondaryCta: { label: 'Manage your account →', href: `${SITE}/saved` },
        footerNote: 'You are receiving this because you submitted an introduction request on Forward Intelligence.',
      }),
    }).catch((e) => console.error('[enquiry/buyer-email]', e))

    // ─── email 2: seller notification (anonymized buyer details, gated) ───
    if (deal.seller?.email) {
      const reviewHref = `${SITE}/dashboard/seller#enquiries`
      sendEmail({
        to: deal.seller.email,
        subject: `New verified inquiry on your Forward listing · Ref ${refId}`,
        html: luxuryEmail({
          preheader: `A qualified buyer has expressed interest. Review in your dashboard.`,
          eyebrow: 'Verified buyer inquiry',
          title: 'A qualified buyer has requested an introduction.',
          intro: 'Forward Intelligence has received and validated a new inquiry on your confidential listing. Open your dashboard to review the buyer profile and decide whether to engage.',
          innerHtml: `
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #E8E4DC;border-radius:4px;margin:8px 0 16px">
              <tr><td style="padding:20px 24px">
                <p style="margin:0 0 6px;font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.22em;color:#B8956A;text-transform:uppercase;font-weight:bold">Buyer profile (Forward-verified)</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                  <td style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#4A463F;padding:8px 16px 8px 0">
                    <strong style="color:#1A1A1A">Buyer type</strong><br>${escapeHtml(humanizeBuyerType(String(buyerType)))}
                  </td>
                  <td style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#4A463F;padding:8px 16px 8px 0">
                    <strong style="color:#1A1A1A">Country</strong><br>${escapeHtml(String(country))}
                  </td>
                  <td style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#4A463F;padding:8px 0">
                    <strong style="color:#1A1A1A">Timeline</strong><br>${escapeHtml(humanizeTimeline(String(timeline)))}
                  </td>
                </tr><tr>
                  <td style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#4A463F;padding:8px 16px 8px 0">
                    <strong style="color:#1A1A1A">Capital available</strong><br>${escapeHtml(String(capitalAvailableRange || 'Not specified'))}
                  </td>
                  <td style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#4A463F;padding:8px 16px 8px 0">
                    <strong style="color:#1A1A1A">Financing</strong><br>${escapeHtml(humanizeFinancing(String(financingNeed || 'maybe')))}
                  </td>
                  <td style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#4A463F;padding:8px 0">
                    <strong style="color:#1A1A1A">Reference</strong><br>${refId}
                  </td>
                </tr></table>
              </td></tr>
            </table>
            <p style="margin:0 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#6B6760;font-weight:bold;text-transform:uppercase;letter-spacing:0.08em">Their message</p>
            <p style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#1A1A1A;font-style:italic;padding-left:14px;border-left:2px solid #B8956A">${escapeHtml(String(message))}</p>
            <p style="margin:0 0 12px;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#6B6760">Open your dashboard to view buyer contact details and accept or decline the introduction.</p>`,
          cta: { label: 'Review inquiry in dashboard', href: reviewHref },
          footerNote: 'For your security, Forward never shares your contact details with buyers until you choose to engage.',
        }),
      }).catch((e) => console.error('[enquiry/seller-email]', e))
    }

    // ─── email 3: Forward audit copy (full buyer + seller details) ────────
    sendEmail({
      to: FORWARD_AUDIT_EMAIL,
      subject: `[AUDIT] Binding intro · ${refId} · ${indLabel} ${region}`,
      html: luxuryEmail({
        eyebrow: 'Binding introduction audit',
        title: `New binding introduction · Ref ${refId}`,
        intro: 'A new buyer-seller introduction has been recorded. This is the Forward audit copy — used to track binding intros and downstream success fees.',
        innerHtml: `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #E8E4DC;border-radius:4px;margin:8px 0 16px">
            <tr><td style="padding:20px 24px;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#4A463F;line-height:1.8">
              <p style="margin:0 0 10px"><strong style="color:#1A1A1A">Listing:</strong> ${escapeHtml(indLabel)} · ${escapeHtml(region)} · Asking ${escapeHtml(askRange)} · ${escapeHtml(deal.id)}</p>
              <p style="margin:0 0 10px"><strong style="color:#1A1A1A">Seller:</strong> ${escapeHtml(deal.seller?.name || '—')} · ${escapeHtml(deal.seller?.email || '—')}</p>
              <p style="margin:0 0 10px"><strong style="color:#1A1A1A">Buyer:</strong> ${escapeHtml(buyerName)} · ${escapeHtml(normalizedEmail)} · ${escapeHtml(String(phone))} · ${escapeHtml(String(country))}</p>
              <p style="margin:0 0 10px"><strong style="color:#1A1A1A">Capital:</strong> ${escapeHtml(String(capitalAvailableRange || '—'))}</p>
              <p style="margin:0 0 10px"><strong style="color:#1A1A1A">Timeline:</strong> ${escapeHtml(humanizeTimeline(String(timeline)))}</p>
              <p style="margin:0 0 10px"><strong style="color:#1A1A1A">Buyer type:</strong> ${escapeHtml(humanizeBuyerType(String(buyerType)))}</p>
              <p style="margin:0 0 10px"><strong style="color:#1A1A1A">Financing:</strong> ${escapeHtml(humanizeFinancing(String(financingNeed || 'maybe')))}</p>
              <p style="margin:0 0 0"><strong style="color:#1A1A1A">Reference:</strong> ${refId} · Acknowledged: ✓</p>
            </td></tr>
          </table>
          <p style="margin:0 0 6px;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#6B6760;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase">Buyer message</p>
          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:14px;line-height:1.7;color:#1A1A1A;padding-left:14px;border-left:2px solid #B8956A">${escapeHtml(String(message))}</p>`,
        cta: { label: 'Open the listing', href: listingHref },
      }),
    }).catch((e) => console.error('[enquiry/audit-email]', e))

    return NextResponse.json({
      success: true,
      enquiryId: enquiry.id,
      reference: refId,
    })
  } catch (e) {
    console.error('[API] enquiries error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

function humanizeTimeline(t: string): string {
  switch (t) {
    case 'immediate': return 'Ready to move immediately'
    case '1-3mo': return 'Within 1-3 months'
    case '3-6mo': return 'Within 3-6 months'
    case '6-12mo': return 'Within 6-12 months'
    case 'exploring': return 'Exploring the market'
    default: return t
  }
}
function humanizeBuyerType(t: string): string {
  switch (t) {
    case 'individual': return 'Individual buyer'
    case 'family-office': return 'Family office'
    case 'pe': return 'Private equity'
    case 'strategic': return 'Strategic acquirer'
    case 'broker': return 'Broker representing buyer'
    default: return t
  }
}
function humanizeFinancing(t: string): string {
  switch (t) {
    case 'no': return 'No — cash purchase'
    case 'maybe': return 'Maybe — exploring options'
    case 'yes': return 'Yes — needs financing'
    default: return t
  }
}
function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

/**
 * Notification email templates — cadence-aware copy, same luxury chrome.
 *
 * Free Weekly: "Your weekly digest" + the upgrade prompt to Premium.
 * Premium Daily: "Today on Forward" + signal density (heat, country).
 * Premium INSTANT: "Just landed" + a tighter list (1-3 items usually).
 *
 * Every email carries the per-category unsub footer ("Switch to weekly"
 * / "Manage preferences"). No category-mass unsub — scoped opt-outs
 * only, so a buyer who turns off price-change alerts still gets new
 * matches.
 */
import { luxuryEmail, listingBlock } from '@/lib/email-templates'
import { formatAskingRange } from '@/lib/public-listing'
import { industryLabel } from '@/lib/listing-narrative'
import { maskCity } from '@/lib/listing-helpers'
import type { AlertFrequency } from '@prisma/client'
import { trackingPixelUrl } from '@/lib/notifications/tracking'

interface DealCard {
  id: string
  slug: string | null
  industry: string
  city: string | null
  country: string
  askingPriceCents: number | null
  heatScore: number | null
}

interface DigestOptions {
  cadence: AlertFrequency
  isPaid: boolean
  userName?: string
  deals: DealCard[]
  /** When provided, an invisible open-tracking pixel is injected.
   *  Drives engagement-decay in the send-window. */
  tracking?: { userId: string; sendId: string }
}

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.forwardos.ai'

export function renderMatchDigest({ cadence, isPaid, userName, deals, tracking }: DigestOptions): string {
  const cards = deals
    .map((d) => listingBlock({
      industryLabel: industryLabel(d.industry as never),
      region: maskCity(d.city, d.country),
      askingRange: formatAskingRange(d.askingPriceCents != null ? BigInt(d.askingPriceCents) : null),
      heatScore: d.heatScore ?? null,
      href: `${SITE}/listing/${d.slug || d.id}`,
    }))
    .join('')

  const eyebrow =
    cadence === 'WEEKLY' ? 'Your weekly intelligence' :
    cadence === 'DAILY'  ? 'Today on Forward' :
                           'Just landed'

  const title =
    cadence === 'WEEKLY' ? `${deals.length} new ${deals.length === 1 ? 'opportunity' : 'opportunities'} matched your saved searches this week` :
    cadence === 'DAILY'  ? `${deals.length} new ${deals.length === 1 ? 'match' : 'matches'} since yesterday` :
                           `${deals.length} new ${deals.length === 1 ? 'match' : 'matches'} on Forward`

  const intro =
    cadence === 'WEEKLY' && !isPaid
      ? 'Ranked by Forward Intelligence. Want these in real time, every morning? Buyer Premium gets the same intel + close-probability scoring on every listing.'
      : cadence === 'DAILY'
      ? 'Your morning briefing — ranked by close probability. Identities are revealed to qualified buyers through Forward.'
      : 'A fresh batch — ranked by close probability. Move first.'

  const cta = { label: 'Browse all matches on Forward', href: `${SITE}/marketplace` }

  const secondaryCta = isPaid
    ? { label: 'Manage your alert preferences →', href: `${SITE}/account/notifications` }
    : { label: 'Upgrade to real-time alerts (Premium $99/mo) →', href: `${SITE}/api/billing/checkout?tier=BUYER_PREMIUM` }

  const footerNote = renderFooterNote(cadence)

  // Open-tracking pixel — injected when the send-window passes a
  // (userId, sendId). 1×1 transparent GIF served by /api/notifications/open.
  // The pixel updates lastEmailEngagedAt, which is read by the engagement-
  // decay logic to keep INSTANT/DAILY users from being silently stepped
  // down. Always at the very bottom of the email body.
  const pixel = tracking
    ? `<img src="${trackingPixelUrl(tracking)}" alt="" width="1" height="1" style="display:block;border:0;width:1px;height:1px" />`
    : ''

  return luxuryEmail({
    preheader: `${deals.length} new opportunities matched on Forward Intelligence.`,
    eyebrow,
    title,
    greetingName: userName,
    intro,
    innerHtml: cards + pixel,
    cta,
    secondaryCta,
    footerNote,
  })
}

function renderFooterNote(cadence: AlertFrequency): string {
  const prefs = `${SITE}/account/notifications`
  const other = cadence === 'WEEKLY' ? 'daily' : 'weekly'
  const otherCadenceUrl = `${SITE}/account/notifications?switch=${other}`
  return `You are receiving this because you opted in to Forward Intelligence match alerts. <a href="${prefs}" style="color:#8C6D45;text-decoration:underline">Manage preferences</a> · <a href="${otherCadenceUrl}" style="color:#8C6D45;text-decoration:underline">Switch to ${other}</a>`
}

/**
 * Welcome email sent the moment a user upgrades to a paid plan.
 * Confirms what changed and shows the value they unlocked. Single CTA.
 */
export function renderWelcomePremium({ userName, tier }: { userName?: string; tier: 'BUYER_PREMIUM' | 'BROKER_PRO' }): string {
  const isBuyer = tier === 'BUYER_PREMIUM'
  return luxuryEmail({
    preheader: `Welcome to Forward ${isBuyer ? 'Buyer Premium' : 'Broker Pro'}. Your first morning brief lands tomorrow at 7am.`,
    eyebrow: 'Welcome',
    title: isBuyer ? 'You\'re in. Smart Daily alerts start tomorrow.' : 'You\'re in. Broker Pro is live.',
    greetingName: userName,
    intro: isBuyer
      ? 'Every weekday morning at 7am local time, you\'ll get one digest: every new match across your saved searches, ranked by close probability, with the driver signals behind each score. Same intel free buyers wait a week for. <br><br>Quiet hours, daily caps, and category filters are on by default so you stay in control.'
      : 'Every inquiry, NDA, data room visit, and stage advancement now flows into your Pipeline view. We\'ve set sensible defaults: 2 emails/day max, quiet hours 9pm–7am, and real-time only for high-importance signals.',
    innerHtml: '',
    cta: { label: isBuyer ? 'See your saved searches' : 'Open your pipeline', href: isBuyer ? `${SITE}/saved-searches` : `${SITE}/dashboard/broker/pipeline` },
    secondaryCta: { label: 'Adjust notification preferences →', href: `${SITE}/account/notifications` },
    footerNote: `Welcome to Forward Intelligence. You can change frequency, quiet hours, and per-category preferences anytime at <a href="${SITE}/account/notifications" style="color:#8C6D45;text-decoration:underline">/account/notifications</a>.`,
  })
}

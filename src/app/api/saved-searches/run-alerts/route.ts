import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { matchDeals } from '@/lib/services/saved-search-service'
import { sendEmail } from '@/lib/services/email'
import { formatAskingRange } from '@/lib/public-listing'
import { industryLabel } from '@/lib/listing-narrative'
import { maskCity } from '@/lib/listing-helpers'
import { luxuryEmail, listingBlock } from '@/lib/email-templates'

/**
 * POST /api/saved-searches/run-alerts  (cron-callable)
 *
 * For every alert-enabled saved search, finds deals published since the last
 * alert, emails an AI-ranked digest, records an AlertDelivery, and advances
 * lastAlertedAt. Email service logs to console when no provider key is set.
 */
export async function POST(_request: NextRequest) {
  try {
    const searches = await prisma.savedSearch.findMany({
      where: { alertEnabled: true },
      include: { user: { select: { email: true, name: true } } },
    })

    let sent = 0
    for (const search of searches) {
      const since = search.lastAlertedAt ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const matches = await matchDeals(JSON.parse(search.filters), { since, take: 10 })
      if (matches.length === 0) continue

      // PRIVACY: never embed the real `m.title` (company name), city, or any
      // identifying detail in a buyer-facing email. We send INDUSTRY · REGION
      // · ASKING RANGE + a link to view the (already-anonymized) listing.
      //
      // LAYOUT: single-column card blocks (NOT a 4-col table). The old table
      // layout cramped to ~80px per cell on phones and rendered "View →" as a
      // vertical stack of letters in iOS Mail. luxuryEmail + listingBlock are
      // mobile-tested.
      const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.forwardos.ai'
      const cards = matches
        .map((m) => listingBlock({
          industryLabel: industryLabel(m.industry),
          region: maskCity(m.city, m.country),
          askingRange: formatAskingRange(m.askingPrice != null ? BigInt(m.askingPrice) : null),
          heatScore: m.heatScore ?? null,
          href: `${SITE}/listing/${m.slug || m.id}`,
        }))
        .join('')

      await sendEmail({
        to: search.user.email,
        subject: `${matches.length} new confidential ${matches.length > 1 ? 'businesses' : 'business'} matched your saved search`,
        html: luxuryEmail({
          preheader: `${matches.length} new opportunity matches for "${search.name}".`,
          eyebrow: 'Curated for you',
          title: `${matches.length} new ${matches.length === 1 ? 'opportunity' : 'opportunities'} matched your saved search`,
          intro: `Ranked by Forward Intelligence — strongest opportunities first. Identities are revealed to qualified buyers through Forward.`,
          innerHtml: cards,
          cta: { label: 'Browse all matches on Forward', href: `${SITE}/marketplace` },
          secondaryCta: { label: 'Manage your alert preferences →', href: `${SITE}/saved-searches` },
          footerNote: `You are receiving this because you set up the alert "${escapeForEmail(search.name)}" on Forward Intelligence.`,
        }),
      })

      await prisma.alertDelivery.create({
        data: {
          savedSearchId: search.id,
          dealIds: JSON.stringify(matches.map((m) => m.id)),
          matchCount: matches.length,
        },
      })
      await prisma.savedSearch.update({ where: { id: search.id }, data: { lastAlertedAt: new Date() } })
      sent++
    }

    return NextResponse.json({ success: true, alertsSent: sent, searchesChecked: searches.length })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Run failed' }, { status: 500 })
  }
}

function escapeForEmail(s: string): string {
  return s.replace(/[<>"&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '"': '&quot;', '&': '&amp;' }[c] || c))
}

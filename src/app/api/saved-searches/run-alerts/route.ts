import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { matchDeals } from '@/lib/services/saved-search-service'
import { sendEmail } from '@/lib/services/email'
import { toPublicListing, formatAskingRange } from '@/lib/public-listing'
import { industryLabel } from '@/lib/listing-narrative'
import { maskCity } from '@/lib/listing-helpers'

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
      const rows = matches
        .map((m) => {
          const indLabel = industryLabel(m.industry)
          const region = maskCity(m.city, m.country)
          const askRange = formatAskingRange(m.askingPrice != null ? BigInt(m.askingPrice) : null)
          const href = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.forwardos.ai'}/listing/${m.slug || m.id}`
          return `<tr>
              <td style="padding:10px 14px;border-bottom:1px solid #E5E7EB"><strong style="color:#1A1A1A">Confidential ${indLabel}</strong><br/><span style="color:#717171">${region}</span></td>
              <td style="padding:10px 14px;border-bottom:1px solid #E5E7EB;color:#1A1A1A">${askRange}</td>
              <td style="padding:10px 14px;border-bottom:1px solid #E5E7EB">🔥 ${m.heatScore ?? '—'}</td>
              <td style="padding:10px 14px;border-bottom:1px solid #E5E7EB"><a href="${href}" style="color:#3B82F6;font-weight:bold">View →</a></td>
            </tr>`
        })
        .join('')

      await sendEmail({
        to: search.user.email,
        subject: `${matches.length} new confidential ${matches.length > 1 ? 'businesses' : 'business'} matched your saved search`,
        html: `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:640px;margin:0 auto;padding:24px">
          <h2 style="color:#1A1A1A;margin:0 0 8px">New matches for your saved search</h2>
          <p style="color:#717171;font-size:14px;margin:0 0 20px">Ranked by Forward Intelligence — strongest opportunities first. Identities are revealed to verified buyers after NDA.</p>
          <table style="border-collapse:collapse;width:100%"><tbody>${rows}</tbody></table>
          <p style="margin:24px 0 0;font-size:13px"><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.forwardos.ai'}/saved-searches" style="color:#3B82F6">Manage your alerts →</a></p>
        </div>`,
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

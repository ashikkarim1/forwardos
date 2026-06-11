import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { matchDeals } from '@/lib/services/saved-search-service'
import { sendEmail } from '@/lib/services/email'
import { formatCurrency } from '@/lib/currency'

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

      const rows = matches
        .map(
          (m) =>
            `<tr>
              <td style="padding:8px 12px"><strong>${m.title}</strong><br/><span style="color:#717171">${m.city || ''} ${m.country}</span></td>
              <td style="padding:8px 12px">${m.askingPrice != null ? formatCurrency(m.askingPrice / 100, 'USD') : '—'}</td>
              <td style="padding:8px 12px">🔥 ${m.heatScore ?? '—'}</td>
            </tr>`,
        )
        .join('')

      await sendEmail({
        to: search.user.email,
        subject: `${matches.length} new business${matches.length > 1 ? 'es' : ''} match "${search.name}"`,
        html: `<h2>New matches for "${search.name}"</h2>
          <p>Ranked by ForwardOS heat score — strongest opportunities first.</p>
          <table style="border-collapse:collapse;width:100%"><tbody>${rows}</tbody></table>
          <p style="margin-top:16px"><a href="${process.env.APP_URL || 'http://localhost:3000'}/saved-searches">Manage your alerts →</a></p>`,
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

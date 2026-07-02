import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { matchDeals } from '@/lib/services/saved-search-service'
import { sendEmail } from '@/lib/services/email'
import { formatAskingRange } from '@/lib/public-listing'
import { industryLabel } from '@/lib/listing-narrative'
import { maskCity } from '@/lib/listing-helpers'
import { luxuryEmail, listingBlock } from '@/lib/email-templates'
import Anthropic from '@anthropic-ai/sdk'

// Background digests run on Haiku — summarizing 10 listing snippets into one
// intro line needs no frontier reasoning, and Haiku is ~1/3 the cost of
// Sonnet. Interactive copilot chat stays on Sonnet (COPILOT_MODEL).
const DIGEST_MODEL = process.env.COPILOT_DIGEST_MODEL || 'claude-haiku-4-5-20251001'

const STATIC_INTRO =
  'Ranked by Forward Intelligence — strongest opportunities first. Identities are revealed to qualified buyers through Forward.'

async function digestIntro(
  searchName: string,
  matches: Array<{ industry: string; country: string; heatScore: number | null }>,
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) return STATIC_INTRO
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const summary = matches
      .map((m) => `${industryLabel(m.industry)} in ${m.country}${m.heatScore != null ? ` (heat ${m.heatScore})` : ''}`)
      .join('; ')
    const res = await client.messages.create({
      model: DIGEST_MODEL,
      max_tokens: 120,
      messages: [{
        role: 'user',
        content: `Write ONE sentence (max 30 words) introducing today's matches for a buyer's saved search "${searchName}". Matches: ${summary}. Professional M&A tone, no hype words, no exclamation marks, mention the strongest pattern you see (e.g. a hot sector or region). Return only the sentence.`,
      }],
    })
    const text = res.content.find((b) => b.type === 'text')
    const line = text && 'text' in text ? text.text.trim() : ''
    // Guard against a chatty or malformed response — fall back rather than
    // send something odd to a buyer's inbox.
    return line && line.length <= 220 && !line.includes('\n') ? line : STATIC_INTRO
  } catch {
    return STATIC_INTRO
  }
}

/**
 * POST /api/saved-searches/run-alerts  (cron-callable)
 *
 * For every alert-enabled saved search, finds deals published since the last
 * alert, emails an AI-ranked digest, records an AlertDelivery, and advances
 * lastAlertedAt. Email service logs to console when no provider key is set.
 *
 * Protected by CRON_SECRET — this endpoint sends email, so it must not be
 * publicly callable. Deterministic matching; the only LLM use is the optional
 * one-line digest intro on Haiku (cheap, and falls back to static copy).
 */
export async function POST(request: NextRequest) {
  const auth = request.headers.get('authorization') || ''
  const expected = process.env.CRON_SECRET
  if (expected && auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
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

      const intro = await digestIntro(
        search.name,
        matches.map((m) => ({ industry: m.industry, country: m.country, heatScore: m.heatScore ?? null })),
      )

      await sendEmail({
        to: search.user.email,
        subject: `${matches.length} new confidential ${matches.length > 1 ? 'businesses' : 'business'} matched your saved search`,
        html: luxuryEmail({
          preheader: `${matches.length} new opportunity matches for "${search.name}".`,
          eyebrow: 'Curated for you',
          title: `${matches.length} new ${matches.length === 1 ? 'opportunity' : 'opportunities'} matched your saved search`,
          greetingName: (search.user.name || '').split(' ')[0] || undefined,
          intro,
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

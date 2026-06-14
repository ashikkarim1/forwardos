/**
 * /intelligence/predictions — M&A Predictions
 *
 * The proprietary intelligence surface that justifies Buyer Premium.
 * Ranks every active listing by close probability, exposes the three
 * driver signals behind each score, and is the page a serious buyer
 * checks every morning.
 *
 * Access model:
 *   - Free buyers see the top 5 deals with scores blurred + an upgrade
 *     CTA. They can FEEL the value but can't act on it.
 *   - Buyer Premium sees the full ranked list with scores, drivers, and
 *     predicted close windows.
 *   - Other roles fall back to the LockedFeature pitch.
 *
 * Implementation note:
 *   Scores are computed server-side from the same /api/deals payload
 *   the marketplace uses, so the marketplace and predictions page stay
 *   in lock-step. v1 model is explainable, deterministic, and lives in
 *   lib/predictions.ts — see that file for the weights.
 */
import Link from 'next/link'
import { ArrowRight, Sparkles, TrendingUp, Lock, Info } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { predictCloseProbability, BAND_COPY, type Prediction } from '@/lib/predictions'
import { LockedFeature } from '@/components/dashboard/LockedFeature'
import { PublicHeader } from '@/components/Navigation'
import { IntelligenceNav } from '@/components/intelligence/IntelligenceNav'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'M&A Predictions · Forward Intelligence' }

interface ScoredDeal {
  id: string
  slug: string | null
  title: string
  industry: string
  country: string
  askingPriceUsd: number | null
  prediction: Prediction
}

async function loadScoredDeals(limit: number): Promise<ScoredDeal[]> {
  // Pull recent active deals. We score only the recent N because the
  // model uses freshness as a signal; older deals are still rankable
  // but rarely surface above the top of the list.
  const deals = await prisma.deal.findMany({
    where: { status: { in: ['PUBLISHED', 'ACTIVE'] } },
    orderBy: { createdAt: 'desc' },
    take: 240,  // score 240, return top N
    select: {
      id: true, slug: true, industry: true, country: true,
      title: true, dealQualityScore: true, heatScore: true,
      createdAt: true, financingEligible: true,
      askingPrice: true,  // BigInt, cents
    },
  }).catch(() => [])

  const now = Date.now()
  const scored: ScoredDeal[] = deals.map((d) => {
    const days = Math.floor((now - new Date(d.createdAt).getTime()) / 86_400_000)
    const prediction = predictCloseProbability({
      dealQualityScore: d.dealQualityScore ?? 50,
      heatIndex:        d.heatScore        ?? 50,
      daysOnMarket:     days,
      financingEligible: !!d.financingEligible,
      sellerVerified:   true,    // all PUBLISHED/ACTIVE deals are seller-verified
      growthRate:       0,        // model field; not yet stored per-deal
    })
    const cents = d.askingPrice ? Number(d.askingPrice) : 0
    return {
      id: d.id,
      slug: d.slug,
      title: d.title ?? 'Confidential listing',
      industry: String(d.industry ?? 'Other'),
      country: d.country ?? '—',
      askingPriceUsd: cents ? cents / 100 : null,
      prediction,
    }
  })

  scored.sort((a, b) => b.prediction.score - a.prediction.score)
  return scored.slice(0, limit)
}

export default async function PredictionsPage() {
  const session = await getSession()

  if (!session) {
    return (
      <LockedFeature
        kicker="Intelligence"
        title="M&A Predictions"
        pitch="Sign in to see close-probability scores on every active listing."
        bullets={[
          'Close-probability score on every active listing',
          'Predicted close window per deal',
          'Top 3 driver signals behind each score',
          'Daily refresh as new market signals land',
        ]}
        requiredTier="BUYER_PREMIUM"
      />
    )
  }

  // Plan tier gate — only PREMIUM_BUYER + ADMIN see real numbers.
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { buyerPlanTier: true, role: true },
  })
  const hasAccess = user?.role === 'ADMIN' || user?.buyerPlanTier === 'PREMIUM_BUYER'

  const deals = await loadScoredDeals(hasAccess ? 50 : 5)
  const headerCount = hasAccess ? deals.length : `${deals.length} of 50+ shown`

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EF' }}>
      <PublicHeader />
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 32, flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#8C6D45', margin: 0, marginBottom: 8 }}>
              Intelligence · M&A Predictions
            </p>
            <h1 style={{ fontSize: 36, fontWeight: 800, color: '#0F1419', margin: 0, marginBottom: 8, letterSpacing: '-0.02em' }}>
              Which deals are about to close?
            </h1>
            <p style={{ fontSize: 16, color: '#454D58', margin: 0, maxWidth: 640 }}>
              Every active listing scored from 0–100 on close probability. {hasAccess
                ? 'Drivers exposed on every card so you can act with the model, not against it.'
                : 'Free buyers see the top 5 — Premium sees the full ranked list with drivers.'}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <span style={{ fontSize: 11, color: '#6C7480' }}>Scored just now</span>
            <span style={{ fontSize: 11, color: '#6C7480' }}>{headerCount}</span>
          </div>
        </div>

        <IntelligenceNav active="predictions" />

        {!hasAccess && (
          <div style={{
            background: 'linear-gradient(135deg, #FAF6EF 0%, #F2EAD9 100%)',
            border: '1px solid #E5D5B5', borderRadius: 14, padding: '20px 24px',
            marginBottom: 28, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 999, background: '#0F1419', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <Sparkles size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <h3 style={{ margin: 0, marginBottom: 4, fontSize: 16, fontWeight: 700, color: '#0F1419' }}>
                Unlock the full ranked list & driver signals
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: '#454D58' }}>
                Buyer Premium · $99/mo · cancel anytime. See every active deal scored, with the top three signals behind each score and a predicted close window.
              </p>
            </div>
            <Link href="/api/billing/checkout?tier=BUYER_PREMIUM" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 20px', borderRadius: 10,
              background: '#0F1419', color: '#fff',
              fontSize: 14, fontWeight: 600, textDecoration: 'none',
            }}>
              Upgrade <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {deals.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #E8EAED', borderRadius: 12, padding: '48px 24px', textAlign: 'center', color: '#6C7480' }}>
            No published deals to score yet. Check back shortly.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {deals.map((d, i) => <PredictionRow key={d.id} rank={i + 1} deal={d} blurScore={!hasAccess} />)}
          </div>
        )}

        <p style={{ marginTop: 32, fontSize: 12, color: '#6C7480', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Info size={12} /> Scores refresh daily. Model v1 is deterministic and explainable — every score is the weighted sum of the drivers shown. ML-backed v2 lands when training data permits.
        </p>
      </div>
    </div>
  )
}

function PredictionRow({ rank, deal, blurScore }: { rank: number; deal: ScoredDeal; blurScore: boolean }) {
  const { prediction } = deal
  const band = BAND_COPY[prediction.band]
  const href = deal.slug ? `/listing/${deal.slug}` : `/deal/${deal.id}`

  return (
    <div style={{
      background: '#fff', border: '1px solid #E8EAED', borderRadius: 14, padding: 20,
      display: 'grid', gridTemplateColumns: '36px 1fr auto', gap: 20, alignItems: 'center',
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#9CA3AF', textAlign: 'center' }}>#{rank}</div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Link href={href} style={{ fontSize: 16, fontWeight: 700, color: '#0F1419', textDecoration: 'none' }}>
            {deal.title}
          </Link>
          <span style={{ fontSize: 11, color: '#6C7480' }}>{deal.industry} · {deal.country}</span>
          {deal.askingPriceUsd && (
            <span style={{ fontSize: 11, color: '#6C7480' }}>· ${(deal.askingPriceUsd / 1_000_000).toFixed(1)}M</span>
          )}
        </div>
        <p style={{ margin: 0, fontSize: 13, color: '#454D58' }}>{prediction.rationale}</p>
        {!blurScore && (
          <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {prediction.drivers.map((dr) => (
              <span key={dr.key} title={dr.detail} style={{
                fontSize: 11, fontWeight: 600,
                background: '#F4EFE5', color: '#8C6D45',
                padding: '4px 8px', borderRadius: 999,
              }}>
                {dr.label} · {Math.round(dr.contribution * 100)}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'right', minWidth: 140 }}>
        {blurScore ? (
          <Link href="/api/billing/checkout?tier=BUYER_PREMIUM" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 10px', borderRadius: 8,
            background: '#0F1419', color: '#fff',
            fontSize: 12, fontWeight: 600, textDecoration: 'none',
          }}>
            <Lock size={11} /> Unlock score
          </Link>
        ) : (
          <>
            <div style={{ fontSize: 30, fontWeight: 800, color: band.color, lineHeight: 1 }}>
              {prediction.score}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: band.color, marginTop: 4, letterSpacing: '0.04em' }}>
              {band.label}
            </div>
            <div style={{ fontSize: 11, color: '#6C7480', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
              <TrendingUp size={11} /> Close in {prediction.closeWindowMonths.min}–{prediction.closeWindowMonths.max} mo
            </div>
          </>
        )}
      </div>
    </div>
  )
}

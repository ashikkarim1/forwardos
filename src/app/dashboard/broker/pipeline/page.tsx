/**
 * /dashboard/broker/pipeline — the broker's Kanban CRM.
 *
 * The workflow-consolidation moat for Broker Pro. Pulls every Enquiry
 * on every Deal the broker owns (Deal.sellerId === brokerUserId) and
 * groups them into a 6-stage pipeline derived from Enquiry.status +
 * adjacent NDA/DataRoomAccess signals.
 *
 * Why this matters:
 *   Brokers today run their pipeline in HubSpot, Pipedrive, or a
 *   spreadsheet. Owning this surface keeps the broker logged into
 *   Forward all day — every inquiry, NDA, data room view, and message
 *   is on this page. That's the workflow lock-in that justifies $599/mo.
 *
 * v1 scope:
 *   - Read-only Kanban with rich cards
 *   - Each card shows buyer (anonymized until KYC verified), deal,
 *     asking price, days-in-stage, last signal
 *   - Quick actions: message buyer, open deal, view data room
 *   - Empty-state guidance when broker has no inquiries yet
 *
 * Out of scope (next iteration):
 *   - Drag-to-advance stage (needs client + an API endpoint)
 *   - Filter by deal / buyer search
 *   - Bulk actions (mass-decline, mass-NDA)
 *   - Delegated deals from BrokerDelegation (currently only owned deals)
 */
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, MessageSquare, FileText, Clock, TrendingUp, ChevronRight } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { LockedFeature } from '@/components/dashboard/LockedFeature'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Pipeline · Forward Broker Pro' }

type Stage = 'new' | 'contacted' | 'nda' | 'data_room' | 'diligence' | 'closed'

interface PipelineCard {
  enquiryId: string
  buyerLabel: string         // anonymized unless KYC complete
  buyerVerified: boolean
  dealId: string
  dealTitle: string
  dealSlug: string | null
  askingPriceUsd: number | null
  industry: string
  country: string
  stage: Stage
  daysInStage: number
  lastSignal: string         // human-readable
  hasUnread: boolean
}

const STAGE_META: Record<Stage, { label: string; color: string; intent: string }> = {
  new:       { label: 'New inquiry',   color: '#8C6D45', intent: 'Reply to introduce yourself' },
  contacted: { label: 'Contacted',     color: '#B8956A', intent: 'Send NDA + qualify intent' },
  nda:       { label: 'NDA signed',    color: '#2E8B57', intent: 'Grant data room access' },
  data_room: { label: 'In data room',  color: '#1B7F4E', intent: 'Watch for diligence questions' },
  diligence: { label: 'Active diligence', color: '#0F1419', intent: 'Push to LOI / negotiate' },
  closed:    { label: 'Closed',        color: '#6C7480', intent: 'Archived' },
}

const STAGE_ORDER: Stage[] = ['new', 'contacted', 'nda', 'data_room', 'diligence', 'closed']

async function loadPipeline(brokerId: string): Promise<PipelineCard[]> {
  const deals = await prisma.deal.findMany({
    where: { sellerId: brokerId, status: { in: ['PUBLISHED', 'ACTIVE'] } },
    select: { id: true },
  }).catch(() => [])

  if (deals.length === 0) return []

  const dealIds = deals.map((d) => d.id)

  const enquiries = await prisma.enquiry.findMany({
    where: { dealId: { in: dealIds } },
    orderBy: { createdAt: 'desc' },
    include: {
      deal:     { select: { id: true, slug: true, title: true, askingPrice: true, industry: true, country: true } },
      inquirer: { select: { id: true, name: true, email: true, kycStatus: true } },
    },
  }).catch(() => [])

  // DataRoomAccess carries both ndaSigned and updatedAt — covers the NDA
  // signal and the "last activity" proxy in one query.
  const enquirerIds = enquiries.map((e) => e.inquirerId)
  const accesses = await prisma.dataRoomAccess.findMany({
    where: { dataRoom: { dealId: { in: dealIds } }, userId: { in: enquirerIds } },
    select: {
      userId: true,
      ndaSigned: true,
      approvedAt: true,
      updatedAt: true,
      dataRoom: { select: { dealId: true } },
    },
  }).catch(() => [])

  const ndaKeySet = new Set<string>()
  const accessMap = new Map<string, Date>()
  for (const a of accesses) {
    const key = `${a.dataRoom.dealId}:${a.userId}`
    if (a.ndaSigned) ndaKeySet.add(key)
    if (a.approvedAt) accessMap.set(key, a.updatedAt ?? a.approvedAt)
  }

  const now = Date.now()

  return enquiries.map((e): PipelineCard => {
    const accessKey = `${e.dealId}:${e.inquirerId}`
    const hasNda = ndaKeySet.has(accessKey)
    const lastAccess = accessMap.get(accessKey)

    // Derive stage. Order matters — later checks override earlier ones.
    let stage: Stage = e.status === 'pending' ? 'new'
                     : e.status === 'closed'  ? 'closed'
                     : 'contacted'
    if (hasNda) stage = 'nda'
    if (lastAccess && (now - lastAccess.getTime() < 30 * 86_400_000)) stage = 'data_room'
    if (e.status === 'responded' && lastAccess && (now - lastAccess.getTime() < 7 * 86_400_000)) stage = 'diligence'

    const stageStart =
      stage === 'closed'   ? (e.respondedAt ?? e.createdAt) :
      lastAccess && stage !== 'contacted' && stage !== 'new' ? lastAccess :
      e.respondedAt ?? e.createdAt

    const daysInStage = Math.max(0, Math.floor((now - new Date(stageStart).getTime()) / 86_400_000))

    const buyerVerified = e.inquirer.kycStatus === 'VERIFIED'
    const buyerLabel = buyerVerified
      ? (e.inquirer.name || e.inquirer.email.split('@')[0])
      : `Buyer #${e.inquirerId.slice(0, 6).toUpperCase()}`

    const lastSignal =
      stage === 'diligence' ? `Last data-room visit ${daysInStage}d ago` :
      stage === 'data_room' ? `Entered data room ${daysInStage}d ago` :
      stage === 'nda'       ? `Signed NDA ${daysInStage}d ago` :
      stage === 'contacted' ? `Responded ${daysInStage}d ago` :
      stage === 'closed'    ? `Closed ${daysInStage}d ago` :
                              `Inquired ${daysInStage}d ago`

    const askingCents = e.deal.askingPrice ? Number(e.deal.askingPrice) : 0

    return {
      enquiryId: e.id,
      buyerLabel,
      buyerVerified,
      dealId: e.deal.id,
      dealTitle: e.deal.title,
      dealSlug: e.deal.slug,
      askingPriceUsd: askingCents ? askingCents / 100 : null,
      industry: String(e.deal.industry ?? 'Other'),
      country: e.deal.country ?? '—',
      stage,
      daysInStage,
      lastSignal,
      hasUnread: e.status === 'pending',
    }
  })
}

export default async function BrokerPipelinePage() {
  const session = await getSession()
  if (!session) redirect('/auth/login?redirect=%2Fdashboard%2Fbroker%2Fpipeline')

  // Role + tier gate: broker-only, and only on Broker Pro
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true, brokerPlanTier: true },
  })
  if (!user) redirect('/auth/login')
  if (user.role !== 'BROKER' && user.role !== 'ADMIN') {
    redirect('/dashboard')
  }
  if (user.role === 'BROKER' && user.brokerPlanTier !== 'BROKER_PRO') {
    return (
      <LockedFeature
        kicker="Broker Pro"
        title="Pipeline & CRM"
        pitch="Every inquiry, NDA, data room visit, and conversation in one place. Replace your HubSpot + Pipedrive + spreadsheets with one workflow built for M&A."
        bullets={[
          'Kanban board across 6 deal stages',
          'Auto-derived stages from NDA + data room signals',
          'Days-in-stage and unread inquiry tracking',
          'One-click message, NDA, and data room actions',
        ]}
        requiredTier="BROKER_PRO"
      />
    )
  }

  const cards = await loadPipeline(session.userId)
  const cardsByStage = STAGE_ORDER.reduce<Record<Stage, PipelineCard[]>>((acc, s) => {
    acc[s] = cards.filter((c) => c.stage === s)
    return acc
  }, { new: [], contacted: [], nda: [], data_room: [], diligence: [], closed: [] })

  const stats = {
    total: cards.length,
    active: cards.filter((c) => c.stage !== 'closed').length,
    new: cardsByStage.new.length,
    inDiligence: cardsByStage.diligence.length,
  }

  return (
    <div style={{ background: '#FAF6EF', minHeight: '100%' }}>
      <div style={{ padding: '32px 32px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#8C6D45', margin: 0, marginBottom: 8 }}>
              Broker Pro · Pipeline
            </p>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0F1419', margin: 0, letterSpacing: '-0.02em' }}>
              Your active pipeline
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 24, fontSize: 13 }}>
            <Stat label="Active" value={stats.active} accent />
            <Stat label="New" value={stats.new} />
            <Stat label="In diligence" value={stats.inDiligence} />
            <Stat label="All-time" value={stats.total} muted />
          </div>
        </div>

        {cards.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${STAGE_ORDER.length}, minmax(260px, 1fr))`,
            gap: 12,
            overflowX: 'auto',
            paddingBottom: 24,
          }}>
            {STAGE_ORDER.map((stage) => (
              <Column key={stage} stage={stage} cards={cardsByStage[stage]} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value, accent, muted }: { label: string; value: number; accent?: boolean; muted?: boolean }) {
  const color = accent ? '#8C6D45' : muted ? '#9CA3AF' : '#0F1419'
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: '#6C7480', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
    </div>
  )
}

function Column({ stage, cards }: { stage: Stage; cards: PipelineCard[] }) {
  const meta = STAGE_META[stage]
  return (
    <div style={{
      background: '#fff', border: '1px solid #E8EAED', borderRadius: 12,
      display: 'flex', flexDirection: 'column', minHeight: 240, maxHeight: 'calc(100vh - 200px)',
    }}>
      <div style={{ padding: '12px 14px', borderBottom: '1px solid #F0F2F4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: meta.color, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#0F1419', letterSpacing: '0.02em' }}>{meta.label}</span>
        </div>
        <span style={{ fontSize: 11, color: '#6C7480', fontWeight: 600 }}>{cards.length}</span>
      </div>
      <div style={{ padding: 8, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {cards.length === 0 ? (
          <p style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', padding: '20px 0', margin: 0 }}>
            Nothing here yet.
          </p>
        ) : (
          cards.map((c) => <Card key={c.enquiryId} card={c} />)
        )}
      </div>
    </div>
  )
}

function Card({ card }: { card: PipelineCard }) {
  const listingHref = card.dealSlug ? `/listing/${card.dealSlug}` : `/deal/${card.dealId}`
  return (
    <div style={{
      background: '#FFFEF8', border: '1px solid #F0E8D8', borderRadius: 10, padding: 10,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#0F1419', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {card.buyerLabel}
        </p>
        {card.buyerVerified && (
          <span title="KYC verified" style={{ fontSize: 9, color: '#1B7F4E', fontWeight: 700, letterSpacing: '0.04em' }}>✓ KYC</span>
        )}
        {card.hasUnread && (
          <span title="Unread" style={{ width: 7, height: 7, borderRadius: 999, background: '#B8956A' }} />
        )}
      </div>

      <Link href={listingHref} style={{ textDecoration: 'none' }}>
        <p style={{ margin: 0, fontSize: 11, color: '#454D58', fontWeight: 600 }}>{card.dealTitle}</p>
        <p style={{ margin: '2px 0 0', fontSize: 10, color: '#6C7480' }}>
          {card.industry} · {card.country}
          {card.askingPriceUsd && ` · $${(card.askingPriceUsd / 1_000_000).toFixed(1)}M`}
        </p>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#6C7480' }}>
        <Clock size={10} /> {card.lastSignal}
      </div>

      <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
        <Link
          href={`/messages?to=${encodeURIComponent(card.buyerLabel)}&deal=${encodeURIComponent(card.dealTitle)}`}
          style={{
            flex: 1, textAlign: 'center',
            padding: '5px 6px', borderRadius: 6,
            background: '#0F1419', color: '#fff',
            fontSize: 10, fontWeight: 600, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}
        >
          <MessageSquare size={10} /> Message
        </Link>
        <Link
          href="/data-rooms"
          style={{
            flex: 1, textAlign: 'center',
            padding: '5px 6px', borderRadius: 6,
            background: '#FFFFFF', color: '#0F1419', border: '1px solid #C7CCD3',
            fontSize: 10, fontWeight: 600, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}
        >
          <FileText size={10} /> Room
        </Link>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{
      background: '#fff', border: '1px dashed #C7CCD3', borderRadius: 14,
      padding: '64px 32px', textAlign: 'center',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 999, background: '#F4EFE5',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: '#8C6D45', marginBottom: 16,
      }}>
        <TrendingUp size={26} />
      </div>
      <h3 style={{ margin: 0, marginBottom: 8, fontSize: 18, fontWeight: 700, color: '#0F1419' }}>
        No inquiries yet
      </h3>
      <p style={{ margin: 0, marginBottom: 20, fontSize: 14, color: '#454D58', maxWidth: 460, marginLeft: 'auto', marginRight: 'auto' }}>
        Once a buyer inquires on one of your listings, they appear here in the right stage. We auto-advance the stage when they sign an NDA or enter the data room.
      </p>
      <Link href="/list" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '10px 18px', borderRadius: 10,
        background: '#0F1419', color: '#fff',
        fontSize: 14, fontWeight: 600, textDecoration: 'none',
      }}>
        List a deal <ArrowRight size={14} />
      </Link>
    </div>
  )
}

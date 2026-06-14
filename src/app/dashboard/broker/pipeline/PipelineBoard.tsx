/**
 * <PipelineBoard> — drag-to-advance Kanban for the broker pipeline.
 *
 * Server fetches all the cards (with auto-derived stages); this client
 * component owns the interaction layer: drag, drop, optimistic update,
 * API call, refresh.
 *
 * Valid drop targets per source stage — same rules as the click menu:
 *
 *   new       → contacted | closed
 *   contacted → closed
 *   nda       → closed
 *   data_room → closed
 *   diligence → closed
 *   closed    → new (reopen)
 *
 * The middle states (nda / data_room / diligence) cannot be entered
 * manually because they're auto-derived from real buyer signals
 * (NDA signed, data room access approved, recent visits). Dragging a
 * card into one of those columns triggers a polite "this advances when
 * the buyer takes action" toast — the card snaps back.
 */
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Clock, MessageSquare, FileText, ArrowRight, TrendingUp } from 'lucide-react'

export type Stage = 'new' | 'contacted' | 'nda' | 'data_room' | 'diligence' | 'closed'

export interface PipelineCard {
  enquiryId: string
  buyerLabel: string
  buyerVerified: boolean
  dealId: string
  dealTitle: string
  dealSlug: string | null
  askingPriceUsd: number | null
  industry: string
  country: string
  stage: Stage
  daysInStage: number
  lastSignal: string
  hasUnread: boolean
}

export interface StageMeta {
  label: string
  color: string
  intent: string
}

interface Props {
  cards: PipelineCard[]
  stageMeta: Record<Stage, StageMeta>
  stageOrder: Stage[]
}

// Map (from, to) → API action, or null if the transition isn't allowed.
const TRANSITION_ACTION: Record<Stage, Partial<Record<Stage, 'mark-contacted' | 'mark-closed' | 'reopen'>>> = {
  new:       { contacted: 'mark-contacted', closed: 'mark-closed' },
  contacted: { closed: 'mark-closed' },
  nda:       { closed: 'mark-closed' },
  data_room: { closed: 'mark-closed' },
  diligence: { closed: 'mark-closed' },
  closed:    { new: 'reopen' },
}

// Human reason why a transition isn't allowed — so the broker
// understands instead of feeling like the UI is broken.
function rejectReason(from: Stage, to: Stage): string {
  if (from === to) return 'Already in this stage.'
  if (to === 'nda')       return 'The NDA stage activates automatically when the buyer signs the NDA.'
  if (to === 'data_room') return 'The Data Room stage activates automatically once you approve access.'
  if (to === 'diligence') return 'The Diligence stage activates automatically as the buyer engages with the data room.'
  if (from === 'closed' && to !== 'new') return 'Closed inquiries can only be reopened — drag back to New.'
  return 'That move is not allowed from this stage.'
}

export function PipelineBoard({ cards, stageMeta, stageOrder }: Props) {
  const router = useRouter()
  const [_, startTransition] = useTransition()

  // Optimistic state — when a drag completes, we move the card
  // immediately, then call the API. If the API rejects, we re-fetch.
  const [optimistic, setOptimistic] = useState<PipelineCard[]>(cards)
  const [dragging, setDragging] = useState<string | null>(null)
  const [hoverColumn, setHoverColumn] = useState<Stage | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  function announce(msg: string) {
    setToast(msg)
    setTimeout(() => setToast((t) => (t === msg ? null : t)), 3500)
  }

  function onDragStart(e: React.DragEvent, card: PipelineCard) {
    setDragging(card.enquiryId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', card.enquiryId)
  }

  function onDragEnd() {
    setDragging(null)
    setHoverColumn(null)
  }

  function onDragOver(e: React.DragEvent, target: Stage) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setHoverColumn(target)
  }

  function onDragLeave(target: Stage) {
    setHoverColumn((cur) => (cur === target ? null : cur))
  }

  async function onDrop(e: React.DragEvent, to: Stage) {
    e.preventDefault()
    const enquiryId = e.dataTransfer.getData('text/plain')
    setDragging(null)
    setHoverColumn(null)
    if (!enquiryId) return
    const card = optimistic.find((c) => c.enquiryId === enquiryId)
    if (!card) return
    const from = card.stage
    if (from === to) return
    const action = TRANSITION_ACTION[from]?.[to]
    if (!action) {
      announce(rejectReason(from, to))
      return
    }
    // Optimistic move.
    const prevList = optimistic
    setOptimistic((cur) => cur.map((c) => (c.enquiryId === enquiryId ? { ...c, stage: to, daysInStage: 0, lastSignal: 'Just moved' } : c)))
    try {
      const r = await fetch(`/api/broker/pipeline/${enquiryId}/transition`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (!r.ok) throw new Error(`status ${r.status}`)
      // Refresh server-fetched data so auto-derived stages (NDA, data
      // room) come back accurate, not stale.
      startTransition(() => router.refresh())
      announce(`Moved to ${stageMeta[to].label}.`)
    } catch {
      // Revert.
      setOptimistic(prevList)
      announce('Could not save the move. Try again.')
    }
  }

  const cardsByStage = stageOrder.reduce<Record<Stage, PipelineCard[]>>((acc, s) => {
    acc[s] = optimistic.filter((c) => c.stage === s)
    return acc
  }, { new: [], contacted: [], nda: [], data_room: [], diligence: [], closed: [] })

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${stageOrder.length}, minmax(260px, 1fr))`,
        gap: 12,
        overflowX: 'auto',
        paddingBottom: 24,
      }}>
        {stageOrder.map((stage) => (
          <Column
            key={stage}
            stage={stage}
            meta={stageMeta[stage]}
            cards={cardsByStage[stage]}
            isHovered={hoverColumn === stage}
            dragging={dragging}
            onDragOver={(e) => onDragOver(e, stage)}
            onDragLeave={() => onDragLeave(stage)}
            onDrop={(e) => onDrop(e, stage)}
            onCardDragStart={onDragStart}
            onCardDragEnd={onDragEnd}
          />
        ))}
      </div>

      {toast && (
        <div
          role="status"
          style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            background: '#0F1419', color: '#FFFFFF',
            padding: '12px 18px', borderRadius: 10,
            fontSize: 13, fontWeight: 500,
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            zIndex: 60, maxWidth: 'calc(100vw - 32px)',
          }}
        >
          {toast}
        </div>
      )}
    </>
  )
}

function Column({
  stage, meta, cards, isHovered, dragging,
  onDragOver, onDragLeave, onDrop, onCardDragStart, onCardDragEnd,
}: {
  stage: Stage
  meta: StageMeta
  cards: PipelineCard[]
  isHovered: boolean
  dragging: string | null
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent) => void
  onCardDragStart: (e: React.DragEvent, c: PipelineCard) => void
  onCardDragEnd: () => void
}) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{
        background: '#fff',
        border: '1px solid ' + (isHovered ? '#8C6D45' : '#E8EAED'),
        borderRadius: 12,
        display: 'flex', flexDirection: 'column',
        minHeight: 240, maxHeight: 'calc(100vh - 200px)',
        transition: 'border-color 80ms ease',
      }}
    >
      <div style={{ padding: '12px 14px', borderBottom: '1px solid #F0F2F4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: meta.color, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#0F1419', letterSpacing: '0.02em' }}>{meta.label}</span>
        </div>
        <span style={{ fontSize: 11, color: '#6C7480', fontWeight: 600 }}>{cards.length}</span>
      </div>
      <div style={{
        padding: 8, overflowY: 'auto', flex: 1,
        display: 'flex', flexDirection: 'column', gap: 8,
        background: isHovered ? 'rgba(140,109,69,0.04)' : 'transparent',
      }}>
        {cards.length === 0 ? (
          <p style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', padding: '20px 0', margin: 0 }}>
            {isHovered ? 'Drop here' : 'Nothing here yet.'}
          </p>
        ) : (
          cards.map((c) => (
            <Card
              key={c.enquiryId}
              card={c}
              isDragging={dragging === c.enquiryId}
              onDragStart={(e) => onCardDragStart(e, c)}
              onDragEnd={onCardDragEnd}
            />
          ))
        )}
      </div>
    </div>
  )
}

function Card({
  card, isDragging, onDragStart, onDragEnd,
}: {
  card: PipelineCard
  isDragging: boolean
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: () => void
}) {
  const listingHref = card.dealSlug ? `/listing/${card.dealSlug}` : `/deal/${card.dealId}`
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{
        background: '#FFFEF8', border: '1px solid #F0E8D8', borderRadius: 10, padding: 10,
        display: 'flex', flexDirection: 'column', gap: 8,
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'scale(0.98)' : 'scale(1)',
        transition: 'opacity 80ms ease, transform 80ms ease',
      }}
    >
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

// Helpers exported so the parent server page doesn't need to duplicate
// the icon/intent constants.
export { ArrowRight, TrendingUp }

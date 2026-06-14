/**
 * Client-side action menu for a pipeline card. Lives in its own file
 * so the parent page can stay a server component (fetches DB-derived
 * stages, server-renders for SEO/auth speed).
 *
 * v1 manual transitions:
 *   - Mark Contacted  (new → contacted)
 *   - Close            (any active stage → closed)
 *   - Reopen           (closed → new, undoes accidental close)
 *
 * The other stages (NDA, data room, diligence) auto-derive from buyer
 * signals — we don't expose manual buttons for those because faking
 * them would mislead the seller about real progress.
 */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, XCircle, RotateCcw, MoreHorizontal } from 'lucide-react'

interface Props {
  enquiryId: string
  /** Current stage so we hide actions that don't apply. */
  stage: 'new' | 'contacted' | 'nda' | 'data_room' | 'diligence' | 'closed'
}

export function PipelineActions({ enquiryId, stage }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  async function transition(action: 'mark-contacted' | 'mark-closed' | 'reopen', label: string) {
    if (!confirm(`${label}?`)) return
    setBusy(true)
    setOpen(false)
    try {
      const r = await fetch(`/api/broker/pipeline/${enquiryId}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action }),
      })
      if (!r.ok) {
        const body = await r.json().catch(() => ({}))
        alert(`Could not update: ${body?.error || 'try again'}`)
        return
      }
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); setOpen((v) => !v) }}
        disabled={busy}
        title="More actions"
        style={{
          padding: 4, borderRadius: 4, background: 'transparent', border: 'none',
          color: '#6C7480', cursor: busy ? 'wait' : 'pointer', display: 'inline-flex',
        }}
      >
        <MoreHorizontal size={14} />
      </button>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute', right: 0, top: 22,
            background: '#FFFFFF', border: '1px solid #E8EAED', borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            padding: 4, minWidth: 170, zIndex: 50,
          }}
        >
          {stage === 'new' && (
            <ActionRow icon={<CheckCircle2 size={12} />} label="Mark contacted" onClick={() => transition('mark-contacted', 'Mark this inquiry as contacted')} />
          )}
          {stage !== 'closed' && (
            <ActionRow icon={<XCircle size={12} />} label="Close" intent="danger" onClick={() => transition('mark-closed', 'Close this inquiry')} />
          )}
          {stage === 'closed' && (
            <ActionRow icon={<RotateCcw size={12} />} label="Reopen" onClick={() => transition('reopen', 'Reopen this closed inquiry')} />
          )}
        </div>
      )}
    </div>
  )
}

function ActionRow({ icon, label, onClick, intent }: { icon: React.ReactNode; label: string; onClick: () => void; intent?: 'danger' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
        padding: '7px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
        background: 'transparent', color: intent === 'danger' ? '#B91C1C' : '#0F1419',
        fontSize: 12, fontWeight: 600, textAlign: 'left',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F4EFE5' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
    >
      {icon} {label}
    </button>
  )
}

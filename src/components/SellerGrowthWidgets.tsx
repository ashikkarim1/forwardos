'use client'

/**
 * Compact growth widgets for the seller dashboard:
 *   - ReferralCard: copy-able referral URL + count + reward
 *   - ListingVisibilityToggle: flip a listing between confidential and public
 *
 * Both are designed to drop into existing dashboard layouts with no extra wiring.
 */
import { useEffect, useState } from 'react'
import { Copy, Check, Gift, Eye, EyeOff } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT } from '@/styles/forward-colors'

interface ReferralData {
  referralCode: string
  referralUrl: string
  referralCount: number
  reward: string
}

export function ReferralCard({ userId }: { userId: string }) {
  const [data, setData] = useState<ReferralData | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!userId) return
    fetch(`/api/seller/referral?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => { if (d.referralCode) setData(d) })
      .catch(() => {})
  }, [userId])

  async function copy() {
    if (!data) return
    try {
      await navigator.clipboard.writeText(data.referralUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  if (!data) return null

  return (
    <div className="rounded-xl border p-5 bg-white" style={{ borderColor: COLOR_BORDER }}>
      <div className="flex items-center gap-2 mb-2">
        <Gift size={18} style={{ color: COLOR_ACCENT }} />
        <h3 className="font-bold" style={{ color: COLOR_PRIMARY }}>Refer a business owner</h3>
      </div>
      <p className="text-sm mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>{data.reward}</p>
      <div className="flex gap-2">
        <input
          readOnly
          value={data.referralUrl}
          className="flex-1 px-3 py-2 rounded border text-sm font-mono bg-gray-50"
          style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
          onFocus={(e) => e.currentTarget.select()}
        />
        <button onClick={copy} className="px-4 py-2 rounded text-sm font-bold text-white hover:opacity-90 flex items-center gap-1.5" style={{ background: COLOR_ACCENT }}>
          {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
        </button>
      </div>
      {data.referralCount > 0 && (
        <p className="text-xs mt-3" style={{ color: COLOR_TEXT_SECONDARY }}>
          <strong style={{ color: COLOR_PRIMARY }}>{data.referralCount}</strong>{' '}
          {data.referralCount === 1 ? 'business owner has' : 'business owners have'} signed up through your link.
        </p>
      )}
    </div>
  )
}

export function ListingVisibilityToggle({
  dealId,
  userId,
  initialConfidential,
  onChange,
}: {
  dealId: string
  userId: string
  initialConfidential: boolean
  onChange?: (next: boolean) => void
}) {
  const [confidential, setConfidential] = useState(initialConfidential)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function toggle() {
    setSaving(true)
    setError('')
    const next = !confidential
    try {
      const r = await fetch('/api/seller/listing-visibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId, userId, isConfidential: next }),
      })
      const data = await r.json()
      if (!r.ok) { setError(data.error || 'Failed to update'); return }
      setConfidential(next)
      onChange?.(next)
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-xl border p-5 bg-white" style={{ borderColor: COLOR_BORDER }}>
      <div className="flex items-center gap-2 mb-2">
        {confidential ? <Eye size={18} style={{ color: COLOR_ACCENT }} /> : <EyeOff size={18} style={{ color: COLOR_TEXT_SECONDARY }} />}
        <h3 className="font-bold" style={{ color: COLOR_PRIMARY }}>Listing visibility</h3>
      </div>
      <p className="text-sm mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>
        {confidential
          ? 'Currently confidential — buyers see industry, country & ranges only. Name, city, and identity are masked.'
          : 'Public — buyers see your full business title and exact city. Reveal increases buyer trust & inquiry rates.'}
      </p>
      <button
        onClick={toggle}
        disabled={saving}
        className="px-4 py-2 rounded font-bold text-sm border hover:bg-gray-50 disabled:opacity-50"
        style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
      >
        {saving ? 'Saving…' : confidential ? 'Reveal identity' : 'Make confidential'}
      </button>
      {error && <p className="text-xs mt-2" style={{ color: '#DC2626' }}>{error}</p>}
    </div>
  )
}

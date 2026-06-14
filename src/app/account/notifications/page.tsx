/**
 * /account/notifications — preference center.
 *
 * Single page where users own the cadence, quiet hours, daily cap, and
 * per-category opt-outs. Designed to be the page email footers always
 * link to, so unsubs route here for one-tap adjustment instead of
 * full-blown removal from the list.
 */
'use client'

import { useEffect, useState } from 'react'
import { PublicHeader } from '@/components/Navigation'
import { Sparkles, Clock, Shield, Bell } from 'lucide-react'

type Cadence = 'INSTANT' | 'DAILY' | 'WEEKLY'
interface Prefs {
  matchAlertCadence: Cadence
  quietHoursStart: number
  quietHoursEnd: number
  timezoneOffsetMin: number
  maxDailyEmails: number
  disabledCategories: string[]
}

const CATEGORIES: Array<{ key: string; label: string; desc: string }> = [
  { key: 'match',         label: 'New listing matches', desc: 'When a fresh listing matches one of your saved searches.' },
  { key: 'price-change',  label: 'Price changes',       desc: 'When a saved or watched listing changes asking price.' },
  { key: 'pre-listing',   label: 'Pre-listing intel',   desc: 'Succession events and distress signals before they hit the marketplace. Premium only.' },
  { key: 'heat-spike',    label: 'Heat spikes',         desc: 'When buyer demand suddenly concentrates on a deal you saved.' },
  { key: 'comparable',    label: 'Comparable closes',   desc: 'When a comparable deal closes in a sector you watch.' },
]

export default function NotificationPrefsPage() {
  const [prefs, setPrefs] = useState<Prefs | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/notifications/preferences', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => setPrefs(d.prefs))
      .catch(() => setError('Sign in to manage notification preferences.'))
  }, [])

  // Honor ?switch=daily/weekly from email footers so one click switches.
  useEffect(() => {
    if (!prefs) return
    const params = new URLSearchParams(window.location.search)
    const sw = params.get('switch')?.toUpperCase()
    if (sw && (sw === 'INSTANT' || sw === 'DAILY' || sw === 'WEEKLY') && sw !== prefs.matchAlertCadence) {
      update({ matchAlertCadence: sw })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefs?.matchAlertCadence])

  async function update(patch: Partial<Prefs>) {
    if (!prefs) return
    setSaving(true)
    setError(null)
    try {
      const next = { ...prefs, ...patch }
      const r = await fetch('/api/notifications/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(patch),
      })
      if (!r.ok) throw new Error()
      setPrefs(next)
      setSavedAt(Date.now())
    } catch {
      setError('Could not save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  function toggleCategory(key: string) {
    if (!prefs) return
    const next = prefs.disabledCategories.includes(key)
      ? prefs.disabledCategories.filter((k) => k !== key)
      : [...prefs.disabledCategories, key]
    update({ disabledCategories: next })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EF' }}>
      <PublicHeader />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#8C6D45', margin: 0, marginBottom: 8 }}>
          Account · Notifications
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0F1419', margin: 0, marginBottom: 8, letterSpacing: '-0.02em' }}>
          Notification preferences
        </h1>
        <p style={{ fontSize: 15, color: '#454D58', margin: 0, marginBottom: 24, maxWidth: 600 }}>
          Forward never sends more than your daily cap. Transactional emails (security, billing, NDA, inquiry responses) always send and are not configurable here.
        </p>

        {error && (
          <div style={card({ tint: '#FFFAE6', border: '#FFEEB5' })}>
            <p style={{ margin: 0, color: '#7A3608', fontSize: 14 }}>{error}</p>
          </div>
        )}

        {prefs && (
          <>
            {/* Cadence */}
            <div style={card({})}>
              <SectionHead icon={<Sparkles size={16} />} title="Match alert cadence" />
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {(['INSTANT', 'DAILY', 'WEEKLY'] as const).map((c) => (
                  <Pill key={c} active={prefs.matchAlertCadence === c} onClick={() => update({ matchAlertCadence: c })}>
                    {c === 'INSTANT' ? 'Real-time (15-min batches)' : c === 'DAILY' ? 'Smart Daily' : 'Weekly digest'}
                  </Pill>
                ))}
              </div>
              <p style={hint}>Daily ships one ranked digest at 7am local. Weekly is a Monday morning roll-up. Real-time batches into 15-min windows to avoid email storms.</p>
            </div>

            {/* Quiet hours */}
            <div style={card({})}>
              <SectionHead icon={<Clock size={16} />} title="Quiet hours" />
              <p style={{ ...hint, marginTop: 0 }}>No emails between these hours (local time). Anything queued goes out at the first slot after.</p>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <HourSelect label="Start" value={prefs.quietHoursStart} onChange={(v) => update({ quietHoursStart: v })} />
                <span style={{ color: '#9CA3AF' }}>→</span>
                <HourSelect label="End"   value={prefs.quietHoursEnd}   onChange={(v) => update({ quietHoursEnd: v })} />
              </div>
            </div>

            {/* Daily cap */}
            <div style={card({})}>
              <SectionHead icon={<Shield size={16} />} title="Daily email cap" />
              <p style={{ ...hint, marginTop: 0 }}>Hard limit on non-transactional emails per 24h. Even real-time respects this — extras queue to the next morning.</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1, 2, 3, 5].map((n) => (
                  <Pill key={n} active={prefs.maxDailyEmails === n} onClick={() => update({ maxDailyEmails: n })}>
                    {n}/day
                  </Pill>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div style={card({})}>
              <SectionHead icon={<Bell size={16} />} title="Categories" />
              <p style={{ ...hint, marginTop: 0 }}>Disabling a category drops those emails silently. Inquiry responses, NDAs, KYC, and billing always send.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                {CATEGORIES.map((c) => {
                  const enabled = !prefs.disabledCategories.includes(c.key)
                  return (
                    <div key={c.key} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, color: '#0F1419', fontSize: 14 }}>{c.label}</p>
                        <p style={{ margin: 0, fontSize: 12, color: '#6C7480' }}>{c.desc}</p>
                      </div>
                      <button
                        onClick={() => toggleCategory(c.key)}
                        style={{
                          width: 48, height: 28, borderRadius: 999,
                          border: 'none', cursor: 'pointer',
                          background: enabled ? '#1B7F4E' : '#C7CCD3',
                          position: 'relative', flexShrink: 0,
                        }}
                        aria-label={`${c.label} ${enabled ? 'on' : 'off'}`}
                      >
                        <span style={{
                          position: 'absolute', top: 3, left: enabled ? 23 : 3,
                          width: 22, height: 22, borderRadius: 999,
                          background: '#fff', transition: 'left .15s ease',
                        }} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {savedAt && (
          <p style={{ marginTop: 16, fontSize: 12, color: '#1B7F4E' }}>
            ✓ Saved {saving ? '…' : 'just now'}
          </p>
        )}
      </div>
    </div>
  )
}

function SectionHead({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <span style={{ color: '#8C6D45', display: 'inline-flex' }}>{icon}</span>
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0F1419' }}>{title}</h2>
    </div>
  )
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 14px', borderRadius: 999, border: '1px solid #C7CCD3',
        background: active ? '#0F1419' : '#FFFFFF',
        color: active ? '#FFFFFF' : '#0F1419',
        fontSize: 13, fontWeight: 600, cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function HourSelect({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label style={{ display: 'inline-flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 11, color: '#6C7480' }}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #C7CCD3', fontSize: 14, background: '#fff' }}
      >
        {Array.from({ length: 24 }, (_, i) => (
          <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>
        ))}
      </select>
    </label>
  )
}

const hint: React.CSSProperties = {
  marginTop: 10, marginBottom: 0, fontSize: 12, color: '#6C7480',
}

function card({ tint, border }: { tint?: string; border?: string }): React.CSSProperties {
  return {
    background: tint ?? '#FFFFFF',
    border: `1px solid ${border ?? '#E8EAED'}`,
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
  }
}

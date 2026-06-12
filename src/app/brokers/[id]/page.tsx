'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Star, CheckCircle2, ArrowLeft, Briefcase, Globe, MapPin, Award } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { useLocale } from '@/context/LocaleContext'
import { formatCurrency, type Currency } from '@/lib/currency'
import { LANGUAGE_LABELS, REGION_FLAGS } from '@/lib/broker-data'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

interface ReviewView {
  id: string; authorName: string; rating: number; title: string; comment: string; isVerifiedDeal: boolean; createdAt: string
}
interface BrokerDetail {
  id: string; name: string; company: string; headline: string; bio: string; avatarUrl: string
  specialties: string[]; industries: string[]; regions: string[]; languages: string[]
  yearsExperience: number; dealsClosed: number; totalValueClosedUsd: number
  isVerified: boolean; avgRating: number; reviewCount: number; reviews?: ReviewView[]
}

const LS_REVIEWS = 'forward_broker_reviews'

function localReviews(brokerId: string): ReviewView[] {
  if (typeof window === 'undefined') return []
  try { return (JSON.parse(localStorage.getItem(LS_REVIEWS) || '{}')[brokerId] || []) } catch { return [] }
}
function addLocalReview(brokerId: string, review: ReviewView) {
  const all = JSON.parse(localStorage.getItem(LS_REVIEWS) || '{}')
  all[brokerId] = [review, ...(all[brokerId] || [])]
  localStorage.setItem(LS_REVIEWS, JSON.stringify(all))
}

export default function BrokerProfilePage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? ''
  const { currency, isRTL } = useLocale()
  const cur = currency as Currency
  const [broker, setBroker] = useState<BrokerDetail | null>(null)
  const [reviews, setReviews] = useState<ReviewView[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/brokers/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.broker) {
          setBroker(d.broker)
          setReviews([...localReviews(id), ...(d.broker.reviews || [])])
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Shell isRTL={isRTL}><p className="px-6 py-12" style={{ color: COLOR_TEXT_SECONDARY }}>Loading…</p></Shell>
  if (!broker) return <Shell isRTL={isRTL}><p className="px-6 py-12" style={{ color: COLOR_TEXT_SECONDARY }}>Broker not found. <Link href="/brokers" style={{ color: COLOR_ACCENT }}>Back to directory</Link></p></Shell>

  return (
    <Shell isRTL={isRTL}>
      <section className="px-6 py-8 border-b" style={{ borderColor: COLOR_BORDER }}>
        <div className="max-w-4xl mx-auto">
          <Link href="/brokers" className="inline-flex items-center gap-1 text-sm font-semibold mb-6" style={{ color: COLOR_ACCENT }}>
            <ArrowLeft size={14} /> All brokers
          </Link>
          <div className="flex items-start gap-5 flex-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={broker.avatarUrl} alt={broker.name} className="w-24 h-24 rounded-2xl object-cover" />
            <div className="flex-1 min-w-[260px]">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black" style={{ color: COLOR_PRIMARY }}>{broker.name}</h1>
                {broker.isVerified && <CheckCircle2 size={22} style={{ color: '#2D7A5F' }} />}
              </div>
              <p className="text-lg font-medium" style={{ color: COLOR_TEXT_SECONDARY }}>{broker.company}</p>
              <p className="mt-1" style={{ color: COLOR_PRIMARY }}>{broker.headline}</p>
              <div className="flex items-center gap-2 mt-3">
                <Star size={18} fill="#F59E0B" style={{ color: '#F59E0B' }} />
                <span className="font-bold" style={{ color: COLOR_PRIMARY }}>{broker.avgRating.toFixed(1)}</span>
                <span style={{ color: COLOR_TEXT_SECONDARY }}>· {reviews.length} reviews</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Stat icon={<Briefcase size={18} />} label="Deals closed" value={String(broker.dealsClosed)} />
            <Stat icon={<Award size={18} />} label="Experience" value={`${broker.yearsExperience} yrs`} />
            <Stat icon={<MapPin size={18} />} label="Value closed" value={formatCurrency(broker.totalValueClosedUsd, cur)} />
            <Stat icon={<Globe size={18} />} label="Languages" value={broker.languages.map((l) => LANGUAGE_LABELS[l]).join(', ')} />
          </div>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          {/* About */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2" style={{ color: COLOR_PRIMARY }}>About</h2>
              <p style={{ color: COLOR_TEXT_SECONDARY }}>{broker.bio}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-3" style={{ color: COLOR_PRIMARY }}>Reviews</h2>
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="bg-white rounded-xl border p-4" style={{ borderColor: COLOR_BORDER }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold" style={{ color: COLOR_PRIMARY }}>{r.title}</span>
                        {r.isVerifiedDeal && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1" style={{ background: '#EAF5F0', color: '#2D7A5F' }}>
                            <CheckCircle2 size={11} /> Verified deal
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={14} fill="#F59E0B" style={{ color: '#F59E0B' }} />
                        <span className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>{r.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>{r.comment}</p>
                    <p className="text-xs mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>— {r.authorName}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: specialties + review form */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: COLOR_BORDER }}>
              <h3 className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {broker.specialties.map((s) => (
                  <span key={s} className="px-2 py-1 rounded-md text-xs font-semibold" style={{ background: '#FAF6EF', color: COLOR_ACCENT }}>{s}</span>
                ))}
              </div>
              <h3 className="font-bold mt-4 mb-2" style={{ color: COLOR_PRIMARY }}>Regions</h3>
              <div className="flex flex-wrap gap-2">
                {broker.regions.map((r) => (
                  <span key={r} className="px-2 py-1 rounded-md text-xs font-semibold" style={{ background: '#F3F4F6', color: COLOR_PRIMARY }}>
                    {REGION_FLAGS[r]} {r === 'CANADA' ? 'Canada' : 'UAE'}
                  </span>
                ))}
              </div>
            </div>

            <ReviewForm brokerId={broker.id} onSubmit={(rev) => setReviews((prev) => [rev, ...prev])} />
          </div>
        </div>
      </section>
    </Shell>
  )
}

function ReviewForm({ brokerId, onSubmit }: { brokerId: string; onSubmit: (r: ReviewView) => void }) {
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [done, setDone] = useState(false)

  async function submit() {
    if (!title || !comment) return
    const review: ReviewView = {
      id: `lr_${Date.now()}`, authorName: 'You', rating, title, comment, isVerifiedDeal: false,
      createdAt: new Date().toISOString(),
    }
    addLocalReview(brokerId, review)
    onSubmit(review)
    fetch(`/api/brokers/${brokerId}/reviews`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorId: 'demo-user', rating, title, comment }),
    }).catch(() => {})
    setDone(true); setTitle(''); setComment('')
    setTimeout(() => setDone(false), 3000)
  }

  return (
    <div className="bg-white rounded-xl border p-5" style={{ borderColor: COLOR_BORDER }}>
      <h3 className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>Leave a review</h3>
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => setRating(n)} title={`${n} star`}>
            <Star size={22} fill={n <= rating ? '#F59E0B' : 'none'} style={{ color: '#F59E0B' }} />
          </button>
        ))}
      </div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Review title"
        className="w-full px-3 py-2 rounded-lg border text-sm mb-2" style={{ borderColor: COLOR_BORDER }} />
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience…" rows={3}
        className="w-full px-3 py-2 rounded-lg border text-sm mb-3" style={{ borderColor: COLOR_BORDER }} />
      <button onClick={submit} className="w-full px-4 py-2 rounded-lg font-semibold text-white text-sm hover:opacity-90" style={{ background: COLOR_ACCENT }}>
        {done ? '✓ Thanks for your review' : 'Submit review'}
      </button>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border p-4" style={{ borderColor: COLOR_BORDER }}>
      <div className="flex items-center gap-2 mb-1" style={{ color: COLOR_ACCENT }}>{icon}</div>
      <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>{label}</p>
      <p className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>{value}</p>
    </div>
  )
}

function Shell({ children, isRTL }: { children: React.ReactNode; isRTL: boolean }) {
  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }} dir={isRTL ? 'rtl' : 'ltr'}>
      <PublicHeader />
      {children}
    </div>
  )
}

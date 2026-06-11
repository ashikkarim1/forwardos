'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, CheckCircle2, Search, MapPin, ArrowRight } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { useLocale } from '@/context/LocaleContext'
import { LANGUAGE_LABELS, REGION_FLAGS, type BrokerSeed } from '@/lib/broker-data'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

type BrokerView = Omit<BrokerSeed, 'reviews'>

export default function BrokersPage() {
  const { isRTL } = useLocale()
  const [brokers, setBrokers] = useState<BrokerView[]>([])
  const [region, setRegion] = useState('')
  const [language, setLanguage] = useState('')
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const p = new URLSearchParams()
    if (region) p.set('region', region)
    if (language) p.set('language', language)
    if (q) p.set('q', q)
    setLoading(true)
    fetch(`/api/brokers?${p.toString()}`)
      .then((r) => r.json())
      .then((d) => setBrokers(d.brokers || []))
      .finally(() => setLoading(false))
  }, [region, language, q])

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }} dir={isRTL ? 'rtl' : 'ltr'}>
      <PublicHeader />

      <section className="px-6 py-12 border-b" style={{ borderColor: COLOR_BORDER, background: '#EFF6FF' }}>
        <div className="max-w-6xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: COLOR_ACCENT, color: 'white' }}>
            BROKER DIRECTORY
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
            Find a verified M&amp;A broker
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: COLOR_TEXT_SECONDARY }}>
            Vetted advisors across Canada and the UAE — filter by region, industry, and the languages they
            work in (EN / FR / AR). Every review is tied to a real closed deal.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 py-6 border-b sticky top-[60px] z-20 bg-white" style={{ borderColor: COLOR_BORDER }}>
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLOR_TEXT_SECONDARY }} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, firm, specialty…"
              className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm" style={{ borderColor: COLOR_BORDER }} />
          </div>
          <select value={region} onChange={(e) => setRegion(e.target.value)} className="px-3 py-2 rounded-lg border text-sm font-semibold" style={{ borderColor: COLOR_BORDER }}>
            <option value="">All regions</option>
            <option value="CANADA">🇨🇦 Canada</option>
            <option value="UAE">🇦🇪 UAE</option>
          </select>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="px-3 py-2 rounded-lg border text-sm font-semibold" style={{ borderColor: COLOR_BORDER }}>
            <option value="">Any language</option>
            <option value="EN">English</option>
            <option value="FR">Français</option>
            <option value="AR">العربية</option>
          </select>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <p style={{ color: COLOR_TEXT_SECONDARY }}>Loading brokers…</p>
          ) : brokers.length === 0 ? (
            <p className="text-center py-12" style={{ color: COLOR_TEXT_SECONDARY }}>No brokers match these filters.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {brokers.map((b, i) => (
                <motion.div key={b.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link href={`/brokers/${b.id}`} className="block bg-white rounded-2xl border p-6 hover:shadow-lg transition-shadow" style={{ borderColor: COLOR_BORDER }}>
                    <div className="flex items-start gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={b.avatarUrl} alt={b.name} className="w-16 h-16 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold truncate" style={{ color: COLOR_PRIMARY }}>{b.name}</h3>
                          {b.isVerified && <CheckCircle2 size={16} style={{ color: '#2D7A5F' }} />}
                          {b.isFeatured && <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: COLOR_ACCENT }}>Featured</span>}
                        </div>
                        <p className="text-sm font-medium" style={{ color: COLOR_TEXT_SECONDARY }}>{b.company}</p>
                        <p className="text-sm mt-1" style={{ color: COLOR_PRIMARY }}>{b.headline}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      {b.regions.map((r) => (
                        <span key={r} className="px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1" style={{ background: '#F3F4F6', color: COLOR_PRIMARY }}>
                          <MapPin size={11} /> {REGION_FLAGS[r]} {r === 'CANADA' ? 'Canada' : 'UAE'}
                        </span>
                      ))}
                      {b.languages.map((l) => (
                        <span key={l} className="px-2 py-1 rounded-md text-xs font-semibold" style={{ background: '#EFF6FF', color: COLOR_ACCENT }}>
                          {LANGUAGE_LABELS[l]}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: COLOR_BORDER }}>
                      <div className="flex items-center gap-1">
                        <Star size={16} fill="#F59E0B" style={{ color: '#F59E0B' }} />
                        <span className="font-bold" style={{ color: COLOR_PRIMARY }}>{b.avgRating.toFixed(1)}</span>
                        <span className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>({b.reviewCount})</span>
                      </div>
                      <div className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {b.dealsClosed} deals · {b.yearsExperience} yrs
                      </div>
                      <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: COLOR_ACCENT }}>
                        View <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

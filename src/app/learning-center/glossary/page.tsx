'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { useLocale } from '@/context/LocaleContext'
import { GLOSSARY } from '@/content/learning'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

export default function GlossaryPage() {
  const { isRTL } = useLocale()
  const [q, setQ] = useState('')
  const terms = GLOSSARY
    .filter((t) => `${t.term} ${t.definition}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => a.term.localeCompare(b.term))

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }} dir={isRTL ? 'rtl' : 'ltr'}>
      <PublicHeader />
      <section className="max-w-3xl mx-auto px-6 py-10">
        <Link href="/learning-center" className="inline-flex items-center gap-1 text-sm font-semibold mb-6" style={{ color: COLOR_ACCENT }}>
          <ArrowLeft size={14} /> Learning Center
        </Link>
        <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>M&amp;A Glossary</h1>
        <p className="mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
          Plain-English definitions for buying and selling businesses — including UAE &amp; Canada financing terms.
        </p>

        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLOR_TEXT_SECONDARY }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search terms…"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm bg-white" style={{ borderColor: COLOR_BORDER }} />
        </div>

        <div className="space-y-3">
          {terms.map((t) => (
            <div key={t.term} className="bg-white rounded-xl border p-4" style={{ borderColor: COLOR_BORDER }}>
              <p className="font-bold mb-1" style={{ color: COLOR_PRIMARY }}>{t.term}</p>
              <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>{t.definition}</p>
            </div>
          ))}
          {terms.length === 0 && <p style={{ color: COLOR_TEXT_SECONDARY }}>No terms match “{q}”.</p>}
        </div>
      </section>
    </div>
  )
}

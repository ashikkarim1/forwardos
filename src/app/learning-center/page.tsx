'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, Clock, ArrowRight, GraduationCap } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { useLocale } from '@/context/LocaleContext'
import { ARTICLES, type ArticleCategory } from '@/content/learning'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

const CATEGORIES: (ArticleCategory | 'All')[] = ['All', 'Buying', 'Selling', 'Financing', 'Valuation', 'Legal & Deal-Making']

const CATEGORY_COLORS: Record<string, string> = {
  Buying: '#3B82F6', Selling: '#2D7A5F', Financing: '#B45309',
  Valuation: '#7C3AED', 'Legal & Deal-Making': '#0EA5E9',
}

export default function LearningCenterPage() {
  const { isRTL } = useLocale()
  const [cat, setCat] = useState<(ArticleCategory | 'All')>('All')
  const articles = cat === 'All' ? ARTICLES : ARTICLES.filter((a) => a.category === cat)

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }} dir={isRTL ? 'rtl' : 'ltr'}>
      <PublicHeader />

      <section className="px-6 py-12 border-b" style={{ borderColor: COLOR_BORDER, background: '#EFF6FF' }}>
        <div className="max-w-6xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: COLOR_ACCENT, color: 'white' }}>
            LEARNING CENTER
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
            Buy and sell businesses with confidence
          </h1>
          <p className="text-lg max-w-2xl mb-5" style={{ color: COLOR_TEXT_SECONDARY }}>
            Practical guides for the UAE and Canadian markets — including financing playbooks
            (CSBFP, BDC, Murabaha, Ijara) you won&apos;t find on US-only platforms.
          </p>
          <Link href="/learning-center/glossary" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border bg-white hover:bg-gray-50" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>
            <GraduationCap size={16} /> M&amp;A Glossary
          </Link>
        </div>
      </section>

      {/* Category filter */}
      <section className="px-6 py-5 border-b sticky top-[60px] z-20 bg-white" style={{ borderColor: COLOR_BORDER }}>
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCat(c)} className="px-3 py-1.5 rounded-full text-sm font-semibold transition-colors"
              style={{ background: cat === c ? COLOR_ACCENT : '#F3F4F6', color: cat === c ? 'white' : COLOR_PRIMARY }}>
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a, i) => (
            <motion.div key={a.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/learning-center/${a.slug}`} className="block h-full bg-white rounded-2xl border p-6 hover:shadow-lg transition-shadow" style={{ borderColor: COLOR_BORDER }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-1 rounded-md text-xs font-bold text-white" style={{ background: CATEGORY_COLORS[a.category] || COLOR_ACCENT }}>
                    {a.category}
                  </span>
                  {a.region && a.region !== 'BOTH' && (
                    <span className="text-xs font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {a.region === 'CANADA' ? '🇨🇦 Canada' : '🇦🇪 UAE'}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold mb-2 leading-snug" style={{ color: COLOR_PRIMARY }}>{a.title}</h3>
                <p className="text-sm mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>{a.excerpt}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    <Clock size={14} /> {a.readMinutes} min
                  </span>
                  <span className="flex items-center gap-1 font-semibold" style={{ color: COLOR_ACCENT }}>
                    Read <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Clock } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { useLocale } from '@/context/LocaleContext'
import { getArticle } from '@/content/learning'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

export default function ArticlePage() {
  const params = useParams<{ slug: string }>()
  const slug = params?.slug ?? ''
  const { isRTL } = useLocale()
  const article = getArticle(slug)

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }} dir={isRTL ? 'rtl' : 'ltr'}>
      <PublicHeader />
      <article className="max-w-3xl mx-auto px-6 py-10">
        <Link href="/learning-center" className="inline-flex items-center gap-1 text-sm font-semibold mb-6" style={{ color: COLOR_ACCENT }}>
          <ArrowLeft size={14} /> Learning Center
        </Link>

        {!article ? (
          <p style={{ color: COLOR_TEXT_SECONDARY }}>Article not found.</p>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-1 rounded-md text-xs font-bold text-white" style={{ background: COLOR_ACCENT }}>{article.category}</span>
              {article.region && article.region !== 'BOTH' && (
                <span className="text-xs font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {article.region === 'CANADA' ? '🇨🇦 Canada' : '🇦🇪 UAE'}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                <Clock size={12} /> {article.readMinutes} min read
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-6 leading-tight" style={{ color: COLOR_PRIMARY }}>{article.title}</h1>

            <div className="space-y-4">
              {article.body.map((para, i) =>
                para.startsWith('## ') ? (
                  <h2 key={i} className="text-xl font-bold pt-3" style={{ color: COLOR_PRIMARY }}>{para.replace('## ', '')}</h2>
                ) : (
                  <p key={i} className="leading-relaxed" style={{ color: COLOR_TEXT_SECONDARY }}>{para}</p>
                ),
              )}
            </div>

            <div className="mt-10 p-5 rounded-xl" style={{ background: '#EFF6FF' }}>
              <p className="font-bold mb-1" style={{ color: COLOR_PRIMARY }}>Ready to act on this?</p>
              <p className="text-sm mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>
                Browse live listings, model financing, or find a verified broker.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href="/marketplace" className="px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90" style={{ background: COLOR_ACCENT }}>Browse marketplace</Link>
                <Link href="/finance-center" className="px-4 py-2 rounded-lg text-sm font-semibold border bg-white hover:bg-gray-50" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>Finance Center</Link>
                <Link href="/brokers" className="px-4 py-2 rounded-lg text-sm font-semibold border bg-white hover:bg-gray-50" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>Find a broker</Link>
              </div>
            </div>
          </>
        )}
      </article>
    </div>
  )
}

'use client'

import { PublicHeader } from '@/components/Navigation'
import { useLocale } from '@/context/LocaleContext'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

export interface LegalSection {
  heading: string
  body: string[] // paragraphs; lines starting with "- " render as list items
}

/**
 * Shared layout for legal/policy pages. Content is intentionally substantive but
 * marked as a draft to be reviewed by qualified counsel before launch.
 */
export function LegalDoc({ title, lastUpdated, intro, sections }: {
  title: string
  lastUpdated: string
  intro: string
  sections: LegalSection[]
}) {
  const { isRTL } = useLocale()
  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }} dir={isRTL ? 'rtl' : 'ltr'}>
      <PublicHeader />
      <article className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>{title}</h1>
        <p className="text-sm mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>Last updated: {lastUpdated}</p>

        <div className="p-4 rounded-xl mb-8 text-sm" style={{ background: '#FEF3C7', color: '#92400E' }}>
          ⚠️ <strong>Draft for review.</strong> This document is a working template prepared to cover ForwardOS&apos;s
          operations in Canada and the UAE. It must be reviewed and finalized by qualified legal counsel in each
          jurisdiction before launch.
        </div>

        <p className="leading-relaxed mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>{intro}</p>

        <div className="space-y-8">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-xl font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                {i + 1}. {s.heading}
              </h2>
              <div className="space-y-3">
                {s.body.map((para, j) =>
                  para.startsWith('- ') ? (
                    <li key={j} className="ml-5 leading-relaxed list-disc" style={{ color: COLOR_TEXT_SECONDARY }}>{para.slice(2)}</li>
                  ) : (
                    <p key={j} className="leading-relaxed" style={{ color: COLOR_TEXT_SECONDARY }}>{para}</p>
                  ),
                )}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t text-sm" style={{ borderColor: COLOR_BORDER, color: COLOR_TEXT_SECONDARY }}>
          Questions about this policy? Contact <a href="mailto:legal@forwardos.ai" style={{ color: COLOR_ACCENT }}>legal@forwardos.ai</a>.
        </div>
      </article>
    </div>
  )
}

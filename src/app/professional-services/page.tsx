'use client'

import Link from 'next/link'
import { PublicHeader } from '@/components/Navigation'
import ProfessionalServicesReferral from '@/components/ProfessionalServicesReferral'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

export default function ProfessionalServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      <div style={{ paddingTop: '80px' }}>
        {/* Header */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-b" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '08' }}>
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
              🤝 Professional Services Referral Network
            </h1>
            <p className="text-xl" style={{ color: COLOR_TEXT_SECONDARY }}>
              The easiest way to get deal flow. Get paid for every referral. Build your reputation on outcomes.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <ProfessionalServicesReferral />
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t text-center" style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
              Ready to Get Deal Flow?
            </h2>
            <p className="text-lg mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
              Apply to join the Forward OS Professional Services Referral Network
            </p>
            <button
              className="px-8 py-4 rounded-lg font-bold text-white hover:opacity-90"
              style={{ background: COLOR_ACCENT }}
            >
              Apply Now →
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

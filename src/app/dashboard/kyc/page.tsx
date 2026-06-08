'use client'

import { KYCVerification } from '@/components/KYCVerification'
import { motion } from 'framer-motion'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'
import { DashboardHeader } from '@/components/DashboardHeader'

export default function KYCPage() {
  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: 'Forward OS', href: '/' },
          { label: 'KYC Verification' },
        ]}
        onMenuToggle={() => window.dispatchEvent(new CustomEvent('toggleSidebar'))}
        sidebarOpen={true}
        title="Complete Your Verification"
        subtitle="We need to verify your identity and credentials to unlock full platform access. This typically takes 5-10 minutes."
        userProfile={{
          name: 'User',
          email: 'user@forward.ae',
          role: 'Unverified',
        }}
      />

      <div className="min-h-screen bg-white">

      {/* Main Content */}
      <motion.main
        className="max-w-7xl mx-auto px-6 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <KYCVerification />
      </motion.main>

      {/* Footer */}
      <motion.footer
        className="border-t mt-16"
        style={{ borderColor: COLOR_BORDER }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                🛡️ Your Data is Secure
              </p>
              <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                All information is encrypted end-to-end and stored securely. We never share your data with third parties without explicit consent.
              </p>
            </div>
            <div>
              <p className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                ⚡ Instant Verification
              </p>
              <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                Most verifications complete within minutes. Complex cases are reviewed by our compliance team within 24 hours.
              </p>
            </div>
            <div>
              <p className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                ❓ Questions?
              </p>
              <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                Contact our compliance team at support@forward.com or call +1 (555) 123-4567 for assistance.
              </p>
            </div>
          </div>
        </div>
      </motion.footer>
      </div>
    </>
  )
}

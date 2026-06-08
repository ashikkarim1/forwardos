'use client'

import { KYCVerification } from '@/components/KYCVerification'
import { motion } from 'framer-motion'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT } from '@/styles/forward-colors'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { DashboardHeader } from '@/components/DashboardHeader'

export default function SellerKYCPage() {
  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: 'Forward OS', href: '/' },
          { label: 'Seller Dashboard', href: '/dashboard/seller' },
          { label: 'KYC Verification' },
        ]}
        onMenuToggle={() => window.dispatchEvent(new CustomEvent('toggleSidebar'))}
        sidebarOpen={true}
        title="Seller Verification"
        subtitle="Complete your seller verification to unlock full platform access"
        userProfile={{
          name: 'Seller',
          email: 'seller@forward.ae',
          role: 'Unverified',
        }}
      />

      <div className="min-h-screen bg-white">

      {/* Progress Bar */}
      <motion.div
        className="border-b"
        style={{ borderColor: COLOR_BORDER }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
              Seller Verification Status
            </h2>
            <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
              Step 1 of 5
            </p>
          </div>
          <div className="w-full h-1 rounded-full" style={{ background: COLOR_BORDER }}>
            <motion.div
              className="h-1 rounded-full"
              style={{ background: COLOR_ACCENT }}
              initial={{ width: '0%' }}
              animate={{ width: '20%' }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.main
        className="max-w-7xl mx-auto px-6 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h2 className="text-4xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
              Verify Your Seller Account
            </h2>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-lg max-w-2xl">
              To list companies and start selling on Forward, we need to verify you are who you claim to be and that you have the authority to represent the company you're selling.
            </p>
          </div>
        </motion.div>

        <KYCVerification />
      </motion.main>

      {/* Footer with Trust Signals */}
      <motion.footer
        className="border-t mt-16 bg-gradient-to-b"
        style={{ borderColor: COLOR_BORDER, background: 'linear-gradient(to bottom, white, rgba(255, 140, 0, 0.02))' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column - Trust & Security */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
                Why We Verify Sellers
              </p>
              <ul className="space-y-3">
                {[
                  'Prevent fraud and protect buyers from fake listings',
                  'Verify actual business ownership and legal authority',
                  'Ensure compliance with financial regulations (KYC/AML)',
                  'Build trust in the Forward marketplace',
                  'Provide insurance and deal protection',
                ].map((reason, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-start gap-3"
                    style={{ color: COLOR_TEXT_SECONDARY }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <span style={{ color: COLOR_ACCENT }} className="font-bold mt-0.5">
                      ✓
                    </span>
                    <span>{reason}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Right Column - What We Need */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
                Documents You'll Need
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Personal ID', desc: 'Passport, National ID, or Driver\'s License' },
                  { title: 'Proof of Address', desc: 'Utility bill or bank statement dated within 90 days' },
                  { title: 'Business Registration', desc: 'Certificate of Incorporation or Tax ID document' },
                  { title: 'Proof of Ownership', desc: 'Share certificates or ownership documents' },
                ].map((doc, idx) => (
                  <motion.div
                    key={idx}
                    className="p-4 rounded-lg border"
                    style={{ borderColor: COLOR_BORDER, background: 'white' }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <p className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>
                      {doc.title}
                    </p>
                    <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {doc.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom Section - Support */}
          <motion.div
            className="mt-12 p-8 rounded-lg border"
            style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '08' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
              Need Help?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-bold mb-2" style={{ color: COLOR_ACCENT }}>
                  Email
                </p>
                <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                  kyc@forward.com
                </p>
              </div>
              <div>
                <p className="text-sm font-bold mb-2" style={{ color: COLOR_ACCENT }}>
                  Phone
                </p>
                <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                  +1 (555) 123-4567
                </p>
              </div>
              <div>
                <p className="text-sm font-bold mb-2" style={{ color: COLOR_ACCENT }}>
                  Live Chat
                </p>
                <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                  Available 9am-6pm EST, Mon-Fri
                </p>
              </div>
            </div>
          </motion.div>

          {/* Privacy Notice */}
          <motion.p
            className="text-center mt-12 text-xs"
            style={{ color: COLOR_TEXT_SECONDARY }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Your information is protected by Forward's Privacy Policy and industry-leading security standards. We encrypt all data end-to-end and comply with GDPR, CCPA, and international KYC/AML regulations.
          </motion.p>
        </div>
      </motion.footer>
      </div>
    </>
  )
}

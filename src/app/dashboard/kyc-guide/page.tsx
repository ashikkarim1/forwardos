'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Clock, Shield, FileText, Lock, Zap, Users } from 'lucide-react'
import Link from 'next/link'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'
import { DashboardHeader } from '@/components/DashboardHeader'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function KYCGuidePage() {
  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: 'Forward OS', href: '/' },
          { label: 'KYC Guide' },
        ]}
        onMenuToggle={() => window.dispatchEvent(new CustomEvent('toggleSidebar'))}
        sidebarOpen={true}
        title="KYC & Verification Guide"
        subtitle="Everything you need to know about identity verification on Forward OS"
        userProfile={{
          name: 'User',
          email: 'user@forward.ae',
          role: 'Member',
        }}
      />

      <motion.div
        className="max-w-6xl mx-auto px-6 py-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Content starts here */}

      {/* Quick Links */}
      <motion.div variants={itemVariants} className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'Start Verification',
            description: 'Begin your KYC process',
            icon: Shield,
            href: '/dashboard/seller/kyc',
            color: COLOR_ACCENT,
          },
          {
            title: 'Check Status',
            description: 'View your verification status',
            icon: Clock,
            href: '/dashboard/kyc',
            color: '#10B981',
          },
          {
            title: 'Contact Support',
            description: 'Need help? Reach out to us',
            icon: Users,
            href: '/contact-sales',
            color: '#B8956A',
          },
        ].map((item, idx) => {
          const Icon = item.icon
          return (
            <Link key={idx} href={item.href}>
              <motion.div
                variants={itemVariants}
                className="p-6 rounded-lg border-2 hover:shadow-lg transition-all cursor-pointer"
                style={{ borderColor: COLOR_BORDER, background: 'white' }}
                whileHover={{ y: -4 }}
              >
                <Icon className="w-8 h-8 mb-3" style={{ color: item.color }} />
                <h3 className="font-bold text-lg mb-1" style={{ color: COLOR_PRIMARY }}>
                  {item.title}
                </h3>
                <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {item.description}
                </p>
              </motion.div>
            </Link>
          )
        })}
      </motion.div>

      {/* Why KYC Matters */}
      <motion.section variants={itemVariants} className="mb-12">
        <h2 className="text-3xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
          Why KYC Verification?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'Fraud Prevention',
              description: 'We verify everyone to prevent fake listings and scams. This protects all users.',
              icon: Shield,
            },
            {
              title: 'Legal Compliance',
              description: 'KYC is required by financial regulations in all markets where Forward operates.',
              icon: Lock,
            },
            {
              title: 'Trust & Safety',
              description: 'Verified users build a trustworthy marketplace where serious deals happen.',
              icon: CheckCircle2,
            },
            {
              title: 'Faster Deals',
              description: 'Pre-verified sellers and buyers close deals faster with less back-and-forth.',
              icon: Zap,
            },
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="p-6 rounded-lg border"
                style={{ borderColor: COLOR_BORDER, background: 'white' }}
              >
                <Icon className="w-6 h-6 mb-3" style={{ color: COLOR_ACCENT }} />
                <h3 className="font-bold text-lg mb-2" style={{ color: COLOR_PRIMARY }}>
                  {item.title}
                </h3>
                <p style={{ color: COLOR_TEXT_SECONDARY }}>{item.description}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* The 5-Step Process */}
      <motion.section variants={itemVariants} className="mb-12">
        <h2 className="text-3xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
          The 5-Step Verification Process
        </h2>

        <div className="space-y-6">
          {[
            {
              step: 1,
              title: 'Account Type',
              description: 'Tell us if you\'re a buyer, seller, or broker so we can tailor the verification.',
              time: '2 minutes',
              details: ['Select role', 'Answer basic questions'],
            },
            {
              step: 2,
              title: 'Personal Information',
              description: 'Provide your personal details and government-issued ID for identity verification.',
              time: '5 minutes',
              details: ['Full name', 'Email & phone', 'Government ID (passport, national ID, or driver\'s license)'],
            },
            {
              step: 3,
              title: 'Address Verification',
              description: 'Confirm your address with a recent utility bill or bank statement.',
              time: '3 minutes',
              details: ['Residential address', 'Proof of address document', 'City, state, country'],
            },
            {
              step: 4,
              title: 'Credential Verification',
              description: 'For sellers: business docs. For buyers: proof of funds. For brokers: certifications.',
              time: '5 minutes',
              details: [
                'Sellers: Articles of Incorporation, Tax ID, proof of ownership',
                'Buyers: Bank statement, LOI, investment experience',
                'Brokers: Professional licenses, certifications',
              ],
            },
            {
              step: 5,
              title: 'Final Review & Approval',
              description: 'Our compliance team reviews everything. Most approvals happen within 24 hours.',
              time: '24 hours',
              details: ['Automated checks', 'Manual review if needed', 'Approval notification'],
            },
          ].map((item) => (
            <motion.div
              key={item.step}
              variants={itemVariants}
              className="p-8 rounded-lg border-2 hover:shadow-lg transition-all"
              style={{ borderColor: COLOR_ACCENT, background: COLOR_ACCENT + '08' }}
            >
              <div className="flex items-start gap-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-black text-white flex-shrink-0"
                  style={{ background: COLOR_ACCENT }}
                >
                  {item.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                      {item.title}
                    </h3>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: COLOR_BORDER, color: COLOR_TEXT_SECONDARY }}
                    >
                      {item.time}
                    </span>
                  </div>
                  <p className="mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {item.description}
                  </p>
                  <ul className="space-y-1">
                    {item.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                        <span style={{ color: COLOR_ACCENT }} className="font-bold mt-0.5">
                          →
                        </span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section variants={itemVariants} className="mb-12">
        <h2 className="text-3xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {[
            {
              q: 'How long does verification take?',
              a: 'Most verifications complete within 5-10 minutes of submission. Complex cases go to manual review (24 hours).',
            },
            {
              q: 'Is my data secure?',
              a: 'Yes. All information is encrypted end-to-end and stored securely. We comply with GDPR, CCPA, and international KYC/AML standards.',
            },
            {
              q: 'What if verification fails?',
              a: 'If your verification fails, you\'ll receive detailed feedback. You can resubmit corrected documents. Contact support if you need help.',
            },
            {
              q: 'How long is verification valid?',
              a: 'Verifications are valid for 365 days. We may request re-verification if regulations change or if we detect suspicious activity.',
            },
            {
              q: 'Do I need to verify for each deal?',
              a: 'No. Once verified, you\'re verified for all deals. We just need periodic updates.',
            },
            {
              q: 'What if I\'m from a different country?',
              a: 'Forward operates globally. We verify users from all countries, though some regions may have additional requirements.',
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="p-6 rounded-lg border"
              style={{ borderColor: COLOR_BORDER, background: 'white' }}
            >
              <details className="cursor-pointer">
                <summary className="font-bold flex items-center gap-3" style={{ color: COLOR_PRIMARY }}>
                  <span style={{ color: COLOR_ACCENT }} className="text-lg">
                    +
                  </span>
                  {item.q}
                </summary>
                <p className="mt-4 ml-7" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {item.a}
                </p>
              </details>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.div variants={itemVariants} className="text-center p-12 rounded-lg border-2" style={{ borderColor: COLOR_ACCENT }}>
        <h2 className="text-3xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
          Ready to Get Verified?
        </h2>
        <p className="text-lg mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>
          Complete your verification in 5-10 minutes and start buying, selling, or brokering deals.
        </p>
        <Link href="/dashboard/seller/kyc">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-lg font-bold text-white text-lg"
            style={{ background: COLOR_ACCENT }}
          >
            Start Verification Now
          </motion.button>
        </Link>
      </motion.div>
      </motion.div>
    </>
  )
}

'use client'

// Dynamic: reads runtime query params (userId, plan, session) — not statically prerenderable
export const dynamic = 'force-dynamic'

import { Suspense } from 'react'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, TrendingUp, Users, Zap, ArrowRight } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

function BusinessSubmittedPageInner() {
  const searchParams = useSearchParams()
  const score = parseInt(searchParams?.get('score') || '0')

  const getTierDetails = () => {
    if (score >= 80) {
      return {
        name: 'Full Transparency Tier',
        icon: '🔓',
        description: 'Your listing shows maximum detail. Buyers can see all your information.',
        benefits: [
          '✓ Top seller badge on marketplace',
          '✓ Data room access for serious buyers',
          '✓ Featured placement',
          '✓ Advanced analytics dashboard',
          '✓ Priority buyer matching',
        ],
      }
    }
    if (score >= 50) {
      return {
        name: 'Premium Verified Tier',
        icon: '⭐',
        description: 'Your listing is featured with financial data visible to buyers.',
        benefits: [
          '✓ Featured on marketplace',
          '✓ Financial metrics visible',
          '✓ Higher search ranking',
          '✓ Buyer trust indicators',
          '✓ Professional seller badge',
        ],
      }
    }
    if (score >= 25) {
      return {
        name: 'Basic Listed Tier',
        icon: '📋',
        description: 'Your listing is live on the marketplace with core information.',
        benefits: [
          '✓ Listed on marketplace',
          '✓ Basic metrics visible',
          '✓ Buyer inquiries enabled',
          '✓ Contact with interested buyers',
          '✓ Basic analytics',
        ],
      }
    }
    return {
      name: 'Incomplete',
      icon: '📝',
      description: 'Add more details to improve your listing visibility.',
      benefits: ['✓ Limited visibility', '✓ Basic listing'],
    }
  }

  const tier = getTierDetails()

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto px-4 md:px-8 py-12"
      >
        {/* Success Card */}
        <div className="bg-white rounded-2xl border p-8 md:p-12 text-center mb-8" style={{ borderColor: COLOR_BORDER }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="mb-6"
          >
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{ background: COLOR_BG_PRIMARY }}>
              <CheckCircle2 size={48} style={{ color: '#10B981' }} />
            </div>
          </motion.div>

          <h1 className="text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
            Business Details Submitted! ✅
          </h1>

          <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-lg mb-8">
            Your listing is now live on the Forward marketplace. Buyers can start reaching out!
          </p>

          {/* Score Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-xl mb-8"
            style={{ background: COLOR_BG_PRIMARY }}
          >
            <div className="text-6xl font-black mb-2" style={{ color: COLOR_ACCENT }}>
              {score}%
            </div>
            <p className="text-2xl font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
              {tier.icon} {tier.name}
            </p>
            <p style={{ color: COLOR_TEXT_SECONDARY }}>
              {tier.description}
            </p>
          </motion.div>

          {/* Tier Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-lg mb-8 text-left"
            style={{ background: '#F0F9FF', border: `2px solid #93C5FD` }}
          >
            <h3 className="font-bold mb-4" style={{ color: '#1E40AF' }}>
              Your Benefits:
            </h3>
            <ul className="space-y-2">
              {tier.benefits.map((benefit, i) => (
                <li key={i} className="text-sm" style={{ color: '#1E40AF' }}>
                  {benefit}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Improvement Tips */}
          {score < 100 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-lg mb-8 text-left"
              style={{ background: '#FEF3C7', border: `2px solid #FCD34D` }}
            >
              <h3 className="font-bold mb-4" style={{ color: '#92400E' }}>
                💡 Ways to Improve Your Listing:
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: '#92400E' }}>
                {score < 50 && (
                  <>
                    <li>✓ Add more customer names to build trust</li>
                    <li>✓ Write detailed financial summaries</li>
                  </>
                )}
                {score < 80 && (
                  <>
                    <li>✓ Upload more business photos</li>
                    <li>✓ Add financial statements and contracts</li>
                  </>
                )}
                <li>✓ Update your information as your business grows</li>
              </ul>
            </motion.div>
          )}

          {/* Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              {
                icon: TrendingUp,
                title: 'Monitor Interest',
                desc: 'Check your dashboard for buyer inquiries daily',
              },
              {
                icon: Users,
                title: 'Respond Quickly',
                desc: 'Fast responses increase chance of serious offers',
              },
              {
                icon: Zap,
                title: 'Build Trust',
                desc: 'Share more data to attract premium buyers',
              },
            ].map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="p-4 rounded-lg border text-center"
                  style={{ borderColor: COLOR_BORDER }}
                >
                  <Icon size={32} style={{ color: COLOR_ACCENT }} className="mx-auto mb-2" />
                  <p className="font-bold text-sm mb-1" style={{ color: COLOR_PRIMARY }}>
                    {step.title}
                  </p>
                  <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {step.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/dashboard/seller"
              className="flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 text-center flex items-center justify-center gap-2"
              style={{ background: COLOR_ACCENT }}
            >
              Go to Dashboard
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/marketplace"
              className="flex-1 px-6 py-3 rounded-lg font-semibold border transition-all hover:bg-gray-50 text-center"
              style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
            >
              View Marketplace
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg border p-6" style={{ borderColor: COLOR_BORDER }}>
          <h2 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="group">
              <summary className="font-bold cursor-pointer flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
                <span>+</span> What happens now?
              </summary>
              <p className="mt-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                Your listing is now visible to buyers on the marketplace. They can see your business information and contact you directly through the platform.
              </p>
            </details>

            <details className="group">
              <summary className="font-bold cursor-pointer flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
                <span>+</span> Can I edit my listing later?
              </summary>
              <p className="mt-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                Yes! You can update your business information, photos, and documents at any time from your dashboard. Changes are reflected immediately.
              </p>
            </details>

            <details className="group">
              <summary className="font-bold cursor-pointer flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
                <span>+</span> How do I increase my listing strength?
              </summary>
              <p className="mt-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                Add more photos, upload financial documents, expand customer list, and write detailed financial summaries. The more complete your information, the higher your score.
              </p>
            </details>

            <details className="group">
              <summary className="font-bold cursor-pointer flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
                <span>+</span> What if I want to take it down?
              </summary>
              <p className="mt-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                You can pause or unpublish your listing anytime from your dashboard. Your information will be saved for when you want to reactivate.
              </p>
            </details>
          </div>
        </div>
      </motion.div>
    </div>
  )
}


export default function BusinessSubmittedPage() {
  return (
    <Suspense fallback={null}>
      <BusinessSubmittedPageInner />
    </Suspense>
  )
}

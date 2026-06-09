'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, TrendingUp, Users, Clock, DollarSign, Shield } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

export default function ForSellersPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      <div style={{ paddingTop: '80px' }}>
        {/* Hero */}
        <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: COLOR_PRIMARY + '05' }}>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
                Know Your Deal is Worth Before You Sell
              </h1>
              <p className="text-xl mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>
                Stop paying 5-10% to brokers for valuation guidance. Get AI-powered intelligence for free.
                Fair value ranges, optimal timing, buyer targeting—all built in.
              </p>
              <Link
                href="/auth/signup?type=seller"
                className="inline-block px-8 py-4 rounded-lg font-bold text-white hover:opacity-90"
                style={{ background: COLOR_ACCENT }}
              >
                List Your Business Free →
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Problem */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black mb-8" style={{ color: COLOR_PRIMARY }}>
              The M&A Seller's Dilemma
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
                <p className="text-2xl font-black mb-3 text-red-600">❌</p>
                <h3 className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                  No Valuation Clarity
                </h3>
                <p style={{ color: COLOR_TEXT_SECONDARY }}>
                  You don't know what your deal is worth. Brokers charge 5-10% 
                  ($425K-$850K) just to figure it out.
                </p>
              </div>

              <div className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
                <p className="text-2xl font-black mb-3 text-red-600">❌</p>
                <h3 className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                  Wrong Timing Kills Value
                </h3>
                <p style={{ color: COLOR_TEXT_SECONDARY }}>
                  Sell in the wrong quarter and lose 8% of valuation. 
                  No one shows you seasonal patterns or buyer budget cycles.
                </p>
              </div>

              <div className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
                <p className="text-2xl font-black mb-3 text-red-600">❌</p>
                <h3 className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                  Missing Strategic Buyers
                </h3>
                <p style={{ color: COLOR_TEXT_SECONDARY }}>
                  Brokers take weeks to identify the right buyers. You have no visibility 
                  into who will pay premium prices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '05' }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black mb-8" style={{ color: COLOR_PRIMARY }}>
              Forward OS: The Seller's Advantage
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex gap-4">
                  <DollarSign size={24} style={{ color: COLOR_ACCENT }} className="flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                      Fair Valuation in Minutes
                    </h3>
                    <p style={{ color: COLOR_TEXT_SECONDARY }}>
                      AI pricing model analyzes 500+ comparable deals. Get $8.1M-$9.2M fair value ranges 
                      with 93% accuracy. Know exactly what to ask.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock size={24} style={{ color: COLOR_ACCENT }} className="flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                      +$680K from Timing Optimization
                    </h3>
                    <p style={{ color: COLOR_TEXT_SECONDARY }}>
                      AI shows Q3 is 8% higher multiple season. Sell in July instead of January. 
                      That's +$680K difference on an $8.5M deal.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Users size={24} style={{ color: COLOR_ACCENT }} className="flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                      30% Faster Close (Right Buyers)
                    </h3>
                    <p style={{ color: COLOR_TEXT_SECONDARY }}>
                      Buyer matching identifies which strategic groups acquire deals like yours. 
                      Target the right 15 buyers, close in 3 months instead of 5.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex gap-4">
                  <TrendingUp size={24} style={{ color: COLOR_ACCENT }} className="flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                      5-Year Growth Visibility
                    </h3>
                    <p style={{ color: COLOR_TEXT_SECONDARY }}>
                      See projected exit value ($16.8M in 5 years vs $8.5M today). Understand growth potential 
                      before negotiating earn-outs.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Shield size={24} style={{ color: COLOR_ACCENT }} className="flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                      87% Success Probability
                    </h3>
                    <p style={{ color: COLOR_TEXT_SECONDARY }}>
                      Know your deal will close. AI success predictor shows 87% probability with 94% confidence. 
                      No surprises in negotiations.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle2 size={24} style={{ color: COLOR_ACCENT }} className="flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                      Completely Free
                    </h3>
                    <p style={{ color: COLOR_TEXT_SECONDARY }}>
                      List your business, get intelligence, connect with buyers. Zero cost. We make money 
                      from buyers and brokers, not sellers.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ROI Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black text-center mb-12" style={{ color: COLOR_PRIMARY }}>
              The Economics: Save 5-10% on Your Exit
            </h2>

            <div className="p-8 rounded-lg" style={{ background: COLOR_ACCENT + '08', border: `1px solid ${COLOR_ACCENT}` }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <p className="text-sm font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                    YOUR DEAL SIZE
                  </p>
                  <p className="text-3xl font-black" style={{ color: COLOR_PRIMARY }}>
                    $8.5M
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                    BROKER FEE (5-10%)
                  </p>
                  <p className="text-3xl font-black text-red-600">
                    $425K-$850K
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                    FORWARD OS COST
                  </p>
                  <p className="text-3xl font-black text-green-600">
                    FREE
                  </p>
                </div>
              </div>

              <p className="text-center mt-8 font-bold" style={{ color: COLOR_PRIMARY }}>
                Save $425K-$850K on your exit. Plus $680K from optimal timing. That's $1.1M-$1.5M upside.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t text-center" style={{ borderColor: COLOR_BORDER }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
              Ready to Sell on Your Terms?
            </h2>
            <p className="text-lg mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>
              Get your business valued in 5 minutes. No broker required.
            </p>
            <Link
              href="/auth/signup?type=seller"
              className="inline-block px-8 py-4 rounded-lg font-bold text-white hover:opacity-90"
              style={{ background: COLOR_ACCENT }}
            >
              List Your Business Free →
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

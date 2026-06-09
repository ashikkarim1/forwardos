'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Flame, CheckCircle2, ArrowRight } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b" style={{ borderColor: COLOR_BORDER }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame size={32} style={{ color: COLOR_ACCENT }} />
            <span className="text-xl font-black" style={{ color: COLOR_PRIMARY }}>
              Forward OS
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/marketplace"
              className="font-bold hover:opacity-80"
              style={{ color: COLOR_PRIMARY }}
            >
              Browse Deals
            </Link>
            <Link
              href="/auth/signin"
              className="px-6 py-2 rounded-lg font-bold text-white hover:opacity-90"
              style={{ background: COLOR_ACCENT }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: COLOR_PRIMARY + '05' }}>
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
              The M&A Platform Built for Intelligent Deals
            </h1>

            <p className="text-xl mb-12" style={{ color: COLOR_TEXT_SECONDARY }}>
              AI-powered deal intelligence, institutional network, and professional services.
              Everything you need to acquire or sell with confidence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/auth/signup"
                className="px-8 py-4 rounded-lg font-bold text-white text-center hover:opacity-90 transition-all flex items-center justify-center gap-2"
                style={{ background: COLOR_ACCENT }}
              >
                Get Started Free <ArrowRight size={20} />
              </Link>
              <Link
                href="/marketplace"
                className="px-8 py-4 rounded-lg font-bold border text-center hover:bg-gray-50 transition-all"
                style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
              >
                Browse Marketplace
              </Link>
            </div>

            <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
              ✅ No credit card required • ✅ Instant access to 47+ deals • ✅ Bank-level security
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12" style={{ color: COLOR_PRIMARY }}>
            Why Forward OS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: '5 AI Models',
                description: 'Success probability, optimal timing, fair pricing, growth forecasts, buyer matching.',
                icon: '🤖',
              },
              {
                title: 'Market Intelligence',
                description: '500+ verified deals, real comparables, sector benchmarking, confidence scoring.',
                icon: '📊',
              },
              {
                title: 'Institutional Network',
                description: 'Verified brokers, integrations, white-label API, professional services network.',
                icon: '🏢',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-lg border text-center"
                style={{ borderColor: COLOR_BORDER }}
              >
                <p className="text-4xl mb-4">{feature.icon}</p>
                <h3 className="text-xl font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                  {feature.title}
                </h3>
                <p style={{ color: COLOR_TEXT_SECONDARY }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-b" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '05' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-black" style={{ color: COLOR_ACCENT }}>$2.5T</p>
              <p style={{ color: COLOR_TEXT_SECONDARY }}>Annual M&A Market</p>
            </div>
            <div>
              <p className="text-3xl font-black" style={{ color: COLOR_ACCENT }}>500+</p>
              <p style={{ color: COLOR_TEXT_SECONDARY }}>Verified Deals</p>
            </div>
            <div>
              <p className="text-3xl font-black" style={{ color: COLOR_ACCENT }}>91%</p>
              <p style={{ color: COLOR_TEXT_SECONDARY }}>Prediction Accuracy</p>
            </div>
            <div>
              <p className="text-3xl font-black" style={{ color: COLOR_ACCENT }}>24-36mo</p>
              <p style={{ color: COLOR_TEXT_SECONDARY }}>Competitive Moat</p>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12" style={{ color: COLOR_PRIMARY }}>
            Built for Every Role
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '💼',
                title: 'For Sellers',
                description: 'Know your deal value. Find the right buyers. Time your exit perfectly.',
                cta: 'List Your Business',
                href: '/auth/signup?type=seller',
              },
              {
                icon: '🎯',
                title: 'For Buyers',
                description: 'Find best deals before the market. Get AI intelligence on every opportunity.',
                cta: 'Browse Deals',
                href: '/marketplace',
              },
              {
                icon: '🤝',
                title: 'For Brokers',
                description: 'Build reputation on outcomes. Get more deal flow. Close faster.',
                cta: 'Join Network',
                href: '/auth/signup?type=broker',
              },
            ].map((user, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-lg border hover:shadow-lg transition-all"
                style={{ borderColor: COLOR_BORDER }}
              >
                <p className="text-4xl mb-4">{user.icon}</p>
                <h3 className="text-xl font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                  {user.title}
                </h3>
                <p className="mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {user.description}
                </p>
                <Link
                  href={user.href}
                  className="inline-block px-4 py-2 rounded-lg font-bold transition-all hover:opacity-90"
                  style={{ background: COLOR_ACCENT + '20', color: COLOR_ACCENT }}
                >
                  {user.cta} →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t text-center" style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
            Ready to Win?
          </h2>
          <p className="text-lg mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>
            Join 500+ deal professionals using Forward OS to source, analyze, and close M&A transactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-4 rounded-lg font-bold text-white hover:opacity-90 transition-all"
              style={{ background: COLOR_ACCENT }}
            >
              Get Started Free →
            </Link>
            <Link
              href="/contact-sales"
              className="px-8 py-4 rounded-lg font-bold border hover:bg-gray-50 transition-all"
              style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
            >
              Enterprise Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 sm:px-6 lg:px-8" style={{ borderColor: COLOR_BORDER }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>Product</h4>
              <ul className="space-y-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                <li><Link href="/marketplace" className="hover:underline">Marketplace</Link></li>
                <li><Link href="/institutional" className="hover:underline">Institutional</Link></li>
                <li><Link href="/professional-services" className="hover:underline">Professional Services</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>Company</h4>
              <ul className="space-y-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                <li><Link href="#" className="hover:underline">About Us</Link></li>
                <li><Link href="/contact-sales" className="hover:underline">Contact</Link></li>
                <li><Link href="/help" className="hover:underline">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>Legal</h4>
              <ul className="space-y-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                <li><Link href="#" className="hover:underline">Privacy</Link></li>
                <li><Link href="#" className="hover:underline">Terms</Link></li>
                <li><Link href="#" className="hover:underline">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>Connect</h4>
              <ul className="space-y-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                <li><a href="#" className="hover:underline">Twitter</a></li>
                <li><a href="#" className="hover:underline">LinkedIn</a></li>
                <li><a href="#" className="hover:underline">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm" style={{ borderColor: COLOR_BORDER, color: COLOR_TEXT_SECONDARY }}>
            <p>© 2024 Forward OS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, Briefcase, TrendingUp, Users, ArrowRight, BarChart3, Network } from 'lucide-react'
import { useState } from 'react'
import { useLocale } from '@/context/LocaleContext'
import { t } from '@/lib/translations'
import { formatCurrency, getDefaultCurrency } from '@/lib/currency'
import { PublicHeader } from './Navigation'
import { SeeInActionSection } from './SeeInActionSection'
import { FeaturedListingsSection } from './FeaturedListingsSection'
import { HelpContactWidget } from './HelpContactWidget'
import { WorldClassFooter } from './WorldClassFooter'
import { UserTypeSelector } from './UserTypeSelector'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

function LocalizedHomePageContent() {
  const { locale, currency, isRTL } = useLocale()
  const [showUserTypeModal, setShowUserTypeModal] = useState(false)

  // Stat values to display.
  //
  // Rule: every number here is one we'd publish in a press release. The
  // first one is industry-cited TAM. The other three describe the
  // shape of the platform today (no fabricated "500+ verified deals" or
  // "91% accuracy" claims — those got us called out in the readiness
  // audit and won't survive a TechCrunch tear-down).
  const stats = [
    { value: '$2.5T',     label: t('stats.market',  locale) },  // industry M&A TAM
    { value: '3',         label: t('stats.regions', locale) },  // USA · Canada · UAE
    { value: '0%',        label: t('stats.fee',     locale) },  // zero success commission
    { value: 'Day 1',     label: t('stats.transparent', locale) }, // transparent reason-for-sale
  ]

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Standard site header — same logo + menu as every other page.
          (The old one-off nav with the Sparkles icon + "Forward OS" wordmark
          made the landing page look like a different product.) */}
      <PublicHeader />

      {/* ─── Hero — cinematic "freedom after the sale" ─────────────────────
          Full-bleed imagery (the morning after you sign), dark ink gradient,
          editorial typography matching the listing pages. The site sells
          life-changing transactions — the hero should feel like one. */}
      <section className="relative overflow-hidden" style={{ background: '#0F1419', minHeight: '88vh' }}>
        {/* Typographic hero: ink-on-ink with a subtle champagne radial bloom.
            Replaces the Unsplash stock photo — luxury reads through restraint,
            not imagery. The light at the bottom feels like dawn without
            looking like a brochure. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 80% at 50% 115%, rgba(184,149,106,0.22) 0%, rgba(184,149,106,0) 55%), ' +
              'radial-gradient(80% 60% at 50% -10%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%)',
          }}
        />
        {/* Faint vertical rule — editorial book feel without a hairline border */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-1/2 -translate-x-1/2"
          style={{ width: '1px', background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.06) 75%, rgba(255,255,255,0) 100%)' }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-center" style={{ minHeight: '88vh' }}>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[11px] md:text-xs font-bold tracking-[0.32em] mb-6" style={{ color: '#B8956A' }}>
              THE TRANSPARENT MARKETPLACE FOR EVERY BUSINESS TRANSACTION
            </p>
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-white leading-[1.05] tracking-tight">
              {t('hero.title', locale)}
            </h1>

            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.78)' }}>
              {t('hero.subtitle', locale)}
            </p>

            <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-10 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Link
                href="/list"
                className="px-9 py-4 rounded-lg font-bold text-center hover:opacity-90 transition-all flex items-center justify-center gap-2"
                style={{ background: 'white', color: '#0F1419' }}
              >
                {t('hero.cta1', locale)}
                <ArrowRight size={18} style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }} />
              </Link>
              <Link
                href="/marketplace"
                className="px-9 py-4 rounded-lg font-bold text-center text-white transition-all hover:bg-white/10"
                style={{ border: '1px solid rgba(255,255,255,0.35)', backdropFilter: 'blur(6px)' }}
              >
                {t('hero.cta2', locale)}
              </Link>
            </div>

            <p className="text-xs md:text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {t('hero.trust', locale)}
            </p>
          </motion.div>

          {/* Quiet bottom strip — the promise, in one line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="absolute bottom-8 left-0 right-0 text-center text-[11px] tracking-[0.22em] font-semibold"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            CONFIDENTIAL · VERIFIED · USA · CANADA · UAE
          </motion.p>
        </div>
      </section>

      {/* ─── Forward Serves — explicit positioning ──────────────────────
          The hero compresses the value to four verbs. This section
          unpacks it: who Forward is for, what kinds of transactions
          we handle, and the transparency promise (every listing tells
          you WHY the seller is exiting). Keeps the deck simple — two
          columns + a banner — so it reads at a glance on mobile. */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-bold tracking-[0.28em] text-center mb-4" style={{ color: '#B8956A' }}>
            ONE PLATFORM · EVERY TRANSACTION
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-center mb-3" style={{ color: COLOR_PRIMARY }}>
            Built for the full M&amp;A lifecycle.
          </h2>
          <p className="text-base md:text-lg text-center max-w-3xl mx-auto mb-12" style={{ color: COLOR_TEXT_SECONDARY }}>
            SMB acquisitions, corporate M&amp;A, roll-ups, succession sales, distressed assets, strategic carve-outs — Forward handles them all in one workspace.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* For Buyers */}
            <div className="p-7 rounded-2xl" style={{ background: '#FAF6EF', border: '1px solid #EDE6D8' }}>
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: '#8C6D45' }}>
                For Buyers
              </p>
              <h3 className="text-xl font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
                Find the right deal. Know it&apos;ll close.
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                <li>· Individual buyers &amp; search funds</li>
                <li>· Private equity &amp; holding companies</li>
                <li>· Corporate development &amp; strategic acquirers</li>
                <li>· Family offices &amp; HNW investors</li>
                <li>· Roll-up sponsors &amp; consolidators</li>
              </ul>
            </div>

            {/* For Sellers */}
            <div className="p-7 rounded-2xl" style={{ background: '#FAF6EF', border: '1px solid #EDE6D8' }}>
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: '#8C6D45' }}>
                For Sellers
              </p>
              <h3 className="text-xl font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
                Tell your story. On your terms.
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                <li>· Owner-operators (retirement, lifestyle change)</li>
                <li>· Corporate divestitures &amp; carve-outs</li>
                <li>· Succession &amp; family transitions</li>
                <li>· Distressed sales &amp; restructuring</li>
                <li>· Brokers &amp; M&amp;A advisors</li>
              </ul>
            </div>
          </div>

          {/* Transparency banner — the differentiator vs BizBuySell etc. */}
          <div className="mt-8 p-6 rounded-2xl flex items-start gap-4" style={{ background: '#0F1419', border: '1px solid #0F1419' }}>
            <span className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full text-base" style={{ background: 'rgba(184,149,106,0.18)' }} aria-hidden>
              <span style={{ color: '#E5C9A8' }}>★</span>
            </span>
            <div>
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: '#B8956A' }}>
                Transparent by design
              </p>
              <p className="text-sm md:text-base" style={{ color: 'rgba(255,255,255,0.86)', lineHeight: 1.55 }}>
                Every Forward listing tells you <strong style={{ color: '#fff' }}>why the seller is exiting</strong> — retirement, succession, distressed sale, strategic divestiture, growth capital, partnership split. No surprises in diligence, no awkward calls. Make decisions with the full picture from day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section — editorial cream stage */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: '#FAF6EF' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-bold tracking-[0.28em] text-center mb-4" style={{ color: '#B8956A' }}>
            WHY FORWARD
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-center mb-14" style={{ color: COLOR_PRIMARY }}>
            {t('features.title', locale)}
          </h2>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8`}>
            {[
              {
                key: 'ai',
                Icon: Zap,
              },
              {
                key: 'intelligence',
                Icon: BarChart3,
              },
              {
                key: 'network',
                Icon: Network,
              },
            ].map((feature, idx) => (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-2xl text-center bg-white hover:shadow-lg transition-all"
                style={{ border: '1px solid #EDE6D8' }}
              >
                <feature.Icon size={36} style={{ color: '#B8956A' }} className="mx-auto mb-4" />
                <h3 className="text-xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
                  {t(`features.${feature.key}.title`, locale)}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {t(`features.${feature.key}.desc`, locale)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section — ink cinematic band */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: '#0F1419' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx}>
                <p className="text-3xl md:text-4xl font-black text-white">
                  {stat.value}
                </p>
                <p className="text-[11px] font-bold tracking-[0.18em] uppercase mt-2" style={{ color: '#B8956A' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-bold tracking-[0.28em] text-center mb-4" style={{ color: '#B8956A' }}>
            BUYERS · SELLERS · BROKERS
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-center mb-14" style={{ color: COLOR_PRIMARY }}>
            {t('users.title', locale)}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                Icon: TrendingUp,
                key: 'sellers',
                href: '/auth/signup?type=seller',
              },
              {
                Icon: Briefcase,
                key: 'buyers',
                href: '/marketplace',
              },
              {
                Icon: Users,
                key: 'brokers',
                href: '/auth/signup?type=broker',
              },
            ].map((user, idx) => (
              <motion.div
                key={user.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-2xl border hover:shadow-lg transition-all flex flex-col"
                style={{ borderColor: COLOR_BORDER }}
              >
                <user.Icon size={36} style={{ color: '#B8956A' }} className="mx-auto mb-4" />
                <h3 className="text-xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
                  {t(`users.${user.key}.title`, locale)}
                </h3>
                <p className="mb-6 text-sm leading-relaxed flex-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {t(`users.${user.key}.desc`, locale)}
                </p>
                <Link
                  href={user.key === 'sellers' ? '/list' : user.href}
                  className="inline-block px-5 py-2.5 rounded-lg font-bold text-sm text-white transition-all hover:opacity-90"
                  style={{ background: '#1A1A1A' }}
                >
                  {user.key === 'sellers' ? t('cta.listBusiness', locale) : t(`users.${user.key}.cta`, locale) + ' →'}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition Section — cream editorial */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: '#FAF6EF' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-14" style={{ color: COLOR_PRIMARY }}>
            {t('roi.title', locale)}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { value: '$685', label: t('roi.savings', locale), note: t('roi.savingsNote', locale) },
              { value: '180+', label: t('roi.hours', locale), note: t('roi.hoursNote', locale) },
              { value: '1 Deal', label: t('roi.breakeven', locale), note: t('roi.breakEvenNote', locale) },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl text-center bg-white"
                style={{ border: '1px solid #EDE6D8' }}
              >
                <p className="text-4xl font-black mb-2" style={{ color: '#B8956A' }}>{card.value}</p>
                <p style={{ color: COLOR_PRIMARY }} className="text-sm font-bold">{card.label}</p>
                <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs mt-3">{card.note}</p>
              </motion.div>
            ))}
          </div>

          <div className="p-8 rounded-2xl text-center" style={{ border: '2px solid #D6C5A8', background: 'white' }}>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-2">
              {t('roi.description', locale)}
            </p>
            <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
              {t('roi.trial', locale)}
            </p>
          </div>
        </div>
      </section>


      {/* Featured Listings Section */}
      <FeaturedListingsSection />

      {/* See in Action Section */}
      <SeeInActionSection />

      {/* Help Contact Widget */}
      <HelpContactWidget />

      {/* CTA Section — ink cinematic closer */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 text-center" style={{ background: '#0F1419' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] font-bold tracking-[0.28em] mb-5" style={{ color: '#B8956A' }}>
            YOUR EXIT STARTS HERE
          </p>
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-white leading-tight">
            {t('cta.title', locale)}
          </h2>
          <p className="text-lg mb-9" style={{ color: 'rgba(255,255,255,0.72)' }}>
            {t('cta.subtitle', locale)}
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <Link
              href="/list"
              className="px-9 py-4 rounded-lg font-bold hover:opacity-90 transition-all"
              style={{ background: 'white', color: '#0F1419' }}
            >
              {t('cta.button1', locale)}
            </Link>
            <Link
              href="/contact-sales"
              className="px-9 py-4 rounded-lg font-bold text-white transition-all hover:bg-white/10"
              style={{ border: '1px solid rgba(255,255,255,0.35)' }}
            >
              {t('cta.button2', locale)}
            </Link>
          </div>
        </div>
      </section>

      {/* World Class Footer */}
      <WorldClassFooter />

      {/* User Type Selector Modal */}
      <UserTypeSelector
        isOpen={showUserTypeModal}
        onClose={() => setShowUserTypeModal(false)}
        redirectAfterSelection={true}
      />

      {/* Legacy Footer - Replaced by WorldClassFooter */}
      <footer className="hidden border-t py-12 px-4 sm:px-6 lg:px-8" style={{ borderColor: COLOR_BORDER }}>
        <div className="max-w-7xl mx-auto">
          <div className={`grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 ${isRTL ? 'text-right' : ''}`}>
            <div>
              <h4 className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
                {t('footer.product', locale)}
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                <li>
                  <Link href="/marketplace" className="hover:underline">
                    {t('footer.marketplace', locale)}
                  </Link>
                </li>
                <li>
                  <Link href="/institutional" className="hover:underline">
                    {t('footer.institutional', locale)}
                  </Link>
                </li>
                <li>
                  <Link href="/professional-services" className="hover:underline">
                    {t('footer.professional', locale)}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
                {t('footer.company', locale)}
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                <li>
                  {/* /about does not exist yet — route to /institutional which
                      doubles as our brand-positioning page until we ship an
                      About surface. */}
                  <Link href="/institutional" className="hover:underline">
                    {t('footer.about', locale)}
                  </Link>
                </li>
                <li>
                  <Link href="/contact-sales" className="hover:underline">
                    {t('footer.contact', locale)}
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:underline">
                    {t('footer.help', locale)}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
                {t('footer.legal', locale)}
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                <li>
                  <Link href="/privacy" className="hover:underline">
                    {t('footer.privacy', locale)}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:underline">
                    {t('footer.terms', locale)}
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:underline">
                    {t('footer.security', locale)}
                  </Link>
                </li>
              </ul>
            </div>
            {/* Social column intentionally removed at launch — pointing at
                href="#" leaks "no real social presence" to anyone who clicks,
                and any inspector will see dead links. We can add this column
                back when we have real handles to link to. */}
          </div>
          <div className="border-t pt-8 text-center text-sm" style={{ borderColor: COLOR_BORDER, color: COLOR_TEXT_SECONDARY }}>
            <p>{t('footer.copyright', locale)}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function LocalizedHomePage() {
  return <LocalizedHomePageContent />
}

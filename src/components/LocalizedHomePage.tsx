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

  // Stat values to display
  const stats = [
    { value: '$2.5T', label: t('stats.market', locale) },
    { value: '500+', label: t('stats.deals', locale) },
    { value: '91%', label: t('stats.accuracy', locale) },
    { value: '24-36mo', label: t('stats.moat', locale) },
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
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=2400&q=80&fit=crop"
            alt=""
            aria-hidden
            className="w-full h-full object-cover"
            style={{ opacity: 0.55 }}
          />
          {/* Ink gradient: readable type up top, image breathing at the bottom */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(15,20,25,0.82) 0%, rgba(15,20,25,0.45) 55%, rgba(15,20,25,0.75) 100%)' }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-center" style={{ minHeight: '88vh' }}>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[11px] md:text-xs font-bold tracking-[0.32em] mb-6" style={{ color: '#B8956A' }}>
              THE MARKETPLACE FOR LIFE&apos;S BIGGEST EXIT
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
                  <Link href="#" className="hover:underline">
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
                  <Link href="#" className="hover:underline">
                    {t('footer.privacy', locale)}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    {t('footer.terms', locale)}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    {t('footer.security', locale)}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
                {t('footer.connect', locale)}
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                <li>
                  <a href="#" className="hover:underline">
                    {t('footer.twitter', locale)}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    {t('footer.linkedin', locale)}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    {t('footer.github', locale)}
                  </a>
                </li>
              </ul>
            </div>
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

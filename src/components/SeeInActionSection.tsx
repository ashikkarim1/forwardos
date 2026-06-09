'use client'

import { useState } from 'react'
import { useLocale } from '@/context/LocaleContext'
import { t } from '@/lib/translations'
import { TrendingUp, Sparkles, Users, ArrowRight } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'
import { motion } from 'framer-motion'
import { MarketplacePreviewModal } from './MarketplacePreviewModal'

export function SeeInActionSection() {
  const { locale, isRTL } = useLocale()
  const [activeModal, setActiveModal] = useState<'seller' | 'buyer' | 'broker' | null>(null)

  const userTypes = [
    {
      id: 'seller',
      icon: TrendingUp,
      iconColor: '#10B981',
      title: t('seeinaction.sellers.callout', locale),
      description: t('seeinaction.sellers.demo', locale),
      badge: '💼',
    },
    {
      id: 'buyer',
      icon: Sparkles,
      iconColor: '#F59E0B',
      title: t('seeinaction.buyers.callout', locale),
      description: t('seeinaction.buyers.demo', locale),
      badge: '🎯',
    },
    {
      id: 'broker',
      icon: Users,
      iconColor: '#8B5CF6',
      title: t('seeinaction.brokers.callout', locale),
      description: t('seeinaction.brokers.demo', locale),
      badge: '🤝',
    },
  ]

  return (
    <>
      <section
        className="py-20 px-4"
        style={{ background: COLOR_PRIMARY + '02' }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: COLOR_PRIMARY }}
            >
              {t('seeinaction.title', locale)}
            </h2>
            <p
              className="text-xl max-w-2xl mx-auto"
              style={{ color: COLOR_TEXT_SECONDARY }}
            >
              {t('seeinaction.subtitle', locale)}
            </p>
          </div>

          {/* User Type Cards */}
          <div className={`grid md:grid-cols-3 gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {userTypes.map((userType, idx) => {
              const Icon = userType.icon
              return (
                <motion.div
                  key={userType.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  style={{
                    borderColor: COLOR_BORDER,
                    background: 'white',
                  }}
                  onClick={() => setActiveModal(userType.id as 'seller' | 'buyer' | 'broker')}
                >
                  {/* Header with Icon */}
                  <div
                    className="p-6 h-32 flex flex-col justify-between"
                    style={{
                      background: `linear-gradient(135deg, ${userType.iconColor}10, ${userType.iconColor}05)`,
                      borderBottom: `1px solid ${COLOR_BORDER}`,
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                        style={{ background: userType.iconColor }}
                      >
                        <Icon size={24} className="text-white" />
                      </div>
                      <span className="text-2xl">{userType.badge}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3
                        className="text-xl font-bold mb-2"
                        style={{ color: COLOR_PRIMARY }}
                      >
                        {userType.title}
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: COLOR_TEXT_SECONDARY }}
                      >
                        {userType.description}
                      </p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-2 pt-4 border-t" style={{ borderColor: COLOR_BORDER }}>
                      {[
                        userType.id === 'seller'
                          ? 'Compare against market'
                          : userType.id === 'buyer'
                            ? 'AI-ranked pipeline'
                            : 'Reputation tracking',
                        userType.id === 'seller'
                          ? 'Growth benchmarks'
                          : userType.id === 'buyer'
                            ? 'Success probability'
                            : 'Market intelligence',
                        userType.id === 'seller'
                          ? 'Deal timing insights'
                          : userType.id === 'buyer'
                            ? '1-click comparison'
                            : 'Verified data',
                      ].map((feature, fidx) => (
                        <div
                          key={fidx}
                          className="flex items-center gap-2 text-sm"
                          style={{ color: COLOR_TEXT_SECONDARY }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: userType.iconColor }}
                          />
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() =>
                        setActiveModal(userType.id as 'seller' | 'buyer' | 'broker')
                      }
                      className="w-full mt-6 px-4 py-3 rounded-lg font-bold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group/btn"
                      style={{ background: userType.iconColor }}
                    >
                      {t('seeinaction.viewexample', locale)}
                      <ArrowRight
                        size={18}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>

                  {/* Hover Overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none rounded-2xl"
                    style={{ background: COLOR_PRIMARY }}
                  />
                </motion.div>
              )
            })}
          </div>

          {/* Benefit Callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16 p-8 rounded-2xl border-2 text-center"
            style={{
              borderColor: COLOR_ACCENT,
              background: COLOR_ACCENT + '05',
            }}
          >
            <div className="text-4xl mb-4">✨</div>
            <h3
              className="text-2xl font-bold mb-3"
              style={{ color: COLOR_PRIMARY }}
            >
              See Your Advantage Instantly
            </h3>
            <p className="max-w-3xl mx-auto" style={{ color: COLOR_TEXT_SECONDARY }}>
              Same marketplace. Different superpowers for each role. See how Forward OS helps you source, analyze, and close deals faster than traditional M&A methods.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Modals */}
      <MarketplacePreviewModal
        isOpen={activeModal === 'seller'}
        onClose={() => setActiveModal(null)}
        userType="seller"
      />
      <MarketplacePreviewModal
        isOpen={activeModal === 'buyer'}
        onClose={() => setActiveModal(null)}
        userType="buyer"
      />
      <MarketplacePreviewModal
        isOpen={activeModal === 'broker'}
        onClose={() => setActiveModal(null)}
        userType="broker"
      />
    </>
  )
}

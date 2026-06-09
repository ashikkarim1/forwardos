'use client'

import { useState } from 'react'
import { useLocale } from '@/context/LocaleContext'
import { t } from '@/lib/translations'
import { X, Sparkles, TrendingUp, Target, Users, Star, Zap, BarChart3 } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'
import { motion, AnimatePresence } from 'framer-motion'

export interface MarketplacePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  userType: 'seller' | 'buyer' | 'broker'
}

export function MarketplacePreviewModal({
  isOpen,
  onClose,
  userType,
}: MarketplacePreviewModalProps) {
  const { locale, isRTL } = useLocale()
  const [activeTab, setActiveTab] = useState<'marketplace' | 'pricing' | 'dashboard'>('marketplace')

  const userTypeConfig = {
    seller: {
      title: t('seeinaction.sellers.callout', locale),
      subtitle: t('seeinaction.sellers.demo', locale),
      icon: TrendingUp,
      color: '#10B981', // Green
      features: [
        'Instant valuation insights',
        '15-20 comparable businesses',
        'Growth rate analysis',
        'Optimal timing recommendations',
      ],
    },
    buyer: {
      title: t('seeinaction.buyers.callout', locale),
      subtitle: t('seeinaction.buyers.demo', locale),
      icon: Sparkles,
      color: '#F59E0B', // Amber
      features: [
        'AI-ranked deal pipeline',
        'Heat score & market demand',
        'M&A probability predictions',
        '1-click deal comparison tool',
      ],
    },
    broker: {
      title: t('seeinaction.brokers.callout', locale),
      subtitle: t('seeinaction.brokers.demo', locale),
      icon: Users,
      color: '#8B5CF6', // Purple
      features: [
        'Deal success tracking',
        'Real-time market intelligence',
        'Verified buyer/seller data',
        'Network reputation builder',
      ],
    },
  }

  const config = userTypeConfig[userType]
  const IconComponent = config.icon

  // Mock marketplace deals for preview
  const mockDeals = [
    {
      id: 1,
      name: 'TechFlow SaaS',
      industry: 'Software',
      location: 'San Francisco, CA',
      valuation: '$3.2M',
      growth: '45%',
      heat: 92,
      success: 94,
      maa: 87,
    },
    {
      id: 2,
      name: 'HealthHub Network',
      industry: 'Healthcare',
      location: 'Toronto, ON',
      valuation: '$5.8M',
      growth: '62%',
      heat: 88,
      success: 91,
      maa: 84,
    },
    {
      id: 3,
      name: 'LogisticsPro Ltd',
      industry: 'Logistics',
      location: 'Dubai, UAE',
      valuation: '$2.1M',
      growth: '38%',
      heat: 85,
      success: 88,
      maa: 79,
    },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
          >
            {/* Header */}
            <div
              className="px-8 py-6 flex items-start justify-between border-b"
              style={{ borderColor: COLOR_BORDER, background: config.color + '05' }}
            >
              <div className="flex items-start gap-4 flex-1">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: config.color }}
                >
                  <IconComponent size={24} className="text-white" />
                </div>
                <div>
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: COLOR_PRIMARY }}
                  >
                    {config.title}
                  </h2>
                  <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {config.subtitle}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <X size={24} style={{ color: COLOR_PRIMARY }} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b" style={{ borderColor: COLOR_BORDER }}>
              {(['marketplace', 'pricing', 'dashboard'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-6 py-4 font-semibold border-b-2 transition-colors ${
                    activeTab === tab ? 'border-b-4' : ''
                  }`}
                  style={{
                    color: activeTab === tab ? config.color : COLOR_TEXT_SECONDARY,
                    borderColor: activeTab === tab ? config.color : 'transparent',
                  }}
                >
                  {tab === 'marketplace' && '🔍 Marketplace'}
                  {tab === 'pricing' && '💰 Pricing'}
                  {tab === 'dashboard' && '📊 Dashboard'}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
              {activeTab === 'marketplace' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
                      47+ Verified Deals Available
                    </h3>
                    <div className="grid gap-4">
                      {mockDeals.map((deal) => (
                        <motion.div
                          key={deal.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer"
                          style={{
                            borderColor: COLOR_BORDER,
                            background: COLOR_PRIMARY + '02',
                          }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="font-bold flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
                                <Star size={16} fill={config.color} style={{ color: config.color }} />
                                {deal.name}
                              </div>
                              <div
                                className="text-sm mt-1"
                                style={{ color: COLOR_TEXT_SECONDARY }}
                              >
                                {deal.industry} • {deal.location}
                              </div>
                            </div>
                            <div
                              className="text-right"
                              style={{ color: COLOR_ACCENT }}
                            >
                              <div className="font-bold">{deal.valuation}</div>
                              <div className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                                +{deal.growth} YoY
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3 pt-3 border-t" style={{ borderColor: COLOR_BORDER }}>
                            <div className="text-center">
                              <div className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                                Heat Score
                              </div>
                              <div className="font-bold mt-1" style={{ color: config.color }}>
                                {deal.heat}/100
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                                Success %
                              </div>
                              <div className="font-bold mt-1" style={{ color: config.color }}>
                                {deal.success}%
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                                M&A %
                              </div>
                              <div className="font-bold mt-1" style={{ color: config.color }}>
                                {deal.maa}%
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border-2" style={{ borderColor: config.color + '40', background: config.color + '05' }}>
                    <div className="flex items-start gap-3">
                      <Zap size={20} style={{ color: config.color }} className="flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>
                          Key Features
                        </div>
                        <ul className="mt-2 space-y-1">
                          {config.features.map((feature, idx) => (
                            <li key={idx} className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                              ✓ {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'pricing' && (
                <div className="space-y-6">
                  <h3 className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                    Simple Transparent Pricing
                  </h3>

                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { name: 'Starter', price: '$499', features: ['Up to 10 deal views/month', 'Basic filters', 'Email support'] },
                      {
                        name: 'Professional',
                        price: '$1,999',
                        features: ['Unlimited deal access', 'All AI models', 'Advanced comparison', 'Priority support'],
                        badge: 'Most Popular',
                      },
                      {
                        name: 'Enterprise',
                        price: 'Custom',
                        features: ['Custom integrations', 'White-label API', 'Dedicated account', 'Custom SLA'],
                      },
                    ].map((plan, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-6 rounded-lg border relative"
                        style={{
                          borderColor: plan.badge ? config.color : COLOR_BORDER,
                          borderWidth: plan.badge ? '2px' : '1px',
                          background: plan.badge ? config.color + '05' : 'white',
                        }}
                      >
                        {plan.badge && (
                          <div
                            className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white"
                            style={{ background: config.color }}
                          >
                            {plan.badge}
                          </div>
                        )}

                        <h4 className="font-bold text-lg mb-2" style={{ color: COLOR_PRIMARY }}>
                          {plan.name}
                        </h4>
                        <div className="text-3xl font-bold mb-4" style={{ color: COLOR_ACCENT }}>
                          {plan.price}
                        </div>
                        <ul className="space-y-2">
                          {plan.features.map((feature, fidx) => (
                            <li
                              key={fidx}
                              className="text-sm flex items-start gap-2"
                              style={{ color: COLOR_TEXT_SECONDARY }}
                            >
                              <span style={{ color: config.color }}>✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <h3 className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                    My Favourites Dashboard
                  </h3>

                  <div className="grid md:grid-cols-4 gap-4">
                    {[
                      { label: 'Saved Deals', value: '12', icon: Star },
                      { label: 'Avg Valuation', value: '$3.8M', icon: BarChart3 },
                      { label: 'Avg Success %', value: '89%', icon: Target },
                      { label: 'Quick Compare', value: 'Up to 5', icon: TrendingUp },
                    ].map((stat, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-4 rounded-lg border text-center"
                        style={{
                          borderColor: COLOR_BORDER,
                          background: COLOR_PRIMARY + '02',
                        }}
                      >
                        <stat.icon
                          size={24}
                          style={{ color: config.color }}
                          className="mx-auto mb-2"
                        />
                        <div className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                          {stat.label}
                        </div>
                        <div
                          className="font-bold text-lg mt-1"
                          style={{ color: COLOR_PRIMARY }}
                        >
                          {stat.value}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="p-6 rounded-lg border-2" style={{ borderColor: config.color + '40', background: config.color + '05' }}>
                    <h4 className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                      Advanced Comparison
                    </h4>
                    <p className="text-sm mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Select multiple deals to compare side-by-side across 12 metrics:
                    </p>
                    <div className="grid md:grid-cols-2 gap-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                      <div>✓ Valuation & Revenue</div>
                      <div>✓ Growth & EBITDA</div>
                      <div>✓ Success Probability</div>
                      <div>✓ M&A Likelihood</div>
                      <div>✓ Market Heat Score</div>
                      <div>✓ Export to PDF/Excel</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer CTA */}
            <div
              className="px-8 py-6 border-t flex items-center justify-between gap-4"
              style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}
            >
              <div>
                <div className="font-semibold" style={{ color: COLOR_PRIMARY }}>
                  Ready to get started?
                </div>
                <div className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Join 500+ deal professionals using Forward OS
                </div>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-lg font-bold text-white hover:opacity-90 transition-opacity whitespace-nowrap"
                style={{ background: config.color }}
              >
                Start Free Trial
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

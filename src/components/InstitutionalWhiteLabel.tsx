'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Code, Lock, Zap, BarChart3, Users, CheckCircle2 } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

interface IntegrationFeature {
  name: string
  description: string
  icon: any
  status: 'live' | 'coming' | 'custom'
}

export default function InstitutionalWhiteLabel() {
  const [selectedTier, setSelectedTier] = useState<'starter' | 'professional' | 'enterprise'>('professional')

  const features: IntegrationFeature[] = [
    {
      name: 'Real-Time Deal Data',
      description: 'Live deal outcomes, pricing, and valuation data flowing in from verified transactions',
      icon: BarChart3,
      status: 'live',
    },
    {
      name: 'Continuous Model Training',
      description: 'ML models automatically retrain on new outcomes. Accuracy improves every deal.',
      icon: Zap,
      status: 'live',
    },
    {
      name: 'Enterprise API',
      description: 'REST/GraphQL API with webhook support, batch processing, and rate limits',
      icon: Code,
      status: 'live',
    },
    {
      name: 'White-Label Portal',
      description: 'Branded platform for your firm. Looks like your tool, runs on Forward OS.',
      icon: Users,
      status: 'live',
    },
    {
      name: 'Data Room Integration',
      description: 'Connect to Box, Datasite, or Intralinks for automatic document enrichment',
      icon: Lock,
      status: 'coming',
    },
    {
      name: 'Custom Reporting',
      description: 'PDF exports, dashboards, and custom metrics tailored to your firm',
      icon: BarChart3,
      status: 'custom',
    },
  ]

  const pricingTiers = {
    starter: {
      name: 'Starter',
      price: '$500',
      period: '/month',
      description: 'For individual buyers and small teams',
      limits: ['100 API requests/month', '5 concurrent deals', '30 days data retention', 'Email support'],
      cta: 'Start Free Trial',
      color: '#e5e7eb',
    },
    professional: {
      name: 'Professional',
      price: '$2,000',
      period: '/month',
      description: 'For growing teams and brokers',
      limits: ['10,000 API requests/month', 'Unlimited concurrent deals', '1 year data retention', 'Priority email support', 'Custom branding', 'Webhook webhooks'],
      cta: 'Start Free Trial',
      color: COLOR_ACCENT,
    },
    enterprise: {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'For institutions and platforms',
      limits: ['Unlimited API requests', 'Unlimited deals', 'Unlimited data retention', '24/7 phone support', 'Dedicated success manager', 'White-label deployment', 'Custom SLA', 'Data room integrations'],
      cta: 'Schedule Demo',
      color: COLOR_PRIMARY,
    },
  }

  const tier = pricingTiers[selectedTier]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
          🏢 Institutional White-Label Platform
        </h2>
        <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-6">
          Enterprise API and white-label platform. Deploy Forward OS intelligence under your brand. Real deal data automatically improves your models.
        </p>
      </div>

      {/* Real Deal Data Flow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-lg"
        style={{ background: '#f0fdf4', border: `1px solid #86efac` }}
      >
        <h3 className="font-bold mb-3 text-green-900">♻️ Real Data Feedback Loop (Phase 5 = Defensibility Lock)</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
          <div className="text-center">
            <div className="font-black text-xl text-green-600 mb-2">1</div>
            <p className="font-bold text-green-900 mb-1">Deal Listed</p>
            <p className="text-xs text-green-800">Seller puts business on Forward OS</p>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-2xl text-green-600">→</div>
          </div>
          <div className="text-center">
            <div className="font-black text-xl text-green-600 mb-2">2</div>
            <p className="font-bold text-green-900 mb-1">AI Predicts</p>
            <p className="text-xs text-green-800">5 models score the deal</p>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-2xl text-green-600">→</div>
          </div>
          <div className="text-center">
            <div className="font-black text-xl text-green-600 mb-2">3</div>
            <p className="font-bold text-green-900 mb-1">Deal Closes</p>
            <p className="text-xs text-green-800">Buyer pays, seller receives funds</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-green-200 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl text-green-600 mb-2">↓</div>
            <p className="font-bold text-green-900 mb-1">4. Real Outcome Verified</p>
            <p className="text-xs text-green-800">Actual price, close time, buyer type recorded</p>
          </div>
          <div className="text-center">
            <div className="text-2xl text-green-600 mb-2">↓</div>
            <p className="font-bold text-green-900 mb-1">5. Models Improve</p>
            <p className="text-xs text-green-800">ML models retrain on real data → accuracy ↑</p>
          </div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div>
        <h3 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
          🎯 Platform Capabilities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            const statusColor = feature.status === 'live' ? '#10b981' : feature.status === 'coming' ? COLOR_ACCENT : COLOR_TEXT_SECONDARY
            const statusLabel = feature.status === 'live' ? '✅ Live' : feature.status === 'coming' ? '⏳ Coming Soon' : '🔧 Custom'

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 rounded-lg border"
                style={{ borderColor: COLOR_BORDER }}
              >
                <Icon size={20} style={{ color: COLOR_ACCENT }} className="mb-3" />
                <p className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                  {feature.name}
                </p>
                <p className="text-sm mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {feature.description}
                </p>
                <p className="text-xs font-bold" style={{ color: statusColor }}>
                  {statusLabel}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Pricing Tiers */}
      <div>
        <h3 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
          💰 Pricing & Tiers
        </h3>

        {/* Tier Selector */}
        <div className="flex gap-2 mb-6">
          {(['starter', 'professional', 'enterprise'] as const).map(t => (
            <button
              key={t}
              onClick={() => setSelectedTier(t)}
              className={`px-4 py-2 rounded-lg border transition-all font-bold capitalize`}
              style={{
                background: selectedTier === t ? COLOR_ACCENT + '20' : 'white',
                borderColor: selectedTier === t ? COLOR_ACCENT : COLOR_BORDER,
                color: selectedTier === t ? COLOR_ACCENT : COLOR_TEXT_SECONDARY,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Selected Tier Card */}
        <motion.div
          key={selectedTier}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-8 rounded-lg border-2"
          style={{ borderColor: tier.color, background: tier.color + '05' }}
        >
          <div className="mb-6">
            <h4 className="text-2xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
              {tier.name}
            </h4>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mb-4">
              {tier.description}
            </p>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black" style={{ color: tier.color }}>
                {tier.price}
              </span>
              <span style={{ color: COLOR_TEXT_SECONDARY }}>{tier.period}</span>
            </div>
            <button
              className="w-full py-3 rounded-lg font-bold text-white transition-all hover:opacity-90"
              style={{ background: tier.color }}
            >
              {tier.cta}
            </button>
          </div>

          <div className="border-t pt-6" style={{ borderColor: COLOR_BORDER }}>
            <p className="text-xs font-bold mb-4 uppercase" style={{ color: COLOR_TEXT_SECONDARY }}>
              Included:
            </p>
            <ul className="space-y-3">
              {tier.limits.map((limit, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 size={16} style={{ color: tier.color }} className="flex-shrink-0 mt-0.5" />
                  <span style={{ color: COLOR_PRIMARY }}>{limit}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Lock-In Effect */}
      <div className="p-6 rounded-lg" style={{ background: COLOR_ACCENT + '08', border: `1px solid ${COLOR_ACCENT}` }}>
        <div className="flex gap-3">
          <Lock size={24} style={{ color: COLOR_ACCENT }} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
              🔐 Institutional Lock-In (The Final Moat)
            </p>
            <p className="text-sm mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>
              Once an institution deploys white-label and integrates API, the cost to switch is massive:
            </p>
            <ul className="space-y-2 text-sm">
              <li style={{ color: COLOR_TEXT_SECONDARY }}>
                • <strong>Custom integrations:</strong> API tied to their data room, CRM, internal workflows
              </li>
              <li style={{ color: COLOR_TEXT_SECONDARY }}>
                • <strong>Model dependency:</strong> They rely on OUR predictions, can't train their own quickly
              </li>
              <li style={{ color: COLOR_TEXT_SECONDARY }}>
                • <strong>Competitive advantage:</strong> Switching means losing superior predictions vs competitors
              </li>
              <li style={{ color: COLOR_TEXT_SECONDARY }}>
                • <strong>Historical data:</strong> We have 500+ deals, new platform has zero
              </li>
            </ul>
            <p className="text-sm mt-3" style={{ color: COLOR_ACCENT }}>
              <strong>Result:</strong> $2-5k/mo enterprise contract becomes permanent, acquisition-only outcome inevitable.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

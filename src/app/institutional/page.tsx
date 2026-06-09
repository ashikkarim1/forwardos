'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, Shield, Users, Zap, Lock, BarChart3, Globe, Award } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import BrokerDirectory from '@/components/BrokerDirectory'
import InstitutionalIntegrations from '@/components/InstitutionalIntegrations'
import BrokerReputationSystem from '@/components/BrokerReputationSystem'
import DealReviewCommunity from '@/components/DealReviewCommunity'
import InstitutionalWhiteLabel from '@/components/InstitutionalWhiteLabel'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

type TabType = 'overview' | 'brokers' | 'integrations' | 'reputation' | 'community' | 'whitelabel' | 'compliance'

export default function InstitutionalPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  const features = [
    {
      icon: Users,
      title: 'Multi-Org Workspaces',
      description: 'Manage multiple investment vehicles, funds, and syndicates in one platform',
      details: ['Unlimited team members', 'Role-based access control', 'Audit trails', 'Custom permissions']
    },
    {
      icon: Shield,
      title: 'Compliance & KYC',
      description: 'Built-in KYC, AML, and regulatory compliance for institutional investors',
      details: ['SOC 2 Type II certified', 'GDPR compliant', 'Automated KYC flows', 'Audit-ready reporting']
    },
    {
      icon: BarChart3,
      title: 'Custom Reporting',
      description: 'Generate institutional-grade reports for LPs, regulators, and stakeholders',
      details: ['PDF export', 'Real-time dashboards', 'Data visualization', 'Custom branding']
    },
    {
      icon: Lock,
      title: 'Data Room Integration',
      description: 'Secure document sharing and due diligence workflows',
      details: ['256-bit encryption', 'Watermarking & DRM', 'Viewer tracking', 'Granular permissions']
    },
    {
      icon: Zap,
      title: 'API Access',
      description: 'Custom integrations with your existing systems and workflows',
      details: ['REST API', 'Webhooks', 'OAuth 2.0', 'Rate limiting: 1000req/min']
    },
    {
      icon: Globe,
      title: 'Deal Flow Distribution',
      description: 'Syndicate deals to your LP network and investor community',
      details: ['White-label options', 'Deal notifications', 'Waterfall distributions', 'Performance tracking']
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      <div style={{ paddingTop: '80px' }}>
        {/* Hero */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-b" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '08' }}>
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
              🏢 Institutional Platform
            </h1>
            <p className="text-xl mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
              Enterprise-grade deal discovery, intelligence, and management for institutional investors
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="#"
                className="px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90"
                style={{ background: COLOR_ACCENT }}
              >
                Request Demo
              </Link>
              <Link
                href="#"
                className="px-6 py-3 rounded-lg font-bold border transition-all hover:bg-gray-50"
                style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-black mb-8" style={{ color: COLOR_PRIMARY }}>
              Enterprise Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-6 rounded-lg border hover:shadow-lg transition-all"
                    style={{ borderColor: COLOR_BORDER }}
                  >
                    <Icon size={32} style={{ color: COLOR_ACCENT }} className="mb-3" />
                    <h3 className="text-lg font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                      {feature.title}
                    </h3>
                    <p className="text-sm mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.details.map(detail => (
                        <li key={detail} className="flex items-center gap-2 text-xs">
                          <CheckCircle2 size={14} style={{ color: COLOR_ACCENT }} />
                          <span style={{ color: COLOR_TEXT_SECONDARY }}>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t" style={{ borderColor: COLOR_BORDER }}>
          <div className="max-w-7xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex gap-2 border-b mb-8 overflow-x-auto" style={{ borderColor: COLOR_BORDER }}>
              {[
                { id: 'overview', label: '📋 Overview' },
                { id: 'brokers', label: '🤝 Broker Network' },
                { id: 'integrations', label: '🔗 Integrations' },
                { id: 'reputation', label: '🏆 Reputation (Phase 5)' },
                { id: 'community', label: '👥 Community (Phase 5)' },
                { id: 'whitelabel', label: '🏢 White-Label (Phase 5)' },
                { id: 'compliance', label: '🔒 Compliance' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`px-4 py-3 font-bold text-sm whitespace-nowrap border-b-2 transition-all`}
                  style={{
                    borderColor: activeTab === tab.id ? COLOR_ACCENT : 'transparent',
                    color: activeTab === tab.id ? COLOR_ACCENT : COLOR_TEXT_SECONDARY,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="p-6 rounded-lg" style={{ background: COLOR_ACCENT + '08', border: `1px solid ${COLOR_BORDER}` }}>
                    <h3 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
                      Why Institutional Buyers Choose Forward OS
                    </h3>
                    <ul className="space-y-3">
                      {[
                        '📊 Access to verified deal intelligence before public markets',
                        '🚀 AI-powered deal scoring & buyer matching',
                        '🔐 Enterprise-grade security and compliance',
                        '🤝 Direct broker network with reputation ratings',
                        '📈 Real-time market analytics and trend forecasting',
                        '🔗 Seamless integrations with your existing systems',
                      ].map(item => (
                        <li key={item} className="flex items-center gap-2">
                          <CheckCircle2 size={18} style={{ color: COLOR_ACCENT }} />
                          <span style={{ color: COLOR_PRIMARY }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { number: '500+', label: 'Verified Deals/Year' },
                      { number: '1M+', label: 'Active Data Points' },
                      { number: '94%', label: 'Success Rate' },
                    ].map(stat => (
                      <div key={stat.label} className="text-center p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
                        <p className="text-3xl font-black" style={{ color: COLOR_ACCENT }}>
                          {stat.number}
                        </p>
                        <p style={{ color: COLOR_TEXT_SECONDARY }}>{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'brokers' && <BrokerDirectory />}
              {activeTab === 'integrations' && <InstitutionalIntegrations />}
              {activeTab === 'reputation' && <BrokerReputationSystem />}
              {activeTab === 'community' && <DealReviewCommunity />}
              {activeTab === 'whitelabel' && <InstitutionalWhiteLabel />}
              {activeTab === 'compliance' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
                    <h3 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
                      🔒 Compliance & Security
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="font-bold" style={{ color: COLOR_PRIMARY }}>Security Certifications</p>
                        <ul className="mt-2 space-y-1 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                          <li>✅ SOC 2 Type II Certified</li>
                          <li>✅ GDPR Compliant</li>
                          <li>✅ CCPA Compliant</li>
                          <li>✅ 256-bit AES Encryption</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: COLOR_PRIMARY }}>Compliance Features</p>
                        <ul className="mt-2 space-y-1 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                          <li>✅ Automated KYC/AML flows</li>
                          <li>✅ Audit trails on all actions</li>
                          <li>✅ Regulatory reporting</li>
                          <li>✅ Data residency options</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t text-center" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '10' }}>
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
              Ready to Win More Deals?
            </h3>
            <p className="text-lg mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
              Join 500+ institutional investors using Forward OS to source, analyze, and close M&A deals
            </p>
            <Link
              href="#"
              className="inline-block px-8 py-4 rounded-lg font-bold text-white transition-all hover:opacity-90"
              style={{ background: COLOR_ACCENT }}
            >
              Schedule Your Demo →
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

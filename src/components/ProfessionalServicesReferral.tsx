'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Briefcase, CheckCircle2, DollarSign, TrendingUp, Users, MapPin, Award, Star } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

interface ServiceProvider {
  id: string
  name: string
  company: string
  type: 'lawyer' | 'valuator' | 'accountant' | 'auditor' | 'insurance' | 'consultant'
  rating: number
  dealsHandled: number
  location: string
  specialization: string
  avgResponseTime: string
  successRate: number
  referralsThisMonth: number
  feePerReferral: string
}

export default function ProfessionalServicesReferral() {
  const [selectedType, setSelectedType] = useState<'all' | 'lawyer' | 'valuator' | 'accountant' | 'auditor' | 'insurance' | 'consultant'>('all')

  const providers: ServiceProvider[] = [
    {
      id: '1',
      name: 'Jennifer Park',
      company: 'Park M&A Legal',
      type: 'lawyer',
      rating: 4.9,
      dealsHandled: 234,
      location: 'New York, NY',
      specialization: 'Small-mid market M&A, SaaS acquisitions',
      avgResponseTime: '2 hours',
      successRate: 96,
      referralsThisMonth: 12,
      feePerReferral: '$5,000',
    },
    {
      id: '2',
      name: 'Michael Chen',
      company: 'Apex Valuations',
      type: 'valuator',
      rating: 4.8,
      dealsHandled: 189,
      location: 'San Francisco, CA',
      specialization: 'Restaurant & hospitality valuations',
      avgResponseTime: '4 hours',
      successRate: 94,
      referralsThisMonth: 8,
      feePerReferral: '$3,500',
    },
    {
      id: '3',
      name: 'Sarah Rodriguez',
      company: 'Strategic Tax Solutions',
      type: 'accountant',
      rating: 4.7,
      dealsHandled: 156,
      location: 'Dallas, TX',
      specialization: 'Tax optimization, deal structure',
      avgResponseTime: '6 hours',
      successRate: 92,
      referralsThisMonth: 6,
      feePerReferral: '$2,500',
    },
    {
      id: '4',
      name: 'David Patel',
      company: 'Integrity Auditors',
      type: 'auditor',
      rating: 4.9,
      dealsHandled: 201,
      location: 'Chicago, IL',
      specialization: 'Financial statement audits, due diligence',
      avgResponseTime: '3 hours',
      successRate: 95,
      referralsThisMonth: 10,
      feePerReferral: '$4,000',
    },
    {
      id: '5',
      name: 'Lisa Thompson',
      company: 'BusinessGuard Insurance',
      type: 'insurance',
      rating: 4.8,
      dealsHandled: 167,
      location: 'Boston, MA',
      specialization: 'M&A insurance, representations & warranties',
      avgResponseTime: '2 hours',
      successRate: 93,
      referralsThisMonth: 7,
      feePerReferral: '$3,000',
    },
  ]

  const serviceTypes = [
    { id: 'lawyer', icon: '⚖️', title: 'M&A Lawyers', count: 2 },
    { id: 'valuator', icon: '💰', title: 'Valuators', count: 1 },
    { id: 'accountant', icon: '📊', title: 'Accountants', count: 1 },
    { id: 'auditor', icon: '✓', title: 'Auditors', count: 1 },
    { id: 'insurance', icon: '🛡️', title: 'Insurance', count: 1 },
    { id: 'consultant', icon: '💼', title: 'Consultants', count: 0 },
  ]

  const filteredProviders = selectedType === 'all' 
    ? providers 
    : providers.filter(p => p.type === selectedType)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
          🤝 Professional Services Referral Network
        </h2>
        <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-6">
          Sellers need lawyers, valuators, accountants, and auditors. Forward OS connects them instantly—
          and professional firms pay referral fees to get deal flow.
        </p>
      </div>

      {/* Revenue Model */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-lg"
        style={{ background: COLOR_ACCENT + '08', border: `1px solid ${COLOR_ACCENT}` }}
      >
        <h3 className="font-bold text-xl mb-4" style={{ color: COLOR_PRIMARY }}>
          💡 How It Works (New Revenue Stream)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-bold mb-3" style={{ color: COLOR_ACCENT }}>
              STEP 1: SELLER LISTS
            </p>
            <p style={{ color: COLOR_TEXT_SECONDARY }}>
              Seller lists business on Forward OS, gets valuation + intelligence
            </p>
          </div>
          <div>
            <p className="text-sm font-bold mb-3" style={{ color: COLOR_ACCENT }}>
              STEP 2: NEEDS SERVICES
            </p>
            <p style={{ color: COLOR_TEXT_SECONDARY }}>
              During deal process, seller needs lawyer, valuator, accountant, auditor, insurance
            </p>
          </div>
          <div>
            <p className="text-sm font-bold mb-3" style={{ color: COLOR_ACCENT }}>
              STEP 3: WE REFER
            </p>
            <p style={{ color: COLOR_TEXT_SECONDARY }}>
              Forward OS recommends vetted professional. Professional pays $2,500-$5,000 referral fee per deal
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg" style={{ background: 'white' }}>
          <p style={{ color: COLOR_PRIMARY }} className="font-bold">
            Revenue Per Deal:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-3 text-center">
            <div>
              <p className="text-sm font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>Lawyer</p>
              <p className="text-lg font-black text-green-600">$5,000</p>
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>Valuator</p>
              <p className="text-lg font-black text-green-600">$3,500</p>
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>Accountant</p>
              <p className="text-lg font-black text-green-600">$2,500</p>
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>Auditor</p>
              <p className="text-lg font-black text-green-600">$4,000</p>
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>Insurance</p>
              <p className="text-lg font-black text-green-600">$3,000</p>
            </div>
          </div>
          <p className="text-center mt-4 font-bold" style={{ color: COLOR_ACCENT }}>
            100 deals/year × $3,500 avg = $350K+ annual revenue from referrals alone
          </p>
        </div>
      </motion.div>

      {/* Service Type Filter */}
      <div>
        <h3 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
          Browse by Service Type
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-lg border transition-all font-bold text-sm`}
            style={{
              background: selectedType === 'all' ? COLOR_ACCENT + '20' : 'white',
              borderColor: selectedType === 'all' ? COLOR_ACCENT : COLOR_BORDER,
              color: selectedType === 'all' ? COLOR_ACCENT : COLOR_TEXT_SECONDARY,
            }}
          >
            All Services
          </button>
          {serviceTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id as any)}
              className={`px-4 py-2 rounded-lg border transition-all font-bold text-sm`}
              style={{
                background: selectedType === type.id ? COLOR_ACCENT + '20' : 'white',
                borderColor: selectedType === type.id ? COLOR_ACCENT : COLOR_BORDER,
                color: selectedType === type.id ? COLOR_ACCENT : COLOR_TEXT_SECONDARY,
              }}
            >
              {type.icon} {type.title}
            </button>
          ))}
        </div>
      </div>

      {/* Provider Cards */}
      <div className="grid grid-cols-1 gap-6">
        {filteredProviders.map((provider, idx) => (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-lg border hover:shadow-lg transition-all"
            style={{ borderColor: COLOR_BORDER }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Left: Info */}
              <div>
                <p className="text-sm font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {provider.type === 'lawyer' && '⚖️ M&A LAWYER'}
                  {provider.type === 'valuator' && '💰 VALUATOR'}
                  {provider.type === 'accountant' && '📊 ACCOUNTANT'}
                  {provider.type === 'auditor' && '✓ AUDITOR'}
                  {provider.type === 'insurance' && '🛡️ INSURANCE'}
                  {provider.type === 'consultant' && '💼 CONSULTANT'}
                </p>
                <h3 className="text-lg font-bold" style={{ color: COLOR_PRIMARY }}>
                  {provider.name}
                </h3>
                <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {provider.company}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <MapPin size={14} style={{ color: COLOR_ACCENT }} />
                  <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {provider.location}
                  </span>
                </div>

                <div className="flex items-center gap-1 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      fill={i < Math.floor(provider.rating) ? COLOR_ACCENT : COLOR_BORDER}
                      style={{ color: i < Math.floor(provider.rating) ? COLOR_ACCENT : COLOR_BORDER }}
                    />
                  ))}
                  <span className="text-xs font-bold" style={{ color: COLOR_ACCENT }}>
                    {provider.rating}
                  </span>
                </div>
              </div>

              {/* Center: Specialization & Stats */}
              <div className="md:col-span-2">
                <p className="text-xs font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                  SPECIALIZATION
                </p>
                <p className="mb-4" style={{ color: COLOR_PRIMARY }}>
                  {provider.specialization}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Deals Handled
                    </p>
                    <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                      {provider.dealsHandled}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Success Rate
                    </p>
                    <p className="font-bold text-green-600">
                      {provider.successRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Response Time
                    </p>
                    <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                      {provider.avgResponseTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                      This Month
                    </p>
                    <p className="font-bold text-blue-600">
                      {provider.referralsThisMonth} referrals
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Referral Info */}
              <div className="flex flex-col justify-center items-center text-center">
                <p className="text-xs font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                  REFERRAL FEE
                </p>
                <p className="text-2xl font-black mb-4" style={{ color: COLOR_ACCENT }}>
                  {provider.feePerReferral}
                </p>
                <button
                  className="w-full py-2 rounded-lg font-bold text-white transition-all hover:opacity-90"
                  style={{ background: COLOR_ACCENT }}
                >
                  Send Referral
                </button>
                <p className="text-xs mt-3" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Forward OS earns commission. Seller gets free intro.
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Become a Partner */}
      <div className="p-8 rounded-lg border-2" style={{ borderColor: COLOR_ACCENT }}>
        <h3 className="text-2xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
          🚀 Are You a Professional Services Firm?
        </h3>
        <p className="mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
          Join our referral network. Get deal flow from Forward OS users. 
          Pay only for referrals that convert to real business.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-sm font-bold mb-2" style={{ color: COLOR_ACCENT }}>
              How it works
            </p>
            <ul className="text-sm space-y-1" style={{ color: COLOR_TEXT_SECONDARY }}>
              <li>✓ List your profile for free</li>
              <li>✓ Get seller referrals</li>
              <li>✓ Pay $2.5k-$5k per successful deal</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold mb-2" style={{ color: COLOR_ACCENT }}>
              Who we need
            </p>
            <ul className="text-sm space-y-1" style={{ color: COLOR_TEXT_SECONDARY }}>
              <li>✓ M&A Lawyers</li>
              <li>✓ Business Valuators</li>
              <li>✓ CPAs & Accountants</li>
              <li>✓ Auditors & Insurance</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold mb-2" style={{ color: COLOR_ACCENT }}>
              Expected volume
            </p>
            <ul className="text-sm space-y-1" style={{ color: COLOR_TEXT_SECONDARY }}>
              <li>✓ 5-20 referrals/month</li>
              <li>✓ $12.5k-$100k/month</li>
              <li>✓ Pre-qualified hot deals</li>
            </ul>
          </div>
        </div>
        <button
          className="px-8 py-3 rounded-lg font-bold text-white hover:opacity-90"
          style={{ background: COLOR_ACCENT }}
        >
          Apply to Join Referral Network →
        </button>
      </div>

      {/* Why This Works */}
      <div className="p-6 rounded-lg" style={{ background: COLOR_ACCENT + '05', border: `1px solid ${COLOR_ACCENT}` }}>
        <h3 className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
          💎 Why This Is Brilliant for Everyone
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="font-bold mb-2" style={{ color: COLOR_ACCENT }}>Sellers Win</p>
            <p style={{ color: COLOR_TEXT_SECONDARY }}>
              Get vetted professionals recommended by platform they trust
            </p>
          </div>
          <div>
            <p className="font-bold mb-2" style={{ color: COLOR_ACCENT }}>Professionals Win</p>
            <p style={{ color: COLOR_TEXT_SECONDARY }}>
              Pre-qualified deal flow. Pay only for real business. Build reputation.
            </p>
          </div>
          <div>
            <p className="font-bold mb-2" style={{ color: COLOR_ACCENT }}>Forward OS Wins</p>
            <p style={{ color: COLOR_TEXT_SECONDARY }}>
              $2.5k-$5k per referral. 100 deals/year = $350k annual recurring revenue
            </p>
          </div>
          <div>
            <p className="font-bold mb-2" style={{ color: COLOR_ACCENT }}>Network Effect</p>
            <p style={{ color: COLOR_TEXT_SECONDARY }}>
              More professionals = better seller experience = more sellers = more professionals
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

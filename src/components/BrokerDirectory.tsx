'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Star, Search, CheckCircle2, TrendingUp, Users, Award } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

interface Broker {
  id: string
  name: string
  company: string
  specialization: string
  rating: number
  deals: number
  successRate: number
  followers: number
  responseTime: string
  image: string
  verified: boolean
  yearsExp: number
  badge: string
}

const brokers: Broker[] = [
  {
    id: '1',
    name: 'Michael Chen',
    company: 'Presidio Capital',
    specialization: 'Healthcare M&A',
    rating: 4.9,
    deals: 127,
    successRate: 94,
    followers: 3240,
    responseTime: '<4 hours',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    verified: true,
    yearsExp: 15,
    badge: 'Top Broker',
  },
  {
    id: '2',
    name: 'Sarah Martinez',
    company: 'Accel Partners',
    specialization: 'SaaS & Tech',
    rating: 4.8,
    deals: 89,
    successRate: 91,
    followers: 2156,
    responseTime: '<6 hours',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    verified: true,
    yearsExp: 12,
    badge: 'Rising Star',
  },
  {
    id: '3',
    name: 'James Patterson',
    company: 'Riverside Advisors',
    specialization: 'Industrial & Manufacturing',
    rating: 4.7,
    deals: 156,
    successRate: 88,
    followers: 4521,
    responseTime: '<2 hours',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    verified: true,
    yearsExp: 18,
    badge: 'Expert',
  },
  {
    id: '4',
    name: 'Elena Rodriguez',
    company: 'Summit Capital',
    specialization: 'Restaurant & Hospitality',
    rating: 4.9,
    deals: 94,
    successRate: 93,
    followers: 2789,
    responseTime: '<5 hours',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    verified: true,
    yearsExp: 14,
    badge: 'Expert',
  },
  {
    id: '5',
    name: 'David Thompson',
    company: 'Pioneer Ventures',
    specialization: 'Real Estate & Hospitality',
    rating: 4.6,
    deals: 112,
    successRate: 85,
    followers: 3156,
    responseTime: '<8 hours',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    verified: true,
    yearsExp: 16,
    badge: 'Trusted',
  },
  {
    id: '6',
    name: 'Lisa Wong',
    company: 'Growth Capital Partners',
    specialization: 'Consumer & Retail',
    rating: 4.8,
    deals: 78,
    successRate: 89,
    followers: 1924,
    responseTime: '<7 hours',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    verified: true,
    yearsExp: 11,
    badge: 'Rising Star',
  },
]

export default function BrokerDirectory() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpec, setSelectedSpec] = useState('all')

  const filteredBrokers = useMemo(() => {
    return brokers.filter(b => {
      const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.company.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSpec = selectedSpec === 'all' || b.specialization.toLowerCase().includes(selectedSpec.toLowerCase())
      return matchesSearch && matchesSpec
    })
  }, [searchQuery, selectedSpec])

  const specializations = ['all', ...new Set(brokers.map(b => b.specialization))]

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="mb-8">
        <h2 className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
          🤝 Broker Network
        </h2>
        <p style={{ color: COLOR_TEXT_SECONDARY }}>
          Connect with verified brokers who've successfully closed {brokers.reduce((sum, b) => sum + b.deals, 0)}+ deals on Forward OS
        </p>
      </div>

      {/* Search & Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5" size={18} style={{ color: COLOR_TEXT_SECONDARY }} />
          <input
            type="text"
            placeholder="Search brokers by name or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border"
            style={{ borderColor: COLOR_BORDER }}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {specializations.map(spec => (
            <button
              key={spec}
              onClick={() => setSelectedSpec(spec)}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap text-xs transition-all ${
                selectedSpec === spec ? 'text-white' : 'bg-white border'
              }`}
              style={{
                background: selectedSpec === spec ? COLOR_ACCENT : 'white',
                borderColor: selectedSpec === spec ? COLOR_ACCENT : COLOR_BORDER,
                color: selectedSpec === spec ? 'white' : COLOR_PRIMARY,
              }}
            >
              {spec === 'all' ? '🌐 All Specializations' : spec}
            </button>
          ))}
        </div>
      </div>

      {/* Broker Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBrokers.map((broker, idx) => (
          <motion.div
            key={broker.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-4 rounded-lg border hover:shadow-lg transition-all"
            style={{ borderColor: COLOR_BORDER }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex gap-3 flex-1">
                <img
                  src={broker.image}
                  alt={broker.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>
                      {broker.name}
                    </p>
                    {broker.verified && (
                      <CheckCircle2 size={14} style={{ color: COLOR_ACCENT }} />
                    )}
                  </div>
                  <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {broker.company}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Star size={14} style={{ color: '#fbbf24' }} fill="#fbbf24" />
                  <span className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                    {broker.rating}
                  </span>
                </div>
                <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {broker.successRate}% success
                </p>
              </div>
            </div>

            {/* Badge */}
            <div className="mb-3">
              <span
                className="text-xs px-2 py-1 rounded-full font-bold"
                style={{ background: COLOR_ACCENT + '20', color: COLOR_ACCENT }}
              >
                {broker.badge}
              </span>
            </div>

            {/* Specialization */}
            <p className="text-xs mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>
              <strong>Specialization:</strong> {broker.specialization}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
              <div className="p-2 rounded" style={{ background: COLOR_PRIMARY + '10' }}>
                <p style={{ color: COLOR_TEXT_SECONDARY }}>Deals Closed</p>
                <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                  {broker.deals}
                </p>
              </div>
              <div className="p-2 rounded" style={{ background: COLOR_ACCENT + '10' }}>
                <p style={{ color: COLOR_TEXT_SECONDARY }}>Followers</p>
                <p className="font-bold" style={{ color: COLOR_ACCENT }}>
                  {(broker.followers / 1000).toFixed(1)}k
                </p>
              </div>
              <div className="p-2 rounded" style={{ background: '#10b98110' }}>
                <p style={{ color: COLOR_TEXT_SECONDARY }}>Response</p>
                <p className="font-bold text-green-600">
                  {broker.responseTime}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs pt-3 border-t" style={{ borderColor: COLOR_BORDER }}>
              <span style={{ color: COLOR_TEXT_SECONDARY }}>
                {broker.yearsExp}+ years experience
              </span>
              <button
                className="font-bold transition-colors"
                style={{ color: COLOR_ACCENT }}
              >
                Connect →
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredBrokers.length === 0 && (
        <div className="text-center py-12">
          <p style={{ color: COLOR_TEXT_SECONDARY }}>No brokers match your search</p>
        </div>
      )}
    </div>
  )
}

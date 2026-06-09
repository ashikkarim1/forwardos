'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, TrendingUp, CheckCircle2, Users, Award, Clock } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

interface BrokerReputation {
  id: string
  name: string
  company: string
  rating: number
  dealsClosed: number
  successRate: number
  avgCloseTime: number
  followers: number
  responseTime: string
  recentDeals: Array<{
    dealName: string
    outcome: 'closed' | 'pending'
    timeToClose: number
    buyer: string
    valuation: string
  }>
  trend: number
}

export default function BrokerReputationSystem() {
  const [sortBy, setSortBy] = useState<'rating' | 'dealsClosing' | 'successRate'>('rating')

  const brokers: BrokerReputation[] = [
    {
      id: '1',
      name: 'Michael Chen',
      company: 'Apex Acquisitions',
      rating: 4.9,
      dealsClosed: 156,
      successRate: 94,
      avgCloseTime: 4.2,
      followers: 4500,
      responseTime: '2 hours',
      recentDeals: [
        { dealName: 'Prime Cut Steakhouse', outcome: 'closed', timeToClose: 3, buyer: 'Restaurant Group', valuation: '$8.5M' },
        { dealName: 'Digital Marketing Agency', outcome: 'closed', timeToClose: 4, buyer: 'Strategic PE', valuation: '$5.2M' },
        { dealName: 'Tech Staffing Firm', outcome: 'closed', timeToClose: 3, buyer: 'Fortune 500', valuation: '$12M' },
      ],
      trend: 12,
    },
    {
      id: '2',
      name: 'Sarah Rodriguez',
      company: 'Strategic Ventures',
      rating: 4.8,
      dealsClosed: 128,
      successRate: 91,
      avgCloseTime: 4.8,
      followers: 3200,
      responseTime: '4 hours',
      recentDeals: [
        { dealName: 'SaaS Platform', outcome: 'closed', timeToClose: 5, buyer: 'Strategic Tech', valuation: '$15M' },
        { dealName: 'Dental Practice Network', outcome: 'closed', timeToClose: 4, buyer: 'DSO', valuation: '$8.1M' },
        { dealName: 'Wellness Center', outcome: 'pending', timeToClose: 2, buyer: 'Healthcare Fund', valuation: '$3.5M' },
      ],
      trend: 8,
    },
    {
      id: '3',
      name: 'David Park',
      company: 'Velocity Capital',
      rating: 4.7,
      dealsClosed: 94,
      successRate: 89,
      avgCloseTime: 5.1,
      followers: 2800,
      responseTime: '6 hours',
      recentDeals: [
        { dealName: 'E-commerce Brand', outcome: 'closed', timeToClose: 4, buyer: 'Aggregator', valuation: '$7.8M' },
        { dealName: 'Logistics Company', outcome: 'closed', timeToClose: 5, buyer: 'Infrastructure PE', valuation: '$22M' },
      ],
      trend: 5,
    },
  ]

  const sortedBrokers = [...brokers].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'dealsClosing') return b.dealsClosed - a.dealsClosed
    return b.successRate - a.successRate
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
          🏆 Broker Reputation System
        </h2>
        <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-6">
          Real-time reputation scoring based on verified deal outcomes. Brokers build credibility through successful closures.
        </p>

        {/* Sort Controls */}
        <div className="flex gap-2 flex-wrap">
          {(['rating', 'dealsClosing', 'successRate'] as const).map(sort => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`px-4 py-2 rounded-lg border transition-all font-bold text-sm`}
              style={{
                background: sortBy === sort ? COLOR_ACCENT + '20' : 'white',
                borderColor: sortBy === sort ? COLOR_ACCENT : COLOR_BORDER,
                color: sortBy === sort ? COLOR_ACCENT : COLOR_TEXT_SECONDARY,
              }}
            >
              {sort === 'rating' && '⭐ By Rating'}
              {sort === 'dealsClosing' && '📊 By Deals Closed'}
              {sort === 'successRate' && '✅ By Success Rate'}
            </button>
          ))}
        </div>
      </div>

      {/* Broker Cards */}
      <div className="grid grid-cols-1 gap-6">
        {sortedBrokers.map((broker, idx) => (
          <motion.div
            key={broker.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-lg border"
            style={{ borderColor: COLOR_BORDER }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left: Broker Info */}
              <div className="md:col-span-1">
                <div className="flex items-start gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                    style={{ background: COLOR_ACCENT }}
                  >
                    {broker.name.split(' ')[0][0]}{broker.name.split(' ')[1][0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                      {broker.name}
                    </h3>
                    <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                      {broker.company}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < Math.floor(broker.rating) ? COLOR_ACCENT : COLOR_BORDER}
                          style={{ color: i < Math.floor(broker.rating) ? COLOR_ACCENT : COLOR_BORDER }}
                        />
                      ))}
                      <span className="font-bold text-sm ml-1" style={{ color: COLOR_ACCENT }}>
                        {broker.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center: Stats */}
              <div className="md:col-span-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      DEALS CLOSED
                    </p>
                    <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                      {broker.dealsClosed}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp size={14} style={{ color: '#10b981' }} />
                      <span className="text-xs font-bold text-green-600">+{broker.trend}% YTD</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      SUCCESS RATE
                    </p>
                    <p className="text-2xl font-black text-green-600">
                      {broker.successRate}%
                    </p>
                    <p className="text-xs mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {broker.avgCloseTime}mo avg close
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Community Stats */}
              <div className="md:col-span-1">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users size={16} style={{ color: COLOR_ACCENT }} />
                    <div>
                      <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Followers
                      </p>
                      <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                        {broker.followers.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} style={{ color: COLOR_ACCENT }} />
                    <div>
                      <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Response Time
                      </p>
                      <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                        {broker.responseTime}
                      </p>
                    </div>
                  </div>
                  <button
                    className="w-full mt-4 py-2 rounded-lg font-bold text-white transition-all hover:opacity-90"
                    style={{ background: COLOR_ACCENT }}
                  >
                    Follow Broker
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Deals */}
            <div className="mt-6 pt-6 border-t" style={{ borderColor: COLOR_BORDER }}>
              <p className="text-xs font-bold mb-3 uppercase" style={{ color: COLOR_TEXT_SECONDARY }}>
                📊 Recent Deals
              </p>
              <div className="space-y-2">
                {broker.recentDeals.map((deal, dIdx) => (
                  <div key={dIdx} className="flex items-center justify-between p-2 rounded text-sm">
                    <div>
                      <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                        {deal.dealName}
                      </p>
                      <p style={{ color: COLOR_TEXT_SECONDARY }}>
                        {deal.buyer} • {deal.valuation}
                      </p>
                    </div>
                    <div className="text-right">
                      {deal.outcome === 'closed' ? (
                        <div>
                          <p className="text-xs font-bold text-green-600">✅ Closed</p>
                          <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                            {deal.timeToClose}mo
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs font-bold" style={{ color: COLOR_ACCENT }}>
                            ⏳ In Progress
                          </p>
                          <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                            {deal.timeToClose}mo in
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Network Effect Explanation */}
      <div className="p-6 rounded-lg" style={{ background: '#f0fdf4', border: `1px solid #86efac` }}>
        <div className="flex gap-3">
          <Award size={24} style={{ color: '#16a34a' }} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold mb-2 text-green-900">🎮 Reputation Game Theory</p>
            <p className="text-sm text-green-800 mb-3">
              Brokers build reputation through verified deal outcomes. Higher reputation → more followers → more deal flow → more success → higher reputation. This virtuous cycle locks brokers into the platform.
            </p>
            <p className="text-sm text-green-800">
              <strong>Why this matters:</strong> A broker with 4,500 followers and 94% success rate won't leave for a competitor (they'd lose their reputation capital). This network effect creates defensibility competitors can't quickly replicate.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

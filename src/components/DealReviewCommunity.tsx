'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, ThumbsUp, Flag, Award, TrendingUp, User } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

interface Review {
  id: string
  author: string
  role: string
  verified: boolean
  rating: number
  title: string
  content: string
  helpfulCount: number
  timestamp: string
  dealPhase: 'early' | 'due_diligence' | 'closing' | 'completed'
}

export default function DealReviewCommunity() {
  const [selectedDeal, setSelectedDeal] = useState('prime-cut')
  const [filterBy, setFilterBy] = useState<'all' | 'verified' | 'completed'>('all')

  const reviews: Record<string, Review[]> = {
    'prime-cut': [
      {
        id: '1',
        author: 'James Thompson',
        role: 'PE Investor',
        verified: true,
        rating: 5,
        title: 'AI predictions were spot-on for this deal',
        content: 'Used the Forward OS AI predictions to evaluate this steakhouse. Timing Engine suggested Q3 launch. We followed that advice, and the valuation jumped 8%. The Buyer Matching model nailed it—strategic restaurant groups dominated the buyer list. Closed in 3.2 months (vs 5mo estimate). Outstanding.',
        helpfulCount: 234,
        timestamp: '2 days ago',
        dealPhase: 'completed',
      },
      {
        id: '2',
        author: 'Maria Garcia',
        role: 'M&A Broker',
        verified: true,
        rating: 5,
        title: 'Pricing model validated in real-time',
        content: 'Pricing prediction said $8.1M-$9.2M. Actual offer came in at $8.45M (right in the middle). This is the first time I\'ve had AI match actual market pricing so accurately. No surprises during negotiation. Buyers took it seriously.',
        helpfulCount: 189,
        timestamp: '1 week ago',
        dealPhase: 'completed',
      },
      {
        id: '3',
        author: 'Robert Lin',
        role: 'Business Seller',
        verified: true,
        rating: 4,
        title: 'Helped me understand my deal better',
        content: 'As the seller, I was nervous about valuation. The AI showed me exactly why my margins were top-decile (28.6% vs 26% avg) and how that justified premium pricing. Gave me confidence in negotiations. Only 4 stars because I wish the growth forecast was more aggressive (but turned out to be realistic).',
        helpfulCount: 156,
        timestamp: '3 weeks ago',
        dealPhase: 'completed',
      },
      {
        id: '4',
        author: 'Unknown (Anonymized)',
        role: 'Strategic Buyer',
        verified: false,
        rating: 4,
        title: 'Recommendations saved us time',
        content: 'Followed the \"Target Strategic Restaurant Groups\" recommendation. Cut our buyer list from 50 to 15 relevant targets. 70% ended up bidding. Closed 30% faster than our previous deals. Community reviews on the broker convinced us to use Michael Chen—best call we made.',
        helpfulCount: 142,
        timestamp: '3 weeks ago',
        dealPhase: 'completed',
      },
    ],
  }

  const filteredReviews = reviews[selectedDeal]?.filter(r => {
    if (filterBy === 'verified') return r.verified
    if (filterBy === 'completed') return r.dealPhase === 'completed'
    return true
  }) || []

  const avgRating = filteredReviews.length > 0
    ? (filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length).toFixed(1)
    : '0'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
          👥 Deal Review Community
        </h2>
        <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-6">
          Real participants (sellers, buyers, brokers) share outcomes and validate predictions. This is how Forward OS gets smarter every deal.
        </p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="p-4 rounded-lg border"
          style={{ borderColor: COLOR_BORDER }}
        >
          <p className="text-xs font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
            Total Reviews
          </p>
          <p className="text-3xl font-black" style={{ color: COLOR_PRIMARY }}>
            847
          </p>
          <p className="text-xs mt-2 text-green-600">↑ +156 this month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-lg border"
          style={{ borderColor: COLOR_BORDER }}
        >
          <p className="text-xs font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
            Verified Outcomes
          </p>
          <p className="text-3xl font-black" style={{ color: COLOR_ACCENT }}>
            631
          </p>
          <p className="text-xs mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>
            74% of reviews verified
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-lg border"
          style={{ borderColor: COLOR_BORDER }}
        >
          <p className="text-xs font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
            Avg Community Rating
          </p>
          <p className="text-3xl font-black text-yellow-500">
            {avgRating}★
          </p>
          <p className="text-xs mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>
            Based on {filteredReviews.length} reviews
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-lg border"
          style={{ borderColor: COLOR_BORDER }}
        >
          <p className="text-xs font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
            Prediction Accuracy
          </p>
          <p className="text-3xl font-black text-green-600">
            91%
          </p>
          <p className="text-xs mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>
            Validated by outcomes
          </p>
        </motion.div>
      </div>

      {/* Filter Controls */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'verified', 'completed'] as const).map(filter => (
          <button
            key={filter}
            onClick={() => setFilterBy(filter)}
            className={`px-4 py-2 rounded-lg border transition-all font-bold text-sm`}
            style={{
              background: filterBy === filter ? COLOR_ACCENT + '20' : 'white',
              borderColor: filterBy === filter ? COLOR_ACCENT : COLOR_BORDER,
              color: filterBy === filter ? COLOR_ACCENT : COLOR_TEXT_SECONDARY,
            }}
          >
            {filter === 'all' && '📋 All Reviews'}
            {filter === 'verified' && '✅ Verified Only'}
            {filter === 'completed' && '🏁 Completed Deals'}
          </button>
        ))}
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {filteredReviews.map((review, idx) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-6 rounded-lg border"
            style={{ borderColor: COLOR_BORDER }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: COLOR_ACCENT }}
                >
                  {review.author.split(' ')[0][0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                      {review.author}
                    </p>
                    {review.verified && (
                      <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                        <Award size={12} /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {review.role} • {review.timestamp}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} style={{ color: i < review.rating ? '#fbbf24' : COLOR_BORDER }}>
                    ★
                  </span>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="mb-4">
              <p className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                {review.title}
              </p>
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm leading-relaxed">
                {review.content}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: COLOR_BORDER }}>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                  <ThumbsUp size={14} />
                  {review.helpfulCount} found helpful
                </button>
                {review.dealPhase === 'completed' && (
                  <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                    <TrendingUp size={14} />
                    Deal closed
                  </span>
                )}
              </div>
              <button className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                <Flag size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Network Effect Info */}
      <div className="p-6 rounded-lg" style={{ background: COLOR_ACCENT + '08', border: `1px solid ${COLOR_ACCENT}` }}>
        <div className="flex gap-3">
          <MessageSquare size={24} style={{ color: COLOR_ACCENT }} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
              🔄 The Virtuous Cycle
            </p>
            <p className="text-sm mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>
              Every deal that closes → Outcomes verified → Community reviews posted → Predictions get validated → Models improve accuracy → Next deal predictions better.
            </p>
            <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
              <strong>Why this creates defensibility:</strong> This feedback loop gets exponentially stronger over time. 
              After 500+ deals, our models are trained on real outcomes. Competitors starting today would need 3-5 years to catch up. 
              Meanwhile, every deal makes us 1% smarter while they stay at zero.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

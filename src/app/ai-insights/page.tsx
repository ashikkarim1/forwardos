'use client'

import { motion } from 'framer-motion'
import { Zap, Brain, TrendingUp, AlertTriangle, Lightbulb, Target, CheckCircle2 } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function AIInsightsPage() {
  return (
    <motion.div className="max-w-7xl mx-auto px-8 py-8" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
      <motion.div variants={itemVariants} className="mb-12">
        <h1 className="text-4xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
          AI-Powered Deal Insights
        </h1>
        <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
          Machine learning models analyze deal dynamics and provide real-time recommendations.
        </p>
      </motion.div>

      {/* AI Insights Cards */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        {[
          {
            title: 'Next Best Action',
            insight: 'Contact Fatima within 24 hours to confirm closing timeline.',
            confidence: 94,
            icon: Lightbulb,
            action: 'Send personalized email',
          },
          {
            title: 'Deal Risk Score',
            insight: 'Customer churn risk increasing. Implement retention program.',
            confidence: 87,
            icon: AlertTriangle,
            action: 'Review retention strategy',
          },
          {
            title: 'Buyer Sentiment Analysis',
            insight: 'Ahmed\'s communication shows 15% increase in engagement momentum.',
            confidence: 92,
            icon: Brain,
            action: 'Accelerate close timeline',
          },
          {
            title: 'Valuation Recommendation',
            insight: 'Based on recent market comps, AED 13.2M is optimal ask price.',
            confidence: 88,
            icon: Target,
            action: 'Update valuation model',
          },
        ].map((card, idx) => {
          const Icon = card.icon
          return (
            <motion.div key={idx} className="p-6 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
              <div className="flex items-start gap-3 mb-4">
                <div className="p-3 rounded-lg" style={{ background: COLOR_ACCENT + '20' }}>
                  <Icon className="w-6 h-6" style={{ color: COLOR_ACCENT }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                    {card.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 rounded-full" style={{ background: COLOR_BORDER }}>
                      <div className="h-2 rounded-full" style={{ background: COLOR_ACCENT, width: `${card.confidence}%` }} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: COLOR_ACCENT }}>
                      {card.confidence}%
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
                {card.insight}
              </p>
              <button className="px-4 py-2 rounded-lg text-sm font-bold border" style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}>
                {card.action} →
              </button>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Deal Trajectory Prediction */}
      <motion.div className="p-8 rounded-lg border-2 mb-12" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '08' }} variants={itemVariants}>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
          <TrendingUp className="w-6 h-6" />
          Deal Trajectory Prediction
        </h3>
        <div className="space-y-6">
          {[
            {
              buyer: 'Ahmed (Strategic)',
              probability: 92,
              prediction: 'Most likely to close in 18-21 days. High engagement, strong fit.',
            },
            {
              buyer: 'Fatima (Family Office)',
              probability: 85,
              prediction: 'Close timeline extends to 25-28 days due to DD scope. Monitor closely.',
            },
            {
              buyer: 'Sarah (PE Firm)',
              probability: 68,
              prediction: 'Engagement plateauing. Recommend re-engagement within 3 days.',
            },
          ].map((prediction, idx) => (
            <div key={idx} className="p-4 rounded-lg" style={{ background: 'white' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold" style={{ color: COLOR_PRIMARY }}>{prediction.buyer}</p>
                <span className="text-xl font-black" style={{ color: COLOR_ACCENT }}>
                  {prediction.probability}%
                </span>
              </div>
              <div className="h-2 rounded-full mb-2" style={{ background: COLOR_BORDER }}>
                <div className="h-2 rounded-full" style={{ background: COLOR_ACCENT, width: `${prediction.probability}%` }} />
              </div>
              <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                {prediction.prediction}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Training Data */}
      <motion.div className="p-8 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
        <h3 className="text-xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
          AI Model Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { metric: 'Close Prediction Accuracy', value: '94%', benchmark: '+12% vs industry' },
            { metric: 'Timing Forecast Error', value: '±3 days', benchmark: 'Best-in-class' },
            { metric: 'Risk Detection Sensitivity', value: '89%', benchmark: '+18% vs average' },
          ].map((stat, idx) => (
            <div key={idx} className="p-4 rounded-lg" style={{ background: COLOR_ACCENT + '05', borderColor: COLOR_BORDER, borderWidth: 1 }}>
              <p className="text-sm font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                {stat.metric}
              </p>
              <p className="text-2xl font-black mb-1" style={{ color: COLOR_PRIMARY }}>
                {stat.value}
              </p>
              <p className="text-xs" style={{ color: COLOR_ACCENT }}>
                {stat.benchmark}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

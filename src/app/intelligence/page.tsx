'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Brain, CheckCircle2, Zap, Target, Lock } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_SURFACE_SUCCESS } from '@/styles/forward-colors'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function IntelligencePage() {
  return (
    <motion.div
      className="max-w-7xl mx-auto px-6 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
          ✨ What Makes Forward Unbeatable
        </h1>
        <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
          By Year 3, Forward is the only platform that delivers predictive intelligence, autonomous workflows, and verifiable outcomes for M&A professionals.
        </p>
      </motion.div>

      {/* Key Capabilities */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        variants={containerVariants}
      >
        {[
          { label: 'Deal Close Prediction', value: '90%+', accuracy: 'accuracy', icon: Target, color: COLOR_ACCENT },
          { label: 'Synergy Realization', value: '85%+', accuracy: 'accuracy', icon: Zap, color: '#10b981' },
          { label: 'Integration Success', value: '80%+', accuracy: 'accuracy', icon: CheckCircle2, color: '#1D4ED8' },
        ].map((metric) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={metric.label}
              variants={itemVariants}
              className="p-6 rounded-lg border"
              style={{ borderColor: COLOR_BORDER, background: COLOR_SURFACE_SUCCESS }}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-start justify-between mb-3">
                <Icon className="w-6 h-6" style={{ color: metric.color }} />
              </div>
              <p className="text-xs font-medium mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                {metric.label}
              </p>
              <p className="text-3xl font-black mb-1" style={{ color: metric.color }}>
                {metric.value}
              </p>
              <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                {metric.accuracy}
              </p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* The Unbeatable Moat */}
      <motion.section variants={itemVariants} className="mb-12">
        <h2 className="text-2xl font-black mb-8" style={{ color: COLOR_PRIMARY }}>
          🏆 The 6-Layer Moat
        </h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          {[
            {
              number: '1',
              title: 'Verification System',
              description: 'Anti-fraud seller verification + risk scoring prevents 95% of fake listings',
              icon: '✓',
            },
            {
              number: '2',
              title: 'Heat Maps & Intelligence',
              description: 'Real-time buyer activity tracking + market signal aggregation',
              icon: '🔥',
            },
            {
              number: '3',
              title: 'Predictive ML Model',
              description: 'Patent-worthy model predicting M&A probability via 3 signals',
              icon: '⭐',
            },
            {
              number: '4',
              title: 'Synergy Prediction',
              description: 'Quantify post-close value creation with 85%+ accuracy',
              icon: '💰',
            },
            {
              number: '5',
              title: 'Comparable Database',
              description: '500K+ deals with real outcomes, synergy data, integration learnings',
              icon: '📊',
            },
            {
              number: '6',
              title: 'Integration Playbooks',
              description: 'Auto-generated checklists 40% faster + orchestrated advisor teams',
              icon: '🎯',
            },
          ].map((layer) => (
            <motion.div
              key={layer.number}
              variants={itemVariants}
              className="p-6 rounded-lg border bg-white hover:shadow-lg transition-all"
              style={{ borderColor: COLOR_BORDER }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg flex-shrink-0"
                  style={{ background: `${COLOR_ACCENT}20`, color: COLOR_ACCENT }}
                >
                  {layer.number}
                </div>
                <div>
                  <h3 className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                    {layer.title}
                  </h3>
                  <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {layer.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Unbeatable Capabilities Grid */}
      <motion.section variants={itemVariants}>
        <h2 className="text-2xl font-black mb-8" style={{ color: COLOR_PRIMARY }}>
          🚀 What Forward Delivers
        </h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          {[
            {
              capability: 'Deal Close Probability',
              benefit: '90%+ accuracy prediction',
              impact: 'Identify winners before competitors',
            },
            {
              capability: 'Synergy Realization',
              benefit: '85%+ accuracy on post-close value',
              impact: 'Quantify true deal value upfront',
            },
            {
              capability: 'Integration Success',
              benefit: '80%+ accuracy on integration outcomes',
              impact: 'De-risk M&A with proven playbooks',
            },
            {
              capability: 'Buyer/Seller Matching',
              benefit: '80%+ match accuracy',
              impact: 'Perfect matches close 3x faster',
            },
            {
              capability: 'Auto Compliance Checklists',
              benefit: '40% faster than manual',
              impact: 'Navigate regulatory 2 weeks ahead',
            },
            {
              capability: 'Diligence Routing',
              benefit: '2 weeks faster than competitors',
              impact: 'First-mover advantage on due diligence',
            },
            {
              capability: 'Advisor Orchestration',
              benefit: 'Automatically manage 10-person teams',
              impact: 'Reduce coordination overhead by 70%',
            },
            {
              capability: 'Post-Close Tracking',
              benefit: 'Permanent outcome database',
              impact: 'Learn from every deal forever',
            },
          ].map((item) => (
            <motion.div
              key={item.capability}
              variants={itemVariants}
              className="p-6 rounded-lg border bg-white"
              style={{ borderColor: COLOR_BORDER }}
            >
              <h3 className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                {item.capability}
              </h3>
              <p className="text-sm mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>
                <strong>Benefit:</strong> {item.benefit}
              </p>
              <p className="text-sm" style={{ color: COLOR_ACCENT }}>
                💡 {item.impact}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Enterprise Security */}
      <motion.section variants={itemVariants} className="mt-12">
        <div
          className="p-8 rounded-lg border"
          style={{
            borderColor: COLOR_BORDER,
            background: COLOR_SURFACE_SUCCESS,
          }}
        >
          <div className="flex items-start gap-4">
            <Lock className="w-8 h-8" style={{ color: COLOR_ACCENT }} />
            <div>
              <h3 className="text-xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
                🔒 Enterprise-Grade Security
              </h3>
              <p className="mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
                SOC 2 Type II Certified • ISO 27001 Compliant • End-to-End Encryption • Zero-Trust Architecture
              </p>
              <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                Every deal, every prediction, every integration outcome is encrypted, audited, and secured to enterprise standards.
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  )
}

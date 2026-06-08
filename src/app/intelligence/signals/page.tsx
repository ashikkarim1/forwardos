'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, TrendingUp, Zap, Flame, Loader } from 'lucide-react'
import { useSignals } from '@/hooks/useApi'
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

export default function SignalsPage() {
  const { data, loading, fetch } = useSignals(200)

  useEffect(() => {
    fetch()
  }, [])

  const stats = (data as any)?.stats || {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  }

  const signals = (data as any)?.signals || []

  const severityConfig = {
    critical: { color: COLOR_ACCENT, icon: '🔴', label: 'Critical' },
    high: { color: '#F97316', icon: '🟠', label: 'High' },
    medium: { color: '#EAB308', icon: '🟡', label: 'Medium' },
    low: { color: '#22C55E', icon: '🟢', label: 'Low' },
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto px-6 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
          🔥 Deal Signals
        </h1>
        <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
          Real-time automated signals detecting high-probability M&A opportunities
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        variants={containerVariants}
      >
        {[
          { label: 'Critical', value: stats.critical, color: COLOR_ACCENT },
          { label: 'High', value: stats.high, color: '#F97316' },
          { label: 'Medium', value: stats.medium, color: '#EAB308' },
          { label: 'Low', value: stats.low, color: '#22C55E' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className="p-6 rounded-lg border"
            style={{ borderColor: COLOR_BORDER, background: 'white' }}
            whileHover={{ y: -4 }}
          >
            <p className="text-xs font-medium mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
              {stat.label} Priority
            </p>
            <p className="text-4xl font-black" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Signals List */}
      <motion.section variants={itemVariants}>
        <h2 className="text-2xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
          📡 Real-Time Signals
        </h2>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 animate-spin" style={{ color: COLOR_ACCENT }} />
          </div>
        ) : signals.length === 0 ? (
          <div className="p-8 text-center rounded-lg border" style={{ borderColor: COLOR_BORDER, background: COLOR_SURFACE_SUCCESS }}>
            <p style={{ color: COLOR_TEXT_SECONDARY }}>No signals available</p>
          </div>
        ) : (
          <motion.div className="space-y-4" variants={containerVariants}>
            {signals.map((signal: any) => {
              const severity = severityConfig[signal.severity as keyof typeof severityConfig] || severityConfig.low
              return (
                <motion.div
                  key={signal.id}
                  variants={itemVariants}
                  className="p-6 rounded-lg border hover:shadow-md transition-all"
                  style={{ borderColor: COLOR_BORDER, background: 'white', borderLeft: `4px solid ${severity.color}` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl flex-shrink-0">{severity.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                            {signal.signal}
                          </h3>
                          <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                            Type: <strong>{signal.type}</strong>
                          </p>
                        </div>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold"
                          style={{ background: `${severity.color}20`, color: severity.color }}
                        >
                          {severity.label}
                        </span>
                      </div>

                      <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Detected: {new Date(signal.detectedAt).toLocaleDateString()} {new Date(signal.detectedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </motion.section>
    </motion.div>
  )
}

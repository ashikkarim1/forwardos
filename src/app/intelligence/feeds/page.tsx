'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Clock, TrendingUp, Briefcase, FileText, AlertTriangle, Loader } from 'lucide-react'
import { useFeeds } from '@/hooks/useApi'
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

export default function FeedsPage() {
  const { data, loading, fetch } = useFeeds()

  useEffect(() => {
    fetch()
  }, [])

  const feeds = (data as any)?.feeds || []
  const stats = (data as any)?.feedStats || {
    totalSources: 0,
    activeFeeds: 0,
    avgLatency: '0',
    coverage: '0',
  }
  const comparables = (data as any)?.comparables || []

  const feedTypeIcons: Record<string, React.ComponentType<any>> = {
    sec_edgar: FileText,
    news: Briefcase,
    market_data: TrendingUp,
    regulatory: AlertTriangle,
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
          ⚡ Real-Time Feeds
        </h1>
        <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
          Live market signals aggregated from 50+ sources, processed in minutes
        </p>
      </motion.div>

      {/* Feed Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12"
        variants={containerVariants}
      >
        {[
          { label: 'Sources Tracked', value: stats.totalSources, icon: Briefcase },
          { label: 'Active Feeds', value: stats.activeFeeds, icon: Zap },
          { label: 'Avg. Latency', value: stats.avgLatency, icon: Clock },
          { label: 'Coverage', value: stats.coverage, icon: TrendingUp },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="p-4 rounded-lg border"
              style={{ borderColor: COLOR_BORDER, background: 'white' }}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
              </div>
              <p className="text-sm mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                {stat.label}
              </p>
              <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                {stat.value}
              </p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Feeds */}
      <motion.section variants={itemVariants} className="mb-12">
        <h2 className="text-2xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
          📡 Data Sources
        </h2>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 animate-spin" style={{ color: COLOR_ACCENT }} />
          </div>
        ) : feeds.length === 0 ? (
          <div className="p-8 text-center rounded-lg border" style={{ borderColor: COLOR_BORDER, background: COLOR_SURFACE_SUCCESS }}>
            <p style={{ color: COLOR_TEXT_SECONDARY }}>No feeds available</p>
          </div>
        ) : (
          <motion.div className="space-y-6" variants={containerVariants}>
            {feeds.map((feed: any) => {
              const IconComponent = feedTypeIcons[feed.type] || Briefcase
              return (
                <motion.div
                  key={feed.id}
                  variants={itemVariants}
                  className="p-6 rounded-lg border hover:shadow-md transition-all"
                  style={{ borderColor: COLOR_BORDER, background: 'white' }}
                  whileHover={{ y: -4 }}
                >
                  <div className="flex items-start gap-4">
                    <IconComponent className="w-6 h-6 flex-shrink-0" style={{ color: COLOR_ACCENT }} />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1" style={{ color: COLOR_PRIMARY }}>
                        {feed.title}
                      </h3>
                      <p className="text-sm mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {feed.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <p className="text-xs flex items-center gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                          <Clock className="w-3 h-3" />
                          Updated {feed.lastUpdate}
                        </p>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold"
                          style={{ background: `${COLOR_ACCENT}20`, color: COLOR_ACCENT }}
                        >
                          {feed.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </motion.section>

      {/* Comparable Deals Database */}
      <motion.section variants={itemVariants}>
        <h2 className="text-2xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
          💾 500K+ Comparable Deals
        </h2>

        {comparables.length === 0 ? (
          <div className="p-8 text-center rounded-lg border" style={{ borderColor: COLOR_BORDER, background: COLOR_SURFACE_SUCCESS }}>
            <p style={{ color: COLOR_TEXT_SECONDARY }}>No comparable deals available</p>
          </div>
        ) : (
          <motion.div
            className="overflow-x-auto"
            variants={containerVariants}
          >
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${COLOR_BORDER}` }}>
                  <th className="text-left px-4 py-3 font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>Company</th>
                  <th className="text-center px-4 py-3 font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>Price</th>
                  <th className="text-center px-4 py-3 font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>Multiple</th>
                  <th className="text-center px-4 py-3 font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>Synergy</th>
                  <th className="text-center px-4 py-3 font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>Timeline</th>
                </tr>
              </thead>
              <tbody>
                {comparables.map((deal: any) => (
                  <motion.tr
                    key={deal.id}
                    variants={itemVariants}
                    style={{ borderBottom: `1px solid ${COLOR_BORDER}` }}
                  >
                    <td className="px-4 py-3" style={{ color: COLOR_PRIMARY }}>
                      <strong>{deal.company}</strong>
                    </td>
                    <td className="px-4 py-3 text-center" style={{ color: COLOR_TEXT_SECONDARY }}>
                      ${(deal.price / 1000000).toFixed(0)}M
                    </td>
                    <td className="px-4 py-3 text-center" style={{ color: COLOR_ACCENT }}>
                      {deal.multiple}x
                    </td>
                    <td className="px-4 py-3 text-center" style={{ color: '#10b981' }}>
                      ${(deal.synergy / 1000000).toFixed(0)}M
                    </td>
                    <td className="px-4 py-3 text-center" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {deal.timeline} months
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </motion.section>
    </motion.div>
  )
}

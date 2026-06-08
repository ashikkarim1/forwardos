'use client'

import { motion } from 'framer-motion'
import { BarChart3, LineChart, PieChart, Download, Share2, Filter, TrendingUp } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function AnalyticsPage() {
  return (
    <motion.div className="max-w-7xl mx-auto px-8 py-8" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
      <motion.div variants={itemVariants} className="mb-12">
        <h1 className="text-4xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
          Advanced Analytics & Reporting
        </h1>
        <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
          Custom dashboards, deep-dive analytics, and executive reports.
        </p>
      </motion.div>

      {/* Report Builder */}
      <motion.div className="mb-12 p-8 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '08' }} variants={itemVariants}>
        <h3 className="text-xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
          Pre-Built Report Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Executive Summary', icon: BarChart3, pages: 5 },
            { title: 'Deal Timeline Report', icon: LineChart, pages: 3 },
            { title: 'Buyer Scorecard', icon: PieChart, pages: 4 },
            { title: 'Risk Assessment', icon: TrendingUp, pages: 6 },
            { title: 'Financial Analysis', icon: BarChart3, pages: 8 },
            { title: 'Competitive Landscape', icon: Filter, pages: 5 },
          ].map((report) => {
            const Icon = report.icon
            return (
              <div key={report.title} className="p-4 rounded-lg border hover:shadow-md transition-all" style={{ borderColor: COLOR_BORDER, background: 'white', cursor: 'pointer' }}>
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="w-6 h-6" style={{ color: COLOR_ACCENT }} />
                  <div>
                    <p className="font-bold" style={{ color: COLOR_PRIMARY }}>{report.title}</p>
                    <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>{report.pages} pages</p>
                  </div>
                </div>
                <button className="w-full px-3 py-2 rounded-lg text-sm font-bold border" style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}>
                  Generate
                </button>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Key Metrics Dashboard */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        {[
          {
            title: 'Deal Velocity',
            metrics: [
              { label: 'Days in Current Stage', value: '4 days', trend: '↓ 3 days faster than avg' },
              { label: 'Stage Progression Rate', value: '87%', trend: '↑ 12% above benchmark' },
            ],
          },
          {
            title: 'Buyer Engagement',
            metrics: [
              { label: 'Avg Response Time', value: '2.5 hours', trend: '↑ 40% engagement' },
              { label: 'Document Views', value: '847', trend: '↑ Deep engagement' },
            ],
          },
        ].map((dashboard, idx) => (
          <motion.div key={idx} className="p-6 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
            <h3 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
              {dashboard.title}
            </h3>
            <div className="space-y-4">
              {dashboard.metrics.map((m, i) => (
                <div key={i} className="pb-4 border-b" style={{ borderColor: COLOR_BORDER }}>
                  <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {m.label}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                      {m.value}
                    </p>
                    <p className="text-xs" style={{ color: COLOR_ACCENT }}>
                      {m.trend}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Export Options */}
      <motion.div className="text-center" variants={itemVariants}>
        <button className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 mr-3" style={{ background: COLOR_ACCENT }}>
          <Download className="w-5 h-5" />
          Export Dashboard (PDF)
        </button>
        <button className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-bold border" style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}>
          <Share2 className="w-5 h-5" />
          Share with Stakeholders
        </button>
      </motion.div>
    </motion.div>
  )
}

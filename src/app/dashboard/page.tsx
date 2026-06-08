'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  LayoutGrid, Zap, Compass, TrendingUp, AlertCircle, Trophy, CheckCircle2,
  Clock, Users, MessageSquare, Eye, Menu, X, ChevronRight, Flame
} from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Mock data
  const listing = {
    name: 'TechFlow Solutions',
    ticker: 'TFS',
    progress: 72,
    daysToExit: 35,
    heat: 92,
  }

  const alerts = [
    {
      id: 1,
      type: 'milestone',
      title: '🏆 Milestone Achieved!',
      description: 'Your listing reached 300+ views — strong buyer interest detected',
      icon: Trophy,
    },
    {
      id: 2,
      type: 'action',
      title: 'Buyers Waiting',
      description: '12 qualified inquiries pending — respond within 2 hours for best conversion',
      icon: AlertCircle,
    },
  ]

  const metrics = {
    daysToExit: 35,
    status: 'Accelerating',
    heat: 92,
    heatTrend: '+14',
    tasksCompleted: 8,
    tasksInProgress: 3,
    tasksBlocked: 1,
    tasksNotStarted: 2,
    currentPhase: 'Active Buyer Engagement',
    phaseProgress: 72,
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <motion.aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'} border-r transition-all duration-300 flex flex-col overflow-y-auto`}
        style={{ borderColor: COLOR_BORDER, background: '#FAFAF8' }}
      >
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: COLOR_BORDER }}>
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: COLOR_ACCENT }}>
                <Zap className="w-5 h-5 text-white" />
              </div>
              {sidebarOpen && <span className="font-black" style={{ color: COLOR_PRIMARY }}>Forward</span>}
            </Link>
            {sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {sidebarOpen && (
            <div className="p-3 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
              <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                {listing.name}
              </p>
              <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                {listing.ticker} • N/A
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Progress
                </span>
                <span className="text-xs font-bold" style={{ color: COLOR_ACCENT }}>
                  {metrics.phaseProgress}%
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-gray-200 overflow-hidden">
                <motion.div
                  className="h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${metrics.phaseProgress}%` }}
                  transition={{ duration: 1 }}
                  style={{ background: COLOR_ACCENT }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-8">
          {/* Mission Section */}
          <div>
            {sidebarOpen && (
              <p className="text-xs font-bold uppercase mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>
                Mission
              </p>
            )}
            <nav className="space-y-2">
              {[
                { icon: Compass, label: 'New To This?', href: '#' },
                { icon: LayoutGrid, label: 'Dashboard', href: '/dashboard', active: true },
                { icon: Zap, label: 'Intelligence Hub', href: '/intelligence' },
                { icon: Compass, label: 'Exit Journey™', href: '#' },
                { icon: TrendingUp, label: 'Market Advantage', href: '/intelligence/heat-maps' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                      item.active ? 'text-white' : 'hover:bg-white'
                    }`}
                    style={{ background: item.active ? COLOR_ACCENT : 'transparent' }}
                  >
                    <Icon className="w-5 h-5" />
                    {sidebarOpen && <span className="text-sm font-semibold">{item.label}</span>}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Work Section */}
          <div>
            {sidebarOpen && (
              <p className="text-xs font-bold uppercase mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>
                Work
              </p>
            )}
            <nav className="space-y-2">
              {[
                { icon: Eye, label: 'Listings' },
                { icon: MessageSquare, label: 'Messages' },
                { icon: Users, label: 'Buyers' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white transition-all"
                  >
                    <Icon className="w-5 h-5" style={{ color: COLOR_TEXT_SECONDARY }} />
                    {sidebarOpen && (
                      <span className="text-sm font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {item.label}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Footer Metric */}
        {sidebarOpen && (
          <div className="p-6 border-t" style={{ borderColor: COLOR_BORDER }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold flex items-center gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                <Flame className="w-4 h-4" style={{ color: COLOR_ACCENT }} />
                Heat Score
              </p>
              <p className="text-lg font-black" style={{ color: COLOR_ACCENT }}>
                {metrics.heat}
              </p>
            </div>
            <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
              <motion.div
                className="h-full"
                initial={{ width: 0 }}
                animate={{ width: `${metrics.heat}%` }}
                transition={{ duration: 1 }}
                style={{ background: COLOR_ACCENT }}
              />
            </div>
            <p className="text-xs mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>
              🔥 Red Hot — Multiple buyers
            </p>
          </div>
        )}

        {/* Collapse Button */}
        {!sidebarOpen && (
          <div className="p-4 border-t" style={{ borderColor: COLOR_BORDER }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-full p-2 hover:bg-white rounded"
            >
              <Menu className="w-5 h-5 mx-auto" />
            </button>
          </div>
        )}
      </motion.aside>

      {/* Main Content */}
      <motion.main
        className="flex-1 overflow-y-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <div className="border-b px-8 py-4" style={{ borderColor: COLOR_BORDER }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                Forward OS → Dashboard
              </p>
              <h1 className="text-3xl font-black mt-1" style={{ color: COLOR_PRIMARY }}>
                Mission Control
              </h1>
              <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                Your deal completion command centre
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="px-4 py-2 rounded-lg font-semibold border-2 transition-all hover:bg-orange-50"
                style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}
              >
                ⚠️ Alert Mode
              </button>
              <button
                className="px-4 py-2 rounded-lg font-semibold border-2 transition-all hover:bg-gray-50"
                style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
              >
                📊 Summary
              </button>
              <button
                className="px-4 py-2 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                style={{ background: COLOR_ACCENT }}
              >
                ✓ Open Checklist
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Alerts */}
          <motion.div className="space-y-3" variants={containerVariants}>
            {alerts.map((alert) => {
              const Icon = alert.icon
              return (
                <motion.div
                  key={alert.id}
                  className="p-4 rounded-lg border-2 flex items-start gap-4"
                  style={{
                    borderColor: alert.type === 'milestone' ? COLOR_ACCENT : COLOR_BORDER,
                    background: alert.type === 'milestone' ? COLOR_ACCENT + '10' : 'white',
                  }}
                  variants={itemVariants}
                >
                  <Icon
                    className="w-6 h-6 mt-1 flex-shrink-0"
                    style={{ color: alert.type === 'milestone' ? COLOR_ACCENT : COLOR_TEXT_SECONDARY }}
                  />
                  <div className="flex-1">
                    <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                      {alert.title}
                    </p>
                    <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {alert.description}
                    </p>
                  </div>
                  <button className="text-xs font-semibold hover:opacity-70" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Dismiss
                  </button>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Main Metrics Grid */}
          <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-8" variants={containerVariants}>
            {/* Heat Score */}
            <motion.div
              className="p-8 rounded-lg border"
              style={{ borderColor: COLOR_BORDER, background: 'white' }}
              variants={itemVariants}
            >
              <h3 className="text-sm font-bold mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
                DEAL HEAT SCORE
              </h3>

              <div className="relative w-32 h-32 mx-auto mb-6">
                <motion.svg
                  className="absolute inset-0"
                  viewBox="0 0 100 100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={COLOR_ACCENT}
                    strokeWidth="8"
                    strokeDasharray="282.7"
                    initial={{ strokeDashoffset: 282.7 }}
                    animate={{ strokeDashoffset: 282.7 * (1 - metrics.heat / 100) }}
                    transition={{ duration: 2 }}
                    strokeLinecap="round"
                  />
                </motion.svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl font-black" style={{ color: COLOR_ACCENT }}>
                      {metrics.heat}
                    </p>
                    <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      degrees
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t" style={{ borderColor: COLOR_BORDER }}>
                <p className="text-xs font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Status
                </p>
                <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                  🔥 Red Hot
                </p>
                <p className="text-xs" style={{ color: COLOR_ACCENT }}>
                  ↑ {metrics.heatTrend} this week
                </p>
              </div>
            </motion.div>

            {/* Days to Exit */}
            <motion.div
              className="p-8 rounded-lg border"
              style={{ borderColor: COLOR_BORDER, background: 'white' }}
              variants={itemVariants}
            >
              <h3 className="text-sm font-bold mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
                ESTIMATED TIMELINE
              </h3>

              <div className="text-center py-8">
                <motion.p
                  className="text-5xl font-black"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{ color: COLOR_PRIMARY }}
                >
                  {metrics.daysToExit}
                </motion.p>
                <p className="text-sm mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                  days to exit
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t" style={{ borderColor: COLOR_BORDER }}>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Status
                  </p>
                  <p className="text-xs font-bold px-2 py-1 rounded-full text-white" style={{ background: COLOR_ACCENT }}>
                    {metrics.status}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Tasks */}
            <motion.div
              className="p-8 rounded-lg border"
              style={{ borderColor: COLOR_BORDER, background: 'white' }}
              variants={itemVariants}
            >
              <h3 className="text-sm font-bold mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
                TASKS
              </h3>

              <div className="space-y-3">
                {[
                  { label: 'Completed', value: metrics.tasksCompleted, color: '#10B981' },
                  { label: 'In Progress', value: metrics.tasksInProgress, color: '#3B82F6' },
                  { label: 'Blocked', value: metrics.tasksBlocked, color: COLOR_ACCENT },
                  { label: 'Not Started', value: metrics.tasksNotStarted, color: '#9CA3AF' },
                ].map((task) => (
                  <div key={task.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ background: task.color }}
                      />
                      <span className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {task.label}
                      </span>
                    </div>
                    <span className="text-lg font-bold" style={{ color: COLOR_PRIMARY }}>
                      {task.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t text-center" style={{ borderColor: COLOR_BORDER }}>
                <p className="text-xs font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {metrics.tasksCompleted + metrics.tasksInProgress}/{metrics.tasksCompleted + metrics.tasksInProgress + metrics.tasksBlocked + metrics.tasksNotStarted} tasks
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Current Phase */}
          <motion.div
            className="p-8 rounded-lg border"
            style={{ borderColor: COLOR_BORDER, background: 'white' }}
            variants={itemVariants}
          >
            <h3 className="text-sm font-bold mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
              CURRENT PHASE
            </h3>
            <p className="text-2xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
              {metrics.currentPhase}
            </p>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Progress
                </span>
                <span className="text-sm font-bold" style={{ color: COLOR_ACCENT }}>
                  {metrics.phaseProgress}%
                </span>
              </div>
              <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                <motion.div
                  className="h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${metrics.phaseProgress}%` }}
                  transition={{ duration: 1 }}
                  style={{ background: COLOR_ACCENT }}
                />
              </div>
            </div>
            <Link
              href="/intelligence"
              className="text-sm font-bold flex items-center gap-2 hover:opacity-70 transition-opacity"
              style={{ color: COLOR_ACCENT }}
            >
              View activity <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </motion.main>
    </div>
  )
}

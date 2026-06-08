'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Loader, Check, CheckCircle2 } from 'lucide-react'
import { FeatureIcon } from '@/components/Icons/FeatureIcons'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_SURFACE_SUCCESS } from '@/styles/forward-colors'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller' | 'broker' | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const roles = [
    {
      id: 'buyer',
      title: 'Buyer / Investor',
      icon: 'deal',
      description: 'Discover acquisition targets, analyze deals, track opportunities',
      features: [
        'Smart deal matching tailored to your strategy',
        'Heat maps showing real buyer activity',
        'Predictive deal probability signals',
        'Advanced filters & saved searches',
      ],
      color: COLOR_ACCENT,
    },
    {
      id: 'seller',
      title: 'Seller / Founder',
      icon: 'comparables',
      description: 'Manage your sale process, track buyer interest, optimize valuation',
      features: [
        'Deal progression tracking from interest to close',
        'Real buyer filtering with proof-of-funds',
        'Market valuation benchmarking',
        'Secure data room with full control',
      ],
      color: '#10b981',
    },
    {
      id: 'broker',
      title: 'Broker / Advisor',
      icon: 'pipeline',
      description: 'Manage pipeline, coordinate advisors, track commissions',
      features: [
        'Deal pipeline management OS',
        'Advisor network & coordination',
        'Commission tracking & automation',
        'Real-time deal status visibility',
      ],
      color: '#1D4ED8',
    },
  ]

  const handleLogin = async () => {
    if (!email || !name || !selectedRole) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, role: selectedRole }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()

      // Store auth data
      if (data.user) {
        localStorage.setItem('userId', data.user.id)
        localStorage.setItem('userEmail', data.user.email)
        localStorage.setItem('userRole', data.user.role)
        localStorage.setItem('userName', data.user.name)
        localStorage.setItem('userCurrency', data.user.currency || 'USD')
        localStorage.setItem('userLanguage', data.user.language || 'en')
      }

      // Navigate to role dashboard
      router.push(`/dashboard/${selectedRole}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#FAFAF8' }}
    >
      {/* Header */}
      <motion.div
        className="w-full border-b py-4"
        style={{ borderColor: COLOR_BORDER, background: 'white' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/fox.jpg" alt="Forward OS" className="w-8 h-8 rounded" style={{ border: `1px solid ${COLOR_BORDER}` }} />
            <div>
              <h1 className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                Forward OS
              </h1>
              <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                The M&A Operating System
              </p>
            </div>
          </div>
          <a
            href="/"
            className="text-sm font-semibold hover:transition-colors"
            style={{ color: COLOR_ACCENT }}
          >
            Back to Home
          </a>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full flex flex-col justify-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Headline */}
        <motion.div variants={itemVariants} className="mb-12 text-center max-w-3xl mx-auto">
          <h2
            className="text-5xl font-black mb-4"
            style={{ color: COLOR_PRIMARY }}
          >
            Welcome to Forward OS
          </h2>
          <p
            className="text-xl"
            style={{ color: COLOR_TEXT_SECONDARY }}
          >
            Select your role to get started. Each dashboard is customized for your specific M&A workflow.
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            variants={itemVariants}
            className="mb-6 p-4 rounded-lg"
            style={{ background: '#FEE2CC', borderLeft: `4px solid ${COLOR_ACCENT}` }}
          >
            <p style={{ color: COLOR_ACCENT }}>
              {error}
            </p>
          </motion.div>
        )}

        {/* Role Selection Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
        >
          {roles.map((role) => (
            <motion.button
              key={role.id}
              variants={itemVariants}
              onClick={() => setSelectedRole(role.id as 'buyer' | 'seller' | 'broker')}
              className="relative p-8 rounded-xl border bg-white hover:shadow-xl transition-all text-left"
              style={{
                borderColor: selectedRole === role.id ? COLOR_ACCENT : COLOR_BORDER,
                background: selectedRole === role.id ? COLOR_SURFACE_SUCCESS : 'white',
                borderWidth: selectedRole === role.id ? '2px' : '1px',
              }}
              whileHover={{ y: -8 }}
            >
              {/* Top Accent Bar */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: role.color,
                  borderRadius: '11px 11px 0 0',
                }}
              />

              {/* Icon */}
              <div className="mb-4">
                <FeatureIcon name={role.icon as any} size={56} />
              </div>

              {/* Title */}
              <h3
                className="text-2xl font-black mb-2"
                style={{ color: COLOR_PRIMARY }}
              >
                {role.title}
              </h3>

              {/* Description */}
              <p
                className="text-sm mb-6 leading-relaxed"
                style={{ color: COLOR_TEXT_SECONDARY }}
              >
                {role.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-8">
                {role.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-sm flex items-start gap-2"
                    style={{ color: COLOR_TEXT_SECONDARY }}
                  >
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: role.color }} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Selection Indicator */}
              {selectedRole === role.id && (
                <div
                  className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: role.color, color: 'white' }}
                >
                  <Check className="w-4 h-4" />
                </div>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Login Form */}
        {selectedRole && (
          <motion.div
            variants={itemVariants}
            className="p-8 rounded-lg border max-w-2xl mx-auto w-full"
            style={{ borderColor: COLOR_BORDER, background: 'white' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
              Get Started
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{ borderColor: COLOR_BORDER }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{ borderColor: COLOR_BORDER }}
                />
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center gap-2 flex-shrink-0"
              style={{
                background: COLOR_ACCENT,
                color: 'white',
              }}
            >
              {loading && <Loader className="w-4 h-4 animate-spin flex-shrink-0" />}
              <span className="whitespace-nowrap">{loading ? 'Logging in...' : `Enter as ${roles.find(r => r.id === selectedRole)?.title.split(' /')[0]} →`}</span>
            </button>
          </motion.div>
        )}

        {/* Info Box */}
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-lg border max-w-2xl mx-auto w-full mt-8"
          style={{
            borderColor: COLOR_BORDER,
            background: COLOR_SURFACE_SUCCESS,
          }}
        >
          <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
            <strong>Tip:</strong> You can change your role at any time from Account Settings. Your preferences (currency, language, notifications) are saved per role.
          </p>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="w-full border-t py-4 mt-8"
        style={{ borderColor: COLOR_BORDER, background: 'white' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
            © {new Date().getFullYear()} Forward Inc. ·
            <a href="/privacy" className="ml-1 hover:underline" style={{ color: COLOR_ACCENT }}>Privacy</a> ·
            <a href="/terms" className="ml-1 hover:underline" style={{ color: COLOR_ACCENT }}>Terms</a> ·
            <a href="/security" className="ml-1 hover:underline" style={{ color: COLOR_ACCENT }}>Security</a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

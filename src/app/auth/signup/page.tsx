'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Building2, ArrowRight, AlertCircle, Loader, CheckCircle2 } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: Role, 2: Details, 3: Review
  const [role, setRole] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name,
          role: role.toUpperCase(),
          company: company || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Signup failed')
      }

      const data = await response.json()
      setSuccess(true)

      // Store JWT token
      localStorage.setItem('token', data.token)

      // Redirect after 2 seconds
      setTimeout(() => {
        if (data.user.role === 'SELLER') {
          router.push('/dashboard/seller')
        } else if (data.user.role === 'BUYER') {
          router.push('/dashboard/buyer')
        } else {
          router.push('/dashboard/broker')
        }
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center font-black text-white text-xl"
              style={{ background: COLOR_ACCENT }}
            >
              F
            </div>
            <div>
              <div className="text-xl font-black text-left" style={{ color: COLOR_PRIMARY }}>
                Forward OS
              </div>
              <div className="text-xs font-medium text-left" style={{ color: COLOR_TEXT_SECONDARY }}>
                M&A Marketplace
              </div>
            </div>
          </Link>
          <h1 className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
            Join Forward OS
          </h1>
          <p style={{ color: COLOR_TEXT_SECONDARY }}>
            Create your account in {3 - step + 1} easy steps
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div className="flex gap-2 mb-8" variants={itemVariants}>
          {[1, 2, 3].map((s) => (
            <motion.div
              key={s}
              className="h-2 flex-1 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              style={{
                background: s <= step ? COLOR_ACCENT : COLOR_BORDER,
              }}
            />
          ))}
        </motion.div>

        {/* Form */}
        <motion.form onSubmit={handleSignup} className="space-y-4" variants={itemVariants}>
          {/* Error Message */}
          {error && (
            <motion.div
              className="flex items-center gap-3 p-3 rounded-lg"
              style={{ background: '#FEE2E2', borderColor: '#FCA5A5', borderWidth: 1 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-5 h-5" style={{ color: '#DC2626' }} />
              <span style={{ color: '#DC2626' }} className="text-sm font-medium">
                {error}
              </span>
            </motion.div>
          )}

          {/* Success Message */}
          {success && (
            <motion.div
              className="flex items-center gap-3 p-3 rounded-lg"
              style={{ background: '#DCFCE7', borderColor: '#86EFAC', borderWidth: 1 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CheckCircle2 className="w-5 h-5" style={{ color: '#22C55E' }} />
              <span style={{ color: '#22C55E' }} className="text-sm font-medium">
                Account created! Redirecting...
              </span>
            </motion.div>
          )}

          {/* Step 1: Role Selection */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <label className="block text-sm font-semibold mb-3" style={{ color: COLOR_PRIMARY }}>
                I am a...
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'seller', label: 'Seller', icon: '🏢' },
                  { value: 'buyer', label: 'Buyer', icon: '🔍' },
                  { value: 'broker', label: 'Broker', icon: '🤝' },
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setRole(option.value)
                      setStep(2)
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 rounded-lg border-2 text-center transition-all"
                    style={{
                      borderColor: role === option.value ? COLOR_ACCENT : COLOR_BORDER,
                      background: role === option.value ? COLOR_ACCENT + '10' : 'transparent',
                    }}
                  >
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="font-semibold text-sm">{option.label}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5" style={{ color: COLOR_TEXT_SECONDARY }} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-colors focus:outline-none"
                    style={{ borderColor: COLOR_BORDER, background: '#FAFAF9' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5" style={{ color: COLOR_TEXT_SECONDARY }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-colors focus:outline-none"
                    style={{ borderColor: COLOR_BORDER, background: '#FAFAF9' }}
                  />
                </div>
              </div>

              {(role === 'seller' || role === 'broker') && (
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 w-5 h-5" style={{ color: COLOR_TEXT_SECONDARY }} />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Your Company"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-colors focus:outline-none"
                      style={{ borderColor: COLOR_BORDER, background: '#FAFAF9' }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <motion.button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-lg font-bold border-2 transition-all"
                  style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
                >
                  Back
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!name || !email}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: COLOR_ACCENT }}
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Password & Review */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5" style={{ color: COLOR_TEXT_SECONDARY }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-colors focus:outline-none"
                    style={{ borderColor: COLOR_BORDER, background: '#FAFAF9' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5" style={{ color: COLOR_TEXT_SECONDARY }} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-colors focus:outline-none"
                    style={{ borderColor: COLOR_BORDER, background: '#FAFAF9' }}
                  />
                </div>
              </div>

              {/* Review */}
              <div className="p-4 rounded-lg" style={{ background: '#F7F6F4' }}>
                <div className="text-sm font-semibold mb-3" style={{ color: COLOR_PRIMARY }}>
                  Review Your Details:
                </div>
                <div className="space-y-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  <div className="flex justify-between">
                    <span>Role:</span>
                    <span className="font-medium" style={{ color: COLOR_PRIMARY }}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span className="font-medium" style={{ color: COLOR_PRIMARY }}>
                      {name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span className="font-medium" style={{ color: COLOR_PRIMARY }}>
                      {email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="terms" required className="w-4 h-4 rounded" />
                <label htmlFor="terms" className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  I agree to the{' '}
                  <Link href="#" style={{ color: COLOR_ACCENT }} className="font-medium hover:underline">
                    Terms of Service
                  </Link>
                </label>
              </div>

              <div className="flex gap-2">
                <motion.button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 rounded-lg font-bold border-2 transition-all"
                  style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
                >
                  Back
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={loading || !password || password !== confirmPassword}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: COLOR_ACCENT }}
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.form>

        {/* Footer */}
        {step === 1 && (
          <motion.div className="text-center text-sm mt-6" variants={itemVariants}>
            <p style={{ color: COLOR_TEXT_SECONDARY }}>
              Already have an account?{' '}
              <Link href="/auth/login" style={{ color: COLOR_ACCENT }} className="font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

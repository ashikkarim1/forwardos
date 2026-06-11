'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, ArrowRight, CheckCircle2, Flame, BarChart3, Users } from 'lucide-react'
import { PasswordInput } from '@/components/PasswordInput'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  businessName?: string
  dealValue?: string
  onSuccess?: () => void
}

type Step = 'value-prop' | 'email' | 'profile'

export default function AuthModal({ isOpen, onClose, businessName = 'this deal', dealValue, onSuccess }: AuthModalProps) {
  const [step, setStep] = useState<Step>('value-prop')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [userType, setUserType] = useState('buyer')
  const [focusArea, setFocusArea] = useState('healthcare')
  const [dealSize, setDealSize] = useState('5-20')
  const [timeline, setTimeline] = useState('3-months')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const emailInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && step === 'email' && emailInputRef.current) {
      emailInputRef.current.focus()
    }
  }, [isOpen, step])

  const handleContinueToEmail = () => {
    setStep('email')
  }

  const handleContinueToProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setStep('profile')
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!fullName) {
        setError('Please enter your name')
        setLoading(false)
        return
      }

      // Simulate account creation
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        fullName,
        userType,
        focusArea,
        dealSize,
        timeline,
        createdAt: new Date().toISOString(),
      }

      // Auth is handled by the httpOnly session cookie — no tokens/PII in localStorage.

      // Success state before closing
      await new Promise(r => setTimeout(r, 800))

      onClose()
      onSuccess?.()
      
      // Reset for next time
      setStep('value-prop')
      setEmail('')
      setPassword('')
      setFullName('')
      setError('')
    } catch (err) {
      setError('Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-96 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between" style={{ borderColor: COLOR_BORDER }}>
              <div>
                <h2 className="text-xl font-black" style={{ color: COLOR_PRIMARY }}>
                  {step === 'value-prop' && 'Unlock Deal Intelligence'}
                  {step === 'email' && 'Sign In or Create Account'}
                  {step === 'profile' && 'Complete Your Profile'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-2xl hover:opacity-50 transition-opacity"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Value Prop Step */}
              {step === 'value-prop' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                      📊 You'll unlock for {businessName}:
                    </p>
                    <div className="space-y-2">
                      <div className="flex gap-2 items-start">
                        <CheckCircle2 size={16} style={{ color: COLOR_ACCENT }} className="mt-0.5 flex-shrink-0" />
                        <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                          Verified financial data (revenue, EBITDA, margins)
                        </span>
                      </div>
                      <div className="flex gap-2 items-start">
                        <CheckCircle2 size={16} style={{ color: COLOR_ACCENT }} className="mt-0.5 flex-shrink-0" />
                        <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                          Comparable market exits (recent valuations)
                        </span>
                      </div>
                      <div className="flex gap-2 items-start">
                        <CheckCircle2 size={16} style={{ color: COLOR_ACCENT }} className="mt-0.5 flex-shrink-0" />
                        <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                          Deal success prediction & timing analysis
                        </span>
                      </div>
                      <div className="flex gap-2 items-start">
                        <CheckCircle2 size={16} style={{ color: COLOR_ACCENT }} className="mt-0.5 flex-shrink-0" />
                        <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                          Rollup scenarios (combine with similar businesses)
                        </span>
                      </div>
                      <div className="flex gap-2 items-start">
                        <CheckCircle2 size={16} style={{ color: COLOR_ACCENT }} className="mt-0.5 flex-shrink-0" />
                        <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                          Owner background & motivation signals
                        </span>
                      </div>
                      <div className="flex gap-2 items-start">
                        <CheckCircle2 size={16} style={{ color: COLOR_ACCENT }} className="mt-0.5 flex-shrink-0" />
                        <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                          Market heatmap & buyer interest metrics
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleContinueToEmail}
                    className="w-full py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
                    style={{ background: COLOR_ACCENT }}
                  >
                    Continue
                    <ArrowRight size={18} />
                  </button>

                  <p className="text-xs text-center" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Takes 60 seconds. Free forever.
                  </p>
                </motion.div>
              )}

              {/* Email Step */}
              {step === 'email' && (
                <motion.form
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleContinueToProfile}
                  className="space-y-4"
                >
                  {/* Social Login */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      className="w-full py-2.5 rounded-lg border font-bold text-sm transition-all hover:bg-gray-50"
                      style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
                    >
                      Continue with Google
                    </button>
                    <button
                      type="button"
                      className="w-full py-2.5 rounded-lg border font-bold text-sm transition-all hover:bg-gray-50"
                      style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
                    >
                      Continue with LinkedIn
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px" style={{ background: COLOR_BORDER }}></div>
                    <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>or</span>
                    <div className="flex-1 h-px" style={{ background: COLOR_BORDER }}></div>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs font-bold">
                      {error}
                    </div>
                  )}

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                      Email
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-3" style={{ color: COLOR_TEXT_SECONDARY }} />
                      <input
                        ref={emailInputRef}
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError('') }}
                        placeholder="you@example.com"
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border"
                        style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                      Password
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-3" style={{ color: COLOR_TEXT_SECONDARY }} />
                      <PasswordInput
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError('') }}
                        placeholder="Min 8 characters"
                        className="w-full pl-9 py-2.5 rounded-lg border"
                        style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg font-bold text-white transition-all hover:opacity-90"
                    style={{ background: COLOR_ACCENT }}
                  >
                    Continue
                  </button>

                  <p className="text-xs text-center" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Already have an account? Sign in with your details above.
                  </p>
                </motion.form>
              )}

              {/* Profile Step */}
              {step === 'profile' && (
                <motion.form
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleCreateAccount}
                  className="space-y-4"
                >
                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs font-bold">
                      {error}
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                      Full Name
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-3" style={{ color: COLOR_TEXT_SECONDARY }} />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border"
                        style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
                      />
                    </div>
                  </div>

                  {/* User Type */}
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                      I am a...
                    </label>
                    <select
                      value={userType}
                      onChange={(e) => setUserType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border"
                      style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
                    >
                      <option value="buyer">Buyer</option>
                      <option value="seller">Seller</option>
                      <option value="broker">Broker</option>
                      <option value="investor">Investor</option>
                    </select>
                  </div>

                  {/* Focus Area */}
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                      Primary Focus
                    </label>
                    <select
                      value={focusArea}
                      onChange={(e) => setFocusArea(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border"
                      style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
                    >
                      <option value="healthcare">Healthcare</option>
                      <option value="restaurants">Restaurants</option>
                      <option value="tech">Tech/SaaS</option>
                      <option value="retail">Retail</option>
                      <option value="services">Services</option>
                      <option value="diversified">Diversified</option>
                    </select>
                  </div>

                  {/* Deal Size */}
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                      Deal Size
                    </label>
                    <select
                      value={dealSize}
                      onChange={(e) => setDealSize(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border"
                      style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
                    >
                      <option value="1-5">$1M - $5M</option>
                      <option value="5-20">$5M - $20M</option>
                      <option value="20-50">$20M - $50M</option>
                      <option value="50+">$50M+</option>
                    </select>
                  </div>

                  {/* Timeline */}
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                      Timeline
                    </label>
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border"
                      style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
                    >
                      <option value="1-month">Next month</option>
                      <option value="3-months">Next 3 months</option>
                      <option value="6-months">Next 6 months</option>
                      <option value="exploring">Just exploring</option>
                    </select>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-lg font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ background: COLOR_ACCENT }}
                  >
                    {loading ? 'Creating Account...' : 'Create Account & View Deal'}
                  </button>
                </motion.form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

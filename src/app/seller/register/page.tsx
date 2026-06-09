'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, Building2, User, AlertCircle, Loader, CheckCircle2, ArrowRight, Crown } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

interface FormData {
  firstName: string
  lastName: string
  email: string
  companyName: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

export default function SellerRegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedPlan = (searchParams.get('plan') as 'freemium' | 'premium' | null) || 'freemium'

  const [step, setStep] = useState<'form' | 'verification' | 'success'>('form')
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userId, setUserId] = useState('')
  const [verificationEmail, setVerificationEmail] = useState('')

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Password must be 8+ characters'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/seller/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          companyName: formData.companyName,
          password: formData.password,
          planTier: selectedPlan,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setErrors({ submit: data.error || 'Registration failed' })
        return
      }

      const data = await response.json()
      setUserId(data.userId)
      setVerificationEmail(formData.email)
      setStep('verification')
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Registration failed' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (step === 'verification') {
    return <VerificationStep email={verificationEmail} userId={userId} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: COLOR_BG_PRIMARY }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full mx-auto px-4"
      >
        <div className="bg-white rounded-lg border p-8" style={{ borderColor: COLOR_BORDER }}>
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-black text-lg mx-auto mb-4" style={{ background: COLOR_ACCENT }}>
              F
            </div>
            <h1 className="text-2xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
              Create Your Seller Account
            </h1>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mb-4">
              List your business and find the right buyer
            </p>

            {/* Plan Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: selectedPlan === 'premium' ? 'rgba(245, 158, 11, 0.15)' : COLOR_BG_PRIMARY }}>
              {selectedPlan === 'premium' ? (
                <>
                  <Crown size={16} style={{ color: '#F59E0B' }} />
                  <span className="text-xs font-bold" style={{ color: '#F59E0B' }}>
                    Premium Plan Selected
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} style={{ color: COLOR_ACCENT }} />
                  <span className="text-xs font-bold" style={{ color: COLOR_ACCENT }}>
                    Freemium Plan Selected
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                  First Name *
                </label>
                <input
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: errors.firstName ? '#EF4444' : COLOR_BORDER, outlineColor: COLOR_ACCENT }}
                />
                {errors.firstName && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: errors.lastName ? '#EF4444' : COLOR_BORDER, outlineColor: COLOR_ACCENT }}
                />
                {errors.lastName && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.lastName}</p>}
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="block text-xs font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                Company Name *
              </label>
              <input
                type="text"
                placeholder="Your Company Inc."
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: errors.companyName ? '#EF4444' : COLOR_BORDER, outlineColor: COLOR_ACCENT }}
              />
              {errors.companyName && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.companyName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                Email Address *
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: errors.email ? '#EF4444' : COLOR_BORDER, outlineColor: COLOR_ACCENT }}
              />
              {errors.email && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                Password (8+ characters) *
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: errors.password ? '#EF4444' : COLOR_BORDER, outlineColor: COLOR_ACCENT }}
              />
              {errors.password && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                Confirm Password *
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: errors.confirmPassword ? '#EF4444' : COLOR_BORDER, outlineColor: COLOR_ACCENT }}
              />
              {errors.confirmPassword && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeToTerms}
                onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                I agree to the <a href="#" className="underline" style={{ color: COLOR_ACCENT }}>Terms of Service</a> and <a href="#" className="underline" style={{ color: COLOR_ACCENT }}>Privacy Policy</a>
              </label>
            </div>
            {errors.agreeToTerms && <p className="text-xs" style={{ color: '#EF4444' }}>{errors.agreeToTerms}</p>}

            {/* Error */}
            {errors.submit && (
              <div className="p-3 rounded-lg flex items-center gap-2" style={{ background: '#FEE2E2', borderLeft: '4px solid #EF4444' }}>
                <AlertCircle size={18} style={{ color: '#DC2626' }} />
                <span className="text-sm" style={{ color: '#7F1D1D' }}>{errors.submit}</span>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: COLOR_ACCENT }}
            >
              {isSubmitting ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: COLOR_BORDER }}>
            <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
              Already have an account?{' '}
              <Link href="/login" className="font-bold" style={{ color: COLOR_ACCENT }}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function VerificationStep({ email, userId }: { email: string; userId: string }) {
  const [code, setCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')
  const [verified, setVerified] = useState(false)

  const handleVerify = async () => {
    if (!code.trim()) {
      setError('Please enter verification code')
      return
    }

    setIsVerifying(true)
    try {
      const response = await fetch('/api/seller/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: code }),
      })

      if (response.ok) {
        setVerified(true)
        setTimeout(() => {
          window.location.href = `/seller/pending-approval?userId=${userId}`
        }, 2000)
      } else {
        setError('Invalid verification code')
      }
    } finally {
      setIsVerifying(false)
    }
  }

  if (verified) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLOR_BG_PRIMARY }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-auto px-4"
        >
          <div className="bg-white rounded-lg border p-8 text-center" style={{ borderColor: COLOR_BORDER }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="mb-4">
              <CheckCircle2 size={48} style={{ color: '#10B981' }} className="mx-auto" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
              Email Verified!
            </h2>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-6">
              Redirecting to pending approval...
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: COLOR_BG_PRIMARY }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full mx-auto px-4"
      >
        <div className="bg-white rounded-lg border p-8" style={{ borderColor: COLOR_BORDER }}>
          <div className="mb-6 text-center">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-black text-lg mx-auto mb-4" style={{ background: COLOR_ACCENT }}>
              ✉️
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
              Verify Your Email
            </h1>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
              We sent a verification code to <br /> <strong>{email}</strong>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                Verification Code
              </label>
              <input
                type="text"
                placeholder="Enter code from email"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  setError('')
                }}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 text-center tracking-widest"
                style={{ borderColor: error ? '#EF4444' : COLOR_BORDER, outlineColor: COLOR_ACCENT }}
              />
              {error && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{error}</p>}
            </div>

            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className="w-full py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: COLOR_ACCENT }}
            >
              {isVerifying ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Email
                  <CheckCircle2 size={18} />
                </>
              )}
            </button>

            <p className="text-xs text-center" style={{ color: COLOR_TEXT_SECONDARY }}>
              Check spam folder if you don't see the email
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

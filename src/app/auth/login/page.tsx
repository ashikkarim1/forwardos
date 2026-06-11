'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, AlertCircle, Loader } from 'lucide-react'
import { PasswordInput } from '@/components/PasswordInput'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Login failed')
      }

      const data = await response.json()

      // Auth is handled by the httpOnly session cookie set by /api/auth/login.
      // Do NOT store tokens in localStorage (XSS-exposable).

      // Redirect based on role
      if (data.user.role === 'SELLER') {
        router.push('/dashboard/seller')
      } else if (data.user.role === 'BUYER') {
        router.push('/dashboard/buyer')
      } else if (data.user.role === 'BROKER') {
        router.push('/dashboard/broker')
      } else {
        router.push('/dashboard/buyer')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
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
            Welcome Back
          </h1>
          <p style={{ color: COLOR_TEXT_SECONDARY }}>
            Sign in to your Forward OS account
          </p>
        </motion.div>

        {/* Form */}
        <motion.form onSubmit={handleLogin} className="space-y-4" variants={itemVariants}>
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

          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
              Email Address
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
                style={{
                  borderColor: COLOR_BORDER,
                  background: '#F3F4F6',
                }}
                onFocus={(e) => (e.target.style.borderColor = COLOR_ACCENT)}
                onBlur={(e) => (e.target.style.borderColor = COLOR_BORDER)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5" style={{ color: COLOR_TEXT_SECONDARY }} />
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 py-3 rounded-lg border-2 transition-colors focus:outline-none"
                style={{
                  borderColor: COLOR_BORDER,
                  background: '#F3F4F6',
                }}
                onFocus={(e) => (e.target.style.borderColor = COLOR_ACCENT)}
                onBlur={(e) => (e.target.style.borderColor = COLOR_BORDER)}
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <span style={{ color: COLOR_TEXT_SECONDARY }}>Remember me</span>
            </label>
            <Link href="/auth/forgot-password" style={{ color: COLOR_ACCENT }} className="font-medium hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: COLOR_ACCENT }}
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Divider */}
        <motion.div className="relative my-6" variants={itemVariants}>
          <div
            className="absolute inset-0 flex items-center"
            style={{ borderTopColor: COLOR_BORDER, borderTopWidth: 1 }}
          />
          <div className="relative flex justify-center text-sm" style={{ background: 'white' }}>
            <span style={{ color: COLOR_TEXT_SECONDARY, padding: '0 16px' }}>
              Or continue with
            </span>
          </div>
        </motion.div>

        {/* Demo Accounts */}
        <motion.div className="grid grid-cols-3 gap-3 mb-6" variants={itemVariants}>
          {[
            { role: 'Seller', email: 'seller@example.com', password: 'demo123' },
            { role: 'Buyer', email: 'buyer@example.com', password: 'demo123' },
            { role: 'Broker', email: 'broker@example.com', password: 'demo123' },
          ].map((demo) => (
            <button
              key={demo.role}
              type="button"
              onClick={() => {
                setEmail(demo.email)
                setPassword(demo.password)
              }}
              className="p-3 rounded-lg border-2 text-sm font-medium transition-all hover:border-orange-300"
              style={{ borderColor: COLOR_BORDER }}
            >
              Demo {demo.role}
            </button>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div className="text-center text-sm" variants={itemVariants}>
          <p style={{ color: COLOR_TEXT_SECONDARY }}>
            Don't have an account?{' '}
            <Link href="/auth/signup" style={{ color: COLOR_ACCENT }} className="font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>

        {/* Demo Mode Note */}
        <motion.div
          className="mt-6 p-3 rounded-lg text-xs"
          style={{ background: '#DBEAFE', borderColor: '#93C5FD', borderWidth: 1, color: '#1E40AF' }}
          variants={itemVariants}
        >
          💡 <strong>Demo Mode:</strong> Use the demo buttons above to test the platform with pre-filled credentials
        </motion.div>
      </motion.div>
    </div>
  )
}

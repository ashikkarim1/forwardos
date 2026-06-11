'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, ArrowRight, Flame } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

function SigninContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams?.get('redirect')

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields')
        setLoading(false)
        return
      }

      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: formData.email,
        fullName: formData.email.split('@')[0],
        userType: 'buyer',
        createdAt: new Date().toISOString()
      }

      // Auth is handled by the httpOnly session cookie — no tokens/PII in localStorage.

      if (redirect) {
        router.push(redirect)
      } else {
        router.push('/marketplace')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12" style={{ background: COLOR_PRIMARY + '10' }}>
        <div className="max-w-md">
          <div className="flex items-center gap-2 mb-12">
            <Flame size={32} style={{ color: COLOR_ACCENT }} />
            <h1 className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
              Forward OS
            </h1>
          </div>

          <h2 className="text-4xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
            Welcome Back
          </h2>

          <p className="text-lg mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>
            Access your exclusive deal flow, market intelligence, and connections to buyers, sellers, and brokers.
          </p>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: COLOR_ACCENT }}>
                  ✓
                </div>
              </div>
              <div>
                <h3 className="font-bold" style={{ color: COLOR_PRIMARY }}>View Hot Deals</h3>
                <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">Access real-time deal flow ranked by heat</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: COLOR_ACCENT }}>
                  ✓
                </div>
              </div>
              <div>
                <h3 className="font-bold" style={{ color: COLOR_PRIMARY }}>Market Analysis</h3>
                <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">Compare valuations with market comps</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: COLOR_ACCENT }}>
                  ✓
                </div>
              </div>
              <div>
                <h3 className="font-bold" style={{ color: COLOR_PRIMARY }}>Contact Deals</h3>
                <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">Message sellers, buyers & brokers directly</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
            Sign In
          </h1>
          <p className="mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>
            Enter your credentials to access Forward OS
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-lg" style={{ background: '#FEE2E2', color: '#991B1B' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3.5" style={{ color: COLOR_TEXT_SECONDARY }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border"
                  style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3.5" style={{ color: COLOR_TEXT_SECONDARY }} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border"
                  style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" style={{ accentColor: COLOR_ACCENT }} />
                <span style={{ color: COLOR_TEXT_SECONDARY }}>Remember me</span>
              </label>
              <Link href="#" className="font-bold" style={{ color: COLOR_ACCENT }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: COLOR_ACCENT }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p style={{ color: COLOR_TEXT_SECONDARY }}>
              Don't have an account?{' '}
              <Link href="/auth/signup" className="font-bold" style={{ color: COLOR_ACCENT }}>
                Sign Up
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link href="/marketplace" className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
              Continue browsing as guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SigninPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <SigninContent />
    </Suspense>
  )
}

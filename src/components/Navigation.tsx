'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { COLOR_ACCENT, COLOR_BORDER } from '@/styles/forward-colors'

import { Bell, Heart } from 'lucide-react'
import { useSavedDeals } from '@/hooks/useSavedDeals'

/**
 * Minimal public header for landing, pricing, login pages
 * Logo + Navigation + Notifications + Account button
 *
 * Notification-bell badge is gated on a session probe (/api/me) so it
 * doesn't fire pre-auth and leak session-shaped UI to crawlers. We start
 * authed=false on the client; the probe flips it once the cookie is checked.
 */
export function PublicHeader() {
  const [authed, setAuthed] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const { count: savedCount, hydrated: savedHydrated } = useSavedDeals()

  useEffect(() => {
    let cancelled = false
    fetch('/api/me', { credentials: 'same-origin' })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (cancelled || !d?.authenticated) return
        setAuthed(true)
        // TODO(notif-api): replace with real unread count fetch once the
        // notifications API ships. For now we keep the badge hidden by
        // default so we never show a fake count.
        setUnreadCount(0)
      })
      .catch(() => { /* anonymous browsing — leave hidden */ })
    return () => { cancelled = true }
  }, [])

  return (
    <header className="border-b sticky top-0 z-30 bg-white" style={{ borderColor: COLOR_BORDER }}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          {/* Logo Icon */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: COLOR_ACCENT }}
          >
            <svg viewBox="0 0 40 40" className="w-6 h-6 text-white">
              <path fill="currentColor" d="M20 4c8.84 0 16 7.16 16 16s-7.16 16-16 16S4 28.84 4 20 11.16 4 20 4zm0 2c-7.73 0-14 6.27-14 14s6.27 14 14 14 14-6.27 14-14-6.27-14-14-14zm3.5 6a2.5 2.5 0 110 5 2.5 2.5 0 010-5zm-7 0a2.5 2.5 0 110 5 2.5 2.5 0 010-5zm3.5 8.5c3.59 0 6.5 2.24 6.5 5s-2.91 5-6.5 5-6.5-2.24-6.5-5 2.91-5 6.5-5z" />
            </svg>
          </div>
          {/* Brand Text */}
          <div className="flex flex-col -space-y-0.5">
            <span className="text-lg font-black leading-none" style={{ color: '#1a1a1a' }}>
              Forward
            </span>
            <span className="text-xs font-bold leading-none tracking-wide" style={{ color: COLOR_ACCENT }}>
              Intelligence
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/marketplace"
            className="text-sm font-semibold hover:opacity-70 transition-opacity"
            style={{ color: '#1a1a1a' }}
          >
            Marketplace
          </Link>
          <Link
            href="/finance-center"
            className="text-sm font-semibold hover:opacity-70 transition-opacity"
            style={{ color: '#1a1a1a' }}
          >
            Finance
          </Link>
          <Link
            href="/brokers"
            className="text-sm font-semibold hover:opacity-70 transition-opacity"
            style={{ color: '#1a1a1a' }}
          >
            Brokers
          </Link>
          <Link
            href="/market-insights"
            className="text-sm font-semibold hover:opacity-70 transition-opacity"
            style={{ color: '#1a1a1a' }}
          >
            Insights
          </Link>
          <Link
            href="/learning-center"
            className="text-sm font-semibold hover:opacity-70 transition-opacity"
            style={{ color: '#1a1a1a' }}
          >
            Learn
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-semibold hover:opacity-70 transition-opacity"
            style={{ color: '#1a1a1a' }}
          >
            Pricing
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Saved Listings */}
          <Link
            href="/saved"
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Saved listings"
          >
            <Heart className="w-6 h-6" style={{ color: '#1a1a1a' }} />
            {savedHydrated && savedCount > 0 && (
              <div
                className="absolute top-0 right-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: COLOR_ACCENT }}
              >
                {savedCount}
              </div>
            )}
          </Link>

          {/* Notification Bell — only rendered for signed-in users so the
              header doesn't leak a notification UI to anonymous visitors. */}
          {authed && (
            <Link
              href="/notifications"
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-6 h-6" style={{ color: '#1a1a1a' }} />
              {unreadCount > 0 && (
                <div
                  className="absolute top-0 right-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: COLOR_ACCENT }}
                >
                  {unreadCount}
                </div>
              )}
            </Link>
          )}

          {/* Account Button */}
          <Link
            href="/auth/login"
            className="px-6 py-2 rounded-lg font-semibold text-white transition-all hover:opacity-90"
            style={{ background: COLOR_ACCENT }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden lg:block w-64 border-r border-gray-200 bg-gray-50 min-h-screen sticky top-20">
      <div className="p-6 space-y-8">
        {/* Section: Navigation */}
        <div>
          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Navigation</h3>
          <nav className="space-y-2">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-white hover:text-teal-700 transition-colors"
            >
              📊 Dashboard
            </Link>
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-sm text-teal-700 bg-white font-medium"
            >
              🎯 Deal Discovery
            </Link>
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-white hover:text-teal-700 transition-colors"
            >
              💡 Intelligence
            </Link>
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-white hover:text-teal-700 transition-colors"
            >
              📈 Reports
            </Link>
          </nav>
        </div>

        {/* Section: Tools */}
        <div>
          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Tools</h3>
          <nav className="space-y-2">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-white hover:text-teal-700 transition-colors"
            >
              📋 Data Room
            </Link>
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-white hover:text-teal-700 transition-colors"
            >
              💬 Messaging
            </Link>
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-white hover:text-teal-700 transition-colors"
            >
              ⚙️ Settings
            </Link>
          </nav>
        </div>

        {/* Section: Design System */}
        <div>
          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Design System</h3>
          <div className="space-y-2 text-xs text-gray-600">
            <p>• 100+ Tokens</p>
            <p>• 5 Components</p>
            <p>• WCAG AA</p>
            <p>• A+ Grade (95/100)</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

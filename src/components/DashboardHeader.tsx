'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, ChevronDown, Settings, LogOut, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

interface DashboardHeaderProps {
  breadcrumbs: Array<{
    label: string
    href?: string
  }>
  title: string
  subtitle?: string
  actionButton?: {
    label: string
    href?: string
    onClick?: () => void
    icon?: React.ReactNode
  }
  stats?: Array<{
    label: string
    value: string | number
    trend?: 'up' | 'down' | 'neutral'
    trendValue?: string
  }>
  userProfile?: {
    name: string
    email: string
    avatar?: string
    role: string
  }
  onMenuToggle?: (open: boolean) => void
  sidebarOpen?: boolean
}

export function DashboardHeader({
  breadcrumbs,
  title,
  subtitle,
  actionButton,
  stats,
  userProfile,
  onMenuToggle,
  sidebarOpen = true,
}: DashboardHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="border-b bg-white sticky top-0 z-40" style={{ borderColor: COLOR_BORDER }}>
      {/* Single Row: Hamburger | Breadcrumbs | [Spacer] | KYC | Notification | Profile */}
      <div className="px-6 py-3 flex items-center justify-between border-b" style={{ borderColor: COLOR_BORDER }}>
        {/* Left: Hamburger + Breadcrumbs */}
        <div className="flex items-center gap-3">
          {/* Hamburger Menu */}
          <button
            onClick={() => onMenuToggle?.(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors -ml-2"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" style={{ color: COLOR_PRIMARY }} />
            ) : (
              <Menu className="w-5 h-5" style={{ color: COLOR_PRIMARY }} />
            )}
          </button>

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && (
                <span style={{ color: COLOR_BORDER }}>/</span>
              )}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:opacity-70 transition-opacity"
                  style={{ color: COLOR_TEXT_SECONDARY }}
                >
                  {crumb.label}
                </Link>
              ) : (
                <span style={{ color: COLOR_PRIMARY, fontWeight: 600 }}>
                  {crumb.label}
                </span>
              )}
            </div>
          ))}
          </nav>
        </div>

        {/* Right: Action Button + Notifications + Profile */}
        <div className="flex items-center gap-3">
          {/* Action Button */}
          {actionButton && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={actionButton.onClick}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all hover:opacity-90 border whitespace-nowrap"
              style={{
                borderColor: COLOR_ACCENT,
                color: COLOR_ACCENT,
                background: 'transparent',
              }}
            >
              {actionButton.icon}
              <span>{actionButton.label}</span>
            </motion.button>
          )}

          {/* Notification Bell */}
          <button
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" style={{ color: COLOR_PRIMARY }} />
            <div
              className="absolute top-1 right-1 w-2 h-2 rounded-full animate-pulse"
              style={{ background: COLOR_ACCENT }}
            />
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                {userProfile?.avatar ? (
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs"
                    style={{ background: COLOR_ACCENT }}
                  >
                    {userProfile?.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
            </motion.button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-64 rounded-lg border bg-white shadow-lg z-50"
                style={{ borderColor: COLOR_BORDER }}
              >
                {/* User Info */}
                <div className="p-4 border-b" style={{ borderColor: COLOR_BORDER }}>
                  <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                    {userProfile?.name}
                  </p>
                  <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {userProfile?.email}
                  </p>
                  <p className="text-xs mt-2 px-2 py-1 rounded-full w-fit" style={{ background: COLOR_ACCENT + '20', color: COLOR_ACCENT }}>
                    {userProfile?.role}
                  </p>
                </div>

                {/* Menu Items */}
                <div className="p-2 space-y-1">
                  <Link
                    href="/account"
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
                    style={{ color: COLOR_PRIMARY }}
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">Account Settings</span>
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {})
                      window.location.href = '/'
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
                    style={{ color: COLOR_PRIMARY }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Main Title & Subtitle Section */}
      <div className="px-6 py-4">
        <h1 className="text-3xl font-black" style={{ color: COLOR_PRIMARY }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Statistics Bar (if provided) */}
      {stats && stats.length > 0 && (
        <div
          className="px-6 py-4 border-t flex items-center gap-8 overflow-x-auto"
          style={{ borderColor: COLOR_BORDER, background: '#FAFAF8' }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="flex-shrink-0">
              <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                {stat.label}
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                  {stat.value}
                </p>
                {stat.trend && stat.trendValue && (
                  <span
                    className="text-xs font-bold"
                    style={{
                      color: stat.trend === 'up' ? '#10B981' : stat.trend === 'down' ? '#EF4444' : COLOR_TEXT_SECONDARY,
                    }}
                  >
                    {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '→'} {stat.trendValue}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  )
}

'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, TrendingUp, BarChart3, Settings, Bell, ChevronDown,
  Menu, X, Zap, Eye, MessageSquare, FileText, PieChart, Target,
  HelpCircle, LogOut, Award
} from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'
import { LogoWithBee } from '@/components/LogoWithBee'

// Navigation organized into semantic groups for deal discovery mission
const NAV_GROUPS = [
  {
    section: 'MY DASHBOARD',
    collapsible: false,
    items: [
      { href: '/dashboard/buyer', icon: LayoutDashboard, label: 'Buyer Dashboard', badge: null, key: 'buyer-dashboard' },
      { href: '/dashboard/seller', icon: LayoutDashboard, label: 'Seller Dashboard', badge: null, key: 'seller-dashboard' },
      { href: '/dashboard/broker', icon: LayoutDashboard, label: 'Broker Dashboard', badge: null, key: 'broker-dashboard' },
    ],
  },
  {
    section: 'DEALS',
    collapsible: true,
    items: [
      { href: '/deals', icon: Target, label: 'Deal Discovery', badge: 'Hot', key: 'deal-discovery' },
      { href: '/deals/heat-maps', icon: Zap, label: 'Heat Maps', badge: null, key: 'heat-maps' },
      { href: '/deals/comparables', icon: BarChart3, label: 'Comparables', badge: 'New', key: 'comparables' },
    ],
  },
  {
    section: 'INTELLIGENCE',
    collapsible: true,
    items: [
      { href: '/intelligence', icon: TrendingUp, label: 'Market Trends', badge: null, key: 'market-trends' },
      { href: '/intelligence/predictions', icon: Eye, label: 'M&A Predictions', badge: null, key: 'predictions' },
      { href: '/intelligence/feeds', icon: Bell, label: 'Real-Time Feeds', badge: null, key: 'feeds' },
      { href: '/intelligence/signals', icon: Zap, label: 'Deal Signals', badge: null, key: 'signals' },
    ],
  },
  {
    section: 'TOOLS',
    collapsible: true,
    items: [
      { href: '/diligence', icon: Award, label: 'Advanced Diligence', badge: null, key: 'diligence' },
      { href: '/data-room', icon: FileText, label: 'Data Room', badge: null, key: 'data-room' },
      { href: '/messaging', icon: MessageSquare, label: 'Messaging', badge: null, key: 'messaging' },
      { href: '/cap-table', icon: PieChart, label: 'Cap Table', badge: null, key: 'cap-table' },
    ],
  },
  {
    section: 'ACCOUNT',
    collapsible: true,
    items: [
      { href: '/account', icon: Settings, label: 'Account Settings', badge: null, key: 'account' },
      { href: '/notifications', icon: Bell, label: 'Notifications', badge: null, key: 'notifications' },
      { href: '/help', icon: HelpCircle, label: 'Help & Docs', badge: null, key: 'help' },
    ],
  },
]

const NAV_ITEMS = NAV_GROUPS.flatMap(g => g.items)

function BadgeChip({ badge }: { badge: string | null }) {
  if (!badge) return null

  if (badge === 'Hot') {
    return (
      <span className="text-[9px] px-1.5 py-0.5 rounded font-bold animate-pulse"
        style={{ background: COLOR_ACCENT, color: 'white', letterSpacing: '0.04em' }}>
        {badge}
      </span>
    )
  }
  if (badge === 'New') {
    return (
      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
        style={{ background: COLOR_ACCENT, color: 'white', opacity: 0.8 }}>
        {badge}
      </span>
    )
  }

  return (
    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
      style={{ background: '#F9FAFB', color: COLOR_TEXT_SECONDARY }}>
      {badge}
    </span>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)

  // Listen for sidebar toggle events from DashboardHeader
  useEffect(() => {
    const handleToggleSidebar = (event: Event) => {
      const customEvent = event as CustomEvent
      setSidebarOpen(!customEvent.detail?.open && sidebarOpen ? false : !sidebarOpen)
    }

    window.addEventListener('toggleSidebar', handleToggleSidebar)
    return () => window.removeEventListener('toggleSidebar', handleToggleSidebar)
  }, [sidebarOpen])

  // Collapsible sections state with localStorage persistence
  const [expandedSections, setExpandedSections] = useState<string[]>(['DEALS', 'INTELLIGENCE'])

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('forward_expanded_nav_sections')
    if (saved) {
      try {
        setExpandedSections(JSON.parse(saved))
      } catch {
        // Keep defaults if parsing fails
      }
    }
  }, [])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const updated = prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
      localStorage.setItem('forward_expanded_nav_sections', JSON.stringify(updated))
      return updated
    })
  }

  const isNavItemActive = (href: string) => {
    if (!pathname) return false

    // Exact match or match with trailing slash
    if (pathname === href || pathname === href + '/') return true

    // For nested routes, check if this is the most specific match
    if (href !== '/' && pathname.startsWith(href + '/')) {
      // Find all nav items that match this pathname
      const matchingItems = NAV_ITEMS.filter(item => {
        return pathname === item.href ||
               pathname === item.href + '/' ||
               (item.href !== '/' && pathname.startsWith(item.href + '/'))
      })

      // Only return true if this href is the most specific (longest) match
      const longestMatch = matchingItems.reduce((longest, current) =>
        current.href.length > longest.href.length ? current : longest
      )

      return href === longestMatch.href
    }
    return false
  }

  return (
    <div className="flex h-screen bg-white" style={{ background: '#FFFFFF' }}>
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-80 border-r bg-white overflow-y-auto flex flex-col"
            style={{
              borderColor: COLOR_BORDER,
              backgroundColor: '#FFFFFF',
            }}
          >
            {/* Logo Section */}
            <div className="p-6 border-b" style={{ borderColor: COLOR_BORDER }}>
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden"
                  style={{ background: COLOR_ACCENT }}>
                  <LogoWithBee />
                </div>
                <div>
                  <div className="text-lg font-black" style={{ color: COLOR_PRIMARY }}>Forward OS</div>
                  <div className="text-xs font-medium" style={{ color: COLOR_TEXT_SECONDARY }}>Deal Discovery</div>
                </div>
              </Link>
            </div>

            {/* Navigation Sections */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {NAV_GROUPS.map(group => (
                <div key={group.section}>
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(group.section)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors"
                    style={{
                      color: COLOR_TEXT_SECONDARY,
                      background: expandedSections.includes(group.section) ? '#FFFFFF' : 'transparent',
                    }}
                  >
                    <span>{group.section}</span>
                    <motion.div
                      animate={{ rotate: expandedSections.includes(group.section) ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>

                  {/* Nav Items */}
                  <AnimatePresence>
                    {expandedSections.includes(group.section) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 py-1">
                          {group.items.map(item => {
                            const isActive = isNavItemActive(item.href)
                            const Icon = item.icon

                            return (
                              <Link
                                key={item.key}
                                href={item.href}
                                className="flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all"
                                style={{
                                  color: isActive ? COLOR_ACCENT : COLOR_TEXT_SECONDARY,
                                  background: isActive ? '#F3F4F6' : 'transparent',
                                  fontWeight: isActive ? 600 : 500,
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <Icon className="w-4 h-4" />
                                  <span>{item.label}</span>
                                </div>
                                {item.badge && <BadgeChip badge={item.badge} />}
                              </Link>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Design System Stats */}
            <div className="p-4 border-t space-y-3" style={{ borderColor: COLOR_BORDER }}>
              <div className="text-xs font-bold uppercase tracking-wider" style={{ color: COLOR_TEXT_SECONDARY }}>
                Design System
              </div>
              <div className="space-y-2 text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                <div className="flex justify-between">
                  <span>• Design Tokens</span>
                  <span className="font-semibold">100+</span>
                </div>
                <div className="flex justify-between">
                  <span>• Components</span>
                  <span className="font-semibold">8+</span>
                </div>
                <div className="flex justify-between">
                  <span>• WCAG AA</span>
                  <span className="font-semibold">✓</span>
                </div>
                <div className="flex justify-between">
                  <span>• Grade</span>
                  <span className="font-semibold" style={{ color: COLOR_ACCENT }}>A+</span>
                </div>
              </div>
            </div>

            {/* Footer in Sidebar */}
            <div className="border-t text-center py-4" style={{ borderColor: COLOR_BORDER }}>
              <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                Forward OS © 2026
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content - Header is now inside children (DashboardHeader) */}
        <main className="flex-1 overflow-y-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  )
}

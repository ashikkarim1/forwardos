'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, TrendingUp, BarChart3, Settings, Bell, ChevronDown,
  Menu, X, Zap, Eye, MessageSquare, FileText, PieChart, Target,
  HelpCircle, LogOut, Award, CreditCard,
} from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

// Single item shape so heterogeneous rows (some with roles, some with
// requiresPaid, some plain) unify into one type — keeps the
// visibleGroups filter map cleanly assignable back to itself.
type NavItem = {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  badge: string | null
  key: string
  roles?: string[]
  requiresPaid?: boolean
}
type NavGroup = { section: string; collapsible: boolean; items: NavItem[] }

// Navigation organized into semantic groups for deal discovery mission
const NAV_GROUPS: NavGroup[] = [
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
      { href: '/deals', icon: Target, label: 'Marketplace', badge: 'Hot', key: 'deal-discovery' },
      { href: '/dashboard/broker/pipeline', icon: BarChart3, label: 'Pipeline (Broker)', badge: 'Pro', key: 'broker-pipeline', roles: ['BROKER', 'ADMIN'] },
      { href: '/deals/heat-maps', icon: Zap, label: 'Heat Maps', badge: 'Premium', key: 'heat-maps', requiresPaid: true },
      { href: '/deals/comparables', icon: BarChart3, label: 'Comparables', badge: 'Premium', key: 'comparables', requiresPaid: true },
    ],
  },
  {
    section: 'INTELLIGENCE',
    collapsible: true,
    items: [
      { href: '/market-insights', icon: TrendingUp, label: 'Market Trends', badge: null, key: 'market-trends' },
      { href: '/intelligence/predictions', icon: Eye, label: 'M&A Predictions', badge: 'Premium', key: 'predictions', requiresPaid: true },
      { href: '/intelligence/feeds', icon: Bell, label: 'Real-Time Feeds', badge: 'Premium', key: 'feeds', requiresPaid: true },
      { href: '/intelligence/signals', icon: Zap, label: 'Deal Signals', badge: 'Premium', key: 'signals', requiresPaid: true },
    ],
  },
  {
    section: 'TOOLS',
    collapsible: true,
    items: [
      { href: '/diligence', icon: Award, label: 'Advanced Diligence', badge: 'Premium', key: 'diligence', requiresPaid: true },
      { href: '/data-rooms', icon: FileText, label: 'Data Room', badge: null, key: 'data-room' },
      { href: '/messages', icon: MessageSquare, label: 'Messaging', badge: null, key: 'messaging' },
      { href: '/cap-table', icon: PieChart, label: 'Cap Table', badge: 'Premium', key: 'cap-table', requiresPaid: true },
    ],
  },
  {
    section: 'ACCOUNT',
    collapsible: true,
    items: [
      { href: '/account', icon: Settings, label: 'Account Settings', badge: null, key: 'account' },
      { href: '/account/billing', icon: CreditCard, label: 'Plans & Billing', badge: null, key: 'billing' },
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
  // Premium / Pro markers — only surface to users who are eligible to
  // see the item at all, so the badge is a confirmation, not a tease.
  if (badge === 'Premium' || badge === 'Pro') {
    return (
      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold tracking-wide"
        style={{ background: '#0F1419', color: '#F2EAD9', letterSpacing: '0.04em' }}>
        {badge.toUpperCase()}
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
  // Sidebar: open by default on desktop, closed on mobile. We measure
  // once on mount and again whenever the pathname changes — clicking a
  // link on mobile should auto-close the overlay so the user lands on
  // the page they tapped, not a screen full of sidebar.
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    // md breakpoint = 768px. Sync once on mount and on every resize.
    const apply = () => setSidebarOpen(window.innerWidth >= 768)
    apply()
    window.addEventListener('resize', apply)
    return () => window.removeEventListener('resize', apply)
  }, [])

  useEffect(() => {
    // Auto-close on mobile after the user navigates.
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }, [pathname])

  // Listen for sidebar toggle events from DashboardHeader
  useEffect(() => {
    const handleToggleSidebar = (event: Event) => {
      const customEvent = event as CustomEvent
      setSidebarOpen(!customEvent.detail?.open && sidebarOpen ? false : !sidebarOpen)
    }

    window.addEventListener('toggleSidebar', handleToggleSidebar)
    return () => window.removeEventListener('toggleSidebar', handleToggleSidebar)
  }, [sidebarOpen])

  // Fetch the current user's role so the sidebar can hide dashboards
  // the user has no business seeing. A BUYER sees only "Buyer Dashboard",
  // SELLER only "Seller Dashboard", etc. ADMIN sees all three (support).
  // Until the fetch resolves we hide all three — better a brief gap than
  // flashing dashboards the user can't open (every other one redirects
  // away via the role gate on /dashboard/{role}/layout.tsx).
  const [role, setRole] = useState<'BUYER' | 'SELLER' | 'BROKER' | 'ADMIN' | null>(null)
  const [hasPaid, setHasPaid] = useState(false)
  const [authLoaded, setAuthLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user?.role) setRole(data.user.role)
        if (data?.user) {
          const paid =
            data.user.role === 'ADMIN' ||
            data.user.buyerPlanTier === 'PREMIUM_BUYER' ||
            data.user.sellerPlanTier === 'PREMIUM' ||
            data.user.brokerPlanTier === 'BROKER_PRO'
          setHasPaid(!!paid)
        }
        setAuthLoaded(true)
      })
      .catch(() => setAuthLoaded(true))
  }, [])

  // Filter nav items by role + plan tier.
  //   - MY DASHBOARD section: keep only the caller's own role dashboard
  //     (admins see all three for support).
  //   - `roles` allowlist: shown only to listed roles.
  //   - `requiresPaid`: hidden until the caller holds ANY paid tier
  //     (PREMIUM_BUYER / SELLER PREMIUM / BROKER_PRO / ADMIN).
  //
  // We wait for /api/auth/me before showing requiresPaid items — better
  // a brief moment without them than flashing Premium links to free
  // users (the user's exact complaint).
  const visibleGroups = useMemo(() => {
    return NAV_GROUPS.map((g) => {
      const items = g.items.filter((i) => {
        const allowed = (i as { roles?: string[] }).roles
        if (allowed) {
          if (!role) return false
          if (!allowed.includes(role)) return false
        }
        const requiresPaid = (i as { requiresPaid?: boolean }).requiresPaid
        if (requiresPaid) {
          if (!authLoaded) return false
          if (!hasPaid) return false
        }
        return true
      })
      if (g.section !== 'MY DASHBOARD') return { ...g, items }
      if (!role) return { ...g, items: [] }
      if (role === 'ADMIN') return { ...g, items }
      const keep = `${role.toLowerCase()}-dashboard`
      return { ...g, items: items.filter((i) => i.key === keep) }
    })
  }, [role, hasPaid, authLoaded])

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
      {/* Mobile backdrop — only shown when sidebar is open on small screens.
          Tap to dismiss. Hidden at md+ where the sidebar is persistent. */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* Sidebar — overlay on mobile, in-flow on desktop. */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="
              fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw]
              md:relative md:max-w-none md:z-auto
              border-r bg-white overflow-y-auto flex flex-col
            "
            style={{
              borderColor: COLOR_BORDER,
              backgroundColor: '#FFFFFF',
            }}
          >
            {/* Logo Section — must match PublicHeader brand mark so the
                dashboard and the public site read as the same product. */}
            <div className="p-6 border-b flex items-center justify-between gap-3" style={{ borderColor: COLOR_BORDER }}>
              <Link href="/" className="flex items-center gap-3 group hover:opacity-80 transition-opacity">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: COLOR_ACCENT }}
                >
                  <svg viewBox="0 0 40 40" className="w-6 h-6 text-white">
                    <path fill="currentColor" d="M20 4c8.84 0 16 7.16 16 16s-7.16 16-16 16S4 28.84 4 20 11.16 4 20 4zm0 2c-7.73 0-14 6.27-14 14s6.27 14 14 14 14-6.27 14-14-6.27-14-14-14zm3.5 6a2.5 2.5 0 110 5 2.5 2.5 0 010-5zm-7 0a2.5 2.5 0 110 5 2.5 2.5 0 010-5zm3.5 8.5c3.59 0 6.5 2.24 6.5 5s-2.91 5-6.5 5-6.5-2.24-6.5-5 2.91-5 6.5-5z" />
                  </svg>
                </div>
                <div className="flex flex-col -space-y-0.5">
                  <span className="text-lg font-black leading-none" style={{ color: COLOR_PRIMARY }}>
                    Forward
                  </span>
                  <span className="text-xs font-bold leading-none tracking-wide" style={{ color: COLOR_ACCENT }}>
                    Intelligence
                  </span>
                </div>
              </Link>
              {/* Mobile-only close button. On desktop the sidebar is
                  persistent so this would just be confusing. */}
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-1.5 rounded-md hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" style={{ color: COLOR_TEXT_SECONDARY }} />
              </button>
            </div>

            {/* Navigation Sections */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {visibleGroups.map(group => (
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

            {/* Internal debug stats removed — was design-system token
                counts which is meaningless to customers and took space.
                Customer-visible status (e.g. system health, beta badge)
                can return here later. */}

            {/* Footer in Sidebar */}
            <div className="border-t text-center py-4" style={{ borderColor: COLOR_BORDER }}>
              <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                Forward Intelligence © 2026
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

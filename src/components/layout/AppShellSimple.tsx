'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, TrendingUp, BarChart3, Settings, Bell, ChevronDown,
  Menu, X, Zap, Eye, MessageSquare, FileText, PieChart, Target,
  HelpCircle, LogOut, Award
} from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

const NAV_GROUPS = [
  {
    section: 'MY DASHBOARD',
    items: [
      { href: '/dashboard/buyer', icon: LayoutDashboard, label: 'Buyer Dashboard', key: 'buyer-dashboard' },
    ],
  },
  {
    section: 'DEALS',
    items: [
      { href: '/deals', icon: Target, label: 'Deal Discovery', key: 'deal-discovery' },
    ],
  },
]

export function AppShellSimple({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const isNavItemActive = (href: string) => {
    return pathname?.startsWith(href) || pathname === href
  }

  return (
    <div className="flex h-screen bg-white" style={{ background: '#FFFFFF' }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <aside
          className="w-80 border-r bg-white overflow-y-auto flex flex-col"
          style={{
            borderColor: COLOR_BORDER,
            backgroundColor: '#FFFFFF',
          }}
        >
          {/* Logo Section */}
          <div className="p-6 border-b" style={{ borderColor: COLOR_BORDER }}>
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-white text-lg"
                style={{ background: COLOR_ACCENT }}>
                🌱
              </div>
              <div>
                <div className="text-lg font-black" style={{ color: COLOR_PRIMARY }}>Forward OS</div>
                <div className="text-xs font-medium" style={{ color: COLOR_TEXT_SECONDARY }}>Deal Discovery</div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {NAV_GROUPS.map(group => (
              <div key={group.section}>
                <div className="text-xs font-bold uppercase tracking-wider" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {group.section}
                </div>
                <div className="space-y-1 py-1">
                  {group.items.map(item => {
                    const Icon = item.icon
                    const isActive = isNavItemActive(item.href)
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
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="border-b bg-white sticky top-0 z-20" style={{ borderColor: COLOR_BORDER }}>
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" style={{ color: COLOR_PRIMARY }} />
              ) : (
                <Menu className="w-6 h-6" style={{ color: COLOR_PRIMARY }} />
              )}
            </button>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" style={{ color: COLOR_PRIMARY }} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: COLOR_ACCENT }}></span>
              </button>

              <button className="w-10 h-10 rounded-full font-bold text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                style={{ background: COLOR_ACCENT }}>
                👤
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  )
}

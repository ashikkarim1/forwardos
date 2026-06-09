'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Mail,
  Activity,
  BarChart3,
  MessageCircle,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'
import { useState } from 'react'

const ADMIN_MENU = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin', section: 'dashboard' },
  { icon: ShoppingCart, label: 'Listings', href: '/admin/listings', section: 'listings' },
  { icon: Users, label: 'Users', href: '/admin/users', section: 'users' },
  { icon: Mail, label: 'Email', href: '/admin/email', section: 'email' },
  { icon: Activity, label: 'Activity', href: '/admin/activity', section: 'activity' },
  { icon: BarChart3, label: 'Reports', href: '/admin/reports', section: 'reports' },
  { icon: MessageCircle, label: 'Support', href: '/admin/support', section: 'support' },
  { icon: Settings, label: 'Settings', href: '/admin/settings', section: 'settings' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const currentSection = ADMIN_MENU.find((item) => pathname.startsWith(item.href))?.section

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : 0 }}
        className={`fixed md:relative md:translate-x-0 top-0 left-0 h-screen w-64 bg-white border-r z-50 md:z-0 transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
        style={{ borderColor: COLOR_BORDER }}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: COLOR_BORDER }}>
          <div>
            <h1 className="text-xl font-black" style={{ color: COLOR_PRIMARY }}>
              Forward OS
            </h1>
            <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
              Admin Console
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} style={{ color: COLOR_PRIMARY }} />
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="p-4 space-y-1 overflow-y-auto">
          {ADMIN_MENU.map((item) => {
            const Icon = item.icon
            const isActive = currentSection === item.section
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                <motion.button
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition-colors text-left"
                  whileHover={{ x: 4 }}
                  style={{
                    background: isActive ? COLOR_ACCENT + '15' : 'transparent',
                    color: isActive ? COLOR_ACCENT : COLOR_TEXT_SECONDARY,
                  }}
                >
                  <Icon size={20} />
                  {item.label}
                </motion.button>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ borderColor: COLOR_BORDER }}>
          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90"
            style={{ background: COLOR_ACCENT }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b px-4 md:px-8 py-4 flex items-center justify-between" style={{ borderColor: COLOR_BORDER }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} style={{ color: COLOR_PRIMARY }} />
          </button>

          <h2 className="text-lg font-bold hidden md:block" style={{ color: COLOR_PRIMARY }}>
            Admin Console
          </h2>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold" style={{ color: COLOR_PRIMARY }}>
                Sarah Chen
              </p>
              <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                Super Admin
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  )
}

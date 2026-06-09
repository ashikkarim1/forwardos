'use client'

import { motion } from 'framer-motion'
import { Shield, Bell, CreditCard, Lock, Globe, Users } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

export default function AdminSettingsPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
          Admin Settings
        </h1>
        <p style={{ color: COLOR_TEXT_SECONDARY }}>
          System configuration, permissions, and compliance settings
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Admin Users */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-lg border"
          style={{ borderColor: COLOR_BORDER }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Users size={28} style={{ color: COLOR_ACCENT }} />
            <h2 className="text-xl font-bold" style={{ color: COLOR_PRIMARY }}>
              Admin Users & Permissions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Sarah Chen', role: 'Super Admin', email: 'sarah@forward.com', status: 'Active', twofa: true },
              { name: 'Tom Wilson', role: 'Moderator', email: 'tom@forward.com', status: 'Active', twofa: true },
              { name: 'Lisa Johnson', role: 'Support', email: 'lisa@forward.com', status: 'Active', twofa: true },
            ].map((admin, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-lg"
                style={{ background: COLOR_BG_PRIMARY }}
              >
                <div>
                  <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                    {admin.name}
                  </p>
                  <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {admin.role} • {admin.email}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-white px-3 py-1 rounded-full" style={{ background: '#10B981' }}>
                    {admin.status}
                  </span>
                  <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                    2FA: {admin.twofa ? '✓' : '✗'}
                  </span>
                  <button className="px-3 py-1 rounded text-xs font-bold border transition-all hover:bg-gray-100"
                    style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>
                    Manage
                  </button>
                </div>
              </div>
            ))}

            <button className="w-full px-4 py-3 rounded-lg border font-bold text-sm transition-all hover:bg-gray-50 mt-4"
              style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>
              + Invite New Admin
            </button>
          </div>
        </motion.section>

        {/* Email Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-lg border"
          style={{ borderColor: COLOR_BORDER }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Bell size={28} style={{ color: COLOR_ACCENT }} />
            <h2 className="text-xl font-bold" style={{ color: COLOR_PRIMARY }}>
              Email Configuration
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                From Email Address
              </label>
              <input
                type="email"
                value="notifications@forwardos.com"
                className="w-full px-4 py-3 rounded-lg border bg-gray-100"
                style={{ borderColor: COLOR_BORDER }}
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                SMTP Server
              </label>
              <input
                type="text"
                value="mail.sendgrid.net"
                className="w-full px-4 py-3 rounded-lg border bg-gray-100"
                style={{ borderColor: COLOR_BORDER }}
                disabled
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5" />
                <span className="text-sm font-semibold" style={{ color: COLOR_PRIMARY }}>
                  Auto-unsubscribe on hard bounce
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5" />
                <span className="text-sm font-semibold" style={{ color: COLOR_PRIMARY }}>
                  Require email verification for new users
                </span>
              </label>
            </div>

            <button className="px-4 py-2 rounded-lg font-bold text-sm transition-all hover:opacity-90 text-white"
              style={{ background: COLOR_ACCENT }}>
              Test Connection
            </button>
          </div>
        </motion.section>

        {/* Fraud Detection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-6 rounded-lg border"
          style={{ borderColor: COLOR_BORDER }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield size={28} style={{ color: COLOR_ACCENT }} />
            <h2 className="text-xl font-bold" style={{ color: COLOR_PRIMARY }}>
              Fraud Detection Settings
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                Auto-flag Threshold (Risk Score)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="10"
                  defaultValue="5"
                  className="flex-1"
                />
                <span className="text-sm font-bold" style={{ color: COLOR_ACCENT }}>
                  5.0/10
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5" />
                <span className="text-sm font-semibold" style={{ color: COLOR_PRIMARY }}>
                  Require manual approval for score &gt; 5.0
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5" />
                <span className="text-sm font-semibold" style={{ color: COLOR_PRIMARY }}>
                  Enable IP geolocation verification
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5" />
                <span className="text-sm font-semibold" style={{ color: COLOR_PRIMARY }}>
                  Enable bot detection
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5" />
                <span className="text-sm font-semibold" style={{ color: COLOR_PRIMARY }}>
                  Enable duplicate listing detection
                </span>
              </label>
            </div>
          </div>
        </motion.section>

        {/* Payment Processing */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-lg border"
          style={{ borderColor: COLOR_BORDER }}
        >
          <div className="flex items-center gap-3 mb-6">
            <CreditCard size={28} style={{ color: COLOR_ACCENT }} />
            <h2 className="text-xl font-bold" style={{ color: COLOR_PRIMARY }}>
              Payment Processing
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg" style={{ background: COLOR_BG_PRIMARY }}>
              <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                Stripe Integration
              </p>
              <p className="font-bold text-lg mt-1" style={{ color: '#10B981' }}>
                ✓ Connected
              </p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5" />
                <span className="text-sm font-semibold" style={{ color: COLOR_PRIMARY }}>
                  Auto-refund on user request (within 30 days)
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5" />
                <span className="text-sm font-semibold" style={{ color: COLOR_PRIMARY }}>
                  Chargeback protection
                </span>
              </label>
            </div>
          </div>
        </motion.section>

        {/* Data & Privacy */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-6 rounded-lg border"
          style={{ borderColor: COLOR_BORDER }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Lock size={28} style={{ color: COLOR_ACCENT }} />
            <h2 className="text-xl font-bold" style={{ color: COLOR_PRIMARY }}>
              Data & Privacy
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                Data Retention Period
              </label>
              <select
                defaultValue="180"
                className="w-full px-4 py-3 rounded-lg border bg-white"
                style={{ borderColor: COLOR_BORDER }}
              >
                <option value="90">90 days</option>
                <option value="180">180 days (default)</option>
                <option value="365">1 year</option>
                <option value="0">Never delete</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5" />
                <span className="text-sm font-semibold" style={{ color: COLOR_PRIMARY }}>
                  GDPR Compliance
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5" />
                <span className="text-sm font-semibold" style={{ color: COLOR_PRIMARY }}>
                  Audit Logging
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5" />
                <span className="text-sm font-semibold" style={{ color: COLOR_PRIMARY }}>
                  PII Masking in Logs
                </span>
              </label>
            </div>
          </div>
        </motion.section>

        {/* Multi-language & Localization */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-lg border"
          style={{ borderColor: COLOR_BORDER }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Globe size={28} style={{ color: COLOR_ACCENT }} />
            <h2 className="text-xl font-bold" style={{ color: COLOR_PRIMARY }}>
              Localization & Regions
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold mb-3" style={{ color: COLOR_PRIMARY }}>
                Enabled Regions
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {['United States', 'Canada', 'United Arab Emirates', 'United Kingdom'].map((region, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                    <span className="text-sm" style={{ color: COLOR_PRIMARY }}>
                      {region}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold mb-3" style={{ color: COLOR_PRIMARY }}>
                Supported Languages
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {['English', 'French', 'Arabic', 'Spanish'].map((lang, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked={idx < 3} className="w-5 h-5" />
                    <span className="text-sm" style={{ color: COLOR_PRIMARY }}>
                      {lang}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Save Settings */}
      <div className="flex gap-3">
        <button className="px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90"
          style={{ background: COLOR_ACCENT }}>
          Save Settings
        </button>
        <button className="px-6 py-3 rounded-lg font-bold border transition-all hover:bg-gray-50"
          style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>
          Reset to Default
        </button>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useUserStore } from '@/store/user-store'
import {
  User, Globe, Bell, Heart, Save, LogOut
} from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_SURFACE_SUCCESS } from '@/styles/forward-colors'

export default function AccountPage() {
  const {
    role, userId, userEmail, companyName,
    currency, language, notifications,
    updateCurrency, updateLanguage, updateNotificationPreferences,
    setRole
  } = useUserStore()

  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'notifications'>('profile')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto px-6 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
          Account Settings
        </h1>
        <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
          Manage your profile, preferences, and notification settings
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        variants={itemVariants}
        className="mb-6 border-b flex gap-6"
        style={{ borderColor: COLOR_BORDER }}
      >
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'preferences', label: 'Preferences', icon: Globe },
          { id: 'notifications', label: 'Notifications', icon: Bell },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className="px-4 py-3 font-semibold border-b-2 transition-colors flex items-center gap-2"
            style={{
              color: activeTab === tab.id ? COLOR_ACCENT : COLOR_TEXT_SECONDARY,
              borderColor: activeTab === tab.id ? COLOR_ACCENT : 'transparent',
            }}
          >
            {activeTab === tab.id && <tab.icon className="w-4 h-4" />}
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <motion.div
          variants={containerVariants}
          className="space-y-6"
        >
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-lg border bg-white"
            style={{ borderColor: COLOR_BORDER }}
          >
            <h2 className="text-xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
              Personal Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="Ashik Ahmed"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue={userEmail || 'ashik@forward.os'}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: COLOR_BORDER }}
                />
              </div>

              {role === 'seller' && (
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    defaultValue={companyName || 'Acme Manufacturing'}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: COLOR_BORDER }}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Role
                </label>
                <select
                  value={role || 'buyer'}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: COLOR_BORDER }}
                >
                  <option value="buyer">Buyer / Investor</option>
                  <option value="seller">Seller / Founder</option>
                  <option value="broker">Broker / Advisor</option>
                </select>
              </div>

              <button
                onClick={handleSave}
                className="w-full mt-6 px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: COLOR_ACCENT }}
              >
                <Save className="w-4 h-4" />
                {saved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <motion.div
          variants={containerVariants}
          className="space-y-6"
        >
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-lg border bg-white"
            style={{ borderColor: COLOR_BORDER }}
          >
            <h2 className="text-xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
              Regional Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => updateCurrency(e.target.value as any)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: COLOR_BORDER }}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AED">AED - UAE Dirham</option>
                  <option value="SAR">SAR - Saudi Riyal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => updateLanguage(e.target.value as any)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: COLOR_BORDER }}
                >
                  <option value="en">English</option>
                  <option value="ar">العربية (Arabic)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
              style={{ background: COLOR_ACCENT }}
            >
              <Save className="w-4 h-4" />
              Save Preferences
            </button>
          </motion.div>

          {/* Watchlist */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-lg border bg-white"
            style={{ borderColor: COLOR_BORDER }}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
              <Heart className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
              Your Watchlist
            </h2>
            <p className="text-sm mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
              You have 0 deals in your watchlist. Add deals from the Buyer Dashboard to track opportunities.
            </p>
            <button
              className="px-6 py-2 rounded-lg font-semibold border transition-colors"
              style={{
                borderColor: COLOR_ACCENT,
                color: COLOR_ACCENT,
                background: 'transparent',
              }}
            >
              Browse Deals
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <motion.div
          variants={containerVariants}
          className="space-y-6"
        >
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-lg border bg-white"
            style={{ borderColor: COLOR_BORDER }}
          >
            <h2 className="text-xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
              Notification Preferences
            </h2>

            <div className="space-y-4">
              {[
                {
                  id: 'emailAlerts',
                  label: 'Email Alerts',
                  description: 'Receive email notifications for important updates',
                  value: notifications.emailAlerts,
                },
                {
                  id: 'inAppNotifications',
                  label: 'In-App Notifications',
                  description: 'Show notifications within the application',
                  value: notifications.inAppNotifications,
                },
                {
                  id: 'newDealAlerts',
                  label: 'New Deal Alerts',
                  description: 'Notify when new deals matching your criteria are added',
                  value: notifications.newDealAlerts,
                },
                {
                  id: 'buyerInterestAlerts',
                  label: 'Buyer Interest Alerts',
                  description: 'Notify when buyers show interest in your company',
                  value: notifications.buyerInterestAlerts,
                },
                {
                  id: 'priceChangeAlerts',
                  label: 'Price Change Alerts',
                  description: 'Notify when valuation estimates change significantly',
                  value: notifications.priceChangeAlerts,
                },
                {
                  id: 'weeklyDigest',
                  label: 'Weekly Digest',
                  description: 'Receive a weekly summary of market updates',
                  value: notifications.weeklyDigest,
                },
              ].map(pref => (
                <div key={pref.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                  style={{ borderColor: COLOR_BORDER }}>
                  <div>
                    <p className="font-semibold" style={{ color: COLOR_PRIMARY }}>
                      {pref.label}
                    </p>
                    <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {pref.description}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={pref.value}
                    onChange={(e) => updateNotificationPreferences({
                      [pref.id]: e.target.checked
                    } as any)}
                    className="w-5 h-5 rounded cursor-pointer"
                    style={{ accentColor: COLOR_ACCENT }}
                  />
                </div>
              ))}
            </div>

            {/* Heat Threshold */}
            <div className="mt-6 pt-6 border-t" style={{ borderColor: COLOR_BORDER }}>
              <label className="block text-sm font-semibold mb-4" style={{ color: COLOR_PRIMARY }}>
                Deal Heat Index Threshold
              </label>
              <p className="text-sm mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
                Only notify me about deals with heat index above:
              </p>
              <input
                type="range"
                min="0"
                max="100"
                value={notifications.dealHeatThreshold}
                onChange={(e) => updateNotificationPreferences({
                  dealHeatThreshold: Number(e.target.value)
                })}
                className="w-full"
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>0%</span>
                <span className="text-sm font-bold" style={{ color: COLOR_ACCENT }}>
                  {notifications.dealHeatThreshold}%+
                </span>
                <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>100%</span>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full mt-6 px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
              style={{ background: COLOR_ACCENT }}
            >
              <Save className="w-4 h-4" />
              Save Notification Settings
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Danger Zone */}
      <motion.div
        variants={itemVariants}
        className="mt-12 p-6 rounded-lg border"
        style={{ borderColor: COLOR_ACCENT, background: '#FFF7F3' }}
      >
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: COLOR_ACCENT }}>
          Danger Zone
        </h3>
        <p className="text-sm mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
          This action cannot be undone.
        </p>
        <button
          className="px-6 py-2 rounded-lg font-semibold border text-white transition-colors flex items-center gap-2"
          style={{
            borderColor: COLOR_ACCENT,
            background: COLOR_ACCENT,
          }}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </motion.div>
    </motion.div>
  )
}

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLocale } from '@/context/LocaleContext'
import { formatCurrency } from '@/lib/currency'
import { CreditCard, Download, Settings, LogOut, ArrowRight, CheckCircle2 } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

interface Subscription {
  plan: 'starter' | 'professional' | 'enterprise'
  status: 'active' | 'past_due' | 'cancelled'
  currentBillingCycle: {
    startDate: string
    endDate: string
  }
  nextBillingDate: string
  amount: number
  billingInterval: 'monthly' | 'annual'
}

interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  description: string
}

interface PaymentMethod {
  id: string
  type: 'card'
  brand: string
  last4: string
  expMonth: number
  expYear: number
  isDefault: boolean
}

export default function DashboardPage() {
  const { locale, currency, isRTL } = useLocale()

  // Mock data
  const subscription: Subscription = {
    plan: 'professional',
    status: 'active',
    currentBillingCycle: {
      startDate: '2024-12-09',
      endDate: '2025-01-09',
    },
    nextBillingDate: '2025-01-09',
    amount: 1999,
    billingInterval: 'monthly',
  }

  const invoices: Invoice[] = [
    {
      id: 'INV-001',
      date: '2024-12-09',
      amount: 1999,
      status: 'paid',
      description: 'Professional Plan - Monthly',
    },
    {
      id: 'INV-002',
      date: '2024-11-09',
      amount: 1999,
      status: 'paid',
      description: 'Professional Plan - Monthly',
    },
    {
      id: 'INV-003',
      date: '2024-10-09',
      amount: 1999,
      status: 'paid',
      description: 'Professional Plan - Monthly',
    },
  ]

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'pm_1',
      type: 'card',
      brand: 'Visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2026,
      isDefault: true,
    },
  ]

  const planDetails = {
    starter: { name: 'Starter', features: ['Advanced search & filters', 'Deal comparison (3)', 'PDF export', 'Email support'] },
    professional: { name: 'Professional', features: ['Everything in Starter', 'Financial modeling tools', 'Deal comparison (5)', 'Portfolio dashboard', 'API access', 'Priority support'] },
    enterprise: { name: 'Enterprise', features: ['Everything in Professional', 'Unlimited API access', 'Custom integrations', 'White-label marketplace', 'Dedicated account manager'] },
  }

  const planInfo = planDetails[subscription.plan]

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="border-b py-8 px-4 sm:px-6 lg:px-8" style={{ borderColor: COLOR_BORDER }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black" style={{ color: COLOR_PRIMARY }}>
              Account Dashboard
            </h1>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mt-1">
              Manage your subscription and billing
            </p>
          </div>
          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link
              href="/"
              className="px-4 py-2 rounded-lg border hover:bg-gray-50"
              style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
            >
              Browse Marketplace
            </Link>
            <button
              className="px-4 py-2 rounded-lg font-bold text-white hover:opacity-90"
              style={{ background: COLOR_ACCENT }}
            >
              <LogOut size={18} className="inline mr-2" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Current Subscription */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-lg border-2"
            style={{ borderColor: COLOR_ACCENT, background: COLOR_ACCENT + '05' }}
          >
            <div className={`flex justify-between items-start mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div>
                <h2 className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                  {planInfo.name} Plan
                </h2>
                <div className={`flex items-center gap-2 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <CheckCircle2 size={20} style={{ color: '#10b981' }} />
                  <p style={{ color: '#10b981' }} className="font-semibold">
                    Active Subscription
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black" style={{ color: COLOR_ACCENT }}>
                  {formatCurrency(subscription.amount, currency, locale)}/month
                </p>
                <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mt-1">
                  Next billing: {subscription.nextBillingDate}
                </p>
              </div>
            </div>

            <div className="mb-6 pb-6 border-b" style={{ borderColor: COLOR_BORDER }}>
              <h3 className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                Included Features:
              </h3>
              <ul className="space-y-2">
                {planInfo.features.map((feature, idx) => (
                  <li key={idx} className="flex gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                    <span style={{ color: COLOR_ACCENT }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                className="px-6 py-2 rounded-lg font-bold border hover:bg-gray-50"
                style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
              >
                Change Plan
              </button>
              <button
                className="px-6 py-2 rounded-lg font-bold text-white hover:opacity-90"
                style={{ background: COLOR_ACCENT }}
              >
                Upgrade to Enterprise
              </button>
            </div>
          </motion.div>

          {/* Billing Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-lg border"
              style={{ borderColor: COLOR_BORDER }}
            >
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={20} style={{ color: COLOR_ACCENT }} />
                <h3 className="font-bold" style={{ color: COLOR_PRIMARY }}>
                  Payment Method
                </h3>
              </div>
              {paymentMethods[0] && (
                <>
                  <p className="text-sm mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {paymentMethods[0].brand} •••• {paymentMethods[0].last4}
                  </p>
                  <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Expires {paymentMethods[0].expMonth}/{paymentMethods[0].expYear}
                  </p>
                </>
              )}
              <button
                className="w-full mt-4 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50"
                style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY, border: `1px solid ${COLOR_BORDER}` }}
              >
                Update Payment
              </button>
            </motion.div>

            {/* Billing History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-lg border"
              style={{ borderColor: COLOR_BORDER }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Download size={20} style={{ color: COLOR_ACCENT }} />
                <h3 className="font-bold" style={{ color: COLOR_PRIMARY }}>
                  Recent Invoices
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                {invoices.slice(0, 3).map((invoice) => (
                  <div key={invoice.id} className="flex justify-between items-center pb-2 border-b" style={{ borderColor: COLOR_BORDER }}>
                    <div>
                      <p style={{ color: COLOR_PRIMARY }}>{invoice.date}</p>
                      <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs">
                        {invoice.description}
                      </p>
                    </div>
                    <button className="text-blue-600 hover:underline text-xs font-semibold">Download</button>
                  </div>
                ))}
              </div>
              <button
                className="w-full mt-4 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50"
                style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY, border: `1px solid ${COLOR_BORDER}` }}
              >
                View All Invoices
              </button>
            </motion.div>

            {/* Account Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-lg border"
              style={{ borderColor: COLOR_BORDER }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Settings size={20} style={{ color: COLOR_ACCENT }} />
                <h3 className="font-bold" style={{ color: COLOR_PRIMARY }}>
                  Account
                </h3>
              </div>
              <div className="space-y-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                <p>Email: john@example.com</p>
                <p>Plan: Professional</p>
                <p>Member Since: Jan 2025</p>
              </div>
              <button
                className="w-full mt-4 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50"
                style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY, border: `1px solid ${COLOR_BORDER}` }}
              >
                Manage Account
              </button>
            </motion.div>
          </div>

          {/* Invoices Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-lg border"
            style={{ borderColor: COLOR_BORDER }}
          >
            <h3 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
              Billing History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: COLOR_PRIMARY + '02', borderBottom: `1px solid ${COLOR_BORDER}` }}>
                    <th className="p-3 text-left font-semibold" style={{ color: COLOR_PRIMARY }}>
                      Date
                    </th>
                    <th className="p-3 text-left font-semibold" style={{ color: COLOR_PRIMARY }}>
                      Invoice
                    </th>
                    <th className="p-3 text-left font-semibold" style={{ color: COLOR_PRIMARY }}>
                      Description
                    </th>
                    <th className="p-3 text-left font-semibold" style={{ color: COLOR_PRIMARY }}>
                      Amount
                    </th>
                    <th className="p-3 text-left font-semibold" style={{ color: COLOR_PRIMARY }}>
                      Status
                    </th>
                    <th className="p-3 text-left font-semibold" style={{ color: COLOR_PRIMARY }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} style={{ borderBottom: `1px solid ${COLOR_BORDER}` }}>
                      <td className="p-3" style={{ color: COLOR_PRIMARY }}>
                        {invoice.date}
                      </td>
                      <td className="p-3" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {invoice.id}
                      </td>
                      <td className="p-3" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {invoice.description}
                      </td>
                      <td className="p-3 font-bold" style={{ color: COLOR_PRIMARY }}>
                        {formatCurrency(invoice.amount, currency, locale)}
                      </td>
                      <td className="p-3">
                        <span
                          className="px-2 py-1 rounded text-xs font-semibold"
                          style={{
                            background: invoice.status === 'paid' ? '#E8F5E9' : '#FFF3E0',
                            color: invoice.status === 'paid' ? '#2E7D32' : '#E65100',
                          }}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          className="text-sm font-semibold hover:underline flex items-center gap-1"
                          style={{ color: COLOR_ACCENT }}
                        >
                          Download <ArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-lg border"
            style={{ borderColor: COLOR_BORDER, background: '#FEE2E2' }}
          >
            <h3 className="font-bold text-lg mb-2" style={{ color: '#B91C1C' }}>
              Cancel Subscription
            </h3>
            <p style={{ color: '#991B1B' }} className="text-sm mb-4">
              If you cancel, you'll lose access to all features at the end of your current billing cycle.
            </p>
            <button style={{ background: '#DC2626', color: 'white' }} className="px-6 py-2 rounded-lg font-bold hover:opacity-90">
              Cancel Subscription
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

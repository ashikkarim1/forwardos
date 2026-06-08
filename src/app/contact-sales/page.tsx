'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function ContactSalesPage() {
  const [formData, setFormData] = useState({
    userType: '',
    name: '',
    email: '',
    phone: '',
    title: '',
    company: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.userType || !formData.email || !formData.name) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      // Send email via API
      const response = await fetch('/api/email/contact-sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          setFormData({ userType: '', name: '', email: '', phone: '', title: '', company: '', message: '' })
          setSubmitted(false)
        }, 3000)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Header */}
      <header className="border-b" style={{ borderColor: COLOR_BORDER }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <ArrowLeft className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
            <span className="font-bold" style={{ color: COLOR_PRIMARY }}>Back</span>
          </Link>
          <h1 className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>Forward OS</h1>
          <div className="w-12" />
        </div>
      </header>

      {/* Main Content */}
      <motion.div
        className="max-w-2xl mx-auto px-6 py-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
            Let's Talk Business
          </h1>
          <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-lg">
            Tell us about your deal sourcing needs and we'll connect you with the right team.
          </p>
        </motion.div>

        <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-6">
          {/* User Type */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
              Who are you? *
            </label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: COLOR_BORDER, boxShadow: `inset 0 0 0 1px ${COLOR_BORDER}` }}
              required
            >
              <option value="">Select your role</option>
              <option value="buyer">Buyer / Investor</option>
              <option value="seller">Seller / Founder</option>
              <option value="broker">Broker / Advisor</option>
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: COLOR_BORDER, boxShadow: `inset 0 0 0 1px ${COLOR_BORDER}` }}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@company.com"
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: COLOR_BORDER, boxShadow: `inset 0 0 0 1px ${COLOR_BORDER}` }}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: COLOR_BORDER, boxShadow: `inset 0 0 0 1px ${COLOR_BORDER}` }}
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
              Job Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Investment Manager, Founder, CEO"
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: COLOR_BORDER, boxShadow: `inset 0 0 0 1px ${COLOR_BORDER}` }}
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
              Company / Firm
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Your company name"
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: COLOR_BORDER, boxShadow: `inset 0 0 0 1px ${COLOR_BORDER}` }}
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
              How can we help?
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your deal sourcing challenges, goals, or questions..."
              rows={5}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: COLOR_BORDER, boxShadow: `inset 0 0 0 1px ${COLOR_BORDER}` }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold text-white text-lg transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: COLOR_ACCENT }}
          >
            {loading ? 'Sending...' : submitted ? '✓ Message Sent!' : 'Send Message'}
          </button>

          {submitted && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm font-medium"
              style={{ color: COLOR_ACCENT }}
            >
              Thanks for reaching out! Our team will contact you shortly.
            </motion.p>
          )}
        </motion.form>

        {/* Footer */}
        <motion.p variants={itemVariants} className="text-center mt-12 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
          Your message will be sent to our sales team at ceo@theupcapital.com
        </motion.p>
      </motion.div>
    </div>
  )
}

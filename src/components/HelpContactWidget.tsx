'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Mail, Phone, HelpCircle } from 'lucide-react'
import { useLocale } from '@/context/LocaleContext'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

export function HelpContactWidget() {
  const { locale, isRTL } = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'faq' | 'contact'>('faq')

  const faqs = [
    {
      question: 'How does the deal verification process work?',
      answer: 'All deals on Forward OS go through our rigorous 7-step verification process including financial audits, legal review, and seller background checks.',
    },
    {
      question: 'What makes Forward OS different from other platforms?',
      answer: 'Our AI-powered market intelligence, 6-layer competitive moat, and institutional network give you an unfair advantage in deal sourcing and analysis.',
    },
    {
      question: 'How do I get started?',
      answer: 'Sign up for a free account, browse verified deals, use AI intelligence tools, and connect with sellers through our platform.',
    },
    {
      question: 'What support do you offer?',
      answer: 'We provide 24/7 support via email, phone, and live chat. Enterprise clients get a dedicated account manager.',
    },
  ]

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'support@forwardos.io', href: 'mailto:support@forwardos.io' },
    { icon: Phone, label: 'Phone', value: '+1-888-FORWARD-1', href: 'tel:+18884436972' },
  ]

  return (
    <>
      {/* Help Widget Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        style={{ background: COLOR_ACCENT, color: 'white' }}
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Help Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-end sm:justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            >
              {/* Header */}
              <div
                className="px-6 py-4 flex items-center justify-between border-b"
                style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT }}
              >
                <div className="flex items-center gap-3 text-white">
                  <HelpCircle size={20} />
                  <h3 className="font-bold text-lg">Help & Support</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b" style={{ borderColor: COLOR_BORDER }}>
                <button
                  onClick={() => setActiveTab('faq')}
                  className={`flex-1 px-4 py-3 font-semibold border-b-2 transition-colors ${
                    activeTab === 'faq' ? 'border-b-2' : ''
                  }`}
                  style={{
                    color: activeTab === 'faq' ? COLOR_ACCENT : COLOR_TEXT_SECONDARY,
                    borderColor: activeTab === 'faq' ? COLOR_ACCENT : 'transparent',
                  }}
                >
                  FAQ
                </button>
                <button
                  onClick={() => setActiveTab('contact')}
                  className={`flex-1 px-4 py-3 font-semibold border-b-2 transition-colors ${
                    activeTab === 'contact' ? 'border-b-2' : ''
                  }`}
                  style={{
                    color: activeTab === 'contact' ? COLOR_ACCENT : COLOR_TEXT_SECONDARY,
                    borderColor: activeTab === 'contact' ? COLOR_ACCENT : 'transparent',
                  }}
                >
                  Contact
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'faq' && (
                  <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="space-y-2"
                      >
                        <h4 className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>
                          {faq.question}
                        </h4>
                        <p className="text-sm leading-relaxed" style={{ color: COLOR_TEXT_SECONDARY }}>
                          {faq.answer}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div className="space-y-6">
                    {/* Quick Message */}
                    <div className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '05' }}>
                      <p className="text-sm font-semibold mb-3" style={{ color: COLOR_PRIMARY }}>
                        Chat with us live
                      </p>
                      <textarea
                        placeholder="Tell us how we can help..."
                        className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                        style={{ borderColor: COLOR_BORDER }}
                        rows={4}
                      />
                      <button
                        className="w-full mt-3 py-2 rounded-lg font-bold text-white hover:opacity-90 transition-opacity"
                        style={{ background: COLOR_ACCENT }}
                      >
                        Send Message
                      </button>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3">
                      <p className="text-xs font-bold uppercase" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Contact Information
                      </p>
                      {contactInfo.map((item, idx) => {
                        const Icon = item.icon
                        return (
                          <a
                            key={idx}
                            href={item.href}
                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                            style={{ borderColor: COLOR_BORDER }}
                          >
                            <Icon size={18} style={{ color: COLOR_ACCENT, flexShrink: 0 }} />
                            <div>
                              <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                                {item.label}
                              </p>
                              <p className="font-semibold" style={{ color: COLOR_PRIMARY }}>
                                {item.value}
                              </p>
                            </div>
                          </a>
                        )
                      })}
                    </div>

                    {/* Hours */}
                    <div className="p-3 rounded-lg" style={{ background: COLOR_PRIMARY + '02' }}>
                      <p className="text-xs font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Support Hours
                      </p>
                      <p className="text-sm font-semibold" style={{ color: COLOR_PRIMARY }}>
                        Available 24/7 for all subscribers
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

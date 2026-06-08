'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share2, TrendingUp, DollarSign, Users, Calendar } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_SURFACE_SUCCESS } from '@/styles/forward-colors'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface Listing {
  id: string
  businessName: string
  industry: string
  city: string
  country: string
  revenue: number
  ebitda: number
  askingPrice: number
  employees: number
  yearsInOperation: number
  description: string
  reasonForSale: string
  inventoryIncluded: boolean
  realEstateIncluded: boolean
  franchiseStatus: boolean
  viewsCount: number
  savesCount: number
  createdAt: string
}

export default function ListingDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [inquiryText, setInquiryText] = useState('')
  const [inquirySubmitted, setInquirySubmitted] = useState(false)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        // Mock: find listing from mock storage
        // In real app, fetch from API
        setLoading(false)
      } catch (error) {
        console.error('Error fetching listing:', error)
        setLoading(false)
      }
    }

    fetchListing()
  }, [id])

  if (loading) {
    return <div className="text-center py-20">Loading...</div>
  }

  if (!listing) {
    return <div className="text-center py-20">Listing not found</div>
  }

  const margin = ((listing.ebitda / listing.revenue) * 100).toFixed(1)
  const multiple = (listing.askingPrice / listing.ebitda).toFixed(1)

  return (
    <motion.div
      className="max-w-6xl mx-auto px-6 py-8"
      initial="hidden"
      animate="visible"
      variants={itemVariants}
    >
      {/* Header */}
      <div className="mb-12">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
              {listing.businessName}
            </h1>
            <div className="flex gap-3 flex-wrap">
              <span
                className="px-4 py-2 rounded-lg font-bold text-white text-sm"
                style={{ background: COLOR_ACCENT }}
              >
                {listing.industry}
              </span>
              <span
                className="px-4 py-2 rounded-lg font-bold text-sm"
                style={{ background: '#FEE2CC', color: COLOR_PRIMARY }}
              >
                📍 {listing.city}, {listing.country}
              </span>
              {listing.franchiseStatus && (
                <span
                  className="px-4 py-2 rounded-lg font-bold text-white text-sm"
                  style={{ background: '#10b981' }}
                >
                  🏪 Franchise
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <motion.button
              onClick={() => setSaved(!saved)}
              className="p-3 rounded-lg hover:bg-gray-100"
              whileHover={{ scale: 1.1 }}
            >
              <Heart
                className="w-6 h-6"
                style={{ color: saved ? COLOR_ACCENT : COLOR_TEXT_SECONDARY }}
                fill={saved ? COLOR_ACCENT : 'none'}
              />
            </motion.button>
            <motion.button
              className="p-3 rounded-lg hover:bg-gray-100"
              whileHover={{ scale: 1.1 }}
            >
              <Share2 className="w-6 h-6" style={{ color: COLOR_ACCENT }} />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <motion.div className="lg:col-span-2 space-y-8" variants={itemVariants}>
          {/* Overview Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
              <p className="text-sm font-semibold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                Annual Revenue
              </p>
              <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                AED {(listing.revenue / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
              <p className="text-sm font-semibold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                EBITDA
              </p>
              <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                AED {(listing.ebitda / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
              <p className="text-sm font-semibold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                EBITDA Margin
              </p>
              <p className="text-2xl font-black" style={{ color: COLOR_ACCENT }}>
                {margin}%
              </p>
            </div>
            <div className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
              <p className="text-sm font-semibold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                Asking Price
              </p>
              <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                AED {(listing.askingPrice / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="p-8 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
              About This Business
            </h3>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="leading-relaxed mb-6">
              {listing.description}
            </p>

            {/* Key Details */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t" style={{ borderColor: COLOR_BORDER }}>
              <div>
                <p className="text-sm font-semibold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Employees
                </p>
                <p className="text-lg font-bold" style={{ color: COLOR_PRIMARY }}>
                  {listing.employees} people
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Years in Operation
                </p>
                <p className="text-lg font-bold" style={{ color: COLOR_PRIMARY }}>
                  {listing.yearsInOperation} years
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Reason for Sale
                </p>
                <p className="text-lg font-bold" style={{ color: COLOR_PRIMARY }}>
                  {listing.reasonForSale || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Valuation Multiple
                </p>
                <p className="text-lg font-bold" style={{ color: COLOR_PRIMARY }}>
                  {multiple}x EBITDA
                </p>
              </div>
            </div>

            {/* Included Assets */}
            {(listing.inventoryIncluded || listing.realEstateIncluded) && (
              <div className="mt-6 pt-6 border-t" style={{ borderColor: COLOR_BORDER }}>
                <p className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                  Included in Sale
                </p>
                <ul className="space-y-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {listing.inventoryIncluded && <li>✅ Inventory</li>}
                  {listing.realEstateIncluded && <li>✅ Real Estate / Property</li>}
                </ul>
              </div>
            )}
          </div>

          {/* AI Insights */}
          <div className="p-8 rounded-lg border-2" style={{ borderColor: COLOR_ACCENT, background: '#FFF7F3' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
              🤖 AI Insights
            </h3>
            <div className="space-y-4 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
              <p>
                <strong>Valuation:</strong> This business is valued at AED {(listing.askingPrice / 1000000).toFixed(1)}M based on {multiple}x EBITDA multiple typical for {listing.industry.toLowerCase()} businesses.
              </p>
              <p>
                <strong>Profitability:</strong> {margin}% EBITDA margin indicates a {margin > 15 ? 'healthy' : 'developing'} business with {listing.ebitda > 1000000 ? 'strong' : 'moderate'} cash generation.
              </p>
              <p>
                <strong>Buyer Types:</strong> Likely acquirers include strategic buyers in the {listing.industry} sector, private equity firms seeking sustainable cash flows, and corporate expansion candidates.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sidebar - Inquiry Form */}
        <motion.div
          className="lg:col-span-1 space-y-6"
          variants={itemVariants}
        >
          {/* CTA Card */}
          <div className="p-8 rounded-lg border-2 sticky top-6" style={{ borderColor: COLOR_ACCENT, background: 'white' }}>
            <h3 className="text-lg font-black mb-6" style={{ color: COLOR_PRIMARY }}>
              Interested?
            </h3>

            {inquirySubmitted ? (
              <div className="text-center py-6">
                <p className="text-lg font-bold mb-2" style={{ color: COLOR_ACCENT }}>
                  ✅ Inquiry Sent
                </p>
                <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  The seller will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  value={inquiryText}
                  onChange={(e) => setInquiryText(e.target.value)}
                  placeholder="Ask a question or request more information..."
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 resize-none"
                  style={{ borderColor: COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
                  rows={4}
                />

                <motion.button
                  onClick={() => setInquirySubmitted(true)}
                  disabled={!inquiryText.trim()}
                  className="w-full py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: COLOR_ACCENT }}
                  whileHover={{ scale: 1.02 }}
                >
                  <MessageCircle className="w-5 h-5" />
                  Send Inquiry
                </motion.button>

                <button
                  className="w-full py-3 rounded-lg font-bold border transition-all"
                  style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}
                >
                  Schedule Call
                </button>
              </div>
            )}
          </div>

          {/* Share */}
          <div className="p-6 rounded-lg border text-center" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
            <p className="text-sm font-semibold mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>
              Share with Partners
            </p>
            <div className="flex gap-2 justify-center">
              {['WhatsApp', 'Email', 'Copy'].map(method => (
                <button
                  key={method}
                  className="flex-1 py-2 rounded text-xs font-bold"
                  style={{ background: '#F3F4F6', color: COLOR_PRIMARY }}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="p-6 rounded-lg border text-sm" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
            <p className="mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
              <strong>Listed:</strong> {new Date(listing.createdAt).toLocaleDateString()}
            </p>
            <p style={{ color: COLOR_TEXT_SECONDARY }}>
              <strong>Views:</strong> {listing.viewsCount}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

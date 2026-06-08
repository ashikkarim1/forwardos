'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Upload, AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_SURFACE_SUCCESS } from '@/styles/forward-colors'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const INDUSTRIES = [
  'SaaS / Software',
  'E-commerce',
  'Professional Services',
  'Manufacturing',
  'Healthcare',
  'FinTech',
  'Retail',
  'Hospitality',
  'Other',
]

const COUNTRIES = ['UAE', 'Saudi Arabia', 'Kuwait', 'Qatar', 'Bahrain', 'Oman', 'Other']

const CITIES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Other']

const REASONS = ['Owner Retirement', 'Growth Capital', 'Strategic Exit', 'Health Reasons', 'Family Reasons', 'Other']

interface ListingData {
  businessName: string
  industry: string
  country: string
  city: string
  revenue: string
  ebitda: string
  askingPrice: string
  employees: string
  yearsInOperation: string
  description: string
  reasonForSale: string
  inventoryIncluded: boolean
  realEstateIncluded: boolean
  franchiseStatus: boolean
}

export default function CreateListingPage() {
  const [data, setData] = useState<ListingData>({
    businessName: '',
    industry: '',
    country: 'UAE',
    city: '',
    revenue: '',
    ebitda: '',
    askingPrice: '',
    employees: '',
    yearsInOperation: '',
    description: '',
    reasonForSale: '',
    inventoryIncluded: false,
    realEstateIncluded: false,
    franchiseStatus: false,
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!data.businessName.trim()) newErrors.businessName = 'Business name required'
    if (!data.industry) newErrors.industry = 'Industry required'
    if (!data.city.trim()) newErrors.city = 'City required'
    if (!data.revenue) newErrors.revenue = 'Revenue required'
    if (!data.ebitda) newErrors.ebitda = 'EBITDA required'
    if (!data.askingPrice) newErrors.askingPrice = 'Asking price required'
    if (!data.description.trim()) newErrors.description = 'Description required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else {
      setData(prev => ({
        ...prev,
        [name]: value,
      }))
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSaveDraft = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, status: 'draft' }),
      })
      if (response.ok) {
        setDraftSaved(true)
        setTimeout(() => setDraftSaved(false), 3000)
      }
    } catch (error) {
      console.error('Error saving draft:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, status: 'published' }),
      })
      if (response.ok) {
        setSuccess(true)
      }
    } catch (error) {
      console.error('Error publishing listing:', error)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div
        className="max-w-4xl mx-auto px-6 py-20 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <CheckCircle2 className="w-16 h-16 mx-auto mb-6" style={{ color: COLOR_ACCENT }} />
        <h1 className="text-4xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
          Listing Published! 🎉
        </h1>
        <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-lg mb-8">
          Your business is now live on Forward OS. Buyers will start seeing it in search results.
        </p>
        <motion.a
          href="/listings"
          className="inline-block px-8 py-4 rounded-lg font-bold text-white"
          style={{ background: COLOR_ACCENT }}
          whileHover={{ scale: 1.05 }}
        >
          View Listing
        </motion.a>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto px-6 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-12">
        <h1 className="text-4xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
          List Your Business
        </h1>
        <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
          Create a professional listing in under 10 minutes. Complete all fields for best visibility.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Progress */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-1 p-6 rounded-lg border"
          style={{ borderColor: COLOR_BORDER, background: 'white' }}
        >
          <h3 className="font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
            Form Sections
          </h3>
          <div className="space-y-3 text-sm">
            {[
              { name: 'Business Info', fields: ['name', 'industry', 'location'] },
              { name: 'Financials', fields: ['revenue', 'ebitda', 'price'] },
              { name: 'Details', fields: ['employees', 'years', 'description'] },
              { name: 'Features', fields: ['inventory', 'realestate', 'franchise'] },
            ].map((section, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-white text-xs"
                  style={{ background: COLOR_ACCENT }}
                >
                  {idx + 1}
                </div>
                <span style={{ color: COLOR_TEXT_SECONDARY }}>{section.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-3 p-8 rounded-lg border"
          style={{ borderColor: COLOR_BORDER, background: 'white' }}
        >
          <div className="space-y-8">
            {/* Business Info Section */}
            <div>
              <h3 className="text-lg font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
                Business Information
              </h3>
              <div className="space-y-6">
                {/* Business Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={data.businessName}
                    onChange={handleInputChange}
                    placeholder="e.g., TechFlow Solutions"
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                    style={{ borderColor: errors.businessName ? '#ef4444' : COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
                  />
                  {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                      Industry *
                    </label>
                    <select
                      name="industry"
                      value={data.industry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                      style={{ borderColor: errors.industry ? '#ef4444' : COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
                    >
                      <option value="">Select industry</option>
                      {INDUSTRIES.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                    {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry}</p>}
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                      Country *
                    </label>
                    <select
                      name="country"
                      value={data.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                      style={{ borderColor: COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
                    >
                      {COUNTRIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                    City *
                  </label>
                  <select
                    name="city"
                    value={data.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                    style={{ borderColor: errors.city ? '#ef4444' : COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
                  >
                    <option value="">Select city</option>
                    {CITIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
              </div>
            </div>

            <hr style={{ borderColor: COLOR_BORDER }} />

            {/* Financials Section */}
            <div>
              <h3 className="text-lg font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
                Financial Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Revenue */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                    Annual Revenue (AED) *
                  </label>
                  <input
                    type="number"
                    name="revenue"
                    value={data.revenue}
                    onChange={handleInputChange}
                    placeholder="e.g., 5000000"
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                    style={{ borderColor: errors.revenue ? '#ef4444' : COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
                  />
                  {errors.revenue && <p className="text-red-500 text-xs mt-1">{errors.revenue}</p>}
                </div>

                {/* EBITDA */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                    EBITDA (AED) *
                  </label>
                  <input
                    type="number"
                    name="ebitda"
                    value={data.ebitda}
                    onChange={handleInputChange}
                    placeholder="e.g., 1500000"
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                    style={{ borderColor: errors.ebitda ? '#ef4444' : COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
                  />
                  {errors.ebitda && <p className="text-red-500 text-xs mt-1">{errors.ebitda}</p>}
                </div>

                {/* Asking Price */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                    Asking Price (AED) *
                  </label>
                  <input
                    type="number"
                    name="askingPrice"
                    value={data.askingPrice}
                    onChange={handleInputChange}
                    placeholder="e.g., 12000000"
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                    style={{ borderColor: errors.askingPrice ? '#ef4444' : COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
                  />
                  {errors.askingPrice && <p className="text-red-500 text-xs mt-1">{errors.askingPrice}</p>}
                </div>
              </div>
            </div>

            <hr style={{ borderColor: COLOR_BORDER }} />

            {/* Details Section */}
            <div>
              <h3 className="text-lg font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
                Business Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Employees */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                    Number of Employees
                  </label>
                  <input
                    type="number"
                    name="employees"
                    value={data.employees}
                    onChange={handleInputChange}
                    placeholder="e.g., 25"
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                    style={{ borderColor: COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
                  />
                </div>

                {/* Years in Operation */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                    Years in Operation
                  </label>
                  <input
                    type="number"
                    name="yearsInOperation"
                    value={data.yearsInOperation}
                    onChange={handleInputChange}
                    placeholder="e.g., 5"
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                    style={{ borderColor: COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
                  />
                </div>
              </div>

              {/* Reason for Sale */}
              <div className="mt-6">
                <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Reason for Sale
                </label>
                <select
                  name="reasonForSale"
                  value={data.reasonForSale}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                  style={{ borderColor: COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
                >
                  <option value="">Select reason</option>
                  {REASONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="mt-6">
                <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Business Description *
                </label>
                <textarea
                  name="description"
                  value={data.description}
                  onChange={handleInputChange}
                  placeholder="Describe your business, what it does, market position, growth story..."
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 resize-none"
                  style={{ borderColor: errors.description ? '#ef4444' : COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
                  rows={5}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
            </div>

            <hr style={{ borderColor: COLOR_BORDER }} />

            {/* Features Section */}
            <div>
              <h3 className="text-lg font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
                Included Assets
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'inventoryIncluded', label: 'Inventory included in sale' },
                  { name: 'realEstateIncluded', label: 'Real estate / property included' },
                  { name: 'franchiseStatus', label: 'This is a franchise' },
                ].map(item => (
                  <label key={item.name} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name={item.name}
                      checked={data[item.name as keyof ListingData] as boolean}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded"
                    />
                    <span style={{ color: COLOR_PRIMARY }} className="font-medium">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <hr style={{ borderColor: COLOR_BORDER }} />

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <motion.button
                onClick={handleSaveDraft}
                disabled={loading}
                className="flex-1 py-3 rounded-lg font-bold border transition-all"
                style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}
                whileHover={{ scale: 1.02 }}
              >
                {draftSaved ? '✅ Draft Saved' : 'Save as Draft'}
              </motion.button>

              <motion.button
                onClick={handlePublish}
                disabled={loading}
                className="flex-1 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: COLOR_ACCENT }}
                whileHover={{ scale: 1.02 }}
              >
                {loading ? '⏳ Publishing...' : '🚀 Publish Listing'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

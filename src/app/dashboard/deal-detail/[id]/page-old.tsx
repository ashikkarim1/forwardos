'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ChevronLeft, Flame, TrendingUp, Users, DollarSign, Calendar,
  Target, Brain, BarChart3, Shield, CheckCircle, AlertCircle,
  Mail, Phone, MessageSquare, Eye
} from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

// Sample business data (same as marketplace)
const businessesData = [
  { id: 1, name: 'NeuralFlow AI', category: 'AI/ML', subcategory: 'Enterprise AI', description: 'Enterprise AI workflow automation platform', heatScore: 98, valuation: '$120M', foundedYear: 2020, team: 42, growth: '180%', buyerType: 'Strategic/PE', aiRelevance: 96, image: 'https://images.unsplash.com/photo-1677442d019cecf8fbf6c3d827b9c4d62c29db5e?w=600&h=400&fit=crop', comparables: [{ year: 2024, price: '$150M', description: 'AI automation, 8yr, $20M ARR, 150%' }, { year: 2024, price: '$95M', description: 'ML ops, 6yr, $12M ARR, 120%' }, { year: 2023, price: '$180M', description: 'Enterprise AI, 7yr, $25M ARR, 200%' }], trend: 'up', marketMomentum: 'Institutional buyers actively acquiring', revenue: '$18.5M ARR', employees: 42, founded: 'January 2020', industry: 'Enterprise Software', stage: 'Series B', funding: '$22M raised', ceo: 'Dr. Sarah Chen', headquarters: 'San Francisco, CA', website: 'www.neuralflow.ai', contact: 'Brokers available' },
  { id: 2, name: 'PeptideLife Therapeutics', category: 'Biotech', subcategory: 'Peptide Therapeutics', description: 'GLP-1 analogue development for metabolic health', heatScore: 95, valuation: '$85M', foundedYear: 2021, team: 28, growth: 'Pre-revenue', buyerType: 'Pharma/Strategic', aiRelevance: 88, image: 'https://images.unsplash.com/photo-1576091160550-2173fb9ce6e4?w=600&h=400&fit=crop', comparables: [{ year: 2024, price: '$120M', description: 'Peptide therapeutics, FDA Stage' }, { year: 2024, price: '$80M', description: 'GLP-1 developer, preclinical' }, { year: 2023, price: '$150M', description: 'Longevity biotech, Phase 2' }], trend: 'up', marketMomentum: 'Pharma mega-deals in peptide space', revenue: 'Pre-revenue', employees: 28, founded: 'June 2021', industry: 'Biopharmaceutical', stage: 'Series A', funding: '$12M raised', ceo: 'Dr. James Mitchell', headquarters: 'Boston, MA', website: 'www.peptidelife.bio', contact: 'Brokers available' },
  { id: 3, name: 'VitalWear Biosensors', category: 'HealthTech', subcategory: 'Wearables', description: 'Advanced biosensor wearables for clinical integration', heatScore: 92, valuation: '$65M', foundedYear: 2019, team: 35, growth: '220%', buyerType: 'Strategic/Healthcare', aiRelevance: 94, image: 'https://images.unsplash.com/photo-1576091160550-2173fb9ce6e4?w=600&h=400&fit=crop', comparables: [{ year: 2024, price: '$110M', description: 'Wearable biosensors, 5yr' }, { year: 2024, price: '$85M', description: 'Health monitoring, 4yr' }, { year: 2023, price: '$140M', description: 'Advanced biosensors, 6yr' }], trend: 'up', marketMomentum: 'Health giants racing to acquire', revenue: '$8.2M ARR', employees: 35, founded: 'March 2019', industry: 'Healthcare Technology', stage: 'Series B', funding: '$18M raised', ceo: 'Maria Garcia', headquarters: 'Palo Alto, CA', website: 'www.vitalwear.health', contact: 'Brokers available' },
  { id: 4, name: 'CloudSecure Pro', category: 'Cybersecurity', subcategory: 'Cloud Security', description: 'AI-powered cloud infrastructure security', heatScore: 88, valuation: '$75M', foundedYear: 2020, team: 38, growth: '150%', buyerType: 'Strategic/PE', aiRelevance: 92, image: 'https://images.unsplash.com/photo-1560264357-8d9766d84f9f?w=600&h=400&fit=crop', comparables: [{ year: 2024, price: '$130M', description: 'Cloud security AI, 4yr, $12M ARR' }, { year: 2023, price: '$105M', description: 'Infrastructure security, 4yr' }, { year: 2023, price: '$85M', description: 'Threat detection, 4yr' }], trend: 'flat', marketMomentum: 'Consolidation wave slowing', revenue: '$12M ARR', employees: 38, founded: 'August 2020', industry: 'Cybersecurity', stage: 'Series B', funding: '$25M raised', ceo: 'Alex Kumar', headquarters: 'New York, NY', website: 'www.cloudsecure.io', contact: 'Brokers available' },
  { id: 5, name: 'DeepGenomics+', category: 'Biotech', subcategory: 'Genomics & AI', description: 'AI-powered genomic analysis for rare disease diagnosis', heatScore: 91, valuation: '$105M', foundedYear: 2018, team: 45, growth: '175%', buyerType: 'Pharma/Diagnostic', aiRelevance: 95, image: 'https://images.unsplash.com/photo-1576091160550-2173fb9ce6e4?w=600&h=400&fit=crop', comparables: [{ year: 2024, price: '$180M', description: 'Genomic AI, 6yr, $8M ARR' }, { year: 2024, price: '$140M', description: 'AI diagnostics, 6yr, $7M ARR' }, { year: 2023, price: '$160M', description: 'Genomics platform, 6yr' }], trend: 'up', marketMomentum: 'Rare disease at all-time valuations', revenue: '$7.8M ARR', employees: 45, founded: 'April 2018', industry: 'Diagnostic AI', stage: 'Series C', funding: '$48M raised', ceo: 'Dr. Rachel Lee', headquarters: 'Toronto, Canada', website: 'www.deepgenomics.ai', contact: 'Brokers available' },
]

const getBusiness = (id: number) => businessesData.find(b => b.id === id)

export default function DealDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const [loading, setLoading] = useState(true)
  const businessId = params?.id ? parseInt(params.id as string) : 0
  const business = businessId > 0 ? getBusiness(businessId) : null

  useEffect(() => {
    // Check if user is authenticated (in production, verify with backend)
    const checkAuth = async () => {
      // For now, just check localStorage
      const token = localStorage.getItem('auth_token')
      if (!token) {
        // Redirect to signin
        router.push('/auth/signin?redirect=' + window.location.pathname)
        return
      }
      setIsAuthed(true)
      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: COLOR_ACCENT }}></div>
          <p className="mt-4" style={{ color: COLOR_TEXT_SECONDARY }}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-white p-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-8 font-bold"
          style={{ color: COLOR_PRIMARY }}
        >
          <ChevronLeft size={20} />
          Back
        </button>
        <div className="text-center">
          <AlertCircle size={48} style={{ color: COLOR_TEXT_SECONDARY }} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Company Not Found</h1>
          <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-6">This company is not in our database.</p>
          <Link href="/marketplace" className="text-white font-bold px-6 py-3 rounded-lg" style={{ background: COLOR_ACCENT }}>
            Back to Marketplace
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 font-bold"
            style={{ color: COLOR_PRIMARY }}
          >
            <ChevronLeft size={20} />
            Back to Marketplace
          </button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: COLOR_ACCENT + '20' }}>
            <Flame size={18} style={{ color: COLOR_ACCENT }} />
            <span className="font-bold" style={{ color: COLOR_ACCENT }}>Heat {business.heatScore}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="border-b" style={{ borderColor: COLOR_BORDER }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Image */}
            <div className="md:col-span-1">
              <div className="rounded-lg overflow-hidden h-64 md:h-96">
                <img
                  src={business.image}
                  alt={business.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop'
                  }}
                />
              </div>
            </div>

            {/* Info */}
            <div className="md:col-span-2">
              <h1 className="text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
                {business.name}
              </h1>
              <p className="text-lg mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
                {business.description}
              </p>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
                  <p className="text-xs uppercase font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Valuation</p>
                  <p className="text-2xl font-black" style={{ color: COLOR_ACCENT }}>{business.valuation}</p>
                </div>
                <div className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
                  <p className="text-xs uppercase font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Growth</p>
                  <p className="text-2xl font-black text-green-600">{business.growth}</p>
                </div>
                <div className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
                  <p className="text-xs uppercase font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Revenue</p>
                  <p className="text-xl font-black" style={{ color: COLOR_PRIMARY }}>{business.revenue}</p>
                </div>
                <div className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
                  <p className="text-xs uppercase font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Founded</p>
                  <p className="text-lg font-bold" style={{ color: COLOR_PRIMARY }}>{business.foundedYear}</p>
                </div>
                <div className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
                  <p className="text-xs uppercase font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Team Size</p>
                  <p className="text-lg font-bold" style={{ color: COLOR_PRIMARY }}>{business.team}</p>
                </div>
                <div className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
                  <p className="text-xs uppercase font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Stage</p>
                  <p className="text-lg font-bold" style={{ color: COLOR_PRIMARY }}>{business.stage}</p>
                </div>
              </div>

              {/* Key Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Target size={16} style={{ color: COLOR_ACCENT }} />
                  <span><strong>Industry:</strong> {business.industry}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} style={{ color: COLOR_ACCENT }} />
                  <span><strong>CEO:</strong> {business.ceo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target size={16} style={{ color: COLOR_ACCENT }} />
                  <span><strong>Headquarters:</strong> {business.headquarters}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Tabs */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Financials */}
          <div>
            <h2 className="text-2xl font-black mb-4 flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
              <DollarSign size={24} />
              Financial Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 rounded-lg border"
                style={{ borderColor: COLOR_BORDER, background: 'white' }}
              >
                <h3 className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>Revenue & Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span style={{ color: COLOR_TEXT_SECONDARY }}>Annual Recurring Revenue</span>
                    <span className="font-bold" style={{ color: COLOR_PRIMARY }}>{business.revenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: COLOR_TEXT_SECONDARY }}>Growth Rate (YoY)</span>
                    <span className="font-bold text-green-600">{business.growth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: COLOR_TEXT_SECONDARY }}>Total Funding Raised</span>
                    <span className="font-bold" style={{ color: COLOR_PRIMARY }}>{business.funding}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: COLOR_TEXT_SECONDARY }}>Current Valuation</span>
                    <span className="font-bold text-lg" style={{ color: COLOR_ACCENT }}>{business.valuation}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 rounded-lg border"
                style={{ borderColor: COLOR_BORDER, background: 'white' }}
              >
                <h3 className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>Company Profile</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span style={{ color: COLOR_TEXT_SECONDARY }}>Employees</span>
                    <span className="font-bold" style={{ color: COLOR_PRIMARY }}>{business.employees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: COLOR_TEXT_SECONDARY }}>Founded</span>
                    <span className="font-bold" style={{ color: COLOR_PRIMARY }}>{business.founded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: COLOR_TEXT_SECONDARY }}>CEO</span>
                    <span className="font-bold" style={{ color: COLOR_PRIMARY }}>{business.ceo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: COLOR_TEXT_SECONDARY }}>Stage</span>
                    <span className="font-bold" style={{ color: COLOR_PRIMARY }}>{business.stage}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Market Comparables */}
          <div>
            <h2 className="text-2xl font-black mb-4 flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
              <BarChart3 size={24} />
              Market Comparables
            </h2>
            <div className="space-y-3">
              {business.comparables.map((comp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 rounded-lg border"
                  style={{ borderColor: COLOR_BORDER }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold" style={{ color: COLOR_PRIMARY }}>{comp.description}</p>
                      <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>{comp.year}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black" style={{ color: COLOR_ACCENT }}>{comp.price}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Market Momentum */}
          <div className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '10' }}>
            <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
              <TrendingUp size={20} />
              Market Momentum
            </h3>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-3">
              {business.marketMomentum}
            </p>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} style={{ color: COLOR_ACCENT }} />
              <span className="font-bold" style={{ color: COLOR_PRIMARY }}>
                Trend: {business.trend === 'up' ? '📈 Upward' : business.trend === 'down' ? '📉 Downward' : '➡️ Flat'}
              </span>
            </div>
          </div>

          {/* Contact Section */}
          <div className="border-t pt-8" style={{ borderColor: COLOR_BORDER }}>
            <h2 className="text-2xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
              Interest in This Deal?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/auth/signup"
                className="p-6 rounded-lg border text-center font-bold transition-all hover:shadow-lg"
                style={{ borderColor: COLOR_ACCENT, background: COLOR_ACCENT + '10' }}
              >
                <Mail size={24} className="mx-auto mb-2" style={{ color: COLOR_ACCENT }} />
                <div>Email Seller</div>
                <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>Sign up required</p>
              </Link>
              <Link
                href="/auth/signup"
                className="p-6 rounded-lg border text-center font-bold transition-all hover:shadow-lg"
                style={{ borderColor: COLOR_ACCENT, background: COLOR_ACCENT + '10' }}
              >
                <MessageSquare size={24} className="mx-auto mb-2" style={{ color: COLOR_ACCENT }} />
                <div>Contact Broker</div>
                <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>Sign up required</p>
              </Link>
              <Link
                href="/auth/signup"
                className="p-6 rounded-lg border text-center font-bold transition-all hover:shadow-lg"
                style={{ borderColor: COLOR_ACCENT, background: COLOR_ACCENT + '10' }}
              >
                <Phone size={24} className="mx-auto mb-2" style={{ color: COLOR_ACCENT }} />
                <div>Schedule Call</div>
                <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>Sign up required</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t mt-8 py-8" style={{ borderColor: COLOR_BORDER }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-xl font-bold mb-3" style={{ color: COLOR_PRIMARY }}>Ready to Explore This Opportunity?</h3>
          <p className="mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
            As a signed-in user, you have full access to all deal intelligence, comparables, and direct contact options
          </p>
          <Link
            href="/marketplace"
            className="inline-block px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90"
            style={{ background: COLOR_ACCENT }}
          >
            Browse Similar Deals
          </Link>
        </div>
      </section>
    </div>
  )
}

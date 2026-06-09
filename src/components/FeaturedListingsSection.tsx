'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, MapPin, TrendingUp, DollarSign, Users, Star } from 'lucide-react'
import { useLocale } from '@/context/LocaleContext'
import { t } from '@/lib/translations'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

interface FeaturedBusiness {
  id: string
  name: string
  businessType: string
  location: string
  valuation: number
  revenue: number
  growthRate: number
  employees: number
  heroImage: string
  description: string
  highlights: string[]
  seller: {
    name: string
    company: string
  }
  broker?: {
    name: string
    company: string
  }
  translations?: {
    fr?: {
      name: string
      description: string
      highlights: string[]
    }
    ar?: {
      name: string
      description: string
      highlights: string[]
    }
  }
}

// Mock featured premium listings (in production, this comes from database)
const FEATURED_BUSINESSES: FeaturedBusiness[] = [
  {
    id: 'featured-1',
    name: 'TechFlow SaaS',
    businessType: 'SaaS Platform - Project Management',
    location: 'San Francisco, CA',
    valuation: 2500000,
    revenue: 850000,
    growthRate: 45,
    employees: 12,
    heroImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    description: 'Rapidly growing SaaS platform with 45% YoY growth and strong product-market fit',
    highlights: [
      '45% YoY growth trajectory',
      '$850K annual recurring revenue',
      '187 enterprise customers',
      '92% AI-predicted success probability',
    ],
    seller: {
      name: 'Alex Johnson',
      company: 'TechFlow Inc',
    },
    broker: {
      name: 'Sarah Chen',
      company: 'Tech M&A Partners',
    },
    translations: {
      fr: {
        name: 'TechFlow SaaS',
        description: 'Plateforme SaaS en croissance rapide avec 45% de croissance annuelle et un excellent product-market fit',
        highlights: [
          'Trajectoire de croissance de 45% annuels',
          '850K$ de revenu annuel récurrent',
          '187 clients enterprise',
          '92% de probabilité de succès prédite par IA',
        ],
      },
      ar: {
        name: 'تكنولوج فلو SaaS',
        description: 'منصة SaaS سريعة النمو بنمو سنوي بنسبة 45% وملاءمة قوية في السوق',
        highlights: [
          'مسار نمو 45% سنوياً',
          '850 كيلو دولار من الإيرادات المتكررة السنوية',
          '187 عميل للمؤسسات',
          '92% احتمالية نجاح متنبأ بها من الذكاء الاصطناعي',
        ],
      },
    },
  },
  {
    id: 'featured-2',
    name: 'CloudFirst Analytics',
    businessType: 'Analytics Platform - Business Intelligence',
    location: 'Toronto, ON',
    valuation: 5800000,
    revenue: 1900000,
    growthRate: 62,
    employees: 18,
    heroImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop',
    description: 'Leading business intelligence platform with exceptional growth and unit economics',
    highlights: [
      '62% YoY growth - fastest growing in sector',
      '$1.9M annual recurring revenue',
      '342 paying customers',
      '98% customer retention rate',
    ],
    seller: {
      name: 'Michael Torres',
      company: 'CloudFirst Holdings',
    },
    broker: {
      name: 'James Wilson',
      company: 'Canadian Tech Advisors',
    },
    translations: {
      fr: {
        name: 'CloudFirst Analytics',
        description: 'Plateforme d\'intelligence commerciale leader avec une croissance exceptionnelle et des économies unitaires solides',
        highlights: [
          'Croissance de 62% annuels - la plus rapide du secteur',
          '1,9M$ de revenu annuel récurrent',
          '342 clients payants',
          'Taux de rétention clientèle de 98%',
        ],
      },
      ar: {
        name: 'كلاود فيرست أناليتيكس',
        description: 'منصة ذكاء أعمال رائدة بنمو استثنائي واقتصاديات وحدة قوية',
        highlights: [
          'نمو 62% سنوياً - الأسرع نمواً في القطاع',
          '1.9 مليون دولار من الإيرادات المتكررة السنوية',
          '342 عميل دافع',
          'معدل احتفاظ العملاء 98%',
        ],
      },
    },
  },
  {
    id: 'featured-3',
    name: 'Emirates Franchise Network',
    businessType: 'Franchise Network - Operations',
    location: 'Dubai, UAE',
    valuation: 12000000,
    revenue: 3200000,
    growthRate: 28,
    employees: 35,
    heroImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    description: 'Leading franchise management platform in Middle East with 450+ franchise locations',
    highlights: [
      '450+ franchise network across GCC',
      '$3.2M annual revenue',
      'Strong regional brand recognition',
      'Expansion opportunities in Saudi Arabia',
    ],
    seller: {
      name: 'Fatima Al Mazrouei',
      company: 'Emirates Holdings',
    },
    broker: {
      name: 'Ahmed Al Mansoori',
      company: 'Gulf M&A Advisors',
    },
    translations: {
      fr: {
        name: 'Réseau de Franchises Emirates',
        description: 'Plateforme leader de gestion de franchises au Moyen-Orient avec plus de 450 emplacements de franchises',
        highlights: [
          '450+ réseau de franchises dans le CCG',
          '3,2M$ de revenus annuels',
          'Forte reconnaissance de marque régionale',
          'Opportunités d\'expansion en Arabie Saoudite',
        ],
      },
      ar: {
        name: 'شبكة الإمارات للامتيازات',
        description: 'منصة إدارة امتيازات رائدة في الشرق الأوسط مع أكثر من 450 موقع امتياز',
        highlights: [
          '450+ شبكة امتيازات في دول مجلس التعاون الخليجي',
          '3.2 مليون دولار إيرادات سنوية',
          'اعتراف قوي بالعلامة التجارية الإقليمية',
          'فرص التوسع في المملكة العربية السعودية',
        ],
      },
    },
  },
]

export function FeaturedListingsSection() {
  const { locale, isRTL } = useLocale()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FEATURED_BUSINESSES.length)
    }, 8000) // Rotate every 8 seconds

    return () => clearInterval(interval)
  }, [autoplay])

  const currentBusiness = FEATURED_BUSINESSES[currentIndex]

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % FEATURED_BUSINESSES.length)
    setAutoplay(false)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + FEATURED_BUSINESSES.length) % FEATURED_BUSINESSES.length)
    setAutoplay(false)
  }

  const formatCurrency = (value: number) => {
    return `$${(value / 1000000).toFixed(1)}M`
  }

  // Get translated business data based on current locale
  const getBusinessData = (business: FeaturedBusiness) => {
    if (locale === 'en' || !business.translations) {
      return {
        name: business.name,
        description: business.description,
        highlights: business.highlights,
      }
    }

    const translation = business.translations[locale as keyof typeof business.translations]
    if (translation) {
      return {
        name: translation.name,
        description: translation.description,
        highlights: translation.highlights,
      }
    }

    // Fallback to English
    return {
      name: business.name,
      description: business.description,
      highlights: business.highlights,
    }
  }

  return (
    <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 border-t" style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Star size={20} style={{ color: COLOR_ACCENT }} fill={COLOR_ACCENT} />
            <span className="text-sm font-bold uppercase" style={{ color: COLOR_ACCENT }}>
              {t('featured.label', locale)}
            </span>
          </div>
          <h2 className="text-4xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
            {t('featured.title', locale)}
          </h2>
          <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-lg max-w-2xl mx-auto">
            {t('featured.subtitle', locale)}
          </p>
        </div>

        {/* Featured Carousel */}
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: COLOR_BORDER }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBusiness.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="h-64 lg:h-auto min-h-[400px] lg:min-h-[500px] bg-gray-200 relative overflow-hidden"
              >
                <img
                  src={currentBusiness.heroImage}
                  alt={currentBusiness.name}
                  className="w-full h-full object-cover"
                />
                {/* Overlay Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className="px-4 py-2 rounded-full text-sm font-bold text-white"
                    style={{ background: COLOR_ACCENT }}
                  >
                    ⭐ Premium Featured
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Content Section */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentBusiness.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="p-6 lg:p-8 flex flex-col justify-between min-h-[400px] lg:min-h-[500px]"
              >
                {/* Business Info */}
                <div>
                  <span
                    className="text-xs font-bold uppercase tracking-wide"
                    style={{ color: COLOR_ACCENT }}
                  >
                    {currentBusiness.businessType}
                  </span>
                  <h3 className="text-2xl font-black mt-1 mb-1" style={{ color: COLOR_PRIMARY }}>
                    {getBusinessData(currentBusiness).name}
                  </h3>

                  <div className="flex items-center gap-1 mb-2">
                    <MapPin size={14} style={{ color: COLOR_TEXT_SECONDARY }} />
                    <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs">
                      {currentBusiness.location}
                    </span>
                  </div>

                  <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-4 leading-relaxed text-sm">
                    {getBusinessData(currentBusiness).description}
                  </p>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}>
                      <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs font-bold mb-1">
                        {t('featured.valuation', locale)}
                      </p>
                      <p className="text-lg font-black" style={{ color: COLOR_PRIMARY }}>
                        {formatCurrency(currentBusiness.valuation)}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}>
                      <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs font-bold mb-1">
                        {t('featured.revenue', locale)}
                      </p>
                      <p className="text-lg font-black" style={{ color: COLOR_PRIMARY }}>
                        {formatCurrency(currentBusiness.revenue)}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}>
                      <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs font-bold mb-1">
                        {t('featured.growth', locale)}
                      </p>
                      <p className="text-lg font-black" style={{ color: '#10B981' }}>
                        {currentBusiness.growthRate}%
                      </p>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}>
                      <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs font-bold mb-1">
                        {t('featured.team', locale)}
                      </p>
                      <p className="text-lg font-black" style={{ color: COLOR_PRIMARY }}>
                        {currentBusiness.employees}
                      </p>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-3">
                    {getBusinessData(currentBusiness).highlights.slice(0, 3).map((highlight, idx) => (
                      <div key={idx} className="flex gap-2 mb-1 text-xs">
                        <span style={{ color: COLOR_ACCENT }}>✓</span>
                        <span style={{ color: COLOR_TEXT_SECONDARY }}>{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* Broker Info */}
                  {currentBusiness.broker && (
                    <div
                      className="p-3 rounded-lg border mb-4"
                      style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '05' }}
                    >
                      <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs font-bold mb-1">
                        {t('featured.managedBy', locale)}
                      </p>
                      <p style={{ color: COLOR_PRIMARY }} className="font-bold text-sm">
                        {currentBusiness.broker.name}
                      </p>
                      <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs">
                        {currentBusiness.broker.company}
                      </p>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <Link
                  href={`/deal/${currentBusiness.id}`}
                  className="w-full px-6 py-3 rounded-lg font-bold text-white hover:opacity-90 transition-all text-center flex items-center justify-center gap-2 text-sm"
                  style={{ background: COLOR_ACCENT }}
                >
                  {t('featured.viewFull', locale)}
                  <ChevronRight size={18} />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between p-3 border-t" style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-1.5 rounded-lg border hover:bg-gray-100 transition-colors text-sm"
                style={{ borderColor: COLOR_BORDER }}
              >
                ←
              </button>
              <div className="flex gap-2">
                {FEATURED_BUSINESSES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx)
                      setAutoplay(false)
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentIndex ? 'w-8' : ''
                    }`}
                    style={{
                      background: idx === currentIndex ? COLOR_ACCENT : COLOR_BORDER,
                    }}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                className="p-1.5 rounded-lg border hover:bg-gray-100 transition-colors text-sm"
                style={{ borderColor: COLOR_BORDER }}
              >
                →
              </button>
            </div>

            <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs font-semibold">
              {currentIndex + 1} / {FEATURED_BUSINESSES.length}
            </span>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
            <div className="text-2xl font-black mb-1" style={{ color: COLOR_ACCENT }}>
              ✓
            </div>
            <h4 className="font-bold mb-1 text-sm" style={{ color: COLOR_PRIMARY }}>
              {t('featured.verified', locale)}
            </h4>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs">
              {t('featured.verifiedDesc', locale)}
            </p>
          </div>

          <div className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
            <div className="text-2xl font-black mb-1" style={{ color: COLOR_ACCENT }}>
              🎯
            </div>
            <h4 className="font-bold mb-1 text-sm" style={{ color: COLOR_PRIMARY }}>
              {t('featured.curation', locale)}
            </h4>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs">
              {t('featured.curationDesc', locale)}
            </p>
          </div>

          <div className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
            <div className="text-2xl font-black mb-1" style={{ color: COLOR_ACCENT }}>
              📊
            </div>
            <h4 className="font-bold mb-1 text-sm" style={{ color: COLOR_PRIMARY }}>
              {t('featured.fullIntelligence', locale)}
            </h4>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs">
              {t('featured.fullIntelligenceDesc', locale)}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-6">
          <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-4 text-sm">
            {t('featured.readyToList', locale)}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/signup-seller"
              className="inline-block px-8 py-3 rounded-lg font-bold text-white hover:opacity-90 transition-all text-sm"
              style={{ background: COLOR_ACCENT }}
            >
              {t('cta.listBusiness', locale)}
            </Link>
            <Link
              href="/pricing"
              className="inline-block px-6 py-3 rounded-lg font-bold border hover:bg-gray-50 transition-all text-sm"
              style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}
            >
              {t('featured.premiumBenefits', locale)}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

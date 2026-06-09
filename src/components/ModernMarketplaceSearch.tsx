'use client'

import { useState } from 'react'
import { useLocale } from '@/context/LocaleContext'
import { useTranslation } from '@/hooks/useTranslation'
import {
  Search,
  ChevronDown,
  Zap,
  Building2,
  MapPin,
  Users,
  TrendingUp,
  Target,
  DollarSign,
  Flame,
  CheckCircle2,
} from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'
import { motion, AnimatePresence } from 'framer-motion'

interface SearchFilters {
  query: string
  industry: string[]
  valuation: [number, number]
  revenue: [number, number]
  ebitda: [number, number]
  location: string[]
  growth: [number, number]
  sellerType: string[]
  sellerMotivation: string[]
  heatScore: [number, number]
  successProbability: [number, number]
  sort: string
}

interface ModernMarketplaceSearchProps {
  onFilterChange?: (filters: SearchFilters) => void
  onSortChange?: (sort: string) => void
  dealCount?: number
}

// Note: Filter labels are dynamically translated using the t() function in the component render
const filterCategoriesConfig = [
  {
    id: 'industry',
    labelKey: 'marketplace.industry',
    icon: Building2,
    color: '#3B82F6',
    options: ['SaaS / Software', 'Healthcare / Medical', 'Food & Beverage', 'Logistics / Transportation', 'Real Estate'],
  },
  {
    id: 'location',
    labelKey: 'marketplace.location',
    icon: MapPin,
    color: '#EF4444',
    options: ['United States', 'Canada', 'United Arab Emirates', 'Europe', 'Asia'],
  },
  {
    id: 'sellerType',
    labelKey: 'marketplace.sellerType',
    icon: Users,
    color: '#8B5CF6',
    options: ['Founder-Owned', 'Family-Owned', 'PE/Financial', 'Corporate Divest'],
  },
  {
    id: 'sellerMotivation',
    labelKey: 'marketplace.sellerMotivation',
    icon: Target,
    color: '#F59E0B',
    options: ['Retirement / Exit', 'Growth Capital', 'Portfolio Optimization', 'Succession Planning'],
  },
]

const rangeFiltersConfig = [
  {
    id: 'valuation',
    labelKey: 'marketplace.valuation',
    icon: DollarSign,
    color: '#10B981',
    min: 100000,
    max: 100000000,
    step: 1000000,
    format: (val: number) => `$${(val / 1000000).toFixed(1)}M`,
  },
  {
    id: 'revenue',
    labelKey: 'marketplace.annualRevenue',
    icon: TrendingUp,
    color: '#06B6D4',
    min: 100000,
    max: 50000000,
    step: 500000,
    format: (val: number) => `$${(val / 1000).toFixed(0)}K`,
  },
  {
    id: 'heatScore',
    labelKey: 'marketplace.dealHeatScore',
    icon: Flame,
    color: '#FF6B35',
    min: 0,
    max: 100,
    step: 5,
    format: (val: number) => `${val}°`,
  },
  {
    id: 'successProbability',
    labelKey: 'marketplace.successProbability',
    icon: CheckCircle2,
    color: '#10B981',
    min: 0,
    max: 100,
    step: 5,
    format: (val: number) => `${val}%`,
  },
]

export function ModernMarketplaceSearch({
  onFilterChange,
  onSortChange,
  dealCount = 47,
}: ModernMarketplaceSearchProps) {
  const { locale, isRTL } = useLocale()
  const t = useTranslation()

  // Create filter labels dynamically with translations
  const filterCategories = filterCategoriesConfig.map((cat) => ({
    ...cat,
    label: t(cat.labelKey),
  }))

  const rangeFilters = rangeFiltersConfig.map((filter) => ({
    ...filter,
    label: t(filter.labelKey),
  }))
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    industry: [],
    valuation: [100000, 100000000],
    revenue: [100000, 50000000],
    ebitda: [5, 80],
    location: [],
    growth: [-20, 100],
    sellerType: [],
    sellerMotivation: [],
    heatScore: [0, 100],
    successProbability: [0, 100],
    sort: 'relevance',
  })

  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const handleCategoryToggle = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
  }

  const handleCheckboxChange = (categoryId: string, value: string) => {
    setFilters((prev) => {
      const fieldKey = categoryId as keyof SearchFilters
      const current = (prev[fieldKey] || []) as string[]
      const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
      const newFilters = { ...prev, [categoryId]: updated }
      onFilterChange?.(newFilters)
      return newFilters
    })
  }

  const handleRangeChange = (categoryId: string, index: 0 | 1, value: number) => {
    setFilters((prev) => {
      const fieldKey = categoryId as keyof SearchFilters
      const current = (prev[fieldKey] as [number, number]) || [0, 100]
      const updated = index === 0 ? [Math.min(value, current[1]), current[1]] : [current[0], Math.max(value, current[0])]
      const newFilters = { ...prev, [categoryId]: updated as [number, number] }
      onFilterChange?.(newFilters)
      return newFilters
    })
  }

  const handleSearchChange = (value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev, query: value }
      onFilterChange?.(newFilters)
      return newFilters
    })
  }

  const activeFilterCount = Object.values(filters).filter(
    (v) => Array.isArray(v) ? v.length > 0 : v !== ''
  ).length - 1

  const clearAllFilters = () => {
    const cleared: SearchFilters = {
      query: '',
      industry: [],
      valuation: [100000, 100000000],
      revenue: [100000, 50000000],
      ebitda: [5, 80],
      location: [],
      growth: [-20, 100],
      sellerType: [],
      sellerMotivation: [],
      heatScore: [0, 100],
      successProbability: [0, 100],
      sort: 'relevance',
    }
    setFilters(cleared)
    onFilterChange?.(cleared)
  }

  return (
    <div className="space-y-4" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Search Bar */}
      <div className="relative">
        <Search
          size={20}
          style={{
            color: COLOR_TEXT_SECONDARY,
            position: 'absolute',
            left: isRTL ? 'auto' : '12px',
            right: isRTL ? '12px' : 'auto',
            top: '12px',
          }}
        />
        <input
          type="text"
          placeholder={t('marketplace.searchPlaceholder')}
          value={filters.query}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
          style={{
            borderColor: COLOR_BORDER,
            paddingLeft: isRTL ? '16px' : '40px',
            paddingRight: isRTL ? '40px' : '16px',
          }}
        />
      </div>

      {/* Sort Dropdown */}
      <select
        value={filters.sort}
        onChange={(e) => {
          setFilters((prev) => ({ ...prev, sort: e.target.value }))
          onSortChange?.(e.target.value)
        }}
        className="w-full px-3 py-2.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2"
        style={{
          borderColor: COLOR_BORDER,
          color: COLOR_PRIMARY,
        }}
      >
        <option value="relevance">{t('marketplace.mostRelevant')}</option>
        <option value="heat-score">Hottest Deals</option>
        <option value="success">Best Success Rate</option>
        <option value="valuation-high">Highest Valuation</option>
        <option value="recent">Recently Added</option>
      </select>

      {/* Active Filters Info */}
      {activeFilterCount > 0 && (
        <div className="p-3 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '10' }}>
          <div className="flex items-center justify-between">
            <span style={{ color: COLOR_ACCENT }} className="text-sm font-semibold">
              {activeFilterCount} {t('marketplace.activeFilters')}
            </span>
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold hover:opacity-75 transition-opacity"
              style={{ color: COLOR_ACCENT }}
            >
              {t('marketplace.clearAll')}
            </button>
          </div>
        </div>
      )}

      {/* Multi-Select Filters */}
      <div className="space-y-2">
        {filterCategories.map((category) => {
          const isExpanded = expandedCategory === category.id
          const Icon = category.icon
          const selectedCount = (filters[category.id as keyof SearchFilters] as string[])?.length || 0

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg border overflow-hidden"
              style={{ borderColor: COLOR_BORDER }}
            >
              {/* Category Header */}
              <button
                onClick={() => handleCategoryToggle(category.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                style={{ background: isExpanded ? COLOR_ACCENT + '05' : 'white' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: category.color + '20' }}
                  >
                    <Icon size={18} style={{ color: category.color }} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>
                      {category.label}
                    </p>
                    {selectedCount > 0 && (
                      <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {selectedCount} selected
                      </p>
                    )}
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={18} style={{ color: COLOR_TEXT_SECONDARY }} />
                </motion.div>
              </button>

              {/* Category Options */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t overflow-hidden"
                    style={{ borderColor: COLOR_BORDER }}
                  >
                    <div className="p-4 space-y-3" style={{ background: COLOR_ACCENT + '02' }}>
                      {category.options.map((option) => (
                        <label key={option} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={(filters[category.id as keyof SearchFilters] as string[])?.includes(option) || false}
                            onChange={() => handleCheckboxChange(category.id, option)}
                            className="w-5 h-5 rounded accent-blue-500 cursor-pointer"
                          />
                          <span
                            className="text-sm font-medium group-hover:opacity-75 transition-opacity"
                            style={{ color: COLOR_PRIMARY }}
                          >
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Range Filters */}
      <div className="space-y-3 pt-2">
        <p className="text-xs font-bold uppercase tracking-wide px-1" style={{ color: COLOR_PRIMARY }}>
          Value Ranges
        </p>
        {rangeFilters.map((filter) => {
          const Icon = filter.icon
          const [min, max] = (filters[filter.id as keyof SearchFilters] as [number, number]) || [filter.min, filter.max]

          return (
            <motion.div
              key={filter.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-lg border"
              style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '02' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: filter.color + '20' }}
                >
                  <Icon size={16} style={{ color: filter.color }} />
                </div>
                <h4 className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>
                  {filter.label}
                </h4>
              </div>

              {/* Range Sliders */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Min: {filter.format(min)}
                  </label>
                  <input
                    type="range"
                    min={filter.min}
                    max={filter.max}
                    step={filter.step}
                    value={min}
                    onChange={(e) => handleRangeChange(filter.id as any, 0, Number(e.target.value))}
                    className="w-full mt-2 accent-blue-500 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Max: {filter.format(max)}
                  </label>
                  <input
                    type="range"
                    min={filter.min}
                    max={filter.max}
                    step={filter.step}
                    value={max}
                    onChange={(e) => handleRangeChange(filter.id as any, 1, Number(e.target.value))}
                    className="w-full mt-2 accent-blue-500 cursor-pointer"
                  />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Results Info */}
      <div className="text-center py-2">
        <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm font-medium">
          {dealCount} verified deals
        </span>
      </div>
    </div>
  )
}

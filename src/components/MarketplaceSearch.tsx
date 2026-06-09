'use client'

import { useState, useCallback } from 'react'
import { useLocale } from '@/context/LocaleContext'
import { t } from '@/lib/translations'
import {
  filterCategories,
  sortOptions,
  type SavedSearch,
} from '@/lib/marketplace-filters'
import { Search, Filter, ChevronDown, Save, Sliders } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

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

interface MarketplaceSearchProps {
  onFilterChange?: (filters: SearchFilters) => void
  onSortChange?: (sort: string) => void
  dealCount?: number
}

export function MarketplaceSearch({
  onFilterChange,
  onSortChange,
  dealCount = 47,
}: MarketplaceSearchProps) {
  const { locale, isRTL } = useLocale()
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

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [showSavedSearches, setShowSavedSearches] = useState(false)

  const handleFilterChange = useCallback(
    (newFilters: Partial<SearchFilters>) => {
      const updated = { ...filters, ...newFilters }
      setFilters(updated)
      onFilterChange?.(updated)
    },
    [filters, onFilterChange]
  )

  const handleSortChange = (newSort: string) => {
    handleFilterChange({ sort: newSort })
    onSortChange?.(newSort)
  }

  const saveSearch = useCallback(() => {
    const saved: SavedSearch = {
      id: `search_${Date.now()}`,
      name: `Saved Search - ${new Date().toLocaleDateString()}`,
      filters,
      sort: filters.sort,
      alertsEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setSavedSearches([...savedSearches, saved])
  }, [filters, savedSearches])

  const activeFilterCount = Object.values(filters).filter(
    (v) => Array.isArray(v) ? v.length > 0 : v !== ''
  ).length - 1 // Subtract 1 for sort field

  return (
    <div className="space-y-4" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
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
            placeholder="Search by company, industry, or keyword..."
            value={filters.query}
            onChange={(e) => handleFilterChange({ query: e.target.value })}
            className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
            style={{
              borderColor: COLOR_BORDER,
              paddingLeft: isRTL ? '16px' : '40px',
              paddingRight: isRTL ? '40px' : '16px',
            }}
          />
        </div>

        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg border font-semibold transition-all ${
            activeFilterCount > 0 ? 'text-white' : ''
          }`}
          style={{
            borderColor: COLOR_BORDER,
            background: activeFilterCount > 0 ? COLOR_ACCENT : 'transparent',
            color: activeFilterCount > 0 ? 'white' : COLOR_PRIMARY,
          }}
        >
          <Sliders size={18} />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 px-2 py-1 rounded-full text-xs bg-white/20">
              {activeFilterCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setShowSavedSearches(!showSavedSearches)}
          className="flex items-center gap-2 px-4 py-3 rounded-lg border font-semibold hover:bg-gray-50 transition-colors"
          style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
        >
          <Save size={18} />
          Save
        </button>
      </div>

      {/* Sort & View Controls */}
      <div className={`flex gap-3 items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
        <select
          value={filters.sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm focus:outline-none"
          style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
        >
          {sortOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="flex-1"></div>

        <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm font-semibold">
          Showing {dealCount} deals
        </span>
      </div>

      {/* Expandable Filter Panel */}
      {isFilterOpen && (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-lg border"
          style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}
        >
          {filterCategories.map((category) => (
            <div key={category.id}>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: COLOR_PRIMARY }}
              >
                {category.icon} {category.label}
              </label>

              {category.type === 'multi-select' && category.options && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {category.options.map((option) => (
                    <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={
                          (filters[category.id as keyof SearchFilters] as string[])?.includes?.(String(option.value)) || false
                        }
                        onChange={(e) => {
                          const field = (filters[category.id as keyof SearchFilters] || []) as string[]
                          const updated = e.target.checked
                            ? [...field, String(option.value)]
                            : field.filter((v) => v !== String(option.value))
                          handleFilterChange({
                            [category.id]: updated,
                          } as any)
                        }}
                        className="w-4 h-4 rounded"
                      />
                      <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                        {option.label}
                      </span>
                      {option.count && (
                        <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs ml-auto">
                          ({option.count})
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              )}

              {category.type === 'range' && (
                <div className="space-y-2">
                  <input
                    type="range"
                    min={category.min}
                    max={category.max}
                    step={category.step}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                    <span>
                      {category.min?.toLocaleString()} {category.unit}
                    </span>
                    <span>
                      {category.max?.toLocaleString()} {category.unit}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Results Info */}
      <div className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
        {activeFilterCount > 0 && (
          <p>
            Showing {dealCount} deals matching your criteria.{' '}
            <button
              onClick={() => setFilters({
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
              })}
              className="underline font-semibold hover:opacity-75"
              style={{ color: COLOR_ACCENT }}
            >
              Clear filters
            </button>
          </p>
        )}
      </div>
    </div>
  )
}

// Comparison Tool
export function DealComparison({ selectedDeals }: { selectedDeals: any[] }) {
  const { isRTL } = useLocale()

  return (
    <div
      className="overflow-x-auto rounded-lg border"
      style={{ borderColor: COLOR_BORDER }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: COLOR_PRIMARY + '02', borderBottom: `1px solid ${COLOR_BORDER}` }}>
            <th className="p-3 text-left font-semibold" style={{ color: COLOR_PRIMARY }}>
              Metric
            </th>
            {selectedDeals.map((deal) => (
              <th key={deal.id} className="p-3 text-left font-semibold" style={{ color: COLOR_PRIMARY }}>
                {deal.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {['valuation', 'revenue', 'ebitda', 'ebitda-margin', 'growth-rate'].map((metric) => (
            <tr key={metric} style={{ borderBottom: `1px solid ${COLOR_BORDER}` }}>
              <td className="p-3 font-semibold" style={{ color: COLOR_PRIMARY }}>
                {metric.charAt(0).toUpperCase() + metric.slice(1).replace(/-/g, ' ')}
              </td>
              {selectedDeals.map((deal) => (
                <td key={deal.id} className="p-3" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {deal[metric] || '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

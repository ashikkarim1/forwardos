'use client'

import { useState, useCallback } from 'react'
import { useLocale } from '@/context/LocaleContext'
import {
  filterCategories,
  sortOptions,
  type SavedSearch,
} from '@/lib/marketplace-filters'
import { Search, Filter, ChevronDown, Save, Sliders, X } from 'lucide-react'
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
  ).length - 1

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
            placeholder="Search by company, industry..."
            value={filters.query}
            onChange={(e) => handleFilterChange({ query: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
            style={{
              borderColor: COLOR_BORDER,
              paddingLeft: isRTL ? '16px' : '40px',
              paddingRight: isRTL ? '40px' : '16px',
            }}
          />
        </div>

        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeFilterCount > 0 ? 'text-white' : ''
          }`}
          style={{
            borderColor: COLOR_BORDER,
            background: activeFilterCount > 0 ? COLOR_ACCENT : 'white',
            color: activeFilterCount > 0 ? 'white' : COLOR_PRIMARY,
            border: activeFilterCount === 0 ? `1px solid ${COLOR_BORDER}` : 'none',
          }}
        >
          <Sliders size={18} />
          Filters
          {activeFilterCount > 0 && (
            <span className="px-2 py-1 rounded-full text-xs bg-white/20 font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        <button
          onClick={saveSearch}
          className="flex items-center gap-2 px-4 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border"
          style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
        >
          <Save size={18} />
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
          {dealCount} deals found
        </span>
      </div>

      {/* Expandable Filter Panel */}
      {isFilterOpen && (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 rounded-lg border"
          style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}
        >
          {filterCategories.map((category) => (
            <div key={category.id} className="space-y-3">
              <label
                className="block text-sm font-bold"
                style={{ color: COLOR_PRIMARY }}
              >
                {category.icon} {category.label}
              </label>

              {category.type === 'multi-select' && category.options && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {category.options.map((option) => (
                    <label key={option.id} className="flex items-center gap-2 cursor-pointer hover:opacity-80">
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
                        className="w-4 h-4 rounded accent-blue-500"
                      />
                      <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                        {option.label}
                      </span>
                      {option.count && (
                        <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs ml-auto opacity-60">
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
                    className="w-full accent-blue-500"
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

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <div className="md:col-span-2 lg:col-span-3 pt-4 border-t" style={{ borderColor: COLOR_BORDER }}>
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
                className="text-sm font-semibold hover:opacity-75"
                style={{ color: COLOR_ACCENT }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results Info */}
      {activeFilterCount > 0 && (
        <div className="text-sm p-3 rounded-lg" style={{ background: COLOR_ACCENT + '10', color: COLOR_TEXT_SECONDARY }}>
          Showing {dealCount} deals matching your criteria
        </div>
      )}
    </div>
  )
}

// Comparison Tool
export function DealComparison({ selectedDeals }: { selectedDeals: any[] }) {
  const { isRTL } = useLocale()

  if (!selectedDeals || selectedDeals.length === 0) {
    return <div style={{ color: COLOR_TEXT_SECONDARY }}>No deals selected for comparison</div>
  }

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
          {['valuation', 'revenue', 'ebitdaMargin', 'growthRate', 'successProbability', 'heatScore', 'maaProbability', 'riskScore'].map((metric) => (
            <tr key={metric} style={{ borderBottom: `1px solid ${COLOR_BORDER}` }}>
              <td className="p-3 font-semibold" style={{ color: COLOR_PRIMARY }}>
                {metric.replace(/([A-Z])/g, ' $1').trim()}
              </td>
              {selectedDeals.map((deal) => (
                <td key={deal.id} className="p-3" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {metric === 'valuation' || metric === 'revenue' ? `$${(deal[metric] / 1000000).toFixed(2)}M` : `${deal[metric]}${['Margin', 'growthRate', 'successProbability', 'maaProbability', 'riskScore'].includes(metric) ? '%' : ''}`}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

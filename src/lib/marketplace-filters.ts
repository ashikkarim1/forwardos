// Marketplace filter configuration - World-class search for bankers & traditional buyers

export interface FilterOption {
  id: string
  label: string
  value: string | number
  count?: number
}

export interface FilterCategory {
  id: string
  label: string
  type: 'checkbox' | 'range' | 'select' | 'multi-select'
  options?: FilterOption[]
  min?: number
  max?: number
  step?: number
  unit?: string
  icon?: string
}

// Available filter categories
export const filterCategories: FilterCategory[] = [
  {
    id: 'franchiseType',
    label: 'Franchise Type',
    type: 'multi-select',
    icon: '🏢',
    options: [
      { id: 'franchise-new', label: 'New Franchise Opportunity', value: 'franchise-new', count: 18 },
      { id: 'franchise-existing', label: 'Existing Franchise (Buy-In)', value: 'franchise-existing', count: 12 },
      { id: 'non-franchise', label: 'Independent Business', value: 'non-franchise', count: 17 },
    ],
  },
  {
    id: 'industry',
    label: 'Industry',
    type: 'multi-select',
    icon: '🏭',
    options: [
      { id: 'saas', label: 'SaaS / Software', value: 'saas', count: 12 },
      { id: 'ecommerce', label: 'E-Commerce', value: 'ecommerce', count: 8 },
      { id: 'healthcare', label: 'Healthcare / Medical', value: 'healthcare', count: 6 },
      { id: 'restaurant', label: 'Food & Beverage', value: 'restaurant', count: 5 },
      { id: 'logistics', label: 'Logistics / Transportation', value: 'logistics', count: 4 },
      { id: 'real-estate', label: 'Real Estate', value: 'real-estate', count: 3 },
      { id: 'manufacturing', label: 'Manufacturing', value: 'manufacturing', count: 3 },
      { id: 'services', label: 'Professional Services', value: 'services', count: 4 },
      { id: 'other', label: 'Other', value: 'other', count: 2 },
    ],
  },
  {
    id: 'valuation',
    label: 'Valuation Range',
    type: 'range',
    icon: '💰',
    min: 100000,
    max: 100000000,
    step: 100000,
    unit: 'USD',
  },
  {
    id: 'revenue',
    label: 'Annual Revenue',
    type: 'range',
    icon: '📈',
    min: 100000,
    max: 50000000,
    step: 100000,
    unit: 'USD',
  },
  {
    id: 'ebitda',
    label: 'EBITDA Margin',
    type: 'range',
    icon: '📊',
    min: 5,
    max: 80,
    step: 5,
    unit: '%',
  },
  {
    id: 'location',
    label: 'Location',
    type: 'multi-select',
    icon: '📍',
    options: [
      { id: 'us', label: 'United States', value: 'us', count: 15 },
      { id: 'canada', label: 'Canada', value: 'canada', count: 8 },
      { id: 'uae', label: 'United Arab Emirates', value: 'uae', count: 12 },
      { id: 'europe', label: 'Europe', value: 'europe', count: 5 },
      { id: 'asia', label: 'Asia', value: 'asia', count: 3 },
    ],
  },
  {
    id: 'growth',
    label: 'Growth Rate',
    type: 'range',
    icon: '📈',
    min: -20,
    max: 100,
    step: 5,
    unit: '% YoY',
  },
  {
    id: 'seller-type',
    label: 'Seller Type',
    type: 'multi-select',
    icon: '👤',
    options: [
      { id: 'founder', label: 'Founder-Owned', value: 'founder', count: 18 },
      { id: 'family', label: 'Family-Owned', value: 'family', count: 12 },
      { id: 'pe', label: 'PE/Financial Buyer', value: 'pe', count: 8 },
      { id: 'corporate', label: 'Corporate Divest', value: 'corporate', count: 4 },
    ],
  },
  {
    id: 'seller-motivation',
    label: 'Seller Motivation',
    type: 'multi-select',
    icon: '💡',
    options: [
      { id: 'retirement', label: 'Retirement / Exit', value: 'retirement', count: 16 },
      { id: 'growth-capital', label: 'Growth Capital Needed', value: 'growth-capital', count: 8 },
      { id: 'portfolio', label: 'Portfolio Optimization', value: 'portfolio', count: 6 },
      { id: 'succession', label: 'Succession Planning', value: 'succession', count: 5 },
      { id: 'distressed', label: 'Distressed / Urgent', value: 'distressed', count: 2 },
    ],
  },
  {
    id: 'heat-score',
    label: 'Deal Heat Score',
    type: 'range',
    icon: '🔥',
    min: 0,
    max: 100,
    step: 5,
    unit: '/100',
  },
  {
    id: 'success-probability',
    label: 'Success Probability',
    type: 'range',
    icon: '✅',
    min: 0,
    max: 100,
    step: 5,
    unit: '%',
  },
]

// Sorting options
export const sortOptions = [
  { id: 'relevance', label: 'Most Relevant' },
  { id: 'heat-score', label: 'Hottest Deals' },
  { id: 'success-probability', label: 'Best Success Rate' },
  { id: 'valuation-high', label: 'Highest Valuation' },
  { id: 'valuation-low', label: 'Lowest Valuation' },
  { id: 'recent', label: 'Recently Added' },
  { id: 'revenue-high', label: 'Highest Revenue' },
  { id: 'margin-high', label: 'Highest EBITDA Margin' },
  { id: 'growth-high', label: 'Fastest Growth' },
]

// Saved search configuration
export interface SavedSearch {
  id: string
  name: string
  filters: Record<string, any>
  sort: string
  alertsEnabled: boolean
  createdAt: Date
  updatedAt: Date
}

// Deal comparison configuration
export interface ComparisonField {
  id: string
  label: string
  category: 'financial' | 'operational' | 'market' | 'owner'
  format: 'currency' | 'percentage' | 'number' | 'text'
}

export const comparisonFields: ComparisonField[] = [
  { id: 'valuation', label: 'Valuation', category: 'financial', format: 'currency' },
  { id: 'revenue', label: 'Annual Revenue', category: 'financial', format: 'currency' },
  { id: 'ebitda', label: 'EBITDA', category: 'financial', format: 'currency' },
  { id: 'ebitda-margin', label: 'EBITDA Margin', category: 'financial', format: 'percentage' },
  { id: 'growth-rate', label: 'Growth Rate (YoY)', category: 'operational', format: 'percentage' },
  { id: 'employees', label: 'Employee Count', category: 'operational', format: 'number' },
  { id: 'customer-count', label: 'Customer Count', category: 'operational', format: 'number' },
  { id: 'market-size', label: 'TAM', category: 'market', format: 'currency' },
  { id: 'location', label: 'Location', category: 'market', format: 'text' },
  { id: 'seller-type', label: 'Seller Type', category: 'owner', format: 'text' },
  { id: 'success-probability', label: 'Success Probability', category: 'market', format: 'percentage' },
  { id: 'heat-score', label: 'Heat Score', category: 'market', format: 'number' },
]

// Export format options
export const exportFormats = [
  { id: 'pdf', label: 'PDF Report', icon: '📄' },
  { id: 'excel', label: 'Excel Spreadsheet', icon: '📊' },
  { id: 'csv', label: 'CSV Data', icon: '📋' },
  { id: 'powerpoint', label: 'PowerPoint Deck', icon: '🎯' },
]

// Analytics for dashboard
export interface DealAnalytics {
  totalDeals: number
  avgValuation: number
  medianValuation: number
  avgEbitdaMargin: number
  avgSuccessProbability: number
  topIndustries: Array<{ industry: string; count: number }>
  topLocations: Array<{ location: string; count: number }>
}

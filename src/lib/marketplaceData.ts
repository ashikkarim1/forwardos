// Complete End-to-End Marketplace Data for 5 Featured Deals

export interface DealData {
  id: number
  name: string
  businessType: 'restaurant' | 'saas' | 'healthcare' | 'ecommerce' | 'industrial'
  category: string
  description: string
  image: string
  revenue: string
  ebitda: string
  ebitdaMargin: number
  valuation: string
  growth: number
  foundedYear: number
  team: number
  heatScore: number
  successProbability: number
  verified: boolean
  buyerInterest: number
  ownerMotivation: 'retiring' | 'growth' | 'portfolio_liquidation'
  location: string
  website: string
  comparables: ComparableData[]
  intelligence: IntelligenceData
  predictions: PredictionData
}

interface ComparableData {
  name: string
  revenue: string
  multiple: string
  matchScore: number
  location: string
  soldYear: number
}

interface IntelligenceData {
  heatScore: number
  buyerInterestCount: number
  marketMultiple: number
  sectorMomentum: number
  sectorAvgMargin: number
  confidenceLevel: number
  benchmarkGrade: string
}

interface PredictionData {
  successProbability: number
  optimalTiming: string
  fairValueLow: number
  fairValueHigh: number
  fairValueMid: number
  growthYear5: {
    revenue: number
    valuation: number
    irr: string
  }
  topBuyerType: string
  buyerMatchScore: number
}

export const allDeals: DealData[] = [
  // Deal 1: Prime Cut Steakhouse
  {
    id: 1,
    name: 'Prime Cut Steakhouse',
    businessType: 'restaurant',
    category: 'F&B',
    description: 'Award-winning steakhouse with 20yr track record. Premium location downtown metro area.',
    image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&h=400&fit=crop',
    revenue: '$4.2M',
    ebitda: '$1.2M',
    ebitdaMargin: 28.6,
    valuation: '$8.5M',
    growth: 12,
    foundedYear: 2004,
    team: 28,
    heatScore: 92,
    successProbability: 87,
    verified: true,
    buyerInterest: 234,
    ownerMotivation: 'retiring',
    location: 'Denver, CO',
    website: 'primecutsteakhouse.com',
    comparables: [
      {
        name: 'Bison Restaurant Group',
        revenue: '$4.1M',
        multiple: '2.05x',
        matchScore: 92,
        location: 'Denver, CO',
        soldYear: 2024,
      },
      {
        name: 'Upscale Dining Co',
        revenue: '$3.9M',
        multiple: '2.08x',
        matchScore: 85,
        location: 'Boulder, CO',
        soldYear: 2024,
      },
      {
        name: 'Metropolitan Steaks',
        revenue: '$4.3M',
        multiple: '2.1x',
        matchScore: 79,
        location: 'Salt Lake City, UT',
        soldYear: 2023,
      },
    ],
    intelligence: {
      heatScore: 92,
      buyerInterestCount: 234,
      marketMultiple: 2.07,
      sectorMomentum: 23,
      sectorAvgMargin: 26,
      confidenceLevel: 94,
      benchmarkGrade: 'A+',
    },
    predictions: {
      successProbability: 87,
      optimalTiming: 'Q3 2026',
      fairValueLow: 8.1,
      fairValueHigh: 9.2,
      fairValueMid: 8.65,
      growthYear5: {
        revenue: 7.4,
        valuation: 16.8,
        irr: '24-28%',
      },
      topBuyerType: 'Strategic Restaurant Group',
      buyerMatchScore: 70,
    },
  },

  // Deal 2: TechStaff Solutions
  {
    id: 2,
    name: 'TechStaff Solutions',
    businessType: 'saas',
    category: 'B2B SaaS',
    description: 'B2B SaaS staffing platform. 180+ enterprise clients. Recurring revenue model. 40% YoY growth.',
    image: 'https://images.unsplash.com/photo-1460925895917-aeb19be489c7?w=600&h=400&fit=crop',
    revenue: '$3.8M',
    ebitda: '$950K',
    ebitdaMargin: 25,
    valuation: '$12.5M',
    growth: 40,
    foundedYear: 2019,
    team: 22,
    heatScore: 88,
    successProbability: 85,
    verified: true,
    buyerInterest: 189,
    ownerMotivation: 'growth',
    location: 'San Francisco, CA',
    website: 'techstaffsolutions.com',
    comparables: [
      {
        name: 'Staffing.io',
        revenue: '$3.6M',
        multiple: '3.2x',
        matchScore: 88,
        location: 'San Francisco, CA',
        soldYear: 2024,
      },
      {
        name: 'TalentHub',
        revenue: '$3.9M',
        multiple: '3.15x',
        matchScore: 84,
        location: 'New York, NY',
        soldYear: 2024,
      },
    ],
    intelligence: {
      heatScore: 88,
      buyerInterestCount: 189,
      marketMultiple: 3.18,
      sectorMomentum: 31,
      sectorAvgMargin: 22,
      confidenceLevel: 91,
      benchmarkGrade: 'A',
    },
    predictions: {
      successProbability: 85,
      optimalTiming: 'Q2 2026',
      fairValueLow: 11.8,
      fairValueHigh: 13.2,
      fairValueMid: 12.5,
      growthYear5: {
        revenue: 12.1,
        valuation: 38.7,
        irr: '28-32%',
      },
      topBuyerType: 'Strategic Tech Company',
      buyerMatchScore: 75,
    },
  },

  // Deal 3: SmileCare Dental Network
  {
    id: 3,
    name: 'SmileCare Dental Network',
    businessType: 'healthcare',
    category: 'Healthcare',
    description: '8-location dental practice network. $2.1M revenue. 2 orthodontic specialists. 95% patient retention.',
    image: 'https://images.unsplash.com/photo-1579154204601-01d6e7974e7a?w=600&h=400&fit=crop',
    revenue: '$2.1M',
    ebitda: '$630K',
    ebitdaMargin: 30,
    valuation: '$5.8M',
    growth: 18,
    foundedYear: 2012,
    team: 35,
    heatScore: 85,
    successProbability: 84,
    verified: true,
    buyerInterest: 156,
    ownerMotivation: 'retiring',
    location: 'Austin, TX',
    website: 'smilecaredental.com',
    comparables: [
      {
        name: 'Bright Smile Dental',
        revenue: '$2.0M',
        multiple: '2.7x',
        matchScore: 91,
        location: 'Austin, TX',
        soldYear: 2024,
      },
      {
        name: 'Metro Dental Group',
        revenue: '$2.2M',
        multiple: '2.65x',
        matchScore: 86,
        location: 'Houston, TX',
        soldYear: 2023,
      },
    ],
    intelligence: {
      heatScore: 85,
      buyerInterestCount: 156,
      marketMultiple: 2.68,
      sectorMomentum: 19,
      sectorAvgMargin: 28,
      confidenceLevel: 89,
      benchmarkGrade: 'A',
    },
    predictions: {
      successProbability: 84,
      optimalTiming: 'Q3 2026',
      fairValueLow: 5.5,
      fairValueHigh: 6.1,
      fairValueMid: 5.8,
      growthYear5: {
        revenue: 3.8,
        valuation: 10.2,
        irr: '20-24%',
      },
      topBuyerType: 'DSO (Dental Service Organization)',
      buyerMatchScore: 82,
    },
  },

  // Deal 4: EcomHub Brands
  {
    id: 4,
    name: 'EcomHub Brands',
    businessType: 'ecommerce',
    category: 'E-commerce',
    description: 'DTC apparel brand. 3 owned SKU families. $18M annual on 3PL. 62% gross margin. +35% YoY growth.',
    image: 'https://images.unsplash.com/photo-1460925895917-aeb19be489c7?w=600&h=400&fit=crop',
    revenue: '$6.2M',
    ebitda: '$1.24M',
    ebitdaMargin: 20,
    valuation: '$9.8M',
    growth: 35,
    foundedYear: 2018,
    team: 18,
    heatScore: 86,
    successProbability: 82,
    verified: true,
    buyerInterest: 201,
    ownerMotivation: 'growth',
    location: 'Los Angeles, CA',
    website: 'ecohubbrands.com',
    comparables: [
      {
        name: 'Fashion Direct Co',
        revenue: '$5.8M',
        multiple: '1.62x',
        matchScore: 89,
        location: 'Los Angeles, CA',
        soldYear: 2024,
      },
      {
        name: 'Apparel Aggregator',
        revenue: '$6.5M',
        multiple: '1.58x',
        matchScore: 85,
        location: 'Portland, OR',
        soldYear: 2024,
      },
    ],
    intelligence: {
      heatScore: 86,
      buyerInterestCount: 201,
      marketMultiple: 1.6,
      sectorMomentum: 28,
      sectorAvgMargin: 18,
      confidenceLevel: 87,
      benchmarkGrade: 'A',
    },
    predictions: {
      successProbability: 82,
      optimalTiming: 'Q4 2026',
      fairValueLow: 9.2,
      fairValueHigh: 10.4,
      fairValueMid: 9.8,
      growthYear5: {
        revenue: 14.2,
        valuation: 22.7,
        irr: '22-26%',
      },
      topBuyerType: 'Roll-up/Aggregator',
      buyerMatchScore: 78,
    },
  },

  // Deal 5: LogisticsPro Fleet
  {
    id: 5,
    name: 'LogisticsPro Fleet',
    businessType: 'industrial',
    category: 'Logistics & Transportation',
    description: '220-truck logistics fleet. Regional carrier serving 12 states. $28M annual revenue. 35-year track record.',
    image: 'https://images.unsplash.com/photo-1532274040911-5f82f1b39330?w=600&h=400&fit=crop',
    revenue: '$28.0M',
    ebitda: '$5.04M',
    ebitdaMargin: 18,
    valuation: '$32.5M',
    growth: 8,
    foundedYear: 1989,
    team: 287,
    heatScore: 79,
    successProbability: 79,
    verified: true,
    buyerInterest: 143,
    ownerMotivation: 'retiring',
    location: 'Atlanta, GA',
    website: 'logisticsprofleet.com',
    comparables: [
      {
        name: 'FreightLine Corporation',
        revenue: '$27.5M',
        multiple: '1.15x',
        matchScore: 94,
        location: 'Atlanta, GA',
        soldYear: 2024,
      },
      {
        name: 'Regional Trucking Co',
        revenue: '$29.2M',
        multiple: '1.12x',
        matchScore: 89,
        location: 'Nashville, TN',
        soldYear: 2023,
      },
    ],
    intelligence: {
      heatScore: 79,
      buyerInterestCount: 143,
      marketMultiple: 1.135,
      sectorMomentum: 15,
      sectorAvgMargin: 17,
      confidenceLevel: 85,
      benchmarkGrade: 'B+',
    },
    predictions: {
      successProbability: 79,
      optimalTiming: 'Q2 2026',
      fairValueLow: 31.2,
      fairValueHigh: 33.8,
      fairValueMid: 32.5,
      growthYear5: {
        revenue: 36.4,
        valuation: 41.1,
        irr: '14-18%',
      },
      topBuyerType: 'Strategic Logistics Company',
      buyerMatchScore: 84,
    },
  },
]

export const getDealById = (id: number): DealData | undefined => {
  return allDeals.find(deal => deal.id === id)
}

export const getAllDeals = (): DealData[] => {
  return allDeals
}

export const searchDeals = (query: string): DealData[] => {
  const q = query.toLowerCase()
  return allDeals.filter(
    deal =>
      deal.name.toLowerCase().includes(q) ||
      deal.description.toLowerCase().includes(q) ||
      deal.businessType.toLowerCase().includes(q)
  )
}

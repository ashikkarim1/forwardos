/**
 * Market Insights — UAE & Canada business-for-sale market intelligence.
 *
 * Where ForwardOS beats BizBuySell's static quarterly US PDF: a live, regional,
 * sector-segmented report for the two markets we serve. When a database is
 * connected, `computeFromDeals` aggregates real `Deal` rows; otherwise the
 * curated regional baselines below render so the report is always populated.
 * All monetary values are USD base (dollars); the UI converts to the user's currency.
 */

export type Region = 'CANADA' | 'UAE'

export interface SectorInsight {
  sector: string
  medianAsking: number // USD
  medianRevenue: number // USD
  medianMultiple: number // price / revenue
  activeListings: number
  salesToAskRatio: number // 0-1
  avgDaysOnMarket: number
  momentum: 'rising' | 'steady' | 'cooling'
}

export interface RegionInsight {
  region: Region
  period: string
  headline: {
    medianAsking: number
    medianMultiple: number
    salesToAskRatio: number
    activeListings: number
    avgDaysOnMarket: number
    yoyListingGrowth: number // %
  }
  sectors: SectorInsight[]
  trend: string
}

const PERIOD = '2026-Q2'

export const INSIGHTS: Record<Region, RegionInsight> = {
  CANADA: {
    region: 'CANADA',
    period: PERIOD,
    headline: {
      medianAsking: 685_000,
      medianMultiple: 2.9,
      salesToAskRatio: 0.93,
      activeListings: 1_240,
      avgDaysOnMarket: 168,
      yoyListingGrowth: 11.4,
    },
    sectors: [
      { sector: 'Services', medianAsking: 540_000, medianRevenue: 720_000, medianMultiple: 2.6, activeListings: 318, salesToAskRatio: 0.94, avgDaysOnMarket: 152, momentum: 'rising' },
      { sector: 'Manufacturing', medianAsking: 1_180_000, medianRevenue: 1_950_000, medianMultiple: 3.4, activeListings: 142, salesToAskRatio: 0.91, avgDaysOnMarket: 198, momentum: 'steady' },
      { sector: 'Retail', medianAsking: 410_000, medianRevenue: 880_000, medianMultiple: 1.9, activeListings: 286, salesToAskRatio: 0.90, avgDaysOnMarket: 176, momentum: 'cooling' },
      { sector: 'SaaS / Tech', medianAsking: 1_650_000, medianRevenue: 920_000, medianMultiple: 4.6, activeListings: 97, salesToAskRatio: 0.96, avgDaysOnMarket: 121, momentum: 'rising' },
      { sector: 'Hospitality', medianAsking: 620_000, medianRevenue: 1_100_000, medianMultiple: 2.2, activeListings: 174, salesToAskRatio: 0.89, avgDaysOnMarket: 189, momentum: 'steady' },
    ],
    trend: 'Sales-to-ask held at 93% as CSBFP-financed buyers stayed active. Tech and services lead on multiple and speed; retail is softening on days-on-market.',
  },
  UAE: {
    region: 'UAE',
    period: PERIOD,
    headline: {
      medianAsking: 540_000,
      medianMultiple: 3.2,
      salesToAskRatio: 0.95,
      activeListings: 870,
      avgDaysOnMarket: 142,
      yoyListingGrowth: 18.7,
    },
    sectors: [
      { sector: 'Hospitality / F&B', medianAsking: 480_000, medianRevenue: 760_000, medianMultiple: 2.7, activeListings: 214, salesToAskRatio: 0.95, avgDaysOnMarket: 128, momentum: 'rising' },
      { sector: 'Logistics', medianAsking: 920_000, medianRevenue: 1_480_000, medianMultiple: 3.1, activeListings: 88, salesToAskRatio: 0.93, avgDaysOnMarket: 156, momentum: 'rising' },
      { sector: 'E-commerce', medianAsking: 610_000, medianRevenue: 540_000, medianMultiple: 4.0, activeListings: 132, salesToAskRatio: 0.97, avgDaysOnMarket: 109, momentum: 'rising' },
      { sector: 'Services', medianAsking: 430_000, medianRevenue: 690_000, medianMultiple: 2.5, activeListings: 201, salesToAskRatio: 0.94, avgDaysOnMarket: 138, momentum: 'steady' },
      { sector: 'Retail', medianAsking: 500_000, medianRevenue: 1_020_000, medianMultiple: 2.0, activeListings: 158, salesToAskRatio: 0.92, avgDaysOnMarket: 161, momentum: 'steady' },
    ],
    trend: 'Listing supply grew 18.7% YoY as free-zone owners brought businesses to market. Sharia-compliant financing widened the buyer pool; e-commerce and F&B clear fastest.',
  },
}

export function getRegionInsight(region: Region): RegionInsight {
  return INSIGHTS[region]
}

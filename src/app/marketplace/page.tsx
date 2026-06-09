'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import ListingCard from '@/components/listing/ListingCard'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

interface Deal {
  id: string; title: string; location: string; country: string; image: string; askingPrice: number; askingPriceCurrency: string; annualRevenue: number; cashFlowMin: number; cashFlowMax: number; ebitda: number; profitMarginPercent: number; dealQualityScore: number; heatIndex: number; roiProjection: number; paybackPeriod: number; growthRate: number; status: 'NEW' | 'FEATURED' | 'STANDARD'; category: string; dealType: 'SALE' | 'LEASE' | 'QUICK_SALE'; employeeCount: number; sellerVerified: boolean; sellerTrustScore: number; marketTrend: 'up' | 'down' | 'stable'; marketPosition: 'underpriced' | 'fair' | 'premium'; daysOnMarket: number; location_country: string; sellerType: string; sellerMotivation: string; upcomingAuction?: boolean
}

// 10 Complete Deals
const DEALS: Deal[] = [
  { id: 'deal-1', title: 'TechFlow SaaS Platform', location: 'San Francisco', country: 'USA', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop', askingPrice: 2500000, askingPriceCurrency: 'USD', annualRevenue: 850000, cashFlowMin: 170000, cashFlowMax: 200000, ebitda: 187000, profitMarginPercent: 22, dealQualityScore: 92, heatIndex: 88, roiProjection: 22.5, paybackPeriod: 32, growthRate: 45, status: 'FEATURED', category: 'SAAS', dealType: 'SALE', employeeCount: 12, sellerVerified: true, sellerTrustScore: 95, marketTrend: 'up', marketPosition: 'underpriced', daysOnMarket: 5, location_country: 'USA', sellerType: 'Founder', sellerMotivation: 'Growth Capital' },
  { id: 'deal-2', title: 'CloudFirst Analytics', location: 'Toronto', country: 'Canada', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=400&fit=crop', askingPrice: 5800000, askingPriceCurrency: 'USD', annualRevenue: 1900000, cashFlowMin: 380000, cashFlowMax: 520000, ebitda: 456000, profitMarginPercent: 24, dealQualityScore: 91, heatIndex: 92, roiProjection: 24.3, paybackPeriod: 28, growthRate: 62, status: 'FEATURED', category: 'SAAS', dealType: 'SALE', employeeCount: 18, sellerVerified: true, sellerTrustScore: 93, marketTrend: 'up', marketPosition: 'fair', daysOnMarket: 8, location_country: 'Canada', sellerType: 'PE', sellerMotivation: 'Portfolio Optimization' },
  { id: 'deal-3', title: 'Emirates Franchise Network', location: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop', askingPrice: 1200000, askingPriceCurrency: 'USD', annualRevenue: 450000, cashFlowMin: 90000, cashFlowMax: 180000, ebitda: 90000, profitMarginPercent: 20, dealQualityScore: 74, heatIndex: 68, roiProjection: 18.5, paybackPeriod: 48, growthRate: 28, status: 'STANDARD', category: 'FRANCHISE', dealType: 'SALE', employeeCount: 8, sellerVerified: true, sellerTrustScore: 88, marketTrend: 'stable', marketPosition: 'fair', daysOnMarket: 15, location_country: 'UAE', sellerType: 'Family', sellerMotivation: 'Succession' },
  { id: 'deal-4', title: 'HealthTech Clinic Network', location: 'Boston', country: 'USA', image: 'https://images.unsplash.com/photo-1576091160550-112173f31c77?w=500&h=400&fit=crop', askingPrice: 4500000, askingPriceCurrency: 'USD', annualRevenue: 1800000, cashFlowMin: 350000, cashFlowMax: 450000, ebitda: 405000, profitMarginPercent: 23, dealQualityScore: 87, heatIndex: 85, roiProjection: 21.2, paybackPeriod: 35, growthRate: 35, status: 'NEW', category: 'HEALTHCARE', dealType: 'SALE', employeeCount: 24, sellerVerified: true, sellerTrustScore: 90, marketTrend: 'up', marketPosition: 'underpriced', daysOnMarket: 3, location_country: 'USA', sellerType: 'Corporate', sellerMotivation: 'Distressed' },
  { id: 'deal-5', title: 'Digital Marketing Agency', location: 'Austin', country: 'USA', image: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=500&h=400&fit=crop', askingPrice: 1800000, askingPriceCurrency: 'USD', annualRevenue: 680000, cashFlowMin: 150000, cashFlowMax: 250000, ebitda: 155000, profitMarginPercent: 23, dealQualityScore: 79, heatIndex: 72, roiProjection: 19.8, paybackPeriod: 42, growthRate: 32, status: 'STANDARD', category: 'SERVICES', dealType: 'SALE', employeeCount: 14, sellerVerified: true, sellerTrustScore: 85, marketTrend: 'up', marketPosition: 'fair', daysOnMarket: 12, location_country: 'USA', sellerType: 'Founder', sellerMotivation: 'Growth Capital' },
  { id: 'deal-6', title: 'LogisticsPro Hub', location: 'Atlanta', country: 'USA', image: 'https://images.unsplash.com/photo-1586398128686-0a03e8917b87?w=500&h=400&fit=crop', askingPrice: 6200000, askingPriceCurrency: 'USD', annualRevenue: 2100000, cashFlowMin: 450000, cashFlowMax: 600000, ebitda: 525000, profitMarginPercent: 25, dealQualityScore: 90, heatIndex: 89, roiProjection: 23.5, paybackPeriod: 30, growthRate: 55, status: 'FEATURED', category: 'LOGISTICS', dealType: 'SALE', employeeCount: 35, sellerVerified: true, sellerTrustScore: 92, marketTrend: 'up', marketPosition: 'fair', daysOnMarket: 10, location_country: 'USA', sellerType: 'Family', sellerMotivation: 'Succession' },
  { id: 'deal-7', title: 'E-Learning Platform', location: 'Seattle', country: 'USA', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=400&fit=crop', askingPrice: 3200000, askingPriceCurrency: 'USD', annualRevenue: 1100000, cashFlowMin: 220000, cashFlowMax: 380000, ebitda: 275000, profitMarginPercent: 25, dealQualityScore: 85, heatIndex: 81, roiProjection: 20.1, paybackPeriod: 38, growthRate: 48, status: 'NEW', category: 'EDTECH', dealType: 'SALE', employeeCount: 16, sellerVerified: true, sellerTrustScore: 89, marketTrend: 'up', marketPosition: 'fair', daysOnMarket: 6, location_country: 'USA', sellerType: 'Founder', sellerMotivation: 'Growth Capital' },
  { id: 'deal-8', title: 'Fintech Lending Platform', location: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=400&fit=crop', askingPrice: 7500000, askingPriceCurrency: 'USD', annualRevenue: 2800000, cashFlowMin: 600000, cashFlowMax: 850000, ebitda: 700000, profitMarginPercent: 25, dealQualityScore: 93, heatIndex: 95, roiProjection: 25.2, paybackPeriod: 26, growthRate: 78, status: 'FEATURED', category: 'FINTECH', dealType: 'SALE', employeeCount: 42, sellerVerified: true, sellerTrustScore: 96, marketTrend: 'up', marketPosition: 'underpriced', daysOnMarket: 2, location_country: 'USA', sellerType: 'PE', sellerMotivation: 'Portfolio Optimization', upcomingAuction: true },
  { id: 'deal-9', title: 'Cybersecurity Solutions', location: 'Austin', country: 'USA', image: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=500&h=400&fit=crop', askingPrice: 2800000, askingPriceCurrency: 'USD', annualRevenue: 950000, cashFlowMin: 180000, cashFlowMax: 280000, ebitda: 220000, profitMarginPercent: 23, dealQualityScore: 88, heatIndex: 86, roiProjection: 21.8, paybackPeriod: 34, growthRate: 52, status: 'STANDARD', category: 'CYBERSECURITY', dealType: 'SALE', employeeCount: 20, sellerVerified: true, sellerTrustScore: 91, marketTrend: 'up', marketPosition: 'fair', daysOnMarket: 9, location_country: 'USA', sellerType: 'Founder', sellerMotivation: 'Growth Capital' },
  { id: 'deal-10', title: 'Green Energy Solutions', location: 'Denver', country: 'USA', image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500&h=400&fit=crop', askingPrice: 5500000, askingPriceCurrency: 'USD', annualRevenue: 1750000, cashFlowMin: 350000, cashFlowMax: 500000, ebitda: 438000, profitMarginPercent: 25, dealQualityScore: 86, heatIndex: 83, roiProjection: 22.1, paybackPeriod: 33, growthRate: 58, status: 'NEW', category: 'CLEANTECH', dealType: 'SALE', employeeCount: 28, sellerVerified: true, sellerTrustScore: 87, marketTrend: 'up', marketPosition: 'fair', daysOnMarket: 7, location_country: 'USA', sellerType: 'Corporate', sellerMotivation: 'Strategic Exit' },
]

export default function SimpleMarketplace() {
  return (
    <div style={{ background: COLOR_BG_PRIMARY, minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: COLOR_PRIMARY, marginBottom: '30px' }}>Marketplace - 10 Deals</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {DEALS.map(deal => (
            <div key={deal.id}>
              <ListingCard
                {...deal}
                onSave={() => {}}
                onViewPhotos={() => {}}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

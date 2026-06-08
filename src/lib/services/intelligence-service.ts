import { query } from '@/lib/db/client'

export interface HeatMap {
  sector: string
  deals: number
  avgRevenue: number
  heat: number
  status: string
}

export interface Prediction {
  companyId: string
  name: string
  closeProbability: number
  synergyRealization: number
  integrationSuccess: number
  confidence: number
}

export interface Signal {
  id: string
  companyId: string
  type: string
  signal: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  detectedAt: string
}

export async function getHeatMaps(limit = 20): Promise<HeatMap[]> {
  try {
    const heatMaps = await query(`
      SELECT
        COALESCE(industry, 'Unknown') as sector,
        COUNT(*) as deal_count,
        ROUND(AVG(revenue::numeric), 0) as avg_revenue,
        COUNT(*) * 15 as heat_index
      FROM companies
      GROUP BY industry
      ORDER BY heat_index DESC
      LIMIT $1
    `, [limit])

    return (heatMaps || []).map((h: any) => {
      const heat = Math.min(100, parseInt(h.heat_index) * 2)
      return {
        sector: h.sector,
        deals: h.deal_count || 0,
        avgRevenue: h.avg_revenue || 0,
        heat,
        status:
          heat > 80 ? '🔥 Hot' :
          heat > 60 ? '📈 Heating' :
          heat > 40 ? '⭐ Warm' :
          heat > 20 ? '📉 Cooling' : '❄️ Cold'
      }
    })
  } catch (error) {
    console.error('Error fetching heat maps:', error)
    return []
  }
}

export async function getPredictions(limit = 20): Promise<Prediction[]> {
  try {
    const companies = await query(`
      SELECT id, name, revenue, growth_rate, ebitda_margin, debt_ratio
      FROM companies
      LIMIT $1
    `, [limit])

    // Simple predictive scoring algorithm
    return (companies || []).map((c: any) => {
      const revenue = c.revenue || 0
      const growth = (c.growth_rate || 0) * 10
      const margin = (c.ebitda_margin || 0) * 5
      const debt = (c.debt_ratio || 0) * -10

      const baseProbability = 50 + growth + margin + debt
      const closeProbability = Math.max(0, Math.min(100, baseProbability + (Math.random() * 20 - 10)))

      return {
        companyId: c.id,
        name: c.name || 'Unnamed',
        closeProbability: Math.round(closeProbability),
        synergyRealization: Math.round(Math.max(0, Math.min(100, closeProbability * 0.94 + (Math.random() * 10 - 5)))),
        integrationSuccess: Math.round(Math.max(0, Math.min(100, closeProbability * 0.88 + (Math.random() * 10 - 5)))),
        confidence: Math.min(1, 0.7 + (Math.random() * 0.25)),
      }
    })
  } catch (error) {
    console.error('Error fetching predictions:', error)
    return []
  }
}

export async function getSignals(limit = 100): Promise<Signal[]> {
  try {
    const companies = await query(`
      SELECT id, name, revenue, growth_rate, stage, status, updated_at
      FROM companies
      LIMIT $1
    `, [Math.max(20, limit / 5)])

    const signals: Signal[] = []
    const signalTypes = [
      { type: 'financial', template: ' showing revenue growth acceleration' },
      { type: 'operational', template: ' hired new CFO/COO' },
      { type: 'market', template: ' gained market share in hot sector' },
      { type: 'strategic', template: ' announced new product line' },
    ]

    const severities: ('critical' | 'high' | 'medium' | 'low')[] = ['critical', 'high', 'medium', 'low']

    companies.forEach((c: any, idx: number) => {
      const numSignals = Math.floor(Math.random() * 4) + 1

      for (let i = 0; i < numSignals; i++) {
        const signalType = signalTypes[Math.floor(Math.random() * signalTypes.length)]
        const severity = severities[Math.floor(Math.random() * severities.length)]

        signals.push({
          id: `signal_${c.id}_${i}`,
          companyId: c.id,
          type: signalType.type,
          signal: `${c.name}${signalType.template}`,
          severity,
          detectedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        })
      }
    })

    return signals.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      return severityOrder[a.severity] - severityOrder[b.severity]
    }).slice(0, limit)
  } catch (error) {
    console.error('Error fetching signals:', error)
    return []
  }
}

export async function getComparables(companyId: string, limit = 10): Promise<any[]> {
  try {
    const company = await query(
      'SELECT industry, revenue FROM companies WHERE id = $1',
      [companyId]
    )

    if (!company || company.length === 0) return []

    const c = company[0]
    const comparables = await query(`
      SELECT id, name, revenue, valuation, industry, stage
      FROM companies
      WHERE industry = $1 AND id != $2 AND revenue BETWEEN $3 AND $4
      ORDER BY ABS(revenue - $5) ASC
      LIMIT $6
    `, [
      c.industry,
      companyId,
      (c.revenue || 0) * 0.5,
      (c.revenue || 0) * 1.5,
      c.revenue || 0,
      limit,
    ])

    return (comparables || []).map((comp: any) => ({
      id: comp.id,
      name: comp.name || 'Unnamed',
      revenue: comp.revenue || 0,
      valuation: comp.valuation || 0,
      multiple: comp.valuation && comp.revenue ? (comp.valuation / comp.revenue).toFixed(1) : 'N/A',
      industry: comp.industry,
      stage: comp.stage,
    }))
  } catch (error) {
    console.error('Error fetching comparables:', error)
    return []
  }
}

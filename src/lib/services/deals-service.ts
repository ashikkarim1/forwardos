import { query, queryOne } from '@/lib/db/client'

export interface Deal {
  id: string
  name: string
  industry: string
  stage: string
  location: string
  revenue: number
  valuation: number
  heat: number
  daysToClose: number
  status: string
  matchScore: number
  created_at: string
  updated_at: string
}

export async function getAllDeals(limit = 20, offset = 0, filters?: any): Promise<Deal[]> {
  try {
    let sql = 'SELECT * FROM companies WHERE 1=1'
    const params: any[] = []

    if (filters?.industry) {
      sql += ` AND industry = $${params.length + 1}`
      params.push(filters.industry)
    }

    if (filters?.stage) {
      sql += ` AND stage = $${params.length + 1}`
      params.push(filters.stage)
    }

    if (filters?.minRevenue) {
      sql += ` AND revenue >= $${params.length + 1}`
      params.push(filters.minRevenue)
    }

    sql += ` ORDER BY revenue DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const deals = await query(sql, params)

    // Transform database response to Deal interface
    return (deals || []).map((d: any) => ({
      id: d.id,
      name: d.name || 'Unnamed Company',
      industry: d.industry || 'Technology',
      stage: d.stage || 'Growth',
      location: d.location || 'USA',
      revenue: d.revenue || 0,
      valuation: d.valuation || 0,
      heat: Math.floor(Math.random() * 100), // Generate heat index
      daysToClose: Math.floor(Math.random() * 120 + 30), // 30-150 days
      status: d.status || 'active',
      matchScore: Math.floor(Math.random() * 30 + 70), // 70-100
      created_at: d.created_at,
      updated_at: d.updated_at,
    }))
  } catch (error) {
    console.error('Error fetching deals:', error)
    return []
  }
}

export async function getDealById(id: string): Promise<Deal | null> {
  try {
    const deal = await queryOne('SELECT * FROM companies WHERE id = $1', [id])

    if (!deal) return null

    return {
      id: deal.id,
      name: deal.name || 'Unnamed Company',
      industry: deal.industry || 'Technology',
      stage: deal.stage || 'Growth',
      location: deal.location || 'USA',
      revenue: deal.revenue || 0,
      valuation: deal.valuation || 0,
      heat: Math.floor(Math.random() * 100),
      daysToClose: Math.floor(Math.random() * 120 + 30),
      status: deal.status || 'active',
      matchScore: Math.floor(Math.random() * 30 + 70),
      created_at: deal.created_at,
      updated_at: deal.updated_at,
    }
  } catch (error) {
    console.error('Error fetching deal:', error)
    return null
  }
}

export async function searchDeals(searchTerm: string): Promise<Deal[]> {
  try {
    const deals = await query(
      `SELECT * FROM companies
       WHERE name ILIKE $1 OR industry ILIKE $1
       ORDER BY revenue DESC LIMIT 20`,
      [`%${searchTerm}%`]
    )

    return (deals || []).map((d: any) => ({
      id: d.id,
      name: d.name || 'Unnamed Company',
      industry: d.industry || 'Technology',
      stage: d.stage || 'Growth',
      location: d.location || 'USA',
      revenue: d.revenue || 0,
      valuation: d.valuation || 0,
      heat: Math.floor(Math.random() * 100),
      daysToClose: Math.floor(Math.random() * 120 + 30),
      status: d.status || 'active',
      matchScore: Math.floor(Math.random() * 30 + 70),
      created_at: d.created_at,
      updated_at: d.updated_at,
    }))
  } catch (error) {
    console.error('Error searching deals:', error)
    return []
  }
}

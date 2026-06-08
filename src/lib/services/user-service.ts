import { query, queryOne } from '@/lib/db/client'

export interface User {
  id: string
  email: string
  name: string
  role: 'buyer' | 'seller' | 'broker' | 'admin'
  companyName?: string
  currency: string
  language: string
  created_at: string
  updated_at: string
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const user = await queryOne(
      'SELECT id, email, name, role, company_name, currency, language, created_at, updated_at FROM users WHERE email = $1',
      [email]
    )

    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'buyer',
      companyName: user.company_name,
      currency: user.currency || 'USD',
      language: user.language || 'en',
      created_at: user.created_at,
      updated_at: user.updated_at,
    }
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

export async function createUser(userData: {
  email: string
  name: string
  role: 'buyer' | 'seller' | 'broker'
  companyName?: string
  currency?: string
  language?: string
}): Promise<User | null> {
  try {
    const result = await queryOne(
      `INSERT INTO users (email, name, role, company_name, currency, language, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING id, email, name, role, company_name, currency, language, created_at, updated_at`,
      [
        userData.email,
        userData.name,
        userData.role,
        userData.companyName || null,
        userData.currency || 'USD',
        userData.language || 'en',
      ]
    )

    return {
      id: result.id,
      email: result.email,
      name: result.name,
      role: result.role,
      companyName: result.company_name,
      currency: result.currency,
      language: result.language,
      created_at: result.created_at,
      updated_at: result.updated_at,
    }
  } catch (error) {
    console.error('Error creating user:', error)
    return null
  }
}

export async function updateUserPreferences(userId: string, prefs: any): Promise<boolean> {
  try {
    const updates: string[] = []
    const params: any[] = []
    let paramCount = 1

    if (prefs.currency) {
      updates.push(`currency = $${paramCount}`)
      params.push(prefs.currency)
      paramCount++
    }

    if (prefs.language) {
      updates.push(`language = $${paramCount}`)
      params.push(prefs.language)
      paramCount++
    }

    if (prefs.companyName) {
      updates.push(`company_name = $${paramCount}`)
      params.push(prefs.companyName)
      paramCount++
    }

    if (updates.length === 0) return true

    updates.push(`updated_at = NOW()`)
    params.push(userId)

    await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount}`,
      params
    )

    return true
  } catch (error) {
    console.error('Error updating user preferences:', error)
    return false
  }
}

export async function addToWatchlist(userId: string, dealId: string): Promise<boolean> {
  try {
    await query(
      `INSERT INTO watchlist (user_id, deal_id, created_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id, deal_id) DO NOTHING`,
      [userId, dealId]
    )
    return true
  } catch (error) {
    console.error('Error adding to watchlist:', error)
    return false
  }
}

export async function removeFromWatchlist(userId: string, dealId: string): Promise<boolean> {
  try {
    await query(
      'DELETE FROM watchlist WHERE user_id = $1 AND deal_id = $2',
      [userId, dealId]
    )
    return true
  } catch (error) {
    console.error('Error removing from watchlist:', error)
    return false
  }
}

export async function getWatchlist(userId: string): Promise<string[]> {
  try {
    const results = await query(
      'SELECT deal_id FROM watchlist WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    )
    return (results || []).map((r: any) => r.deal_id)
  } catch (error) {
    console.error('Error fetching watchlist:', error)
    return []
  }
}

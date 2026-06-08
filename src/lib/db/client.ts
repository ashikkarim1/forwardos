import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function query(sql: string, params?: any[]) {
  const result = await pool.query(sql, params)
  return result.rows
}

export async function queryOne(sql: string, params?: any[]) {
  const result = await pool.query(sql, params)
  return result.rows[0]
}

export async function transaction(callback: (client: any) => Promise<any>) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

export async function health() {
  try {
    const result = await pool.query('SELECT NOW()')
    return { status: 'ok', timestamp: result.rows[0].now }
  } catch (e) {
    return { status: 'error', message: String(e) }
  }
}

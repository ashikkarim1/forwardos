/**
 * Run the data-retention purge manually:
 *   npx -y tsx prisma/data-retention.ts
 * Deletes time-bound data past its retention window (see src/lib/retention.ts and
 * compliance/DATA_RETENTION.md). Safe to run repeatedly. Requires DATABASE_URL.
 */
import { PrismaClient } from '@prisma/client'
import { purgeExpired } from '../src/lib/retention'

async function main() {
  const db = new PrismaClient()
  try {
    const result = await purgeExpired(db)
    console.log('Retention purge complete:', result)
  } finally {
    await db.$disconnect()
  }
}

main().catch((e) => { console.error(e); process.exit(1) })

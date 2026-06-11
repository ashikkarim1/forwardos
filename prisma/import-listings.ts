/**
 * Bulk-import business listings from a CSV file.
 *
 *   npx -y tsx prisma/import-listings.ts path/to/listings.csv
 *
 * See prisma/listings-template.csv for the expected columns. Idempotent: a row
 * maps to a stable deal id (seller + title), so re-running updates rather than
 * duplicates. Requires DATABASE_URL.
 */
import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { runImport } from '../src/lib/listing-import'

async function main() {
  const file = process.argv[2]
  if (!file) {
    console.error('Usage: npx -y tsx prisma/import-listings.ts <file.csv>')
    process.exit(1)
  }
  const csv = readFileSync(file, 'utf8')
  const db = new PrismaClient()
  try {
    const result = await runImport(csv, db)
    console.log(`Import complete: ${result.created} created, ${result.updated} updated, ${result.skipped} skipped.`)
    if (result.errors.length) {
      console.log('Issues:')
      result.errors.forEach((e) => console.log(`  row ${e.row}: ${e.error}`))
    }
  } finally {
    await db.$disconnect()
  }
}

main().catch((e) => { console.error(e); process.exit(1) })

/**
 * Seed the Lender table from the canonical dataset in src/lib/finance-data.ts.
 *
 * Run once a DATABASE_URL is configured:
 *   npx tsx prisma/seed-lenders.ts
 * (or)  npx ts-node --compiler-options '{"module":"commonjs"}' prisma/seed-lenders.ts
 *
 * Idempotent: upserts by the stable ids defined in the dataset.
 */
import { PrismaClient } from '@prisma/client'
import { LENDERS } from '../src/lib/finance-data'

const prisma = new PrismaClient()

async function main() {
  for (const l of LENDERS) {
    await prisma.lender.upsert({
      where: { id: l.id },
      update: {
        name: l.name,
        region: l.region,
        financingTypes: JSON.stringify(l.financingTypes),
        description: l.description,
        logoUrl: l.logoUrl ?? null,
        applyUrl: l.applyUrl ?? null,
        minAmount: BigInt(l.minAmount),
        maxAmount: BigInt(l.maxAmount),
        interestRateMin: l.interestRateMin,
        interestRateMax: l.interestRateMax,
        termMonthsMin: l.termMonthsMin,
        termMonthsMax: l.termMonthsMax,
        maxLtvPercent: l.maxLtvPercent,
        shariaCompliant: l.shariaCompliant,
        isActive: true,
      },
      create: {
        id: l.id,
        name: l.name,
        region: l.region,
        financingTypes: JSON.stringify(l.financingTypes),
        description: l.description,
        logoUrl: l.logoUrl ?? null,
        applyUrl: l.applyUrl ?? null,
        minAmount: BigInt(l.minAmount),
        maxAmount: BigInt(l.maxAmount),
        interestRateMin: l.interestRateMin,
        interestRateMax: l.interestRateMax,
        termMonthsMin: l.termMonthsMin,
        termMonthsMax: l.termMonthsMax,
        maxLtvPercent: l.maxLtvPercent,
        shariaCompliant: l.shariaCompliant,
        isActive: true,
      },
    })
  }
  console.log(`Seeded ${LENDERS.length} lenders.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

/**
 * Demo seed: a buyer user, broker profiles (+reviews), and a representative set
 * of deals across UAE & Canada. Makes the BizBuySell-parity features DB-backed:
 * saved searches / reviews / inquiries can persist (FKs satisfied), the broker
 * directory reads real BrokerProfile rows, and saved-search matching returns
 * real ranked deals (some financing-eligible).
 *
 * Run: npx -y tsx prisma/seed-demo.ts   (idempotent — upserts by stable ids)
 */
import { PrismaClient } from '@prisma/client'
import { BROKERS } from '../src/lib/broker-data'

const prisma = new PrismaClient()
const usd = (d: number) => BigInt(Math.round(d * 100))

async function main() {
  // 1) Demo buyer (used by saved searches, reviews, inquiries)
  await prisma.user.upsert({
    where: { id: 'demo-user' },
    update: {},
    create: { id: 'demo-user', email: 'buyer@demo.forward.com', name: 'Demo Buyer', password: 'x', role: 'BUYER' },
  })

  // 2) Broker users + profiles + reviews
  for (const b of BROKERS) {
    const userId = `user-${b.id}`
    await prisma.user.upsert({
      where: { id: userId },
      update: { name: b.name, company: b.company },
      create: { id: userId, email: `${b.id}@brokers.forward.com`, name: b.name, company: b.company, password: 'x', role: 'BROKER', profileImage: b.avatarUrl },
    })
    await prisma.brokerProfile.upsert({
      where: { userId },
      update: {
        headline: b.headline, bio: b.bio,
        specialties: JSON.stringify(b.specialties), industries: JSON.stringify(b.industries),
        regions: JSON.stringify(b.regions), languages: JSON.stringify(b.languages),
        yearsExperience: b.yearsExperience, dealsClosed: b.dealsClosed,
        totalValueClosed: usd(b.totalValueClosedUsd), isVerified: b.isVerified,
        isFeatured: b.isFeatured, avgRating: b.avgRating, reviewCount: b.reviewCount,
      },
      create: {
        id: b.id, userId,
        headline: b.headline, bio: b.bio,
        specialties: JSON.stringify(b.specialties), industries: JSON.stringify(b.industries),
        regions: JSON.stringify(b.regions), languages: JSON.stringify(b.languages),
        yearsExperience: b.yearsExperience, dealsClosed: b.dealsClosed,
        totalValueClosed: usd(b.totalValueClosedUsd), isVerified: b.isVerified,
        isFeatured: b.isFeatured, avgRating: b.avgRating, reviewCount: b.reviewCount,
      },
    })
    // Reviews authored by the demo buyer (idempotent: clear+recreate for this broker)
    await prisma.review.deleteMany({ where: { brokerProfileId: b.id, authorId: 'demo-user' } })
    for (const r of b.reviews) {
      await prisma.review.create({
        data: {
          authorId: 'demo-user', brokerProfileId: b.id, rating: Math.round(r.rating),
          title: r.title, comment: r.comment, isVerifiedDeal: r.isVerifiedDeal,
        },
      })
    }
  }

  // 3) A seller + representative deals (UAE & Canada, some financing-eligible)
  await prisma.user.upsert({
    where: { id: 'demo-seller' },
    update: {},
    create: { id: 'demo-seller', email: 'seller@demo.forward.com', name: 'Demo Seller', password: 'x', role: 'SELLER' },
  })

  const deals = [
    { id: 'deal-uae-fb', title: 'Established Dubai F&B Group (4 outlets)', industry: 'HOSPITALITY', country: 'UAE', city: 'Dubai', revenue: 2_400_000, ebitda: 540_000, askingPrice: 1_650_000, heatScore: 88, predictedCloseProb: 72, dealQualityScore: 84, financingEligible: true, financingNote: 'Sharia-compliant (Murabaha) eligible' },
    { id: 'deal-uae-logistics', title: 'UAE Last-Mile Logistics Operator', industry: 'LOGISTICS', country: 'UAE', city: 'Abu Dhabi', revenue: 3_100_000, ebitda: 720_000, askingPrice: 2_300_000, heatScore: 81, predictedCloseProb: 64, dealQualityScore: 79, financingEligible: true, financingNote: 'EDB SME loan eligible' },
    { id: 'deal-ca-saas', title: 'Toronto B2B SaaS — 92% Recurring Revenue', industry: 'SAAS', country: 'Canada', city: 'Toronto', revenue: 1_900_000, ebitda: 610_000, askingPrice: 5_800_000, heatScore: 92, predictedCloseProb: 78, dealQualityScore: 90, financingEligible: true, financingNote: 'BDC acquisition loan eligible' },
    { id: 'deal-ca-services', title: 'Québec HVAC Services (founder exit)', industry: 'SERVICES', country: 'Canada', city: 'Montréal', revenue: 1_200_000, ebitda: 340_000, askingPrice: 980_000, heatScore: 76, predictedCloseProb: 69, dealQualityScore: 75, financingEligible: true, financingNote: 'CSBFP eligible up to $1.15M' },
    { id: 'deal-ca-retail', title: 'Vancouver Specialty Retail Chain', industry: 'RETAIL', country: 'Canada', city: 'Vancouver', revenue: 2_050_000, ebitda: 280_000, askingPrice: 1_100_000, heatScore: 58, predictedCloseProb: 51, dealQualityScore: 62, financingEligible: false, financingNote: null },
  ] as const

  for (const d of deals) {
    await prisma.deal.upsert({
      where: { id: d.id },
      update: {
        heatScore: d.heatScore, predictedCloseProb: d.predictedCloseProb, dealQualityScore: d.dealQualityScore,
        financingEligible: d.financingEligible, financingNote: d.financingNote,
      },
      create: {
        id: d.id, sellerId: 'demo-seller', title: d.title, status: 'ACTIVE', publishedAt: new Date('2026-06-01'),
        industry: d.industry as never, country: d.country, city: d.city,
        revenue: usd(d.revenue), ebitda: usd(d.ebitda), askingPrice: usd(d.askingPrice),
        heatScore: d.heatScore, predictedCloseProb: d.predictedCloseProb, dealQualityScore: d.dealQualityScore,
        financingEligible: d.financingEligible, financingNote: d.financingNote,
      },
    })
  }

  const counts = {
    users: await prisma.user.count(),
    brokers: await prisma.brokerProfile.count(),
    reviews: await prisma.review.count(),
    deals: await prisma.deal.count(),
    lenders: await prisma.lender.count(),
  }
  console.log('Demo seed complete:', counts)
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())

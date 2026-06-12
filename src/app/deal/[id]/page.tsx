import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

/**
 * Legacy deal detail route. The canonical listing page is now /listing/[slug]
 * (server-rendered with the masked title + NDA gate). Anyone landing here via
 * an old link, saved-search digest, or external bookmark gets redirected to
 * the new URL. If the deal id doesn't exist, 404 instead of silently leaking
 * the hardcoded mock content that used to render here.
 */
interface Props { params: { id: string } }

export default async function DealRedirect({ params }: Props): Promise<never> {
  const deal = await prisma.deal
    .findUnique({ where: { id: params.id }, select: { slug: true, status: true } })
    .catch(() => null)
  if (!deal) notFound()
  if (deal.status !== 'ACTIVE' && deal.status !== 'PUBLISHED') notFound()
  redirect(`/listing/${deal.slug ?? params.id}`)
}

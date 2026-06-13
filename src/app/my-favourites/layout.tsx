// SERVER COMPONENT — gates /my-favourites. See /dashboard/layout.tsx for context.
import { requireSessionOrRedirect } from '@/lib/auth-guard'

export const dynamic = 'force-dynamic'

export default async function MyFavouritesLayout({ children }: { children: React.ReactNode }) {
  await requireSessionOrRedirect('/my-favourites')
  return <>{children}</>
}

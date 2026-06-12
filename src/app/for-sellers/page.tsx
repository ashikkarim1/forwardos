import { redirect } from 'next/navigation'

// Consolidated to /sell-your-business — the single seller landing page.
// This permanent redirect preserves inbound SEO equity from /for-sellers links.
export default function ForSellersRedirect(): never {
  redirect('/sell-your-business')
}

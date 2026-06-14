// /deals — the dashboard's Marketplace view.
//
// Renders the canonical /marketplace page inside the AppShell chrome
// provided by /deals/layout.tsx. The marketplace page detects the
// /deals path via usePathname() and skips its <PublicHeader /> so
// the dashboard sidebar isn't paired with the public site header.
//
// This is intentionally a re-export, NOT a duplicated copy — there is
// one marketplace, rendered in two chrome contexts.
export { default } from '@/app/marketplace/page'

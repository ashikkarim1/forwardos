import '@/styles/globals.css'
import type { Metadata } from 'next'
import { LocaleProvider } from '@/context/LocaleContext'
import { LaunchPromoBanner } from '@/components/LaunchPromoBanner'
import FeedbackWidget from '@/components/FeedbackWidget'
import ConsentBanner from '@/components/ConsentBanner'
import {
  SITE_URL, SITE_NAME, SITE_TAGLINE, DEFAULT_DESCRIPTION, DEFAULT_KEYWORDS, OG_IMAGE,
  organizationLd, webSiteLd, jsonLdScript,
} from '@/lib/seo'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  alternates: {
    canonical: SITE_URL,
    languages: { 'en': SITE_URL, 'fr-CA': SITE_URL, 'ar': SITE_URL },
  },
  openGraph: {
    type: 'website', siteName: SITE_NAME, url: SITE_URL,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`, description: DEFAULT_DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image', title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: DEFAULT_DESCRIPTION, images: [OG_IMAGE],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  // Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in your host env to verify Search Console.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#3B82F6" />
        <link rel="icon" href="/FOS.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/FOS.jpg" />
        {/* Structured data: Organization + WebSite (enables sitelinks search box) */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(webSiteLd()) }} />
      </head>
      <body className="bg-white text-[#1A1A1A] font-sans antialiased">
        <LocaleProvider>
          <LaunchPromoBanner />
          <main id="main-content">{children}</main>
          <FeedbackWidget />
          <ConsentBanner />
        </LocaleProvider>
      </body>
    </html>
  )
}

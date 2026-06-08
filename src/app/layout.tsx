import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Forward OS - Corporate Transactions Operating System',
  description: 'The operating system for corporate transactions and strategic outcomes.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    icon: '/fox.jpg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#FF8C00" />
      </head>
      <body className="bg-white text-[#1A1A1A] font-sans antialiased">
        <main id="main-content">{children}</main>
      </body>
    </html>
  )
}

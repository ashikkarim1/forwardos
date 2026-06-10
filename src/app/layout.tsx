import '@/styles/globals.css'
import { LocaleProvider } from '@/context/LocaleContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3B82F6" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f59e0b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 3v6m0 0v6m0-6h-6m6 0h6M5.5 5.5l4.24 4.24M18.5 18.5l-4.24-4.24M18.5 5.5l-4.24 4.24M5.5 18.5l4.24-4.24'/></svg>" type="image/svg+xml" />
      </head>
      <body className="bg-white text-[#1A1A1A] font-sans antialiased">
        <LocaleProvider>
          <main id="main-content">{children}</main>
        </LocaleProvider>
      </body>
    </html>
  )
}

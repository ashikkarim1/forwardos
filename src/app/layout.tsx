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
        <meta name="theme-color" content="#FF8C00" />
        <link rel="icon" href="/FOS.jpg" type="image/jpeg" />
      </head>
      <body className="bg-white text-[#1A1A1A] font-sans antialiased">
        <LocaleProvider>
          <main id="main-content">{children}</main>
        </LocaleProvider>
      </body>
    </html>
  )
}

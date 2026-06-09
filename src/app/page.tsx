'use client'

import { Suspense } from 'react'
import LocalizedHomePage from '@/components/LocalizedHomePage'

function HomePageFallback() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl font-black mb-4" style={{ color: '#1A1A1A' }}>
          Forward OS
        </div>
        <p style={{ color: '#717171' }}>Loading...</p>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageFallback />}>
      <LocalizedHomePage />
    </Suspense>
  )
}

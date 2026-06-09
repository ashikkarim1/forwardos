import { Suspense } from 'react'
import { PricingPageContent } from './PricingPageContent'
import { COLOR_PRIMARY } from '@/styles/forward-colors'

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><div style={{ color: COLOR_PRIMARY }} className="text-lg font-semibold">Loading...</div></div>}>
      <PricingPageContent />
    </Suspense>
  )
}

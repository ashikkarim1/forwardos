import { Suspense } from 'react'
import { SignupContent } from './SignupContent'
import { COLOR_PRIMARY } from '@/styles/forward-colors'

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><div style={{ color: COLOR_PRIMARY }} className="text-lg font-semibold">Loading...</div></div>}>
      <SignupContent />
    </Suspense>
  )
}

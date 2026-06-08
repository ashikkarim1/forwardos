import Link from 'next/link'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY } from '@/styles/forward-colors'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <h1 className="text-6xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
          404
        </h1>
        <p className="text-2xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
          Page Not Found
        </p>
        <p className="text-lg mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="px-8 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 inline-block"
          style={{ background: COLOR_ACCENT }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

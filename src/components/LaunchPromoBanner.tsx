'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { launchActive, timeRemaining, LAUNCH_DISCOUNT_PCT } from '@/lib/pricing'

/**
 * Site-wide launch-pricing banner with a live countdown. Renders nothing once
 * the promo window has ended.
 */
export function LaunchPromoBanner() {
  const [t, setT] = useState(() => timeRemaining())
  const [active, setActive] = useState(true)

  useEffect(() => {
    setActive(launchActive())
    const id = setInterval(() => {
      setT(timeRemaining())
      setActive(launchActive())
    }, 1000)
    return () => clearInterval(id)
  }, [])

  if (!active) return null

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <Link
      href="/pricing"
      className="block w-full text-center text-white text-sm font-semibold py-2 px-4 hover:opacity-95 transition-opacity"
      style={{ background: 'linear-gradient(90deg, #2563EB, #3B82F6)' }}
    >
      <span className="inline-flex items-center gap-2 flex-wrap justify-center">
        <Sparkles size={15} />
        Launch offer: <strong>{LAUNCH_DISCOUNT_PCT}% off</strong> Premium listings — the lowest price in the market.
        <span className="font-mono bg-white/20 rounded px-2 py-0.5">
          {t.days}d {pad(t.hours)}:{pad(t.minutes)}:{pad(t.seconds)}
        </span>
        left →
      </span>
    </Link>
  )
}

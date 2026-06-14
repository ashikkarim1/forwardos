/**
 * <IntelligenceNav> — sub-nav strip shown at the top of each Buyer
 * Premium intelligence surface so users discover the other two.
 *
 * Highlights the active page; every link uses the same brand vocabulary
 * so it reads as one product, not three siloed pages.
 */
import Link from 'next/link'
import { Sparkles, TrendingUp, Flame, BarChart3 } from 'lucide-react'

interface Props {
  active: 'predictions' | 'heat-maps' | 'comparables'
}

const ITEMS = [
  { key: 'predictions', label: 'Predictions',  href: '/intelligence/predictions', icon: TrendingUp, blurb: 'Close-probability score on every deal' },
  { key: 'heat-maps',   label: 'Heat Maps',    href: '/deals/heat-maps',          icon: Flame,      blurb: 'Demand grid by industry × region' },
  { key: 'comparables', label: 'Comparables',  href: '/deals/comparables',        icon: BarChart3,  blurb: 'Live multiples by industry × region' },
] as const

export function IntelligenceNav({ active }: Props) {
  return (
    <div style={{
      display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap',
      padding: 6, background: '#FFFFFF',
      border: '1px solid #E8EAED', borderRadius: 12,
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 10px', borderRadius: 8,
        fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: '#8C6D45',
      }}>
        <Sparkles size={12} /> Intelligence
      </div>
      {ITEMS.map((it) => {
        const isActive = it.key === active
        const Icon = it.icon
        return (
          <Link
            key={it.key}
            href={it.href}
            title={it.blurb}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 8,
              fontSize: 13, fontWeight: 600, textDecoration: 'none',
              background: isActive ? '#0F1419' : 'transparent',
              color: isActive ? '#FFFFFF' : '#454D58',
            }}
          >
            <Icon size={13} /> {it.label}
          </Link>
        )
      })}
    </div>
  )
}

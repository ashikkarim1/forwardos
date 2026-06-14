/**
 * Badge — small status pill. Use for tier labels, status indicators,
 * counts, tags. Five tones cover the entire functional palette:
 *
 *   default — ink-on-cream, neutral
 *   brand   — champagne, premium / featured
 *   success — emerald, verified / completed
 *   warning — amber, caution / pending
 *   danger  — crimson, blocked / failed
 *
 * Two sizes: sm (compact, default) and md (hero badges).
 */
import { ReactNode } from 'react'
import { palette, radius, space, typography } from '@/styles/tokens'

type Tone = 'default' | 'brand' | 'success' | 'warning' | 'danger'
type Size = 'sm' | 'md'

interface BadgeProps {
  tone?: Tone
  size?: Size
  leftIcon?: ReactNode
  children: ReactNode
}

function toneStyles(tone: Tone): { bg: string; fg: string } {
  switch (tone) {
    case 'default': return { bg: palette.ink[50],       fg: palette.ink[700] }
    case 'brand':   return { bg: palette.champagne[100], fg: palette.champagne[800] }
    case 'success': return { bg: palette.emerald[50],    fg: palette.emerald[700] }
    case 'warning': return { bg: palette.amber[50],      fg: palette.amber[700] }
    case 'danger':  return { bg: palette.crimson[50],    fg: palette.crimson[700] }
  }
}

export function Badge({ tone = 'default', size = 'sm', leftIcon, children }: BadgeProps) {
  const t = toneStyles(tone)
  const isMd = size === 'md'
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: space[1],
      padding: isMd ? `${space[1]} ${space[3]}` : `2px ${space[2]}`,
      borderRadius: radius.sm,
      background: t.bg,
      color: t.fg,
      fontFamily: typography.fontFamily.sans,
      fontSize: isMd ? typography.style.bodySm.fontSize : '11px',
      fontWeight: 600,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      lineHeight: 1.4,
      whiteSpace: 'nowrap',
    }}>
      {leftIcon}
      {children}
    </span>
  )
}

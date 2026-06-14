/**
 * Card — elevated surface container. Use for marketplace cards, dashboard
 * modules, settings sections, anything that should read as a "tile."
 *
 * Variants:
 *   default  — white, subtle border, sm shadow (most common)
 *   muted    — cream background, no shadow (use for editorial breaks)
 *   accent   — white, champagne border (use for premium tier highlights)
 *
 * Padding:
 *   sm — space[4]  (compact)
 *   md — space[5]  (default)
 *   lg — space[6]  (spacious)
 */
import { CSSProperties, ReactNode } from 'react'
import { palette, semantic, radius, shadow, space } from '@/styles/tokens'

interface CardProps {
  variant?: 'default' | 'muted' | 'accent'
  padding?: 'sm' | 'md' | 'lg' | 'none'
  hover?: boolean
  onClick?: () => void
  children: ReactNode
  className?: string
  style?: CSSProperties
}

const padMap = { sm: space[4], md: space[5], lg: space[6], none: '0' }

function bg(variant: NonNullable<CardProps['variant']>) {
  switch (variant) {
    case 'default': return semantic.surface.default
    case 'muted':   return palette.cream[100]
    case 'accent':  return semantic.surface.default
  }
}

function border(variant: NonNullable<CardProps['variant']>) {
  switch (variant) {
    case 'default': return semantic.border.subtle
    case 'muted':   return 'transparent'
    case 'accent':  return semantic.border.brand
  }
}

export function Card({
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick,
  children,
  className,
  style,
}: CardProps) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: bg(variant),
        border: `1px solid ${border(variant)}`,
        borderRadius: radius.lg,
        padding: padMap[padding],
        boxShadow: variant === 'muted' ? 'none' : shadow.sm,
        cursor: onClick ? 'pointer' : 'default',
        transition: hover ? 'box-shadow 180ms ease, transform 180ms ease' : 'none',
        ...style,
      }}
      onMouseEnter={hover ? (e) => {
        e.currentTarget.style.boxShadow = shadow.md
      } : undefined}
      onMouseLeave={hover ? (e) => {
        e.currentTarget.style.boxShadow = variant === 'muted' ? 'none' : shadow.sm
      } : undefined}
    >
      {children}
    </div>
  )
}

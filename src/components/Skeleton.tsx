/**
 * Skeleton loading components — token-disciplined, 8 variants.
 *
 * Migrated from inline hex gradients (162 violations) to a single
 * <Shimmer> primitive that reads from the design system. To tune the
 * shimmer color globally, bump palette.ink[50] / [100] in tokens.ts.
 *
 * Usage:
 *   import { Skeleton, CardSkeleton, TableSkeleton } from '@/components/Skeleton'
 *
 *   <CardSkeleton />
 *   <TableSkeleton rows={5} columns={4} />
 */
'use client'

import React, { CSSProperties } from 'react'
import { palette, semantic, radius, space, shadow } from '@/styles/tokens'

// ━━━ Shimmer primitive ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Animated gradient bar — the only place hex colors are referenced; everything
 *  else composes this. Width / height / radius are all token-driven. */
function Shimmer({
  height = '16px',
  width = '100%',
  rounded = 'sm',
  style,
}: {
  height?: string
  width?: string
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  style?: CSSProperties
}) {
  return (
    <div
      role="status"
      aria-label="Loading"
      style={{
        height,
        width,
        borderRadius: radius[rounded],
        background: `linear-gradient(90deg, ${palette.ink[50]} 0%, ${palette.ink[100]} 50%, ${palette.ink[50]} 100%)`,
        backgroundSize: '200% 100%',
        animation: 'fw-shimmer 1.8s ease-in-out infinite',
        ...style,
      }}
    />
  )
}

const cardStyle: CSSProperties = {
  background: semantic.surface.default,
  border: `1px solid ${semantic.border.subtle}`,
  borderRadius: radius.lg,
  overflow: 'hidden',
}

const headerStyle: CSSProperties = {
  background: palette.cream[50],
  borderBottom: `1px solid ${semantic.border.subtle}`,
}

// ━━━ Generic ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SkeletonProps {
  className?: string
  count?: number
}

export function Skeleton({ className, count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Shimmer key={i} style={className ? undefined : undefined} />
      ))}
    </>
  )
}

// ━━━ Card ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function CardSkeleton() {
  return (
    <div style={cardStyle}>
      <Shimmer height="160px" rounded="none" />
      <div style={{ padding: space[6], display: 'flex', flexDirection: 'column', gap: space[4] }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: space[2] }}>
          <Shimmer height="24px" width="75%" />
          <Shimmer height="16px" width="50%" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: space[3], paddingBottom: space[4], borderBottom: `1px solid ${semantic.border.subtle}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Shimmer height="16px" width="25%" />
            <Shimmer height="16px" width="25%" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Shimmer height="16px" width="25%" />
            <Shimmer height="16px" width="25%" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: space[2] }}>
          <Shimmer height="24px" width="80px" rounded="full" />
          <Shimmer height="24px" width="80px" rounded="full" />
        </div>
        <Shimmer height="40px" rounded="md" />
      </div>
    </div>
  )
}

// ━━━ Table ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface TableSkeletonProps {
  rows?: number
  columns?: number
}

export function TableSkeleton({ rows = 5, columns = 5 }: TableSkeletonProps) {
  return (
    <div style={{ ...cardStyle, boxShadow: shadow.sm }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={headerStyle}>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} style={{ padding: `${space[3]} ${space[4]}`, textAlign: 'left' }}>
                <Shimmer height="14px" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr
              key={rowIdx}
              style={{
                borderBottom: `1px solid ${semantic.border.subtle}`,
                background: rowIdx % 2 === 0 ? semantic.surface.default : palette.cream[50],
              }}
            >
              {Array.from({ length: columns }).map((_, colIdx) => (
                <td key={colIdx} style={{ padding: `${space[3]} ${space[4]}` }}>
                  <Shimmer height="14px" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ━━━ Deal detail ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function DealDetailSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space[6] }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: space[2] }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <React.Fragment key={i}>
            <Shimmer height="16px" width="64px" />
            {i < 2 && <div style={{ width: '16px' }} />}
          </React.Fragment>
        ))}
      </div>
      {/* Heading */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: space[2] }}>
        <Shimmer height="32px" width="66%" />
        <Shimmer height="16px" width="33%" />
      </div>
      {/* Body */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: space[6] }}>
        <div style={{ ...cardStyle, padding: space[6], display: 'flex', flexDirection: 'column', gap: space[4] }}>
          <Shimmer height="24px" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Shimmer key={i} height="16px" />
          ))}
        </div>
        <div style={{ ...cardStyle, padding: space[6], display: 'flex', flexDirection: 'column', gap: space[4] }}>
          <Shimmer height="24px" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Shimmer key={i} height="16px" />
          ))}
        </div>
      </div>
    </div>
  )
}

// ━━━ Dashboard ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function DashboardSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space[6] }}>
      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: space[4] }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ ...cardStyle, padding: space[6], display: 'flex', flexDirection: 'column', gap: space[3] }}>
            <Shimmer height="14px" width="50%" />
            <Shimmer height="28px" width="75%" />
            <Shimmer height="14px" width="33%" />
          </div>
        ))}
      </div>
      {/* Main panel */}
      <div style={{ ...cardStyle, padding: space[6], display: 'flex', flexDirection: 'column', gap: space[4] }}>
        <Shimmer height="20px" width="33%" />
        <TableSkeleton rows={5} columns={4} />
      </div>
    </div>
  )
}

// ━━━ List / inbox ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space[3] }}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} style={{ ...cardStyle, padding: space[4], display: 'flex', gap: space[4], alignItems: 'center' }}>
          <Shimmer height="40px" width="40px" rounded="full" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: space[2] }}>
            <Shimmer height="16px" width="40%" />
            <Shimmer height="12px" width="66%" />
          </div>
          <Shimmer height="32px" width="80px" rounded="md" />
        </div>
      ))}
    </div>
  )
}

// ━━━ Form ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space[5] }}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: space[2] }}>
          <Shimmer height="12px" width="25%" />
          <Shimmer height="40px" rounded="md" />
        </div>
      ))}
      <Shimmer height="40px" width="160px" rounded="md" />
    </div>
  )
}

// ━━━ Stats row ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function StatsSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: space[4] }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} style={{ ...cardStyle, padding: space[5], textAlign: 'center', display: 'flex', flexDirection: 'column', gap: space[2] }}>
          <Shimmer height="32px" width="50%" style={{ margin: '0 auto' }} />
          <Shimmer height="14px" width="75%" style={{ margin: '0 auto' }} />
        </div>
      ))}
    </div>
  )
}

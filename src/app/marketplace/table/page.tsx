/**
 * /marketplace/table — institutional-grade list view of every active listing.
 *
 * This is the "Carta / Affinity / Pitchbook" view that PE funds, family
 * offices, and institutional buyers expect when they evaluate dozens of
 * deals at once. The card grid at /marketplace stays as the consumer-facing
 * browse experience; this page is for serious due diligence.
 *
 * Built on the DataTable primitive — sort, search, column-sort, pagination,
 * selection, bulk export. CSV export ships in a follow-up commit; this
 * page wires the API + table + branded shell.
 */
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Download, FileSpreadsheet, LayoutGrid, Table as TableIcon } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { Button, DataTable, EmptyState, Heading, Overline, Text, toast } from '@/components/ui'
import type { ColumnDef } from '@/components/ui'
import { palette, semantic, radius, space } from '@/styles/tokens'

interface Deal {
  id: string
  slug?: string
  title: string
  location: string
  country: string
  askingPrice: number
  annualRevenue: number
  ebitda: number
  profitMarginPercent: number
  dealQualityScore: number
  heatIndex: number
  roiProjection: number
  paybackPeriod: number
  growthRate: number
  status: 'NEW' | 'FEATURED' | 'STANDARD'
  category: string
  employeeCount: number
  sellerVerified: boolean
  daysOnMarket: number
  sellerType: string
  sellerMotivation: string
  financingEligible?: boolean
}

function fmtUSD(n: number): string {
  if (!n) return '—'
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toFixed(0)}`
}

function fmtPct(n: number): string {
  if (n == null) return '—'
  return `${Math.round(n)}%`
}

function statusBadge(status: Deal['status']) {
  const map = {
    FEATURED: { bg: palette.champagne[100], color: palette.champagne[800], label: 'Featured' },
    NEW: { bg: palette.emerald[50], color: palette.emerald[700], label: 'New' },
    STANDARD: { bg: palette.ink[50], color: palette.ink[600], label: 'Listed' },
  }[status] || { bg: palette.ink[50], color: palette.ink[600], label: 'Listed' }
  return (
    <span style={{
      display: 'inline-block',
      padding: `${space[1]} ${space[2]}`,
      borderRadius: radius.sm,
      background: map.bg,
      color: map.color,
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
    }}>{map.label}</span>
  )
}

export default function MarketplaceTablePage() {
  const router = useRouter()
  const [deals, setDeals] = useState<Deal[] | null>(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/deals')
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return
        if (Array.isArray(d.deals)) setDeals(d.deals)
        else setLoadError(true)
      })
      .catch(() => { if (!cancelled) setLoadError(true) })
    return () => { cancelled = true }
  }, [])

  const columns = useMemo<ColumnDef<Deal>[]>(() => [
    {
      accessorKey: 'title',
      header: 'Listing',
      cell: ({ row }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '220px' }}>
          <Text size="bodySm" tone="primary" style={{ fontWeight: 600 }}>{row.original.title}</Text>
          <Text size="caption" tone="tertiary">{row.original.location}</Text>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Industry',
      cell: ({ getValue }) => <Text size="bodySm" tone="secondary">{String(getValue() ?? '—').replace(/_/g, ' ')}</Text>,
    },
    {
      accessorKey: 'askingPrice',
      header: 'Asking',
      cell: ({ getValue }) => <Text size="bodySm" tone="primary">{fmtUSD(Number(getValue() ?? 0))}</Text>,
    },
    {
      accessorKey: 'annualRevenue',
      header: 'Revenue',
      cell: ({ getValue }) => <Text size="bodySm" tone="secondary">{fmtUSD(Number(getValue() ?? 0))}</Text>,
    },
    {
      accessorKey: 'ebitda',
      header: 'EBITDA',
      cell: ({ getValue }) => <Text size="bodySm" tone="secondary">{fmtUSD(Number(getValue() ?? 0))}</Text>,
    },
    {
      accessorKey: 'profitMarginPercent',
      header: 'Margin',
      cell: ({ getValue }) => <Text size="bodySm" tone="secondary">{fmtPct(Number(getValue() ?? 0))}</Text>,
    },
    {
      accessorKey: 'roiProjection',
      header: 'ROI',
      cell: ({ getValue }) => <Text size="bodySm" tone="secondary">{fmtPct(Number(getValue() ?? 0))}</Text>,
    },
    {
      accessorKey: 'heatIndex',
      header: 'Heat',
      cell: ({ getValue }) => {
        const v = Number(getValue() ?? 0)
        const tone = v >= 80 ? 'brand' : v >= 60 ? 'primary' : 'secondary'
        return <Text size="bodySm" tone={tone} style={{ fontWeight: 600 }}>{v}</Text>
      },
    },
    {
      accessorKey: 'dealQualityScore',
      header: 'Quality',
      cell: ({ getValue }) => <Text size="bodySm" tone="secondary">{Number(getValue() ?? 0)}</Text>,
    },
    {
      accessorKey: 'daysOnMarket',
      header: 'Days',
      cell: ({ getValue }) => <Text size="bodySm" tone="tertiary">{Number(getValue() ?? 0)}</Text>,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => statusBadge(row.original.status),
    },
  ], [])

  function exportCsv(rows: Deal[]) {
    const header = ['Title', 'Industry', 'Location', 'Asking (USD)', 'Revenue (USD)', 'EBITDA (USD)', 'Margin %', 'ROI %', 'Heat', 'Quality', 'Days', 'Status']
    const lines = rows.map((d) => [
      d.title,
      d.category,
      d.location,
      d.askingPrice,
      d.annualRevenue,
      d.ebitda,
      d.profitMarginPercent,
      d.roiProjection,
      d.heatIndex,
      d.dealQualityScore,
      d.daysOnMarket,
      d.status,
    ].map((v) => {
      const s = String(v ?? '')
      return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s
    }).join(','))
    const csv = [header.join(','), ...lines].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `forward-marketplace-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`Exported ${rows.length} ${rows.length === 1 ? 'listing' : 'listings'} to CSV`)
  }

  const isLoading = deals === null && !loadError

  return (
    <div style={{ minHeight: '100vh', background: semantic.surface.cream }}>
      <PublicHeader />

      {/* Header */}
      <div style={{ background: semantic.surface.default, borderBottom: `1px solid ${semantic.border.subtle}` }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: `${space[8]} ${space[6]}` }}>
          <Overline tone="brand" style={{ marginBottom: space[2] }}>Institutional view</Overline>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: space[6], flexWrap: 'wrap' }}>
            <div style={{ maxWidth: '720px' }}>
              <Heading level={1}>The Marketplace — Table View</Heading>
              <Text size="bodyLg" tone="secondary" style={{ marginTop: space[2] }}>
                Every active listing, sortable by financials, quality, and momentum. Built for the analyst tab that never closes.
              </Text>
            </div>
            <div style={{ display: 'flex', gap: space[2], flexShrink: 0 }}>
              <Link href="/marketplace" style={{ textDecoration: 'none' }}>
                <Button variant="ghost" size="md" leftIcon={<LayoutGrid size={16} />}>
                  Card view
                </Button>
              </Link>
              <Button
                variant="primary"
                size="md"
                leftIcon={<TableIcon size={16} />}
                disabled
              >
                Table view
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: `${space[6]} ${space[6]} ${space[16]}` }}>
        {loadError ? (
          <EmptyState
            icon={<FileSpreadsheet size={28} />}
            title="Couldn't load listings"
            body="The marketplace data didn't come back. Reload the page, or contact support if it persists."
            action={<Button variant="secondary" onClick={() => window.location.reload()}>Reload</Button>}
          />
        ) : (
          <DataTable<Deal>
            data={deals ?? []}
            columns={columns}
            loading={isLoading}
            searchPlaceholder="Search by title, industry, location…"
            selectable
            pageSize={25}
            onRowClick={(d) => router.push(d.slug ? `/listing/${d.slug}` : `/deal/${d.id}`)}
            getRowId={(d) => d.id}
            bulkActions={(rows) => (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Download size={14} />}
                  onClick={() => exportCsv(rows)}
                >
                  Export CSV
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  rightIcon={<ArrowRight size={14} />}
                  onClick={() => {
                    toast.info(`${rows.length} listings staged for outreach`, {
                      description: 'Bulk contact flow ships next iteration.',
                    })
                  }}
                >
                  Contact sellers
                </Button>
              </>
            )}
            emptyState={
              <EmptyState
                icon={<FileSpreadsheet size={28} />}
                title="No listings match your search"
                body="Try widening the search, or check back later — new listings publish every day."
              />
            }
          />
        )}
      </div>
    </div>
  )
}

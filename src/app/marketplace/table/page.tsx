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
import { ArrowRight, Download, ExternalLink, FileSpreadsheet, HelpCircle, LayoutGrid, Mail, Table as TableIcon } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { Badge, Button, DataTable, Drawer, EmptyState, Heading, Overline, Text, Tooltip, toast } from '@/components/ui'
import type { ColumnDef } from '@/components/ui'
import { palette, semantic, radius, space } from '@/styles/tokens'

/** Renders a tooltip-anchored column header so the buyer can hover to learn
 *  what a metric means without leaving the table. */
function H({ label, explain }: { label: string; explain: string }) {
  return (
    <Tooltip content={explain} side="top">
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'help' }}>
        {label}
        <HelpCircle size={11} style={{ color: semantic.text.tertiary }} />
      </span>
    </Tooltip>
  )
}

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
  // Drawer-based inspection — clicking a row opens a side panel with the
  // deal's full snapshot instead of leaving the table. PE / family-office
  // analysts can scan 30+ listings without losing position.
  const [active, setActive] = useState<Deal | null>(null)

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
      header: () => <H label="Margin" explain="EBITDA as a percentage of revenue. Higher = more efficient operations." />,
      cell: ({ getValue }) => <Text size="bodySm" tone="secondary">{fmtPct(Number(getValue() ?? 0))}</Text>,
    },
    {
      accessorKey: 'roiProjection',
      header: () => <H label="ROI" explain="Projected first-year return on the asking price (EBITDA ÷ Asking). Doesn't account for leverage or working-capital changes." />,
      cell: ({ getValue }) => <Text size="bodySm" tone="secondary">{fmtPct(Number(getValue() ?? 0))}</Text>,
    },
    {
      accessorKey: 'heatIndex',
      header: () => <H label="Heat" explain="Buyer-demand momentum signal (0–100). Combines view velocity, inbound inquiries, and saved-search hits over the last 14 days. 80+ = high attention." />,
      cell: ({ getValue }) => {
        const v = Number(getValue() ?? 0)
        const tone = v >= 80 ? 'brand' : v >= 60 ? 'primary' : 'secondary'
        return <Text size="bodySm" tone={tone} style={{ fontWeight: 600 }}>{v}</Text>
      },
    },
    {
      accessorKey: 'dealQualityScore',
      header: () => <H label="Quality" explain="Forward's listing-quality score (0–100). Considers financial completeness, verified-financials badge, photo count, and historical close rates for similar deals." />,
      cell: ({ getValue }) => <Text size="bodySm" tone="secondary">{Number(getValue() ?? 0)}</Text>,
    },
    {
      accessorKey: 'daysOnMarket',
      header: () => <H label="Days" explain="Days since the listing was published. Use alongside Heat as a freshness check — long DOM with low heat often means stale pricing." />,
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
            onRowClick={(d) => setActive(d)}
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

      {/* Deal-detail Drawer — opens on row click. Lets analysts scan & dismiss
          without leaving the table. The full /listing page is still available
          via the "Open full listing" CTA. */}
      <Drawer
        open={active != null}
        onClose={() => setActive(null)}
        title={active?.title}
        description={active ? `${String(active.category).replace(/_/g, ' ')} · ${active.location}` : undefined}
        size="lg"
      >
        {active && <DealDetailPanel deal={active} onOpenFull={() => router.push(active.slug ? `/listing/${active.slug}` : `/deal/${active.id}`)} />}
      </Drawer>
    </div>
  )
}

function DealDetailPanel({ deal, onOpenFull }: { deal: Deal; onOpenFull: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space[6] }}>
      {/* Status row */}
      <div style={{ display: 'flex', gap: space[2], flexWrap: 'wrap' }}>
        {statusBadge(deal.status)}
        {deal.sellerVerified && <Badge tone="success">Verified seller</Badge>}
        {deal.financingEligible && <Badge tone="brand">Financing eligible</Badge>}
      </div>

      {/* Financials grid */}
      <div>
        <Overline tone="brand" style={{ marginBottom: space[3] }}>Financials</Overline>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: space[4] }}>
          <Stat label="Asking" value={fmtUSD(deal.askingPrice)} />
          <Stat label="Revenue (LTM)" value={fmtUSD(deal.annualRevenue)} />
          <Stat label="EBITDA" value={fmtUSD(deal.ebitda)} />
          <Stat label="Margin" value={fmtPct(deal.profitMarginPercent)} />
          <Stat label="Projected ROI" value={fmtPct(deal.roiProjection)} />
          <Stat label="Payback" value={`${deal.paybackPeriod} mo`} />
        </div>
      </div>

      {/* Forward signals */}
      <div>
        <Overline tone="brand" style={{ marginBottom: space[3] }}>Forward signals</Overline>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: space[4] }}>
          <Stat label="Heat" value={String(deal.heatIndex)} tone={deal.heatIndex >= 80 ? 'brand' : 'primary'} />
          <Stat label="Quality" value={String(deal.dealQualityScore)} />
          <Stat label="Days on market" value={String(deal.daysOnMarket)} />
        </div>
      </div>

      {/* Seller intent */}
      <div>
        <Overline tone="brand" style={{ marginBottom: space[3] }}>Seller intent</Overline>
        <div style={{ display: 'flex', flexDirection: 'column', gap: space[2] }}>
          <Text size="bodySm" tone="secondary">Seller type: {String(deal.sellerType ?? '—').replace(/_/g, ' ')}</Text>
          <Text size="bodySm" tone="secondary">Motivation: {String(deal.sellerMotivation ?? '—').replace(/_/g, ' ')}</Text>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: space[2], paddingTop: space[4], borderTop: `1px solid ${semantic.border.subtle}` }}>
        <Button variant="primary" leftIcon={<Mail size={14} />} onClick={() => toast.info('Contact seller flow opens on the listing page')}>
          Contact seller
        </Button>
        <Button variant="secondary" rightIcon={<ExternalLink size={14} />} onClick={onOpenFull}>
          Open full listing
        </Button>
      </div>
    </div>
  )
}

function Stat({ label, value, tone = 'primary' }: { label: string; value: string; tone?: 'primary' | 'brand' }) {
  return (
    <div>
      <Text size="caption" tone="tertiary" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</Text>
      <Text size="bodyLg" tone={tone} style={{ fontWeight: 600, marginTop: '2px' }}>{value}</Text>
    </div>
  )
}

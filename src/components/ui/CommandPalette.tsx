/**
 * CommandPalette — Linear / Vercel-style ⌘K navigator.
 *
 * Global shortcut: ⌘K (Mac) / Ctrl+K (Windows-Linux).
 * Type to filter. Enter to navigate. Esc to close.
 *
 * Mounted once at the app root via <CommandPaletteProvider />. Feature code
 * never instantiates this directly — use the provider and let it handle the
 * keyboard listener + portal.
 */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import {
  Briefcase, Building2, FileText, LayoutGrid, LineChart, MessageSquare,
  Plus, Search, Settings, Sparkles, Star, Table, User, Wallet,
} from 'lucide-react'
import { palette, semantic, radius, shadow, space, typography, z } from '@/styles/tokens'

interface NavItem {
  label: string
  href: string
  group: string
  icon: React.ReactNode
  keywords?: string
}

const ITEMS: NavItem[] = [
  // Discover
  { label: 'Browse marketplace', href: '/marketplace',         group: 'Discover', icon: <LayoutGrid size={14} />, keywords: 'deals listings browse' },
  { label: 'Table view',         href: '/marketplace/table',   group: 'Discover', icon: <Table size={14} />,     keywords: 'institutional list spreadsheet csv' },
  { label: 'Insights',           href: '/market-insights',     group: 'Discover', icon: <LineChart size={14} />, keywords: 'market analytics report' },
  { label: 'Brokers',            href: '/brokers',             group: 'Discover', icon: <Building2 size={14} />, keywords: 'directory advisors' },
  { label: 'Finance Center',     href: '/finance-center',      group: 'Discover', icon: <Wallet size={14} />,    keywords: 'lender financing sba bdc murabaha' },
  // Act
  { label: 'List my company',    href: '/list',                group: 'Act',      icon: <Plus size={14} />,      keywords: 'sell publish' },
  { label: 'Saved searches',     href: '/saved-searches',      group: 'Act',      icon: <Search size={14} />,    keywords: 'alerts notifications' },
  { label: 'Saved listings',     href: '/saved',               group: 'Act',      icon: <Star size={14} />,      keywords: 'favorites favourites watchlist' },
  { label: 'Valuation',          href: '/valuation',           group: 'Act',      icon: <Sparkles size={14} />,  keywords: 'value tool estimate' },
  // Account
  { label: 'Dashboard',          href: '/dashboard',           group: 'Account',  icon: <Briefcase size={14} />, keywords: 'home overview' },
  { label: 'Messages',           href: '/messages',            group: 'Account',  icon: <MessageSquare size={14} />, keywords: 'inbox' },
  { label: 'Documents',          href: '/documents',           group: 'Account',  icon: <FileText size={14} />,  keywords: 'files vault' },
  { label: 'Settings',           href: '/account',             group: 'Account',  icon: <Settings size={14} />,  keywords: 'profile preferences' },
  // Learn
  { label: 'Pricing',            href: '/pricing',             group: 'Learn',    icon: <User size={14} />,      keywords: 'plans tiers premium' },
  { label: 'Learning Center',    href: '/learning-center',     group: 'Learn',    icon: <FileText size={14} />,  keywords: 'guides articles' },
  { label: 'Help',               href: '/help',                group: 'Learn',    icon: <MessageSquare size={14} />, keywords: 'support contact faq' },
]

const GROUPS = ['Discover', 'Act', 'Account', 'Learn'] as const

export function CommandPaletteProvider() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function go(href: string) {
    setOpen(false)
    router.push(href)
  }

  return (
    <>
      {/* Backdrop must be a SIBLING of Command.Dialog — not a child.
          The dialog uses `transform: translateX(-50%)`, which makes any
          `position: fixed` descendant get positioned relative to (and
          clipped by) the dialog box instead of the viewport. Nesting it
          inside made the overlay paint only inside the popup, which is
          why the panel looked washed-out grey. */}
      <Backdrop visible={open} onClick={() => setOpen(false)} />
      <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command palette"
      style={{
        position: 'fixed',
        top: '15vh',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '92vw',
        maxWidth: '560px',
        zIndex: z.modal,
        background: semantic.surface.default,
        borderRadius: radius.lg,
        boxShadow: shadow.xl,
        border: `1px solid ${semantic.border.subtle}`,
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: space[3], padding: `${space[3]} ${space[4]}`, borderBottom: `1px solid ${semantic.border.subtle}` }}>
        <Search size={16} style={{ color: semantic.text.tertiary }} />
        <Command.Input
          autoFocus
          placeholder="Type to search · ⌘K to toggle"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontFamily: typography.fontFamily.sans,
            fontSize: typography.style.body.fontSize,
            color: semantic.text.primary,
          }}
        />
        <kbd style={{
          padding: '2px 6px',
          borderRadius: radius.sm,
          border: `1px solid ${semantic.border.default}`,
          fontSize: '11px',
          color: semantic.text.tertiary,
          fontFamily: typography.fontFamily.mono,
        }}>esc</kbd>
      </div>
      <Command.List style={{
        maxHeight: '400px',
        overflowY: 'auto',
        padding: space[2],
      }}>
        <Command.Empty style={{
          padding: `${space[6]} ${space[3]}`,
          textAlign: 'center',
          color: semantic.text.tertiary,
          fontSize: typography.style.bodySm.fontSize,
        }}>
          No results. Try a different term.
        </Command.Empty>
        {GROUPS.map((group) => (
          <Command.Group
            key={group}
            heading={group}
            style={{}}
          >
            <div style={{
              padding: `${space[2]} ${space[3]} ${space[1]}`,
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: semantic.text.tertiary,
            }}>{group}</div>
            {ITEMS.filter((i) => i.group === group).map((item) => (
              <Command.Item
                key={item.href}
                value={`${item.label} ${item.keywords ?? ''}`}
                onSelect={() => go(item.href)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: space[3],
                  padding: `${space[2]} ${space[3]}`,
                  borderRadius: radius.md,
                  fontSize: typography.style.bodySm.fontSize,
                  color: semantic.text.primary,
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = palette.cream[100] }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ color: semantic.text.brand, display: 'inline-flex' }}>{item.icon}</span>
                {item.label}
              </Command.Item>
            ))}
          </Command.Group>
        ))}
      </Command.List>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${space[2]} ${space[4]}`,
        borderTop: `1px solid ${semantic.border.subtle}`,
        background: palette.cream[50],
        fontSize: '11px',
        color: semantic.text.tertiary,
      }}>
        <span>Forward · navigate anywhere</span>
        <span>
          <kbd style={kbdStyle}>↑</kbd>{' '}<kbd style={kbdStyle}>↓</kbd>{' '}to move · <kbd style={kbdStyle}>↵</kbd>{' '}to open
        </span>
      </div>
    </Command.Dialog>
    </>
  )
}

const kbdStyle: React.CSSProperties = {
  padding: '1px 5px',
  borderRadius: radius.sm,
  border: `1px solid ${semantic.border.default}`,
  fontFamily: typography.fontFamily.mono,
}

function Backdrop({ visible, onClick }: { visible: boolean; onClick: () => void }) {
  if (!visible) return null
  return (
    <div
      onClick={onClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: semantic.surface.overlay,
        zIndex: z.modal - 1,
      }}
    />
  )
}

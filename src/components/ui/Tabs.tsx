/**
 * Tabs — segmented navigation for switching between related views without
 * leaving the page. Radix-backed for accessibility (arrow keys, focus mgmt).
 *
 * Underline indicator in champagne. Use for inline view-switching only;
 * for actual page navigation use Link.
 *
 *   <Tabs value={view} onValueChange={setView}>
 *     <TabsList>
 *       <TabsTrigger value="overview">Overview</TabsTrigger>
 *       <TabsTrigger value="financials">Financials</TabsTrigger>
 *     </TabsList>
 *     <TabsContent value="overview">…</TabsContent>
 *     <TabsContent value="financials">…</TabsContent>
 *   </Tabs>
 */
'use client'

import { ReactNode } from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { semantic, space, typography } from '@/styles/tokens'

interface TabsProps {
  value: string
  onValueChange: (v: string) => void
  children: ReactNode
  defaultValue?: string
}

export function Tabs({ value, onValueChange, children, defaultValue }: TabsProps) {
  return (
    <TabsPrimitive.Root value={value} defaultValue={defaultValue} onValueChange={onValueChange}>
      {children}
    </TabsPrimitive.Root>
  )
}

export function TabsList({ children }: { children: ReactNode }) {
  return (
    <TabsPrimitive.List
      style={{
        display: 'flex',
        gap: space[1],
        borderBottom: `1px solid ${semantic.border.subtle}`,
        marginBottom: space[5],
      }}
    >
      {children}
    </TabsPrimitive.List>
  )
}

export function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  return (
    <TabsPrimitive.Trigger
      value={value}
      style={{
        position: 'relative',
        padding: `${space[3]} ${space[4]}`,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontFamily: typography.fontFamily.sans,
        fontSize: typography.style.bodySm.fontSize,
        fontWeight: 600,
        color: semantic.text.secondary,
        marginBottom: '-1px',
      }}
      className="fw-tab-trigger"
    >
      {children}
      <style>{`
        .fw-tab-trigger[data-state="active"] {
          color: ${semantic.text.primary};
        }
        .fw-tab-trigger[data-state="active"]::after {
          content: "";
          position: absolute;
          left: ${space[4]};
          right: ${space[4]};
          bottom: 0;
          height: 2px;
          background: ${semantic.action.accent};
          border-radius: 2px;
        }
      `}</style>
    </TabsPrimitive.Trigger>
  )
}

export function TabsContent({ value, children }: { value: string; children: ReactNode }) {
  return (
    <TabsPrimitive.Content value={value}>
      {children}
    </TabsPrimitive.Content>
  )
}

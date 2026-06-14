/**
 * Drawer — side-panel that slides in from the right (default) or left.
 *
 * Use for inspection / detail without losing context. The marketplace's
 * deal-detail surface should be a Drawer rather than a full page nav: PE
 * buyers scan-and-flick through 50 listings without ever leaving the table.
 *
 *   <Drawer open={open} onClose={...} title="TechFlow Solutions" size="lg">
 *     <DealDetails />
 *   </Drawer>
 */
'use client'

import { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { palette, semantic, radius, shadow, space, typography, z } from '@/styles/tokens'
import { Heading } from './Typography'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  side?: 'left' | 'right'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: ReactNode
}

const sizeMap = { sm: '360px', md: '480px', lg: '640px', xl: '880px' }

export function Drawer({
  open, onClose, title, description, side = 'right', size = 'md', children,
}: DrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: 'fixed', inset: 0,
            background: semantic.surface.overlay,
            zIndex: z.drawer - 1,
          }}
        />
        <Dialog.Content
          style={{
            position: 'fixed',
            top: 0, bottom: 0,
            [side]: 0,
            width: '92vw',
            maxWidth: sizeMap[size],
            background: semantic.surface.default,
            boxShadow: shadow.xl,
            zIndex: z.drawer,
            display: 'flex',
            flexDirection: 'column',
            ...(side === 'right'
              ? { borderTopLeftRadius: radius.lg, borderBottomLeftRadius: radius.lg }
              : { borderTopRightRadius: radius.lg, borderBottomRightRadius: radius.lg }
            ),
          }}
        >
          {(title || description) && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: space[3],
              padding: `${space[5]} ${space[6]}`,
              borderBottom: `1px solid ${semantic.border.subtle}`,
              background: palette.cream[50],
              flexShrink: 0,
            }}>
              <div>
                {title && <Dialog.Title asChild><Heading level={3}>{title}</Heading></Dialog.Title>}
                {description && (
                  <Dialog.Description style={{
                    marginTop: space[1],
                    fontFamily: typography.fontFamily.sans,
                    fontSize: typography.style.bodySm.fontSize,
                    color: semantic.text.secondary,
                  }}>{description}</Dialog.Description>
                )}
              </div>
              <Dialog.Close asChild>
                <button
                  aria-label="Close"
                  style={{
                    padding: space[1],
                    borderRadius: radius.sm,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: semantic.text.tertiary,
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = palette.ink[100] }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                >
                  <X size={16} />
                </button>
              </Dialog.Close>
            </div>
          )}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: `${space[5]} ${space[6]}`,
          }}>
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

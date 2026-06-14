/**
 * Modal — centered dialog. Use for focused, blocking interactions:
 * confirmation prompts, KYC submission, settings edits. For complex flows
 * (multi-step wizards, detail panels) reach for <Drawer> instead.
 *
 *   <Modal open={open} onClose={() => setOpen(false)} title="Confirm">
 *     <Text>Are you sure?</Text>
 *     <ModalActions>
 *       <Button variant="secondary" onClick={...}>Cancel</Button>
 *       <Button variant="danger" onClick={...}>Delete</Button>
 *     </ModalActions>
 *   </Modal>
 */
'use client'

import { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { palette, semantic, radius, shadow, space, typography, z } from '@/styles/tokens'
import { Heading } from './Typography'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const sizeMap = { sm: '420px', md: '560px', lg: '720px' }

export function Modal({ open, onClose, title, description, size = 'md', children }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: 'fixed', inset: 0,
            background: semantic.surface.overlay,
            zIndex: z.modal - 1,
            animation: 'fadeIn 180ms ease',
          }}
        />
        <Dialog.Content
          style={{
            position: 'fixed',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '92vw',
            maxWidth: sizeMap[size],
            maxHeight: '85vh',
            overflowY: 'auto',
            background: semantic.surface.default,
            borderRadius: radius.lg,
            boxShadow: shadow.xl,
            zIndex: z.modal,
            padding: space[6],
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: space[3], marginBottom: space[3] }}>
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
                onMouseEnter={(e) => { e.currentTarget.style.background = palette.ink[50] }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function ModalActions({ children }: { children: ReactNode }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-end',
      gap: space[2],
      marginTop: space[6],
      paddingTop: space[4],
      borderTop: `1px solid ${semantic.border.subtle}`,
    }}>
      {children}
    </div>
  )
}

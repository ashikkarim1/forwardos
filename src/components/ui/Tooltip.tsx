/**
 * Tooltip — branded, accessible, Radix-backed.
 *
 * Use to explain jargon, expand on icons, surface keyboard shortcuts, and
 * clarify any UI element whose meaning isn't visually obvious.
 *
 * Don't use for primary content. If the text matters, it doesn't belong in
 * a tooltip — render it inline.
 *
 *   <Tooltip content="What this means…">
 *     <button>?</button>
 *   </Tooltip>
 *
 * The trigger MUST be a single focusable element (a button, link, etc.).
 */
'use client'

import { ReactNode } from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { semantic, palette, radius, shadow, space, typography, motion, z } from '@/styles/tokens'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  delayDuration?: number
}

export function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  delayDuration = 200,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={6}
            style={{
              maxWidth: '280px',
              padding: `${space[2]} ${space[3]}`,
              background: palette.ink[800],
              color: semantic.text.inverse,
              borderRadius: radius.sm,
              boxShadow: shadow.lg,
              fontFamily: typography.fontFamily.sans,
              fontSize: typography.style.bodySm.fontSize,
              lineHeight: typography.style.bodySm.lineHeight,
              fontWeight: 400,
              zIndex: z.tooltip,
              animationDuration: motion.duration.fast,
            }}
          >
            {content}
            <TooltipPrimitive.Arrow style={{ fill: palette.ink[800] }} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

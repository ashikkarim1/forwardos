/**
 * Toast — branded Sonner provider + a typed helper API.
 *
 * Replace `console.error(...)` and silent fail patterns with `toast.error()`.
 * Use `toast.success()` after any mutation completes. Use `toast.info()`
 * sparingly (it's a low-signal channel; default to silence).
 *
 * The Toaster is mounted once in the root layout. All you import in feature
 * code is the `toast` helper.
 *
 *   import { toast } from '@/components/ui'
 *   toast.success('Listing published')
 *   toast.error('Couldn't save — try again')
 */
'use client'

import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner'
import { palette, semantic, radius, shadow, typography } from '@/styles/tokens'

/** Mount once at the top of the app tree. */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors={false}
      closeButton
      gap={8}
      duration={4000}
      toastOptions={{
        style: {
          background: semantic.surface.default,
          color: semantic.text.primary,
          border: `1px solid ${semantic.border.subtle}`,
          borderRadius: radius.md,
          boxShadow: shadow.lg,
          fontFamily: typography.fontFamily.sans,
          fontSize: typography.style.bodySm.fontSize,
          padding: '12px 14px',
        },
        classNames: {
          success: 'fw-toast-success',
          error: 'fw-toast-error',
          warning: 'fw-toast-warning',
          info: 'fw-toast-info',
        },
      }}
    />
  )
}

/**
 * Typed wrapper. Don't import Sonner directly elsewhere — import `toast`
 * from `@/components/ui` so we can keep the style centralised here.
 */
export const toast = {
  success: (message: string, opts?: { description?: string }) =>
    sonnerToast.success(message, {
      description: opts?.description,
      style: { borderLeft: `3px solid ${palette.emerald[500]}` },
    }),
  error: (message: string, opts?: { description?: string }) =>
    sonnerToast.error(message, {
      description: opts?.description,
      style: { borderLeft: `3px solid ${palette.crimson[500]}` },
    }),
  warning: (message: string, opts?: { description?: string }) =>
    sonnerToast.warning(message, {
      description: opts?.description,
      style: { borderLeft: `3px solid ${palette.amber[500]}` },
    }),
  info: (message: string, opts?: { description?: string }) =>
    sonnerToast(message, {
      description: opts?.description,
      style: { borderLeft: `3px solid ${palette.champagne[500]}` },
    }),
  promise: sonnerToast.promise,
  dismiss: sonnerToast.dismiss,
}

/**
 * Button — the only allowed way to render a clickable action.
 *
 * Replace every <button className="..." style={{background: COLOR_ACCENT}}>
 * with <Button variant="primary"> etc. There are exactly 5 variants × 3 sizes
 * — anything beyond that is reinventing the system.
 *
 * Variants:
 *   primary   — ink button on white/cream. The default for the highest-intent
 *               action on the page. Luxurious, confident. Use sparingly: max
 *               one primary per page.
 *   accent    — champagne button. Reserved for brand moments (premium upgrade,
 *               featured listing, signature CTA on marketing pages).
 *   secondary — ink-outlined on white. Use for the second action next to a
 *               primary (e.g. "Save draft" next to "Publish").
 *   ghost     — ink text only, no background, hover adds soft ink-50. Use for
 *               tertiary actions and toolbar buttons.
 *   danger    — crimson. Reserved for destructive actions (delete, cancel sub).
 *
 * Sizes:
 *   sm — 32px tall. Use in dense toolbars, table rows, chip rows.
 *   md — 40px tall. Default. Forms, cards, page headers.
 *   lg — 48px tall. Hero CTAs only.
 */
'use client'

import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { palette, semantic, radius, space, typography, motion, shadow } from '@/styles/tokens'

type Variant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  loading?: boolean
  fullWidth?: boolean
}

const sizeStyle: Record<Size, { height: string; padX: string; fontSize: string; iconGap: string }> = {
  sm: { height: '32px', padX: space[3], fontSize: typography.style.bodySm.fontSize, iconGap: space[2] },
  md: { height: '40px', padX: space[4], fontSize: typography.style.body.fontSize,   iconGap: space[2] },
  lg: { height: '48px', padX: space[6], fontSize: typography.style.bodyLg.fontSize, iconGap: space[3] },
}

function variantStyle(variant: Variant) {
  switch (variant) {
    case 'primary':
      return {
        background: semantic.action.primary,
        color: semantic.text.inverse,
        border: '1px solid transparent',
        hoverBg: semantic.action.primaryHover,
        activeBg: semantic.action.primaryActive,
      }
    case 'accent':
      return {
        background: semantic.action.accent,
        color: semantic.text.inverse,
        border: '1px solid transparent',
        hoverBg: semantic.action.accentHover,
        activeBg: semantic.action.accentActive,
      }
    case 'secondary':
      return {
        background: semantic.surface.default,
        color: semantic.text.primary,
        border: `1px solid ${semantic.border.default}`,
        hoverBg: palette.ink[50],
        activeBg: palette.ink[100],
      }
    case 'ghost':
      return {
        background: 'transparent',
        color: semantic.text.primary,
        border: '1px solid transparent',
        hoverBg: palette.ink[50],
        activeBg: palette.ink[100],
      }
    case 'danger':
      return {
        background: semantic.action.danger,
        color: semantic.text.inverse,
        border: '1px solid transparent',
        hoverBg: semantic.action.dangerHover,
        activeBg: palette.crimson[700],
      }
  }
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    loading = false,
    fullWidth = false,
    disabled,
    children,
    className,
    style,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    ...rest
  },
  ref,
) {
  const v = variantStyle(variant)
  const s = sizeStyle[size]
  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={className}
      data-variant={variant}
      data-size={size}
      style={{
        // box
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.iconGap,
        height: s.height,
        padding: `0 ${s.padX}`,
        borderRadius: radius.md,
        // visual
        background: v.background,
        color: v.color,
        border: v.border,
        // type
        fontFamily: typography.fontFamily.sans,
        fontSize: s.fontSize,
        fontWeight: 600,
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
        // interaction
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1,
        transition: `background ${motion.duration.fast} ${motion.easing.standard}, transform ${motion.duration.fast} ${motion.easing.standard}, box-shadow ${motion.duration.fast} ${motion.easing.standard}`,
        boxShadow: shadow.none,
        // accessibility
        outline: 'none',
        // size
        width: fullWidth ? '100%' : undefined,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) e.currentTarget.style.background = v.hoverBg
        onMouseEnter?.(e)
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) e.currentTarget.style.background = v.background
        onMouseLeave?.(e)
      }}
      onMouseDown={(e) => {
        if (!isDisabled) e.currentTarget.style.background = v.activeBg
        onMouseDown?.(e)
      }}
      onMouseUp={(e) => {
        if (!isDisabled) e.currentTarget.style.background = v.hoverBg
        onMouseUp?.(e)
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = shadow.focus
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = shadow.none
      }}
      {...rest}
    >
      {loading ? <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  )
})

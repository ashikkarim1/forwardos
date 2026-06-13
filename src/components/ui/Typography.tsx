/**
 * Typography primitives — the only allowed way to render text in the app.
 *
 * Replace every `text-4xl font-black` / inline fontSize with one of these.
 * If a style is missing, add it to typography.style in src/styles/tokens.ts,
 * then expose it here. Never invent a font-size in component code.
 *
 * Brand voice: ink-on-cream for editorial moments, ink-on-white for app
 * moments, champagne-700 for brand text (it reads premium darker than 500).
 */
import { ElementType, ReactNode, CSSProperties } from 'react'
import { typography, semantic } from '@/styles/tokens'

type StyleKey = keyof typeof typography.style
type Tone = 'primary' | 'secondary' | 'tertiary' | 'muted' | 'inverse' | 'brand' | 'success' | 'danger'

const toneToColor: Record<Tone, string> = {
  primary:   semantic.text.primary,
  secondary: semantic.text.secondary,
  tertiary:  semantic.text.tertiary,
  muted:     semantic.text.muted,
  inverse:   semantic.text.inverse,
  brand:     semantic.text.brand,
  success:   semantic.status.success,
  danger:    semantic.status.danger,
}

interface TextProps {
  as?: ElementType
  size?: StyleKey
  tone?: Tone
  align?: 'left' | 'center' | 'right'
  truncate?: boolean
  children: ReactNode
  className?: string
  style?: CSSProperties
  id?: string
}

export function Text({
  as: Component = 'p',
  size = 'body',
  tone = 'primary',
  align,
  truncate = false,
  children,
  className,
  style,
  id,
}: TextProps) {
  const s = typography.style[size]
  const merged: CSSProperties = {
    ...s,
    color: toneToColor[tone],
    margin: 0,
    ...(align ? { textAlign: align } : {}),
    ...(truncate ? { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } : {}),
    ...style,
  }
  return <Component id={id} className={className} style={merged}>{children}</Component>
}

interface HeadingProps extends Omit<TextProps, 'size' | 'as'> {
  level: 1 | 2 | 3 | 4 | 5
}

export function Heading({ level, tone = 'primary', ...rest }: HeadingProps) {
  const sizeMap: Record<HeadingProps['level'], StyleKey> = {
    1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5',
  }
  const asMap: Record<HeadingProps['level'], ElementType> = {
    1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5',
  }
  return <Text as={asMap[level]} size={sizeMap[level]} tone={tone} {...rest} />
}

export function Display({ tone = 'primary', ...rest }: Omit<TextProps, 'size'>) {
  return <Text as="h1" size="display" tone={tone} {...rest} />
}

/** Eyebrow/overline label — small uppercase tracking. Use above headings. */
export function Overline({ tone = 'brand', ...rest }: Omit<TextProps, 'size'>) {
  return <Text as="div" size="overline" tone={tone} {...rest} />
}

/** Small mono text for IDs, prices, code-like values. */
export function Mono({
  children, tone = 'secondary', className, style,
}: { children: ReactNode; tone?: Tone; className?: string; style?: CSSProperties }) {
  return (
    <span className={className} style={{
      fontFamily: typography.fontFamily.mono,
      fontSize: typography.style.bodySm.fontSize,
      color: toneToColor[tone],
      ...style,
    }}>
      {children}
    </span>
  )
}

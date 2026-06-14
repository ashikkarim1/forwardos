/**
 * Form primitives — the only allowed way to render text inputs, selects,
 * checkboxes, and switches.
 *
 * Pattern:
 *   <TextField label="Email" required value={email} onChange={...} />
 *   <Select label="Country" options={[...]} value={c} onChange={...} />
 *   <Checkbox label="Anonymous listing" checked={a} onChange={...} />
 *   <Switch label="Featured" checked={f} onChange={...} />
 *
 * All four wrap a labelled field with optional hint + error. Inline error
 * surfaces below on `error` prop. Focus ring uses the champagne token. No
 * inline hex.
 */
'use client'

import { forwardRef, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, useId } from 'react'
import { palette, semantic, radius, shadow, space, typography, motion } from '@/styles/tokens'

type Tone = 'default' | 'error'

function fieldFrameStyle(tone: Tone): React.CSSProperties {
  return {
    width: '100%',
    padding: `${space[2]} ${space[3]}`,
    borderRadius: radius.md,
    background: semantic.surface.default,
    border: `1px solid ${tone === 'error' ? palette.crimson[400] : semantic.border.default}`,
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.style.body.fontSize,
    lineHeight: typography.style.body.lineHeight,
    color: semantic.text.primary,
    outline: 'none',
    transition: `border ${motion.duration.fast} ${motion.easing.standard}, box-shadow ${motion.duration.fast} ${motion.easing.standard}`,
  }
}

function FieldShell({
  label, hint, error, htmlFor, required, children,
}: {
  label?: string
  hint?: string
  error?: string
  htmlFor?: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space[1] }}>
      {label && (
        <label
          htmlFor={htmlFor}
          style={{
            fontFamily: typography.fontFamily.sans,
            fontSize: typography.style.bodySm.fontSize,
            fontWeight: 600,
            color: semantic.text.primary,
            marginBottom: '2px',
          }}
        >
          {label}{required && <span style={{ color: palette.crimson[500], marginLeft: 4 }}>*</span>}
        </label>
      )}
      {hint && !error && (
        <span style={{
          fontFamily: typography.fontFamily.sans,
          fontSize: typography.style.caption.fontSize,
          color: semantic.text.tertiary,
          marginBottom: space[1],
        }}>{hint}</span>
      )}
      {children}
      {error && (
        <span style={{
          fontFamily: typography.fontFamily.sans,
          fontSize: typography.style.caption.fontSize,
          color: palette.crimson[600],
          marginTop: space[1],
        }}>{error}</span>
      )}
    </div>
  )
}

// ━━━ TextField ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  hint?: string
  error?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, leftIcon, rightIcon, id, required, style, ...rest },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const tone: Tone = error ? 'error' : 'default'

  return (
    <FieldShell label={label} hint={hint} error={error} htmlFor={inputId} required={required}>
      <div style={{ position: 'relative', width: '100%' }}>
        {leftIcon && (
          <span style={{
            position: 'absolute', left: space[3], top: '50%', transform: 'translateY(-50%)',
            color: semantic.text.tertiary, display: 'inline-flex',
          }}>{leftIcon}</span>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          style={{
            ...fieldFrameStyle(tone),
            paddingLeft: leftIcon ? '36px' : space[3],
            paddingRight: rightIcon ? '36px' : space[3],
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = tone === 'error' ? palette.crimson[500] : palette.champagne[400]
            e.currentTarget.style.boxShadow = shadow.focus
            rest.onFocus?.(e)
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = tone === 'error' ? palette.crimson[400] : semantic.border.default
            e.currentTarget.style.boxShadow = shadow.none
            rest.onBlur?.(e)
          }}
          {...rest}
        />
        {rightIcon && (
          <span style={{
            position: 'absolute', right: space[3], top: '50%', transform: 'translateY(-50%)',
            color: semantic.text.tertiary, display: 'inline-flex',
          }}>{rightIcon}</span>
        )}
      </div>
    </FieldShell>
  )
})

// ━━━ Select ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string
  hint?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, options, placeholder, id, required, style, ...rest },
  ref,
) {
  const autoId = useId()
  const selectId = id ?? autoId
  const tone: Tone = error ? 'error' : 'default'

  return (
    <FieldShell label={label} hint={hint} error={error} htmlFor={selectId} required={required}>
      <select
        ref={ref}
        id={selectId}
        required={required}
        style={{
          ...fieldFrameStyle(tone),
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 4.5L6 7.5L9 4.5' stroke='%236C7480' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: `right ${space[3]} center`,
          paddingRight: '32px',
          cursor: 'pointer',
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = tone === 'error' ? palette.crimson[500] : palette.champagne[400]
          e.currentTarget.style.boxShadow = shadow.focus
          rest.onFocus?.(e)
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = tone === 'error' ? palette.crimson[400] : semantic.border.default
          e.currentTarget.style.boxShadow = shadow.none
          rest.onBlur?.(e)
        }}
        {...rest}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>
        ))}
      </select>
    </FieldShell>
  )
})

// ━━━ Checkbox ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode
  description?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, id, disabled, style, ...rest },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <label
      htmlFor={inputId}
      style={{
        display: 'flex',
        gap: space[3],
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        disabled={disabled}
        style={{
          marginTop: '2px',
          width: '16px',
          height: '16px',
          accentColor: semantic.action.accent,
          cursor: disabled ? 'not-allowed' : 'pointer',
          flexShrink: 0,
          ...style,
        }}
        {...rest}
      />
      {(label || description) && (
        <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {label && (
            <span style={{
              fontFamily: typography.fontFamily.sans,
              fontSize: typography.style.bodySm.fontSize,
              fontWeight: 500,
              color: semantic.text.primary,
            }}>{label}</span>
          )}
          {description && (
            <span style={{
              fontFamily: typography.fontFamily.sans,
              fontSize: typography.style.caption.fontSize,
              color: semantic.text.tertiary,
            }}>{description}</span>
          )}
        </span>
      )}
    </label>
  )
})

// ━━━ Switch ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SwitchProps {
  label?: ReactNode
  description?: string
  checked: boolean
  onChange: (next: boolean) => void
  disabled?: boolean
  id?: string
}

export function Switch({ label, description, checked, onChange, disabled, id }: SwitchProps) {
  const autoId = useId()
  const switchId = id ?? autoId
  return (
    <label
      htmlFor={switchId}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: space[3],
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        style={{
          position: 'relative',
          width: '34px',
          height: '20px',
          borderRadius: radius.full,
          background: checked ? semantic.action.accent : palette.ink[200],
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: `background ${motion.duration.fast} ${motion.easing.standard}`,
          flexShrink: 0,
        }}
      >
        <span style={{
          position: 'absolute',
          top: '2px',
          left: checked ? '16px' : '2px',
          width: '16px',
          height: '16px',
          borderRadius: radius.full,
          background: '#FFFFFF',
          boxShadow: shadow.sm,
          transition: `left ${motion.duration.fast} ${motion.easing.standard}`,
        }} />
      </button>
      {(label || description) && (
        <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {label && (
            <span style={{
              fontFamily: typography.fontFamily.sans,
              fontSize: typography.style.bodySm.fontSize,
              fontWeight: 500,
              color: semantic.text.primary,
            }}>{label}</span>
          )}
          {description && (
            <span style={{
              fontFamily: typography.fontFamily.sans,
              fontSize: typography.style.caption.fontSize,
              color: semantic.text.tertiary,
            }}>{description}</span>
          )}
        </span>
      )}
    </label>
  )
}

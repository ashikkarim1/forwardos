/**
 * EmptyState — the only allowed way to render "nothing here yet" UI.
 *
 * Every list view, dashboard module, and filtered surface should render this
 * (or pass it to DataTable's emptyState prop) instead of blank pixels.
 *
 * Pattern:
 *   <EmptyState
 *     icon={<Search size={28} />}
 *     title="No deals match your filters"
 *     body="Try widening the price range or selecting more industries."
 *     action={<Button variant="secondary" onClick={clear}>Clear filters</Button>}
 *   />
 */
import { ReactNode } from 'react'
import { palette, semantic, radius, space, typography } from '@/styles/tokens'
import { Text, Heading } from './Typography'

interface Props {
  icon?: ReactNode
  title: string
  body?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, body, action, className }: Props) {
  return (
    <div className={className} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: space[3],
      padding: `${space[16]} ${space[6]}`,
      textAlign: 'center',
    }}>
      {icon && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '56px',
          height: '56px',
          borderRadius: radius.full,
          background: palette.cream[100],
          color: semantic.text.brand,
          marginBottom: space[2],
        }}>
          {icon}
        </div>
      )}
      <Heading level={4} tone="primary">{title}</Heading>
      {body && (
        <Text size="bodySm" tone="secondary" style={{ maxWidth: '420px' }}>
          {body}
        </Text>
      )}
      {action && <div style={{ marginTop: space[3] }}>{action}</div>}
    </div>
  )
}

/**
 * UI primitives — the only allowed components for new UI in this app.
 *
 * If something you need isn't here, build it in src/components/ui/ first.
 * Never inline a button / table / form input in a feature component.
 */
export { Button } from './Button'
export { CommandPaletteProvider } from './CommandPalette'
export { DataTable, type ColumnDef } from './DataTable'
export { EmptyState } from './EmptyState'
export { Toaster, toast } from './Toast'
export { Tooltip } from './Tooltip'
export { Text, Heading, Display, Overline, Mono } from './Typography'

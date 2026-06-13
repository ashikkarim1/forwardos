/**
 * DataTable — enterprise data presentation primitive.
 *
 * Built on TanStack Table v8. Wraps the headless engine in our luxury theme.
 * What it gives you out of the box:
 *   - Sort (click column header)
 *   - Filter (built-in column filter or external)
 *   - Pagination (configurable page size)
 *   - Selection (checkbox column, bulk action ready)
 *   - Column visibility (show/hide menu)
 *   - Empty state slot
 *   - Loading skeleton
 *   - Row click → onRowClick
 *
 * Define columns with the standard TanStack ColumnDef<T> shape. Pass data
 * + columns + optional handlers, and you're done.
 *
 * Example:
 *   const columns: ColumnDef<Deal>[] = [
 *     { accessorKey: 'title', header: 'Listing' },
 *     { accessorKey: 'askingPrice', header: 'Asking', cell: ({ getValue }) => formatUSD(getValue()) },
 *   ]
 *   <DataTable data={deals} columns={columns} onRowClick={(d) => router.push(`/listing/${d.slug}`)} />
 */
'use client'

import { useState, ReactNode, useMemo } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  RowSelectionState,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, MoreHorizontal, Search } from 'lucide-react'
import { palette, semantic, radius, space, typography, shadow } from '@/styles/tokens'
import { Button } from './Button'
import { Text } from './Typography'

interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  loading?: boolean
  emptyState?: ReactNode
  onRowClick?: (row: T) => void
  pageSize?: number
  searchPlaceholder?: string
  globalFilter?: boolean
  selectable?: boolean
  bulkActions?: (selectedRows: T[]) => ReactNode
  className?: string
  /** Keyed by row.id; defaults to index. Use a stable key when possible. */
  getRowId?: (row: T, index: number) => string
}

export function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyState,
  onRowClick,
  pageSize = 25,
  searchPlaceholder = 'Search…',
  globalFilter = true,
  selectable = false,
  bulkActions,
  className,
  getRowId,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [filter, setFilter] = useState('')
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  // Prepend a checkbox column when selectable.
  const cols = useMemo<ColumnDef<T>[]>(() => {
    if (!selectable) return columns
    return [
      {
        id: '__select',
        size: 32,
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            ref={(el) => { if (el) el.indeterminate = table.getIsSomeRowsSelected() }}
            onChange={table.getToggleAllRowsSelectedHandler()}
            style={{ cursor: 'pointer', accentColor: semantic.action.accent }}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
            onClick={(e) => e.stopPropagation()}
            style={{ cursor: 'pointer', accentColor: semantic.action.accent }}
          />
        ),
        enableSorting: false,
      },
      ...columns,
    ]
  }, [columns, selectable])

  const table = useReactTable({
    data,
    columns: cols,
    state: { sorting, globalFilter: filter, rowSelection },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFilter,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: selectable,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
    getRowId,
  })

  const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original)
  const hasData = table.getRowModel().rows.length > 0

  return (
    <div className={className} style={{
      background: semantic.surface.default,
      border: `1px solid ${semantic.border.subtle}`,
      borderRadius: radius.lg,
      overflow: 'hidden',
      boxShadow: shadow.sm,
    }}>
      {/* Toolbar */}
      {(globalFilter || (selectable && selectedRows.length > 0)) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: space[3],
          padding: `${space[3]} ${space[4]}`,
          borderBottom: `1px solid ${semantic.border.subtle}`,
          background: palette.cream[50],
        }}>
          {globalFilter ? (
            <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
              <Search size={14} style={{
                position: 'absolute', left: space[3], top: '50%',
                transform: 'translateY(-50%)', color: semantic.text.tertiary,
              }} />
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder={searchPlaceholder}
                style={{
                  width: '100%',
                  padding: `${space[2]} ${space[3]} ${space[2]} ${space[8]}`,
                  border: `1px solid ${semantic.border.default}`,
                  borderRadius: radius.md,
                  background: semantic.surface.default,
                  fontFamily: typography.fontFamily.sans,
                  fontSize: typography.style.bodySm.fontSize,
                  color: semantic.text.primary,
                  outline: 'none',
                }}
                onFocus={(e) => { e.currentTarget.style.boxShadow = shadow.focus }}
                onBlur={(e) => { e.currentTarget.style.boxShadow = shadow.none }}
              />
            </div>
          ) : <div />}

          {selectable && selectedRows.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: space[3] }}>
              <Text size="bodySm" tone="secondary">
                {selectedRows.length} selected
              </Text>
              {bulkActions?.(selectedRows)}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: typography.fontFamily.sans,
          fontSize: typography.style.bodySm.fontSize,
        }}>
          <thead style={{ background: palette.cream[100] }}>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => {
                  const canSort = h.column.getCanSort()
                  const sorted = h.column.getIsSorted()
                  return (
                    <th
                      key={h.id}
                      style={{
                        textAlign: 'left',
                        padding: `${space[3]} ${space[4]}`,
                        fontWeight: 600,
                        fontSize: typography.style.caption.fontSize,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        color: semantic.text.secondary,
                        borderBottom: `1px solid ${semantic.border.subtle}`,
                        cursor: canSort ? 'pointer' : 'default',
                        userSelect: 'none',
                        whiteSpace: 'nowrap',
                      }}
                      onClick={canSort ? h.column.getToggleSortingHandler() : undefined}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: space[2] }}>
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {sorted === 'asc' && <ArrowUp size={12} />}
                        {sorted === 'desc' && <ArrowDown size={12} />}
                      </span>
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={`skel-${i}`}>
                  {cols.map((_c, ci) => (
                    <td key={ci} style={{ padding: `${space[3]} ${space[4]}`, borderBottom: `1px solid ${semantic.border.subtle}` }}>
                      <div style={{
                        height: '14px',
                        width: `${60 + ((i + ci) * 7) % 30}%`,
                        background: palette.ink[100],
                        borderRadius: radius.sm,
                      }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : hasData ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  style={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background 120ms ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = palette.cream[50] }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        padding: `${space[3]} ${space[4]}`,
                        borderBottom: `1px solid ${semantic.border.subtle}`,
                        color: semantic.text.primary,
                        verticalAlign: 'middle',
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={cols.length} style={{ padding: space[16], textAlign: 'center' }}>
                  {emptyState ?? <Text tone="tertiary">No results.</Text>}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {hasData && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${space[3]} ${space[4]}`,
          borderTop: `1px solid ${semantic.border.subtle}`,
          background: palette.cream[50],
        }}>
          <Text size="bodySm" tone="secondary">
            Page {table.getState().pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)} · {table.getFilteredRowModel().rows.length} {table.getFilteredRowModel().rows.length === 1 ? 'row' : 'rows'}
          </Text>
          <div style={{ display: 'flex', gap: space[2] }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              leftIcon={<ChevronLeft size={14} />}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              rightIcon={<ChevronRight size={14} />}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Re-export TanStack types so consumers don't have to import from two places.
export type { ColumnDef } from '@tanstack/react-table'

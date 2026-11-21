import { flexRender, useTable } from '@tanstack/react-table';
import { useId } from 'react';
import { cn } from '@lib/utils';
import { tableFeatureSet } from '@lib/table-feature';

import type { RefObject } from 'react';
import type { ColumnDef, RowData } from '@tanstack/react-table';
import type { TableFeatures } from '@lib/table-feature';

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<TableFeatures, TData>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
  emptyMessage?: string;
  isLoading?: boolean;
  sentinelRef?: RefObject<HTMLDivElement | null>;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  onRowClick,
  emptyMessage = 'No hay resultados.',
  isLoading = false,
  sentinelRef,
}: DataTableProps<TData>) {
  const tableId = useId();
  const table = useTable({
    features: tableFeatureSet,
    data,
    columns,
  });
  const rows = table.getRowModel().rows;

  return (
    <div className='min-w-0 md:rounded-xl md:border md:border-border'>
      <table role='table' className='w-full text-sm max-md:block'>
        <thead role='rowgroup' className='border-b border-border bg-muted max-md:sr-only md:sticky md:top-0 md:z-10'>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} role='row'>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  id={`${tableId}-${header.column.id}`}
                  role='columnheader'
                  scope={header.colSpan > 1 ? 'colgroup' : 'col'}
                  colSpan={header.colSpan}
                  className='h-11 px-3 py-2 text-left font-medium text-text-secondary xl:px-4'
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody role='rowgroup' className='max-md:block max-md:space-y-3'>
          {rows.map((row) => (
            <tr
              key={row.id}
              role='row'
              onClick={onRowClick ? () => onRowClick(row.original) : undefined}
              className={cn(
                'border-border max-md:block max-md:rounded-xl max-md:border max-md:bg-card max-md:px-3 md:border-b md:last:border-0',
                onRowClick && 'cursor-pointer hover:bg-muted/50',
              )}
            >
              {row.getVisibleCells().map((cell) => {
                const label = cell.column.columnDef.header;
                return (
                  <td
                    key={cell.id}
                    role='cell'
                    headers={`${tableId}-${cell.column.id}`}
                    className='py-2 max-md:grid max-md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] max-md:items-center max-md:gap-x-2 max-md:border-b max-md:border-border max-md:last:border-0 md:px-3 md:py-3 xl:px-4'
                  >
                    <span aria-hidden='true' className='text-xs font-medium text-text-secondary md:hidden'>
                      {typeof label === 'string' ? label : null}
                    </span>
                    <div className='min-w-0 wrap-anywhere'>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
          {rows.length === 0 && !isLoading && (
            <tr role='row' className='max-md:block max-md:rounded-xl max-md:border max-md:border-border'>
              <td role='cell' colSpan={columns.length} className='py-8 text-center text-text-secondary max-md:block'>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {sentinelRef && <div ref={sentinelRef} className='h-px' aria-hidden='true' />}
      {isLoading && (
        <div className='my-2 flex items-center justify-center' role='status'>
          <span className='text-xs'>Cargando</span>
        </div>
      )}
    </div>
  );
}

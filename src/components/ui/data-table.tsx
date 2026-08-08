import { flexRender, useTable } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { tableFeatureSet } from '@lib/table-feature';

import type { ColumnDef, RowData } from '@tanstack/react-table';
import type { TableFeatures } from '@lib/table-feature';

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<TableFeatures, TData>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  onRowClick,
  emptyMessage = 'No hay resultados.',
  isLoading = false,
}: DataTableProps<TData>) {
  const table = useTable({
    features: tableFeatureSet,
    data,
    columns,
  });

  return (
    <div className='overflow-hidden rounded-xl border border-border'>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead className='border-b border-border bg-muted/40'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className='h-11 px-4 text-left font-medium text-text-secondary'
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className='h-24 text-center text-text-secondary'>
                  Cargando...
                </td>
              </tr>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row.original as TData) : undefined}
                  className={cn(
                    'border-b border-border last:border-0 hover:bg-muted/30',
                    onRowClick && 'cursor-pointer',
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className='px-4 py-3'>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className='h-24 text-center text-text-secondary'>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';

import type { ColumnDef } from '@tanstack/react-table';
import type { TableFeatures } from '@lib/table-feature';
import type { Admin } from '@/types';

const columnHelper = createColumnHelper<TableFeatures, Admin>();

interface UseAdminColumnsParams {
  onDeleteAdmin: (admin: Admin) => void;
}

export function useAdminColumns({ onDeleteAdmin }: UseAdminColumnsParams) {
  return useMemo<ColumnDef<TableFeatures, Admin>[]>(
    () => [
      {
        header: 'ID',
        accessorKey: 'id',
        cell: (info) => info.getValue(),
      },
      {
        header: 'Administrador',
        accessorKey: 'adminName',
        cell: ({ row }) => row.original.adminName,
      },
      {
        header: 'Creado',
        cell: ({ row }) =>
          format(new Date(row.original.createdAt), "d 'de' MMMM yyyy", { locale: es }),
      },
      columnHelper.display({
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation();
              onDeleteAdmin(row.original);
            }}
            className='rounded-md p-1.5 text-destructive hover:bg-destructive/10'
            title='Eliminar administrador'
          >
            <Trash2 className='size-4' />
          </button>
        ),
      }),
    ],
    [onDeleteAdmin],
  );
}

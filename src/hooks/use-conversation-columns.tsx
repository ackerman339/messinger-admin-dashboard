import { useMemo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import type { ColumnDef } from '@tanstack/react-table';
import type { TableFeatures } from '@lib/table-feature';
import type { Conversation } from '@/types';

export function useConversationColumns() {
  return useMemo<ColumnDef<TableFeatures, Conversation>[]>(
    () => [
      {
        header: 'ID',
        accessorKey: 'id',
        cell: (info) => info.getValue(),
      },
      {
        header: 'Nombre',
        accessorKey: 'name',
        cell: ({ row }) => {
          return row.original.name || 'Sin nombre';
        },
      },
      {
        header: 'Creada',
        accessorKey: 'createdAt',
        cell: ({ row }) =>
          format(new Date(row.original.createdAt), "d 'de' MMMM yyyy", { locale: es }),
      },
      {
        header: 'Actualizado',
        accessorKey: 'updatedAt',
        cell: ({ row }) =>
          format(new Date(row.original.updatedAt), "d 'de' MMMM yyyy", { locale: es }),
      },
    ],
    [],
  );
}

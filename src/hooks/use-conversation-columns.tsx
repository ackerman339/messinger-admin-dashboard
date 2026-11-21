import { useMemo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link } from 'react-router-dom';

import type { ColumnDef } from '@tanstack/react-table';
import type { TableFeatures } from '@lib/table-feature';
import type { Conversation } from '@/types';

export function useConversationColumns({ userId }: { userId: string }) {
  return useMemo<ColumnDef<TableFeatures, Conversation>[]>(
    () => [
      {
        header: 'ID',
        accessorKey: 'id',
        cell: (info) => info.getValue(),
      },
      {
        header: 'Conversó con',
        accessorKey: 'members',
        cell: ({ row }) => {
          const { id, members } = row.original;
          const participants = members
            .filter(({ user }) => user.id !== userId)
            .map(({ user }) => user.username)
            .join(', ');
          return (
            <Link
              to={`/users/${userId}/conversations/${id}`}
              onClick={(event) => event.stopPropagation()}
              className='inline-flex min-h-11 items-center font-medium underline-offset-2 hover:underline'
            >
              {participants || 'Ver mensajes'}
            </Link>
          );
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
    [userId],
  );
}

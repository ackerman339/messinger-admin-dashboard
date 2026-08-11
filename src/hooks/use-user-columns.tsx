import { useMemo } from 'react';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { RotateCcw, Trash2 } from 'lucide-react';
import type { TableFeatures } from '@lib/table-feature';
import type { User } from '@/types';

const columnHelper = createColumnHelper<TableFeatures, User>();

interface UseUserColumnsParams {
  onRestoreLoginKey: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

export function useUserColumns({ onRestoreLoginKey, onDeleteUser }: UseUserColumnsParams) {
  return useMemo<ColumnDef<TableFeatures, User>[]>(
    () => [
      {
        header: 'ID',
        accessorKey: 'id',
        cell: ({ row }) => <span>{row.original.id}</span>,
      },
      {
        header: 'Usuario',
        accessorKey: 'username',
        cell: ({ row }) => (
          <Link
            to={`/users/${row.original.id}`}
            className='font-medium hover:underline'
            onClick={(e) => e.stopPropagation()}
          >
            {row.original.username}
          </Link>
        ),
      },
      {
        header: 'Última conexión',
        accessorKey: 'lastSeenAt',
        cell: ({ row }) => {
          const value = row.original.lastSeenAt;
          return value
            ? format(new Date(value), "d 'de' MMMM yyyy, HH:mm a", { locale: es })
            : 'Nunca';
        },
      },
      {
        header: 'Creado',
        accessorKey: 'createdAt',
        cell: ({ row }) =>
          format(new Date(row.original.createdAt), "d 'de' MMMM yyyy", { locale: es }),
      },
      columnHelper.display({
        id: 'acciones',
        header: 'Acciones',
        cell: (info) => (
          <div className='flex items-center gap-2'>
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation();
                onRestoreLoginKey(info.row.original);
              }}
              className='rounded-md p-1.5 text-text-secondary hover:bg-muted hover:text-foreground cursor-pointer'
              title='Restaurar clave de acceso'
            >
              <RotateCcw className='size-4' />
            </button>
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation();
                onDeleteUser(info.row.original);
              }}
              className='rounded-md p-1.5 text-destructive hover:bg-destructive/10 cursor-pointer'
              title='Eliminar usuario'
            >
              <Trash2 className='size-4' />
            </button>
          </div>
        ),
      }),
    ],
    [onRestoreLoginKey, onDeleteUser],
  );
}

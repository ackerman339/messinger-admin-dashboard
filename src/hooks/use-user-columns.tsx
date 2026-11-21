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
            className='inline-flex min-h-11 items-center font-medium underline-offset-2 hover:underline'
            onClick={(e) => e.stopPropagation()}
          >
            {row.original.username}
          </Link>
        ),
      },
      {
        header: 'Código',
        accessorKey: 'userCode',
        cell: ({ row }) => <span>{row.original.userCode}</span>,
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
          <div className='flex flex-wrap items-center gap-1'>
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation();
                onRestoreLoginKey(info.row.original);
              }}
              className='grid size-11 shrink-0 cursor-pointer place-items-center rounded-md text-text-secondary hover:bg-muted hover:text-foreground'
              title='Restaurar clave de acceso'
              aria-label='Restaurar clave de acceso'
            >
              <RotateCcw className='size-4' />
            </button>
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation();
                onDeleteUser(info.row.original);
              }}
              className='grid size-11 shrink-0 cursor-pointer place-items-center rounded-md text-destructive hover:bg-destructive/10'
              title='Eliminar usuario'
              aria-label='Eliminar usuario'
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

import { useNavigate } from 'react-router-dom';
import { userService } from '@services/user-service';
import { useCursorPagination } from '@hooks/use-cursor-pagination';
import { useInfiniteScrollSentinel } from '@hooks/use-infinite-scroll';
import { DataTable } from '@components/ui/data-table';
import { useUserColumns } from '@hooks/use-user-columns';
import { Dialog } from '@components/ui/dialog';
import { AlertDialog } from '@components/ui/alert-dialog';
import { useState } from 'react';
import type { User } from '@/types';

export function UsersPage() {
  const navigate = useNavigate();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [restoredKey, setRestoredKey] = useState<string | null>(null);

  const {
    items: users,
    setItems: setUsers,
    isInitialLoading,
    isLoadingMore,
    hasMore,
    loadMore,
  } = useCursorPagination({
    fetchPage: (cursor) => userService.listUsers({ cursor, limit: 20 }),
  });

  const sentinelRef = useInfiniteScrollSentinel({
    onIntersect: loadMore,
    enabled: hasMore && !isInitialLoading,
  });

  const onRestoreLoginKey = async (user: User) => {
    const { loginKey } = await userService.restoreLoginKey({ userId: user.id });
    setRestoredKey(loginKey);
  };

  const onConfirmDelete = async () => {
    if (!userToDelete) return;
    await userService.deleteUser({ userId: userToDelete.id });
    setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
    setUserToDelete(null);
  };

  const columns = useUserColumns({ onRestoreLoginKey, onDeleteUser: setUserToDelete });

  return (
    <div className='space-y-4'>
      <h1 className='text-lg font-semibold text-foreground'>Usuarios</h1>

      <DataTable
        columns={columns}
        data={users}
        isLoading={isInitialLoading}
        isLoadingMore={isLoadingMore}
        sentinelRef={sentinelRef}
        emptyMessage='No hay usuarios registrados.'
        onRowClick={(user) => navigate(`/users/${user.id}`)}
      />

      <Dialog
        open={!!restoredKey}
        onOpenChange={(open) => !open && setRestoredKey(null)}
        title='Clave de acceso restaurada'
        description='Copia esta clave ahora — no se volverá a mostrar.'
      >
        <div className='flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2'>
          <code className='font-mono text-sm text-foreground'>{restoredKey}</code>
          <button
            type='button'
            onClick={() => restoredKey && navigator.clipboard.writeText(restoredKey)}
            className='text-xs text-accent hover:underline'
          >
            Copiar
          </button>
        </div>
      </Dialog>

      <AlertDialog
        open={!!userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
        title='Eliminar usuario'
        description={`¿Seguro que quieres eliminar a "${userToDelete?.username}"? Esta acción no se puede deshacer.`}
        confirmLabel='Eliminar'
        onConfirm={onConfirmDelete}
      />
    </div>
  );
}

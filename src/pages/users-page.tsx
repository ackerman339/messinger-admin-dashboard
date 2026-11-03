import { z } from 'zod';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { CreateUserSchema } from '@schemas/user-schema';
import { userService } from '@services/user-service';
import { adminService } from '@services/admin-service';
import { useCursorPagination } from '@hooks/use-cursor-pagination';
import { useInfiniteScrollSentinel } from '@hooks/use-infinite-scroll';
import { DataTable } from '@components/ui/data-table';
import { useUserColumns } from '@hooks/use-user-columns';
import { Dialog } from '@components/ui/dialog';
import { AlertDialog } from '@components/ui/alert-dialog';

import type { CreateUserDto } from '@schemas/user-schema';
import type { User } from '@/types';

export function UsersPage() {
  const navigate = useNavigate();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [restoredKey, setRestoredKey] = useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<User | null>(null);

  const {
    items: users,
    setItems: setUsers,
    isLoading,
    hasMore,
    loadMore,
    refresh,
  } = useCursorPagination({
    fetchPage: (cursor) => userService.listUsers({ cursor, limit: 20 }),
  });

  const sentinelRef = useInfiniteScrollSentinel({
    onIntersect: loadMore,
    enabled: hasMore && !isLoading,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof CreateUserSchema>, unknown, z.output<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
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

  const onCreateUser = async (data: CreateUserDto) => {
    setFormError(null);
    try {
      const newUser = await adminService.createUser(data);
      setNewUser(newUser);
    } catch (error: unknown) {
      if (!(error instanceof AxiosError)) {
        console.error(error);
        setFormError('No se puede crear el administrador');
        return;
      }

      if (error.status === 409) {
        setFormError('Administrador ya existe');
        return;
      }
    } finally {
      reset();
      refresh();
    }
  };

  const columns = useUserColumns({ onRestoreLoginKey, onDeleteUser: setUserToDelete });

  return (
    <div className='space-y-4'>
      <h1 className='text-lg font-semibold text-foreground'>Usuarios</h1>
      <div className='flex items-center justify-end gap-x-2 '>
        <button
          type='button'
          onClick={() => setIsCreateOpen(true)}
          className='flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 cursor-pointer'
        >
          <Plus className='size-4' />
          Crear nuevo usuario
        </button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
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
            className='text-xs text-accent-foreground hover:underline cursor-pointer'
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

      <Dialog
        open={isCreateOpen}
        onOpenChange={(open) => {
          if (!open) {
            setNewUser(null);
          }
          setIsCreateOpen(open);
        }}
        title={!newUser ? 'Crear usario nuevo' : 'Usuario creado'}
        description={
          !newUser
            ? 'Crea un usuario nuevo y envía el código de inicio de sesión'
            : 'Copia y envía este código via Whatsapp, correo o SMS'
        }
      >
        {!newUser ? (
          <form onSubmit={handleSubmit(onCreateUser)} className='space-y-4'>
            <div>
              <label htmlFor='username' className='mb-1.5 block text-sm text-text-secondary'>
                Nombre del usuario
              </label>
              <input
                id='username'
                {...register('username')}
                className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent'
              />
              {errors.username && (
                <p className='mt-1 text-xs text-destructive'>{errors.username.message}</p>
              )}
            </div>

            {formError && <p className='text-sm text-destructive'>{formError}</p>}

            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full rounded-lg bg-accent py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50 cursor-pointer'
            >
              {isSubmitting ? 'Creando...' : 'Crear'}
            </button>
          </form>
        ) : (
          <div className='flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2'>
            <code className='font-mono text-sm text-foreground'>{newUser.loginKey}</code>
            <button
              type='button'
              onClick={() => navigator.clipboard.writeText(newUser.loginKey)}
              className='text-xs text-accent-foreground hover:underline cursor-pointer'
            >
              Copiar
            </button>
          </div>
        )}
      </Dialog>
    </div>
  );
}

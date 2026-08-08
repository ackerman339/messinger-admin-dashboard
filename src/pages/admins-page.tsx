import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { adminService } from '@services/admin-service';
import { DataTable } from '@/components/ui/data-table';
import { useAdminColumns } from '@hooks/use-admin-columns';
import { Dialog } from '@components/ui/dialog';
import { AlertDialog } from '@components/ui/alert-dialog';
import { AdminSchema, type AdminDto } from '@schemas/admin-schema';
import type { Admin } from '@/types';

export function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAdmins() {
      setIsLoading(true);
      try {
        const data = await adminService.listAdmins();
        setAdmins(data);
      } finally {
        setIsLoading(false);
      }
    }

    loadAdmins();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminDto>({ resolver: zodResolver(AdminSchema) });

  const onCreateAdmin = async (data: AdminDto) => {
    setFormError(null);
    try {
      const created = await adminService.createAdmin(data);
      setAdmins((prev) => [...prev, created]);
      reset();
      setIsCreateOpen(false);
    } catch {
      setFormError('No se pudo crear el administrador. Verifica los datos.');
    }
  };

  const onConfirmDelete = async () => {
    if (!adminToDelete) return;
    await adminService.deleteAdmin({ userId: adminToDelete.id });
    setAdmins((prev) => prev.filter((a) => a.id !== adminToDelete.id));
    setAdminToDelete(null);
  };

  const columns = useAdminColumns({ onDeleteAdmin: setAdminToDelete });

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-lg font-semibold text-foreground'>Administradores</h1>
        <button
          type='button'
          onClick={() => setIsCreateOpen(true)}
          className='flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground hover:opacity-90'
        >
          <Plus className='size-4' />
          Crear administrador
        </button>
      </div>

      <DataTable
        columns={columns}
        data={admins}
        isLoading={isLoading}
        emptyMessage='No hay administradores registrados.'
      />

      <Dialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title='Crear administrador'
        description='El nuevo administrador podrá acceder al panel con estas credenciales.'
      >
        <form onSubmit={handleSubmit(onCreateAdmin)} className='space-y-4'>
          <div>
            <label htmlFor='adminName' className='mb-1.5 block text-sm text-text-secondary'>
              Usuario
            </label>
            <input
              id='adminName'
              {...register('adminName')}
              className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent'
            />
            {errors.adminName && (
              <p className='mt-1 text-xs text-destructive'>{errors.adminName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor='password' className='mb-1.5 block text-sm text-text-secondary'>
              Contraseña
            </label>
            <input
              id='password'
              type='password'
              {...register('password')}
              className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent'
            />
            {errors.password && (
              <p className='mt-1 text-xs text-destructive'>{errors.password.message}</p>
            )}
          </div>

          {formError && <p className='text-sm text-destructive'>{formError}</p>}

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full rounded-lg bg-accent py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50'
          >
            {isSubmitting ? 'Creando...' : 'Crear administrador'}
          </button>
        </form>
      </Dialog>

      <AlertDialog
        open={!!adminToDelete}
        onOpenChange={(open) => !open && setAdminToDelete(null)}
        title='Eliminar administrador'
        description={`¿Seguro que quieres eliminar a "${adminToDelete?.adminName}"? Esta acción no se puede deshacer.`}
        confirmLabel='Eliminar'
        onConfirm={onConfirmDelete}
      />
    </div>
  );
}

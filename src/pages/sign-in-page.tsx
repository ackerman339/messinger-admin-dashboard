import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { LockKeyhole, MessageCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { AdminSchema, type AdminDto } from '@schemas/admin-schema';
import { adminService } from '@services/admin-service';

export function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminDto>({
    resolver: zodResolver(AdminSchema),
    defaultValues: {
      adminName: '',
      password: '',
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: AdminDto) => {
    await adminService.signIn(data);

    navigate('/users', {
      replace: true,
    });
  };

  return (
    <main className='flex min-h-screen items-center justify-center bg-background px-4'>
      <div className='w-full max-w-sm'>
        <div className='mb-8 flex flex-col items-center'>
          <div className='mb-4 flex size-16 items-center justify-center rounded-full bg-primary'>
            <MessageCircle className='size-8 text-primary-foreground' />
          </div>

          <h1 className='text-2xl font-semibold text-foreground'>Iniciar sesión</h1>

          <p className='mt-2 text-center text-sm text-text-secondary'>
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <div className='rounded-xl border border-border bg-card p-6 shadow-xl'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            {/* Usuario */}
            <div className='space-y-2'>
              <label htmlFor='adminName' className='text-sm font-medium text-foreground'>
                Usuario
              </label>

              <input
                id='adminName'
                type='text'
                autoComplete='username'
                placeholder='Ingresa tu usuario'
                {...register('adminName')}
                className={[
                  'w-full rounded-lg border bg-background px-3 py-2.5',
                  'text-sm text-foreground outline-none',
                  'placeholder:text-text-muted',
                  'transition-colors',
                  'focus:border-primary',
                  'focus:ring-2 focus:ring-ring/20',
                  errors.adminName ? 'border-destructive' : 'border-input',
                ].join(' ')}
              />

              {errors.adminName && (
                <p className='text-sm text-destructive'>{errors.adminName.message}</p>
              )}
            </div>

            {/* Contraseña */}
            <div className='space-y-2'>
              <label htmlFor='password' className='text-sm font-medium text-foreground'>
                Contraseña
              </label>

              <div className='relative'>
                <LockKeyhole className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted' />

                <input
                  id='password'
                  type='password'
                  autoComplete='current-password'
                  placeholder='Ingresa tu contraseña'
                  {...register('password')}
                  className={[
                    'w-full rounded-lg border bg-background',
                    'py-2.5 pl-10 pr-3',
                    'text-sm text-foreground outline-none',
                    'placeholder:text-text-muted',
                    'transition-colors',
                    'focus:border-primary',
                    'focus:ring-2 focus:ring-ring/20',
                    errors.password ? 'border-destructive' : 'border-input',
                  ].join(' ')}
                />
              </div>

              {errors.password && (
                <p className='text-sm text-destructive'>{errors.password.message}</p>
              )}
            </div>

            <button
              type='submit'
              disabled={isSubmitting}
              className={[
                'cursor-pointer',
                'w-full rounded-lg bg-primary px-4 py-2.5',
                'text-sm font-semibold text-primary-foreground',
                'transition-colors',
                'hover:bg-primary/90',
                'focus:outline-none focus:ring-2',
                'focus:ring-ring focus:ring-offset-2',
                'focus:ring-offset-background',
                'disabled:cursor-not-allowed disabled:opacity-50',
              ].join(' ')}
            >
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

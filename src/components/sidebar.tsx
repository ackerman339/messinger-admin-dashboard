import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, MessageCircle, Shield, Users } from 'lucide-react';
import { adminService } from '@services/admin-service';

const navigationItems = [
  {
    label: 'Usuarios',
    href: '/users',
    icon: Users,
  },
  {
    label: 'Administradores',
    href: '/admins',
    icon: Shield,
  },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  async function handleLogout() {
    await adminService.logout();

    navigate('/sign-in', {
      replace: true,
    });
  }

  return (
    <aside className='grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 border-b border-border bg-sidebar px-3 pt-1 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-x-4 sm:px-4 sm:py-2 xl:flex xl:w-64 xl:flex-col xl:items-stretch xl:gap-0 xl:border-r xl:border-b-0 xl:p-0'>
      <div className='col-start-1 row-start-1 flex min-h-11 min-w-0 items-center gap-2 xl:min-h-16 xl:border-b xl:border-border xl:px-3'>
        <div className='grid size-8 shrink-0 place-items-center rounded-full bg-primary xl:size-10'>
          <MessageCircle className='size-4 text-primary-foreground xl:size-5' aria-hidden='true' />
        </div>
        <span className='text-sm leading-tight font-semibold xl:text-base'>Panel de administración</span>
      </div>

      <nav aria-label='Navegación principal' className='col-span-2 row-start-2 mb-2 grid grid-cols-2 gap-1 py-1 sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:flex sm:justify-center sm:py-0 xl:mb-0 xl:block xl:flex-1 xl:space-y-1 xl:p-3'>
        {navigationItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              to={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={[
                'flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-lg px-2 py-2',
                'text-center text-sm leading-tight font-medium transition-colors xl:justify-start xl:gap-3 xl:px-3 xl:text-left',
                isActive
                  ? 'bg-sidebar-active text-primary-foreground'
                  : ['text-text-secondary', 'hover:bg-sidebar-hover', 'hover:text-foreground'].join(
                      ' ',
                    ),
              ].join(' ')}
            >
              <Icon className='size-4 shrink-0 xl:size-5' aria-hidden='true' />

              <span className='min-w-0 wrap-anywhere'>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className='col-start-2 row-start-1 sm:col-start-3 xl:border-t xl:border-border xl:p-3'>
        <button
          type='button'
          onClick={handleLogout}
          aria-label='Cerrar sesión'
          title='Cerrar sesión'
          className={[
            'grid size-11 cursor-pointer place-items-center rounded-lg xl:flex xl:h-11 xl:w-full xl:gap-3 xl:px-3',
            'text-sm font-medium text-text-secondary',
            'transition-colors',
            'hover:bg-sidebar-hover hover:text-foreground',
          ].join(' ')}
        >
          <LogOut className='size-5 shrink-0' aria-hidden='true' />

          <span className='hidden xl:inline'>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}

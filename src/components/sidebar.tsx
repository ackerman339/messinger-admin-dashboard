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
    <aside className='flex w-64 shrink-0 flex-col border-r border-border bg-sidebar'>
      {/* Header */}
      <div className='flex h-16 items-center gap-x-2 border-b border-border p-2'>
        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary'>
          <MessageCircle className='size-5 text-primary-foreground' />
        </div>
        <span className='font-semibold'>Panel del administración</span>
      </div>

      {/* Navigation */}
      <nav className='flex-1 space-y-1 p-3'>
        {navigationItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              to={item.href}
              className={[
                'flex items-center gap-3 rounded-lg px-3 py-2.5',
                'text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-active text-primary-foreground'
                  : ['text-text-secondary', 'hover:bg-sidebar-hover', 'hover:text-foreground'].join(
                      ' ',
                    ),
              ].join(' ')}
            >
              <Icon className='size-5 shrink-0' />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className='border-t border-border p-3'>
        <button
          type='button'
          onClick={handleLogout}
          className={[
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer',
            'text-sm font-medium text-text-secondary',
            'transition-colors',
            'hover:bg-sidebar-hover hover:text-foreground',
          ].join(' ')}
        >
          <LogOut className='size-5 shrink-0' />

          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}

import { Outlet } from 'react-router-dom';

import { Sidebar } from '@components/sidebar';

export function DashboardLayout() {
  return (
    <div className='flex h-dvh flex-col overflow-hidden bg-background text-foreground xl:flex-row'>
      <Sidebar />
      <main className='flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto px-3 py-3 sm:p-4'>
        <Outlet />
      </main>
    </div>
  );
}

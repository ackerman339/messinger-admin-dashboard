import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@layouts/dashboard-layout';
import { SignInPage } from '@pages/sign-in-page';
import { UsersPage } from '@pages/users-page';
import { UserConversationsPage } from '@pages/user-conversations-page';
import { ConversationMessagesPage } from '@pages/conversation-messages-page';
import { AdminsPage } from '@pages/admins-page';

export const router = createBrowserRouter([
  {
    path: '/sign-in',
    element: <SignInPage />,
  },
  {
    element: <DashboardLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to='/users' replace />,
      },
      {
        path: '/users',
        element: <UsersPage />,
      },
      {
        path: '/users/:userId',
        element: <UserConversationsPage />,
      },
      {
        path: '/users/:userId/conversations/:conversationId',
        element: <ConversationMessagesPage />,
      },
      {
        path: '/admins',
        element: <AdminsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to='/users' replace />,
  },
]);

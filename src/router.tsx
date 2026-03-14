import { createBrowserRouter, Navigate } from 'react-router-dom';
import ClientLayout from '@/layouts/ClientLayout';
import BackOfficeLayout from '@/layouts/BackOfficeLayout';
import NewChatPage from '@/pages/chat/NewChatPage';
import ChatPage from '@/pages/chat/ChatPage';
import DashboardPage from '@/pages/backoffice/DashboardPage';
import ChatsListPage from '@/pages/backoffice/ChatsListPage';
import ChatDetailPage from '@/pages/backoffice/ChatDetailPage';
import SettingsPage from '@/pages/backoffice/SettingsPage';
import PlaceholderPage from '@/components/PlaceholderPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/chat" replace />,
  },
  {
    element: <ClientLayout />,
    children: [
      { path: '/chat', element: <NewChatPage /> },
      { path: '/chat/:id', element: <ChatPage /> },
    ],
  },
  {
    element: <BackOfficeLayout />,
    children: [
      { path: '/bo/dashboard', element: <DashboardPage /> },
      { path: '/bo/chats', element: <ChatsListPage /> },
      { path: '/bo/chat/:id', element: <ChatDetailPage /> },
      { path: '/bo/settings', element: <SettingsPage /> },
      { path: '/bo/users', element: <PlaceholderPage title="Users" /> },
      { path: '/bo/tickets', element: <PlaceholderPage title="Tickets" /> },
      { path: '/bo/action-requests', element: <PlaceholderPage title="Action Requests" /> },
      { path: '/bo/user-profile', element: <PlaceholderPage title="User Profile" /> },
    ],
  },
]);

export default router;

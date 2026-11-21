import { useParams } from 'react-router-dom';
import { MessageList } from '@components/message-list';
import { Breadcrumb } from '@components/ui/bread-crumb';

export function ConversationMessagesPage() {
  const { userId, conversationId } = useParams<{
    userId: string;
    conversationId: string;
  }>();

  if (!userId || !conversationId) return null;

  return (
    <div className='flex h-[calc(100dvh-2rem)] flex-col'>
      <Breadcrumb
        items={[
          { label: 'Usuarios', to: '/users' },
          { label: 'Conversaciones', to: `/users/${userId}` },
          { label: 'Mensajes' },
        ]}
      />
      <h1 className='mb-4 text-lg font-semibold text-foreground'>Mensajes</h1>
      <MessageList key={`${userId}:${conversationId}`} userId={userId} conversationId={conversationId} />
    </div>
  );
}

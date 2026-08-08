import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userService } from '@services/user-service';
import { DataTable } from '@/components/ui/data-table';
import { useConversationColumns } from '@hooks/use-conversation-columns';
import type { Conversation } from '@/types';

export function UserConversationsPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const columns = useConversationColumns();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadConversations() {
      if (!userId) return;

      setIsLoading(true);
      try {
        const data = await userService.listUserConversations({ userId });
        setConversations(data);
      } finally {
        setIsLoading(false);
      }
    }
    loadConversations();
  }, [userId]);

  return (
    <div className='space-y-4'>
      <h1 className='text-lg font-semibold text-foreground'>Conversaciones del usuario</h1>
      <DataTable
        columns={columns}
        data={conversations}
        isLoading={isLoading}
        emptyMessage='Este usuario no tiene conversaciones.'
        onRowClick={(conversation) => navigate(`/users/${userId}/conversations/${conversation.id}`)}
      />
    </div>
  );
}

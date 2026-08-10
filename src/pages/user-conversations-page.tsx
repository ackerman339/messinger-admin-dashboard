import { useNavigate, useParams } from 'react-router-dom';
import { userService } from '@services/user-service';
import { useCursorPagination } from '@hooks/use-cursor-pagination';
import { useInfiniteScrollSentinel } from '@hooks/use-infinite-scroll';
import { useConversationColumns } from '@hooks/use-conversation-columns';
import { DataTable } from '@components/ui/data-table';
import { Breadcrumb } from '@components/ui/bread-crumb';

export function UserConversationsPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const columns = useConversationColumns({ userId: userId! });

  const {
    items: conversations,
    isInitialLoading,
    isLoadingMore,
    hasMore,
    loadMore,
  } = useCursorPagination({
    fetchPage: (cursor) =>
      userService.listUserConversations({ userId: userId!, cursor, limit: 20 }),
    deps: [userId],
  });

  const sentinelRef = useInfiniteScrollSentinel({
    onIntersect: loadMore,
    enabled: hasMore && !isInitialLoading,
  });

  return (
    <div className='space-y-4'>
      <Breadcrumb items={[{ label: 'Usuarios', to: '/users' }, { label: 'Conversaciones' }]} />
      <h1 className='text-lg font-semibold text-foreground'>Conversaciones del usuario</h1>
      <DataTable
        columns={columns}
        data={conversations}
        isLoading={isInitialLoading}
        isLoadingMore={isLoadingMore}
        sentinelRef={sentinelRef}
        emptyMessage='Este usuario no tiene conversaciones.'
        onRowClick={(conversation) => navigate(`/users/${userId}/conversations/${conversation.id}`)}
      />
    </div>
  );
}

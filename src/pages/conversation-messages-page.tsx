import { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ScrollArea } from 'radix-ui';
import { userService } from '@services/user-service';
import { useCursorPagination } from '@hooks/use-cursor-pagination';
import { useInfiniteScrollSentinel } from '@hooks/use-infinite-scroll';
import { MessageBubble } from '@components/message-bubble';

export function ConversationMessagesPage() {
  const { userId, conversationId } = useParams<{ userId: string; conversationId: string }>();

  const {
    items: pages,
    isInitialLoading,
    isLoadingMore,
    hasMore,
    loadMore,
  } = useCursorPagination({
    fetchPage: async (cursor) => {
      return userService.listConversationMessages({
        userId: userId!,
        conversationId: conversationId!,
        cursor,
        limit: 20,
      });
    },
    reverse: true,
    deps: [userId, conversationId],
  });

  const sentinelRef = useInfiniteScrollSentinel<HTMLDivElement>({
    onIntersect: loadMore,
    enabled: hasMore && !isInitialLoading,
  });

  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = useMemo(() => [...pages], [pages]);

  const isFirstLoadRef = useRef(true);

  // Se reinicia el flag cada vez que cambias de conversación.
  useEffect(() => {
    isFirstLoadRef.current = true;
  }, [userId, conversationId]);

  useEffect(() => {
    if (isInitialLoading || isLoadingMore) return;
    if (!isFirstLoadRef.current) return;
    if (messages.length === 0) return;

    bottomRef.current?.scrollIntoView({ behavior: 'instant', block: 'end' });
    isFirstLoadRef.current = false;
  }, [messages, isInitialLoading, isLoadingMore]);
  console.log(messages);
  return (
    <div className='flex h-[calc(100vh-8rem)] flex-col'>
      <h1 className='mb-4 text-lg font-semibold text-foreground'>Mensajes</h1>

      <ScrollArea.Root className='max-h-[90vh] flex-1 rounded-xl border border-border'>
        <ScrollArea.Viewport className='h-full'>
          <div className='chat-paper flex min-h-full w-full flex-col gap-2 px-32 py-6'>
            {isInitialLoading && (
              <p className='text-center text-sm text-text-secondary'>Cargando mensajes...</p>
            )}

            {!isInitialLoading && messages.length === 0 && (
              <p className='text-center text-sm text-text-secondary'>
                No hay mensajes en esta conversación.
              </p>
            )}

            {hasMore && <div ref={sentinelRef} />}
            {isLoadingMore && (
              <p className='text-center text-xs text-text-secondary'>
                Cargando mensajes anteriores...
              </p>
            )}

            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} currentUserId={userId!} />
            ))}
            {<div ref={bottomRef} />}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className='flex w-2 touch-none bg-transparent p-0.5'
          orientation='vertical'
        >
          <ScrollArea.Thumb className='flex-1 rounded-full bg-muted-foreground/40' />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
}

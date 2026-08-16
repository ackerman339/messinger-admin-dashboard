import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ScrollArea } from 'radix-ui';
import { userService } from '@services/user-service';
import { useCursorPagination } from '@hooks/use-cursor-pagination';
import { useInfiniteScrollSentinel } from '@hooks/use-infinite-scroll';
import { MessageBubble } from '@components/message-bubble';
import { Breadcrumb } from '@components/ui/bread-crumb';

export function ConversationMessagesPage() {
  const { userId, conversationId } = useParams<{
    userId: string;
    conversationId: string;
  }>();

  const viewportRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  /**
   * Stores the scroll height before loading older messages.
   */
  const previousScrollHeightRef = useRef<number | null>(null);

  /**
   * Tracks whether the first page has been loaded.
   */
  const isInitialLoadRef = useRef(true);

  const {
    items: messages,
    isLoading,
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

  /**
   * Save the current scroll height before loading
   * the next page of older messages.
   */
  const handleLoadMore = useCallback(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    previousScrollHeightRef.current = viewport.scrollHeight;

    loadMore();
  }, [loadMore]);

  const sentinelRef = useInfiniteScrollSentinel<HTMLDivElement>({
    onIntersect: handleLoadMore,
    enabled: hasMore,
    rootRef: viewportRef,
  });

  /**
   * Reset the initial-load state when the conversation changes.
   */
  useEffect(() => {
    isInitialLoadRef.current = true;
    previousScrollHeightRef.current = null;
  }, [userId, conversationId]);

  /**
   * After loading older messages, compensate for the
   * additional content height so the user's visual
   * scroll position remains unchanged.
   */
  useLayoutEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const previousScrollHeight = previousScrollHeightRef.current;

    if (previousScrollHeight === null) {
      return;
    }

    const newScrollHeight = viewport.scrollHeight;

    const heightDifference = newScrollHeight - previousScrollHeight;

    viewport.scrollTop += heightDifference;

    previousScrollHeightRef.current = null;
  }, [messages]);

  /**
   * Scroll to the bottom after the initial page loads.
   */
  useEffect(() => {
    if (!isInitialLoadRef.current) {
      return;
    }

    if (messages.length === 0 || messages.length >= 20) {
      return;
    }

    bottomRef.current?.scrollIntoView({
      behavior: 'instant',
      block: 'end',
    });

    isInitialLoadRef.current = false;
  }, [messages]);

  return (
    <div className='flex h-[calc(100vh-8rem)] flex-col'>
      <Breadcrumb
        items={[
          {
            label: 'Usuarios',
            to: '/users',
          },
          {
            label: 'Conversaciones',
            to: `/users/${userId}`,
          },
          {
            label: 'Mensajes',
          },
        ]}
      />

      <h1 className='mb-4 text-lg font-semibold text-foreground'>Mensajes</h1>

      <ScrollArea.Root className='max-h-[85vh] flex-1 rounded-xl border border-border'>
        <ScrollArea.Viewport ref={viewportRef} className='h-full'>
          <div className='chat-paper flex min-h-full w-full flex-col gap-2 px-32 py-6'>
            <div ref={sentinelRef} className='h-1' />

            {isLoading && (
              <p className='text-center text-sm text-text-secondary'>Cargando mensajes...</p>
            )}

            {messages.length === 0 && !isLoading && (
              <p className='text-center text-sm text-text-secondary'>
                No hay mensajes en esta conversación.
              </p>
            )}

            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} currentUserId={userId!} />
            ))}

            <div ref={bottomRef} />
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

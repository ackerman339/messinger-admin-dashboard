import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Copy, LoaderCircle, X } from 'lucide-react';
import { MessageBubble } from '@components/message-bubble';
import { useCursorPagination } from '@hooks/use-cursor-pagination';
import { useInfiniteScrollSentinel } from '@hooks/use-infinite-scroll';
import { userService } from '@services/user-service';

import type { ConversationHistoryDetails, Message } from '@/types';

export function MessageList({ userId, conversationId }: { userId: string; conversationId: string }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isAtBottom = useRef(true);
  const previousHeight = useRef<number | null>(null);
  const [conversation, setConversation] = useState<ConversationHistoryDetails | null>();
  const [selectedId, setSelectedId] = useState<string>();
  const [copyError, setCopyError] = useState(false);

  const { items: messages, isLoading, hasMore, loadMore, error, retry } =
    useCursorPagination<Message>({
      fetchPage: async (cursor) => {
        const result = await userService.listConversationMessages({
          userId, conversationId, cursor, limit: 20,
        });
        if (!cursor) setConversation(result.conversation ?? null);
        return { ...result, page: [...result.page].reverse() };
      },
      reverse: true,
    });

  const loadingInitialPage = conversation === undefined;
  const handleLoadMore = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport || previousHeight.current !== null) return;
    previousHeight.current = viewport.scrollHeight;
    isAtBottom.current = false;
    loadMore();
  }, [loadMore]);

  const sentinelRef = useInfiniteScrollSentinel<HTMLDivElement>({
    onIntersect: handleLoadMore,
    enabled: !loadingInitialPage && hasMore && !isLoading && !error,
    rootRef: viewportRef,
    rootMargin: '10px',
  });

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || isLoading) return;

    if (previousHeight.current !== null) {
      if (!error) viewport.scrollTop += viewport.scrollHeight - previousHeight.current;
      previousHeight.current = null;
    } else if (isAtBottom.current) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [error, isLoading, messages]);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;

    const observer = new ResizeObserver(() => {
      if (isAtBottom.current) viewport.scrollTop = viewport.scrollHeight;
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  const selectedMessage = messages.find((message) => message.id === selectedId);

  function clearSelection() {
    setSelectedId(undefined);
    setCopyError(false);
  }

  async function copySelectedMessage() {
    if (!selectedMessage) return;
    try {
      await navigator.clipboard.writeText(selectedMessage.content);
      clearSelection();
    } catch {
      setCopyError(true);
    }
  }

  return (
    <section className='message-history relative isolate flex min-h-0 min-w-0 flex-1 overflow-hidden rounded-lg' aria-label='Historial de mensajes'>
      {selectedMessage && (
        <div className='absolute inset-x-0 top-0 z-10 flex min-h-14 flex-wrap items-center gap-x-1 gap-y-0.5 border-t border-border bg-bg-app/95 px-2 shadow-lg backdrop-blur-sm sm:min-h-16 sm:gap-x-2 sm:px-4'>
          <button type='button' onClick={clearSelection} className='grid size-11 shrink-0 cursor-pointer place-items-center rounded-full hover:bg-slate-100' aria-label='Cancelar selección'>
            <X size={20} />
          </button>
          <span className='text-sm font-medium'>1 mensaje seleccionado</span>
          {copyError && <span role='status' className='order-last basis-full pb-1 pl-2 text-xs text-red-700 sm:order-none sm:basis-auto sm:p-0'>No se pudo copiar el texto.</span>}
          <button type='button' onClick={copySelectedMessage} className='ml-auto flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg px-2 hover:bg-slate-100' aria-label='Copiar texto'>
            <Copy size={20} />
            <span className='hidden sm:inline'>Copiar</span>
          </button>
        </div>
      )}
      {isLoading && !loadingInitialPage && (
        <div className='pointer-events-none absolute inset-x-0 top-2 z-10 flex justify-center' role='status' aria-label='Cargando mensajes anteriores'>
          <span className='rounded-full bg-bg-app p-2 shadow-sm'><LoaderCircle size={18} className='animate-spin text-accent' /></span>
        </div>
      )}
      {error && (
        <div className='absolute inset-x-0 z-10 flex justify-center px-4' style={loadingInitialPage ? { top: '45%' } : { top: 8 }}>
          <div className='flex flex-wrap items-center gap-2 rounded-lg bg-bg-app px-4 py-2 text-sm text-text-secondary shadow-sm'>
            <span role='status'>No se pudieron cargar los mensajes.</span>
            <button type='button' className='cursor-pointer font-medium text-accent-ink hover:underline' onClick={() => {
              if (!loadingInitialPage && viewportRef.current) previousHeight.current = viewportRef.current.scrollHeight;
              void retry();
            }}>Reintentar</button>
          </div>
        </div>
      )}
      <div
        ref={viewportRef}
        className='chat-paper min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain [overflow-anchor:none]'
        onScroll={({ currentTarget }) => {
          isAtBottom.current =
            currentTarget.scrollHeight - currentTarget.clientHeight - currentTarget.scrollTop < 2;
        }}
      >
        <div ref={contentRef} className='flex min-h-full flex-col gap-y-3 px-2 pb-3 sm:gap-y-5 sm:px-4 sm:pb-5 lg:px-8'>
          <div ref={sentinelRef} className='h-1 min-h-1 shrink-0' />
          {loadingInitialPage && !error && (
            <div className='mx-auto my-auto rounded-lg bg-bg-app/85 px-4 py-2 shadow-sm' role='status' aria-label='Cargando mensajes'>
              <LoaderCircle size={20} className='animate-spin text-accent' />
            </div>
          )}
          {!loadingInitialPage && messages.length === 0 && !error && (
            <div className='mx-auto my-auto rounded-lg bg-bg-app/85 px-4 py-2 text-sm text-text-secondary shadow-sm'>
              No hay mensajes todavía
            </div>
          )}
          {messages.map((message) => {
            const canSelect = message.type === 'MESSAGE' && !!message.content?.trim() &&
              !message.location && !message.attachments?.length;
            return (
              <MessageBubble
                key={message.id}
                message={message}
                currentUserId={userId}
                conversation={conversation}
                selected={selectedId === message.id}
                onSelect={canSelect ? () => {
                  if (selectedId === message.id) clearSelection();
                  else {
                    setCopyError(false);
                    setSelectedId(message.id);
                  }
                } : undefined}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

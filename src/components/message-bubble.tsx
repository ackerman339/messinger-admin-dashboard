import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Check, CheckCheck } from 'lucide-react';
import { MessageAttachment } from '@components/attachments/message-attachment';
import { ConversationEventMessage } from './conversation-event-message';
import { LocationContent } from './location-content';

import type { ConversationHistoryDetails, Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  currentUserId: string;
  conversation?: ConversationHistoryDetails | null;
  selected: boolean;
  onSelect?: () => void;
}

function MessageDelivery({ deliveries = [] }: Pick<Message, 'deliveries'>) {
  const sent = !deliveries.length || deliveries.some(({ status }) => status === 'SENT');
  const read = !sent && deliveries.every(({ status }) => status === 'READ');
  const label = sent ? 'Enviado' : read ? 'Leído' : 'Entregado';
  const Icon = sent ? Check : CheckCheck;

  return (
    <span role='img' aria-label={label} title={label} className={read ? 'text-blue-500' : undefined}>
      <Icon aria-hidden='true' size={15} strokeWidth={2} />
    </span>
  );
}

export function MessageBubble({ message, currentUserId, conversation, selected, onSelect }: MessageBubbleProps) {
  if (message.type && message.type !== 'MESSAGE') {
    return (
      <ConversationEventMessage
        message={message}
        members={conversation?.members}
        isOwn={message.metadata?.callerId === currentUserId}
      />
    );
  }

  const isOwn = message.senderId === currentUserId;
  const senderName = conversation?.type === 'GROUP'
    ? conversation.members.find(({ userId }) => userId === message.senderId)?.username?.trim() ||
      'Miembro del grupo'
    : null;

  return (
    <article
      className={[
        'flex p-1 sm:p-2',
        isOwn ? 'justify-end' : 'justify-start',
        onSelect ? 'cursor-pointer' : '',
        selected ? 'bg-accent/10 ring-1 ring-accent/10' : '',
      ].join(' ')}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (onSelect && event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      <div
        className={[
          'min-w-0 max-w-[92%] rounded-lg px-3 py-2 shadow-sm sm:max-w-[min(82%,620px)] lg:max-w-[min(76%,620px)]',
          isOwn ? 'rounded-br-sm bg-bg-bubble-own' : 'rounded-bl-sm bg-bg-bubble-other',
        ].join(' ')}
      >
        {senderName && <p className='mb-1 truncate text-xs font-semibold text-accent'>{senderName}</p>}
        {message.location ? (
          <LocationContent location={message.location} />
        ) : (
          <p className='whitespace-pre-wrap wrap-break-word text-[15px] leading-5'>
            {/^https?:\/\/\S+$/.test(message.content.trim()) ? (
              <a
                href={message.content.trim()}
                target='_blank'
                rel='noopener noreferrer'
                onClick={(event) => event.stopPropagation()}
                className='text-primary underline hover:opacity-80'
              >
                {message.content}
              </a>
            ) : (
              message.content
            )}
          </p>
        )}

        {message.attachments?.length > 0 && (
          <ul
            className='my-2 space-y-2'
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            {message.attachments.map((attachment) => (
              <li key={attachment.id}>
                <MessageAttachment attachment={attachment} />
              </li>
            ))}
          </ul>
        )}

        <div className='mt-1 flex items-center justify-end gap-1 text-[11px] text-text-secondary'>
          <time dateTime={message.createdAt}>
            {format(new Date(message.createdAt), 'dd MMM hh:mm a', { locale: es })}
          </time>
          {isOwn && <MessageDelivery deliveries={message.deliveries} />}
        </div>
      </div>
    </article>
  );
}

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MessageAttachment } from '@components/attachments/message-attachment';

import type { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  currentUserId: string;
}

export function MessageBubble({ message, currentUserId }: MessageBubbleProps) {
  const isOwn = message.senderId === currentUserId;

  return (
    <article className={isOwn ? 'flex justify-end' : 'flex justify-start'}>
      <div
        className={[
          'max-w-[min(76%,620px)] rounded-lg px-3 py-2 shadow-sm',
          isOwn ? 'rounded-br-sm bg-primary' : 'rounded-bl-sm bg-accent',
        ].join(' ')}
      >
        <p className='whitespace-pre-wrap wrap-break-word text-[15px] leading-5'>
          {/^https?:\/\/\S+$/.test(message.content.trim()) ? (
            <a
              href={message.content.trim()}
              target='_blank'
              rel='noopener noreferrer'
              className='text-accent-foreground underline hover:opacity-80'
            >
              {message.content}
            </a>
          ) : (
            message.content
          )}
        </p>

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
          <time>{format(new Date(message.createdAt), 'dd MMM HH:mm', { locale: es })}</time>
        </div>
      </div>
    </article>
  );
}

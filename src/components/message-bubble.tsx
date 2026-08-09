import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { fileService } from '@services/file-service';
import type { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  currentUserId: string;
}

export function MessageBubble({ message, currentUserId }: MessageBubbleProps) {
  const [downloads, setDownloads] = useState<Map<string, string>>(new Map());
  const isOwn = message.senderId === currentUserId;

  useEffect(() => {
    if (!message.attachments || message.attachments.length === 0) return;

    const loadDownloadUrls = async () => {
      const entries: [string, string][] = [];
      for (const attachment of message.attachments) {
        const response = await fileService.downloadFile({ attachmentId: attachment.id });
        entries.push([attachment.id, response.url]);
      }
      setDownloads(new Map(entries));
    };

    loadDownloadUrls();
  }, [message]);

  return (
    <article className={isOwn ? 'flex justify-end' : 'flex justify-start'}>
      <div
        className={[
          'max-w-[min(76%,620px)] rounded-lg px-3 py-2 shadow-sm',
          isOwn ? 'rounded-br-sm bg-primary' : 'rounded-bl-sm bg-accent',
        ].join(' ')}
      >
        <p className='text-[15px] leading-5 whitespace-pre-wrap wrap-break-word text-foreground'>
          {message.content}
        </p>

        {message.attachments?.length > 0 && (
          <ul className='my-2 space-y-2'>
            {message.attachments.map((attachment) => {
              const url = downloads.get(attachment.id);
              if (!url) return null;

              if (attachment.contentType.startsWith('audio/')) {
                return (
                  <li key={attachment.id}>
                    <audio controls preload='auto' src={url} className='max-w-full' />
                  </li>
                );
              }

              return (
                <li key={attachment.id} className='text-accent'>
                  <a href={url} download={attachment.fileName} className='hover:underline'>
                    {attachment.fileName}
                  </a>
                </li>
              );
            })}
          </ul>
        )}

        <div className='mt-1 flex items-center justify-end gap-1 text-[11px] text-text-secondary'>
          <time>{<time>{format(new Date(message.createdAt), 'HH:mm', { locale: es })}</time>}</time>
        </div>
      </div>
    </article>
  );
}

import * as RadixDialog from 'radix-ui/dialog';
import { X } from 'lucide-react';

import type { ReactNode } from 'react';

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
};

export function Dialog({ open, onOpenChange, title, description, children }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className='fixed inset-0 z-40 bg-black/60 data-[state=open]:animate-in data-[state=open]:fade-in' />
        <RadixDialog.Content className='fixed top-1/2 left-1/2 z-50 max-h-[calc(100dvh_-_1.5rem)] w-[calc(100%_-_1.5rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-xl border border-border bg-background p-4 shadow-xl sm:p-6'>
          <div className='mb-4 flex items-start justify-between gap-2'>
            <div className='min-w-0 wrap-anywhere'>
              <RadixDialog.Title className='text-base font-semibold text-foreground'>
                {title}
              </RadixDialog.Title>
              {description && (
                <RadixDialog.Description className='mt-1 text-sm text-text-secondary'>
                  {description}
                </RadixDialog.Description>
              )}
            </div>
            <RadixDialog.Close aria-label='Cerrar' className='grid size-11 shrink-0 cursor-pointer place-items-center rounded-md text-text-secondary hover:bg-muted'>
              <X className='size-4' aria-hidden='true' />
            </RadixDialog.Close>
          </div>
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

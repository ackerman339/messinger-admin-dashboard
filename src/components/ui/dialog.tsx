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
        <RadixDialog.Overlay className='fixed inset-0 bg-black/60 data-[state=open]:animate-in data-[state=open]:fade-in' />
        <RadixDialog.Content className='fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-background p-6 shadow-xl'>
          <div className='mb-4 flex items-start justify-between'>
            <div>
              <RadixDialog.Title className='text-base font-semibold text-foreground'>
                {title}
              </RadixDialog.Title>
              {description && (
                <RadixDialog.Description className='mt-1 text-sm text-text-secondary'>
                  {description}
                </RadixDialog.Description>
              )}
            </div>
            <RadixDialog.Close className='rounded-md p-1 text-text-secondary hover:bg-muted'>
              <X className='size-4' />
            </RadixDialog.Close>
          </div>
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

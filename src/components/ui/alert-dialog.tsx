import * as RadixAlertDialog from 'radix-ui/alert-dialog';

type AlertDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  isDestructive?: boolean;
};

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmar',
  onConfirm,
  isDestructive = true,
}: AlertDialogProps) {
  return (
    <RadixAlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixAlertDialog.Portal>
        <RadixAlertDialog.Overlay className='fixed inset-0 z-40 bg-black/60' />
        <RadixAlertDialog.Content className='fixed top-1/2 left-1/2 z-50 max-h-[calc(100dvh_-_1.5rem)] w-[calc(100%_-_1.5rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-xl border border-border bg-background p-4 shadow-xl sm:p-6'>
          <RadixAlertDialog.Title className='text-base font-semibold text-foreground'>
            {title}
          </RadixAlertDialog.Title>
          <RadixAlertDialog.Description className='mt-2 text-sm wrap-anywhere text-text-secondary'>
            {description}
          </RadixAlertDialog.Description>
          <div className='mt-6 flex flex-wrap justify-end gap-2'>
            <RadixAlertDialog.Cancel className='min-h-11 flex-1 cursor-pointer rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-muted sm:flex-none'>
              Cancelar
            </RadixAlertDialog.Cancel>
            <RadixAlertDialog.Action
              onClick={onConfirm}
              className={`min-h-11 flex-1 cursor-pointer rounded-lg px-3 py-2 text-sm hover:opacity-90 sm:flex-none ${
                isDestructive ? 'bg-destructive text-white' : 'bg-accent text-accent-foreground'
              }`}
            >
              {confirmLabel}
            </RadixAlertDialog.Action>
          </div>
        </RadixAlertDialog.Content>
      </RadixAlertDialog.Portal>
    </RadixAlertDialog.Root>
  );
}

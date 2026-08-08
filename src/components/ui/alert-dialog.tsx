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
        <RadixAlertDialog.Overlay className='fixed inset-0 bg-black/60' />
        <RadixAlertDialog.Content className='fixed top-1/2 left-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-background p-6 shadow-xl'>
          <RadixAlertDialog.Title className='text-base font-semibold text-foreground'>
            {title}
          </RadixAlertDialog.Title>
          <RadixAlertDialog.Description className='mt-2 text-sm text-text-secondary'>
            {description}
          </RadixAlertDialog.Description>
          <div className='mt-6 flex justify-end gap-2'>
            <RadixAlertDialog.Cancel className='rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-muted'>
              Cancelar
            </RadixAlertDialog.Cancel>
            <RadixAlertDialog.Action
              onClick={onConfirm}
              className={
                isDestructive
                  ? 'rounded-lg bg-destructive px-3 py-1.5 text-sm text-white hover:opacity-90'
                  : 'rounded-lg bg-accent px-3 py-1.5 text-sm text-accent-foreground hover:opacity-90'
              }
            >
              {confirmLabel}
            </RadixAlertDialog.Action>
          </div>
        </RadixAlertDialog.Content>
      </RadixAlertDialog.Portal>
    </RadixAlertDialog.Root>
  );
}

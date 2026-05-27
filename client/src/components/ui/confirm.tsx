import { create } from 'zustand';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface ConfirmOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

interface ConfirmState {
  open: boolean;
  options: ConfirmOptions | null;
  resolve: ((value: boolean) => void) | null;
  show: (opts: ConfirmOptions) => Promise<boolean>;
  handle: (value: boolean) => void;
}

const useConfirmStore = create<ConfirmState>((set, get) => ({
  open: false,
  options: null,
  resolve: null,
  show: (options) =>
    new Promise<boolean>((resolve) => {
      const prev = get().resolve;
      prev?.(false);
      set({ open: true, options, resolve });
    }),
  handle: (value) => {
    const { resolve } = get();
    resolve?.(value);
    set({ open: false, resolve: null });
  },
}));

export function confirm(options: ConfirmOptions): Promise<boolean> {
  return useConfirmStore.getState().show(options);
}

export function ConfirmDialog() {
  const open = useConfirmStore((s) => s.open);
  const options = useConfirmStore((s) => s.options);
  const handle = useConfirmStore((s) => s.handle);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handle(false)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{options?.title ?? 'Xác nhận'}</DialogTitle>
          {options?.description && (
            <DialogDescription>{options.description}</DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handle(false)}>
            {options?.cancelText ?? 'Hủy'}
          </Button>
          <Button
            type="button"
            variant={options?.variant === 'destructive' ? 'destructive' : 'default'}
            onClick={() => handle(true)}
          >
            {options?.confirmText ?? 'Xác nhận'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

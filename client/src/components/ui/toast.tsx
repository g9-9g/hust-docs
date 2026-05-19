import * as React from 'react';
import { create } from 'zustand';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastVariant = 'default' | 'success' | 'error';

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastStore {
  items: ToastItem[];
  push: (t: Omit<ToastItem, 'id'>) => void;
  dismiss: (id: string) => void;
}

const useToastStore = create<ToastStore>((set) => ({
  items: [],
  push: (t) =>
    set((s) => {
      const id = Math.random().toString(36).slice(2);
      setTimeout(() => set((s2) => ({ items: s2.items.filter((it) => it.id !== id) })), 4000);
      return { items: [...s.items, { id, ...t }] };
    }),
  dismiss: (id) => set((s) => ({ items: s.items.filter((it) => it.id !== id) })),
}));

export function toast(input: { title: string; description?: string; variant?: ToastVariant }) {
  useToastStore.getState().push({ title: input.title, description: input.description, variant: input.variant ?? 'default' });
}

export function Toaster() {
  const items = useToastStore((s) => s.items);
  const dismiss = useToastStore((s) => s.dismiss);
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          className={cn(
            'pointer-events-auto relative rounded-lg border bg-card p-4 shadow-lg transition-all',
            t.variant === 'success' && 'border-emerald-300 bg-emerald-50',
            t.variant === 'error' && 'border-destructive bg-destructive/5'
          )}
        >
          <button
            onClick={() => dismiss(t.id)}
            className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
            aria-label="dismiss"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="pr-6 font-medium">{t.title}</p>
          {t.description && <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>}
        </div>
      ))}
    </div>
  );
}

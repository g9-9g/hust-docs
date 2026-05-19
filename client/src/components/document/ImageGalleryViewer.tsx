import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
  documentId: string;
  count: number;
  baseUrl: (docId: string, index: number) => string;
  title?: string;
}

export function ImageGalleryViewer({ documentId, count, baseUrl, title }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(0, i - 1));
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(count - 1, i + 1));
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [count]);

  if (count <= 1) {
    return (
      <div className="flex max-h-[82vh] justify-center overflow-auto bg-muted/40 p-4">
        <img
          src={baseUrl(documentId, 0)}
          alt={title}
          className="max-h-full rounded-md shadow-lg ring-1 ring-border/60"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="relative flex max-h-[72vh] items-center justify-center overflow-auto bg-muted/40 p-4">
        <img
          key={index}
          src={baseUrl(documentId, index)}
          alt={`${title ?? 'Ảnh'} ${index + 1}/${count}`}
          className="max-h-[68vh] rounded-md shadow-lg ring-1 ring-border/60"
        />
        <Button
          size="icon"
          variant="secondary"
          className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-md"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          aria-label="Ảnh trước"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-md"
          onClick={() => setIndex((i) => Math.min(count - 1, i + 1))}
          disabled={index === count - 1}
          aria-label="Ảnh sau"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground/80 px-3 py-1 text-xs font-medium text-background">
          {index + 1} / {count}
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto border-t bg-secondary/40 p-3">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={cn(
              'shrink-0 overflow-hidden rounded-md border-2 transition-all',
              i === index
                ? 'border-hust shadow-md'
                : 'border-transparent opacity-70 hover:opacity-100',
            )}
          >
            <img
              src={baseUrl(documentId, i)}
              alt=""
              loading="lazy"
              className="h-16 w-24 object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DocumentCard } from './DocumentCard';
import type { DocumentItem } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  title: string;
  icon?: ComponentType<{ className?: string }>;
  documents: DocumentItem[];
  isLoading?: boolean;
  emptyHint?: string;
}

export function DocumentCarousel({ title, icon: Icon, documents, isLoading, emptyHint }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const sync = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    sync();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      el.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [sync, documents.length, isLoading]);

  function scroll(dir: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-3">
          <span className="h-7 w-1.5 rounded-full bg-gradient-to-b from-hust to-hust-700" />
          {Icon && (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-hust/10 ring-1 ring-hust/20">
              <Icon className="h-5 w-5 text-hust" />
            </span>
          )}
          <span className="text-xl font-bold tracking-tight md:text-2xl">{title}</span>
        </h2>
        <div className="flex gap-1.5">
          <ArrowButton dir={-1} disabled={!canLeft} onClick={() => scroll(-1)} />
          <ArrowButton dir={1} disabled={!canRight} onClick={() => scroll(1)} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="w-56 shrink-0 overflow-hidden border-border/60">
              <Skeleton className="aspect-[4/3] w-full rounded-none" />
              <CardContent className="space-y-2 p-4">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : documents.length === 0 ? (
        <Card className="border-dashed border-border/60">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {emptyHint ?? 'Chưa có tài liệu nào.'}
          </CardContent>
        </Card>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {documents.map((d) => (
            <div key={d.id} className="w-56 shrink-0 snap-start">
              <DocumentCard document={d} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ArrowButton({
  dir,
  disabled,
  onClick,
}: {
  dir: 1 | -1;
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = dir === 1 ? ChevronRight : ChevronLeft;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 1 ? 'Cuộn phải' : 'Cuộn trái'}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full border bg-background transition-colors',
        disabled
          ? 'cursor-not-allowed text-muted-foreground/40'
          : 'text-foreground hover:border-hust/40 hover:bg-hust-50 hover:text-hust',
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

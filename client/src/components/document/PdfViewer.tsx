import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Loader2,
  AlertTriangle,
  FileText,
  ScrollText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import '@/lib/pdfjs-worker';

interface Props {
  url: string;
}

type Mode = 'paged' | 'scroll';

const MIN_SCALE = 0.5;
const MAX_SCALE = 2.5;
const SCALE_STEP = 0.15;

export function PdfViewer({ url }: Props) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.1);
  const [mode, setMode] = useState<Mode>('paged');
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setContainerWidth(w - 32);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const file = useMemo(() => ({ url }), [url]);

  const onLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  }, []);

  function toggleMode() {
    setMode((m) => {
      const next = m === 'paged' ? 'scroll' : 'paged';
      if (next === 'scroll') {
        requestAnimationFrame(() => {
          pageRefs.current.get(pageNumber)?.scrollIntoView({ block: 'start' });
        });
      }
      return next;
    });
  }

  function setRef(num: number) {
    return (el: HTMLDivElement | null) => {
      if (el) pageRefs.current.set(num, el);
      else pageRefs.current.delete(num);
    };
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-secondary/40 px-3 py-2">
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={mode === 'scroll' || pageNumber <= 1}
            aria-label="Trang trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="w-20 text-center text-xs tabular-nums">
            {pageNumber} / {numPages || '—'}
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => setPageNumber((p) => Math.min(numPages || p, p + 1))}
            disabled={mode === 'scroll' || pageNumber >= numPages}
            aria-label="Trang sau"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 gap-1.5 px-2 text-xs"
            onClick={toggleMode}
            aria-label="Đổi chế độ xem"
            title={mode === 'paged' ? 'Chuyển sang chế độ cuộn' : 'Chuyển sang chế độ từng trang'}
          >
            {mode === 'paged' ? (
              <>
                <ScrollText className="h-4 w-4" /> Cuộn
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" /> Trang
              </>
            )}
          </Button>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => setScale((s) => Math.max(MIN_SCALE, +(s - SCALE_STEP).toFixed(2)))}
              disabled={scale <= MIN_SCALE}
              aria-label="Thu nhỏ"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center text-xs tabular-nums">
              {Math.round(scale * 100)}%
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => setScale((s) => Math.min(MAX_SCALE, +(s + SCALE_STEP).toFixed(2)))}
              disabled={scale >= MAX_SCALE}
              aria-label="Phóng to"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div
        ref={containerRef}
        className={cn(
          'max-h-[82vh] overflow-auto bg-muted/40 p-4',
          mode === 'paged' ? 'flex justify-center' : 'flex flex-col items-center gap-4',
        )}
      >
        <Document
          file={file}
          onLoadSuccess={(d) => {
            setErrorMsg(null);
            onLoadSuccess(d);
          }}
          onLoadError={(err) => {
            console.error('PDF load error:', err);
            setErrorMsg(err?.message || String(err));
          }}
          onSourceError={(err) => {
            console.error('PDF source error:', err);
            setErrorMsg(err?.message || String(err));
          }}
          loading={
            <div className="flex items-center gap-2 py-20 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Đang tải PDF…
            </div>
          }
          error={
            <div className="flex max-w-md flex-col items-center gap-2 py-20 text-center text-sm">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <p className="font-medium text-destructive">Không tải được file PDF</p>
              {errorMsg && (
                <p className="break-words font-mono text-xs text-muted-foreground">{errorMsg}</p>
              )}
            </div>
          }
          className={mode === 'scroll' ? 'flex flex-col items-center gap-4' : undefined}
        >
          {mode === 'paged' ? (
            <Page
              pageNumber={pageNumber}
              scale={scale}
              width={containerWidth ?? undefined}
              className="shadow-lg ring-1 ring-border/60"
              renderAnnotationLayer
              renderTextLayer
            />
          ) : (
            Array.from({ length: numPages }, (_, i) => i + 1).map((num) => (
              <div key={num} ref={setRef(num)}>
                <Page
                  pageNumber={num}
                  scale={scale}
                  width={containerWidth ?? undefined}
                  className="shadow-lg ring-1 ring-border/60"
                  renderAnnotationLayer
                  renderTextLayer
                />
              </div>
            ))
          )}
        </Document>
      </div>
    </div>
  );
}

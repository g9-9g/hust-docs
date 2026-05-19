import { useEffect, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { cn } from '@/lib/utils';
import { fileTypeStyle, type FileTypeStyle } from '@/lib/fileType';
import '@/lib/pdfjs-worker';

interface Props {
  url: string;
  fallbackStyle?: FileTypeStyle;
}

export function PdfThumbnail({ url, fallbackStyle }: Props) {
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const style = fallbackStyle ?? fileTypeStyle('pdf');
  const Icon = style.Icon;

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  return (
    <div
      ref={ref}
      className={cn('relative h-full w-full overflow-hidden bg-gradient-to-br', style.gradient)}
    >
      {(!ready || failed) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon
            className={cn(
              'h-16 w-16 transition-transform group-hover:scale-110',
              style.iconColor,
            )}
          />
        </div>
      )}
      {visible && !failed && (
        <div
          className={cn(
            'absolute inset-0 flex items-start justify-center bg-white transition-opacity duration-300',
            ready ? 'opacity-100' : 'opacity-0',
          )}
        >
          <Document
            file={url}
            loading={null}
            error={null}
            onLoadError={() => setFailed(true)}
            onSourceError={() => setFailed(true)}
          >
            <Page
              pageNumber={1}
              width={360}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              onRenderSuccess={() => setReady(true)}
              onRenderError={() => setFailed(true)}
            />
          </Document>
        </div>
      )}
    </div>
  );
}

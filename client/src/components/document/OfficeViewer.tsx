import { useEffect, useRef, useState } from 'react';
import { Loader2, AlertTriangle, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

type OfficeKind = 'docx' | 'xlsx' | 'pptx';

interface Props {
  url: string;
  kind: OfficeKind;
  downloadUrl: string;
  publicUrl?: string | null;
}

const OFFICE_EMBED = 'https://view.officeapps.live.com/op/embed.aspx?src=';

function isPublic(url: string | null | undefined): url is string {
  return !!url && /^https?:\/\//i.test(url) && !/localhost|127\.0\.0\.1/i.test(url);
}

export function OfficeViewer({ url, kind, downloadUrl, publicUrl }: Props) {
  if (isPublic(publicUrl)) {
    const src = OFFICE_EMBED + encodeURIComponent(publicUrl);
    return (
      <iframe
        src={src}
        title="Office preview"
        className="h-[82vh] w-full border-0"
        allowFullScreen
      />
    );
  }
  if (kind === 'pptx') {
    return <PptxViewer downloadUrl={downloadUrl} />;
  }
  if (kind === 'docx') {
    return <DocxViewer url={url} downloadUrl={downloadUrl} />;
  }
  return <XlsxViewer url={url} downloadUrl={downloadUrl} />;
}

function DocxViewer({ url, downloadUrl }: { url: string; downloadUrl: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    async function render() {
      try {
        setState('loading');
        const [{ renderAsync }, res] = await Promise.all([
          import('docx-preview'),
          fetch(url, { headers: { 'ngrok-skip-browser-warning': 'true' } }),
        ]);
        if (!res.ok) throw new Error('fetch failed');
        const buffer = await res.arrayBuffer();
        if (cancelled || !ref.current) return;
        ref.current.innerHTML = '';
        await renderAsync(buffer, ref.current, undefined, {
          className: 'docx',
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          breakPages: true,
          renderHeaders: true,
          renderFooters: true,
          renderFootnotes: true,
          experimental: true,
          useBase64URL: true,
        });
        if (!cancelled) setState('ready');
      } catch (err) {
        console.error('docx render failed', err);
        if (!cancelled) setState('error');
      }
    }
    render();
    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <div className="relative max-h-[82vh] overflow-auto bg-muted/40 p-4">
      {state === 'loading' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-muted/40 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Đang dựng tài liệu Word…
        </div>
      )}
      {state === 'error' && (
        <FallbackError downloadUrl={downloadUrl} message="Không hiển thị được file Word này." />
      )}
      <div ref={ref} className="docx-preview-wrapper mx-auto" />
    </div>
  );
}

function XlsxViewer({ url, downloadUrl }: { url: string; downloadUrl: string }) {
  const [sheets, setSheets] = useState<{ name: string; html: string }[]>([]);
  const [active, setActive] = useState(0);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    async function render() {
      try {
        setState('loading');
        const [XLSX, res] = await Promise.all([
          import('xlsx'),
          fetch(url, { headers: { 'ngrok-skip-browser-warning': 'true' } }),
        ]);
        if (!res.ok) throw new Error('fetch failed');
        const buffer = await res.arrayBuffer();
        if (cancelled) return;
        const wb = XLSX.read(buffer, { type: 'array' });
        const list = wb.SheetNames.map((name) => ({
          name,
          html: XLSX.utils.sheet_to_html(wb.Sheets[name], { editable: false }),
        }));
        if (!cancelled) {
          setSheets(list);
          setActive(0);
          setState('ready');
        }
      } catch (err) {
        console.error('xlsx render failed', err);
        if (!cancelled) setState('error');
      }
    }
    render();
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (state === 'loading') {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Đang tải bảng tính…
      </div>
    );
  }
  if (state === 'error') {
    return <FallbackError downloadUrl={downloadUrl} message="Không hiển thị được file Excel này." />;
  }

  return (
    <div className="flex max-h-[82vh] flex-col">
      {sheets.length > 1 && (
        <div className="flex flex-wrap items-center gap-1 border-b bg-secondary/40 px-3 py-2">
          {sheets.map((s, i) => (
            <button
              key={s.name}
              onClick={() => setActive(i)}
              className={
                'rounded-md px-3 py-1 text-xs font-medium transition-colors ' +
                (i === active
                  ? 'bg-hust text-white'
                  : 'text-muted-foreground hover:bg-background hover:text-foreground')
              }
            >
              {s.name}
            </button>
          ))}
        </div>
      )}
      <div className="overflow-auto bg-white p-4">
        <div
          className="xlsx-preview"
          dangerouslySetInnerHTML={{ __html: sheets[active]?.html ?? '' }}
        />
      </div>
    </div>
  );
}

function PptxViewer({ downloadUrl }: { downloadUrl: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <FileText className="h-16 w-16 text-muted-foreground" />
      <p className="font-medium">Bản xem trước PowerPoint chưa khả dụng trong môi trường này</p>
      <p className="max-w-md text-sm text-muted-foreground">
        Trình xem PowerPoint nhúng yêu cầu file được công khai trên internet. Vui lòng tải xuống để
        xem nội dung.
      </p>
      <Button asChild className="mt-2 gap-2">
        <a href={downloadUrl}>
          <Download className="h-4 w-4" /> Tải xuống
        </a>
      </Button>
    </div>
  );
}

function FallbackError({ downloadUrl, message }: { downloadUrl: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive" />
      <p className="font-medium">{message}</p>
      <Button asChild className="mt-2 gap-2">
        <a href={downloadUrl}>
          <Download className="h-4 w-4" /> Tải xuống
        </a>
      </Button>
    </div>
  );
}

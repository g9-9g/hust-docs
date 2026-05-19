import { useParams } from 'react-router-dom';
import { Download, Eye, ThumbsUp, BadgeCheck, FileText, Calendar, User as UserIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { downloadUrl, previewUrl, previewUrlByIndex, publicPreviewUrl } from '@/api/documents';
import { CATEGORY_LABEL } from '@/lib/categories';
import { formatFileSize, formatRelativeDate } from '@/lib/utils';
import { useDocumentQuery } from '@/hooks/queries';
import { PdfViewer } from '@/components/document/PdfViewer';
import { OfficeViewer } from '@/components/document/OfficeViewer';
import { ImageGalleryViewer } from '@/components/document/ImageGalleryViewer';
import type { DocumentItem } from '@/types';

type OfficeKind = 'docx' | 'xlsx' | 'pptx';

function officeKind(doc: DocumentItem): OfficeKind | null {
  const ext = doc.extension.toLowerCase();
  if (ext === 'docx' || ext === 'doc') return 'docx';
  if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') return 'xlsx';
  if (ext === 'pptx' || ext === 'ppt') return 'pptx';
  const m = doc.mimeType;
  if (m.includes('wordprocessingml') || m === 'application/msword') return 'docx';
  if (m.includes('spreadsheetml') || m === 'application/vnd.ms-excel' || m === 'text/csv') return 'xlsx';
  if (m.includes('presentationml') || m === 'application/vnd.ms-powerpoint') return 'pptx';
  return null;
}

export default function DocumentDetailPage() {
  const { id } = useParams();
  const { data: doc, isLoading, isError } = useDocumentQuery(id);

  if (isLoading) {
    return <DocumentDetailSkeleton />;
  }
  if (isError || !doc) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-xl font-semibold">Không tìm thấy tài liệu</h1>
      </div>
    );
  }

  const hasPdfPreview = doc.previewMimeType === 'application/pdf';
  const isPdf =
    hasPdfPreview || doc.mimeType === 'application/pdf' || doc.extension.toLowerCase() === 'pdf';
  const isImage = doc.mimeType.startsWith('image/');
  const kind = !isPdf && !isImage ? officeKind(doc) : null;
  const pageCount = 1 + (doc.extraOriginalNames?.length ?? doc.extraPaths?.length ?? 0);
  const up = doc.uploader ?? null;

  return (
    <div className="container py-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0 space-y-6">
        <div className="space-y-3">
          <Badge variant="secondary" className="text-hust">
            {CATEGORY_LABEL[doc.category]}
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">{doc.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {doc.subject && <span>📚 {doc.subject.name}</span>}
            {doc.major && <span>🎓 {doc.major.name}</span>}
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> {formatRelativeDate(doc.createdAt)}
            </span>
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {isPdf ? (
              <PdfViewer url={previewUrl(doc.id)} />
            ) : isImage ? (
              <ImageGalleryViewer
                documentId={doc.id}
                count={pageCount}
                baseUrl={previewUrlByIndex}
                title={doc.title}
              />
            ) : kind ? (
              <OfficeViewer
                url={previewUrl(doc.id)}
                kind={kind}
                downloadUrl={downloadUrl(doc.id)}
                publicUrl={publicPreviewUrl(doc.id)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <FileText className="h-16 w-16 text-muted-foreground" />
                <p className="font-medium">Preview chưa hỗ trợ cho định dạng này</p>
                <p className="text-sm text-muted-foreground">Vui lòng tải xuống để xem nội dung đầy đủ.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {doc.description && (
          <Card>
            <CardContent className="p-6 space-y-2">
              <h2 className="font-semibold">Mô tả</h2>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {doc.description}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
        <Card>
          <CardContent className="p-5 space-y-4">
            <Button asChild className="w-full gap-2" size="lg">
              <a href={downloadUrl(doc.id)}>
                <Download className="h-4 w-4" />
                Tải xuống · {formatFileSize(doc.size)}
              </a>
            </Button>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <Stat icon={<Eye className="h-4 w-4" />} label="Lượt xem" value={doc.viewCount} />
              <Stat icon={<Download className="h-4 w-4" />} label="Tải" value={doc.downloadCount} />
              <Stat icon={<ThumbsUp className="h-4 w-4" />} label="Upvote" value={doc.upvoteCount} />
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <Row label="Định dạng" value={doc.extension.toUpperCase()} />
              <Row label="Dung lượng" value={formatFileSize(doc.size)} />
              {doc.teacherName && <Row label="Giảng viên" value={doc.teacherName} />}
              {doc.semester && <Row label="Học kỳ" value={doc.semester} />}
              {doc.academicYear && <Row label="Năm học" value={doc.academicYear} />}
            </div>
            {doc.tags.length > 0 && (
              <>
                <Separator />
                <div className="flex flex-wrap gap-1">
                  {doc.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="font-normal">
                      #{t}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {up && (
          <Card>
            <CardContent className="p-5 space-y-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Người đăng</p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-hust text-white">
                    {up.fullName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="flex items-center gap-1 font-medium">
                    {up.fullName}
                    {up.isVerified && <BadgeCheck className="h-4 w-4 text-emerald-600" />}
                  </span>
                  <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    <UserIcon className="h-3 w-3" /> @{up.username}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </aside>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-lg bg-secondary/60 p-2">
      <div className="flex justify-center text-muted-foreground">{icon}</div>
      <p className="mt-1 font-semibold">{value}</p>
      <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

function DocumentDetailSkeleton() {
  return (
    <div className="container py-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-[70vh] w-full rounded-xl" />
      </div>
      <aside className="space-y-4">
        <Card>
          <CardContent className="p-5 space-y-4">
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
            </div>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

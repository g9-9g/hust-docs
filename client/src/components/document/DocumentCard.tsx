import { Link } from 'react-router-dom';
import { Download, ThumbsUp, Eye, BadgeCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { DocumentItem } from '@/types';
import { CATEGORY_LABEL } from '@/lib/categories';
import { formatRelativeDate, cn } from '@/lib/utils';
import { previewUrl } from '@/api/documents';
import { fileTypeStyle } from '@/lib/fileType';
import { PdfThumbnail } from './PdfThumbnail';

interface Props {
  document: DocumentItem;
}

function uploaderName(doc: DocumentItem) {
  return doc.uploader?.fullName ?? 'Sinh viên HUST';
}

function subjectName(doc: DocumentItem) {
  return doc.subject?.name ?? '';
}

function majorName(doc: DocumentItem) {
  return doc.major?.name ?? '';
}

export function DocumentCard({ document }: Props) {
  const ext = document.extension.toUpperCase();
  const isPdf =
    document.previewMimeType === 'application/pdf' ||
    document.mimeType === 'application/pdf' ||
    document.extension.toLowerCase() === 'pdf';
  const isImage = document.mimeType.startsWith('image/');
  const style = fileTypeStyle(document.extension);
  const FallbackIcon = style.Icon;

  return (
    <Card className="group overflow-hidden border-border/60 transition-shadow hover:shadow-md">
      <Link to={`/documents/${document.id}`} className="block">
        <div
          className={cn(
            'relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br',
            style.gradient,
          )}
        >
          {isPdf ? (
            <PdfThumbnail url={previewUrl(document.id)} fallbackStyle={style} />
          ) : isImage ? (
            <img
              src={previewUrl(document.id)}
              alt={document.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <FallbackIcon
                className={cn(
                  'h-16 w-16 transition-transform group-hover:scale-110',
                  style.iconColor,
                )}
              />
            </div>
          )}
          <Badge
            className={cn('absolute left-3 top-3 text-white shadow-sm', style.badgeBg)}
            variant="default"
          >
            {ext}
          </Badge>
          {document.isVerified && (
            <Badge className="absolute right-3 top-3 gap-1 bg-emerald-600 text-white" variant="default">
              <BadgeCheck className="h-3 w-3" /> Verified
            </Badge>
          )}
        </div>
        <CardContent className="p-4 space-y-2">
          <p className="text-[11px] uppercase tracking-wider text-hust font-semibold">
            {CATEGORY_LABEL[document.category]}
          </p>
          <h3 className="line-clamp-2 font-semibold leading-snug min-h-[2.75rem]">{document.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {subjectName(document)} {majorName(document) ? `· ${majorName(document)}` : ''}
          </p>
          <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" /> {document.viewCount}
            </span>
            <span className="inline-flex items-center gap-1">
              <Download className="h-3.5 w-3.5" /> {document.downloadCount}
            </span>
            <span className="inline-flex items-center gap-1">
              <ThumbsUp className="h-3.5 w-3.5" /> {document.upvoteCount}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground border-t">
            <span className="truncate">{uploaderName(document)}</span>
            <span className="shrink-0">{formatRelativeDate(document.createdAt)}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ChevronRight,
  Folder,
  FileText,
  Download,
  Upload,
  Search,
  Flame,
  Star,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { DocumentCard } from '@/components/document/DocumentCard';
import { DocumentCarousel } from '@/components/document/DocumentCarousel';
import { useDocumentsQuery, useSubjectDetailQuery } from '@/hooks/queries';
import { cn } from '@/lib/utils';

export default function SubjectDetailPage() {
  const { id } = useParams();
  const [search, setSearch] = useState('');
  const query = search.trim();
  const searching = query.length > 0;

  const { data: subject, isLoading: subjectLoading, isError } = useSubjectDetailQuery(id);

  const trending = useDocumentsQuery({ subjectId: id, sort: 'mostViewed', limit: 12 });
  const topRated = useDocumentsQuery({ subjectId: id, sort: 'topRated', limit: 12 });
  const browse = useDocumentsQuery({
    subjectId: id,
    q: query || undefined,
    sort: 'latest',
    limit: 24,
  });

  if (isError) {
    return (
      <div className="container py-16">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <Folder className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-lg font-medium">Không tìm thấy môn học</p>
            <Button asChild variant="outline">
              <Link to="/subjects">Quay lại danh sách môn học</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const browseDocs = browse.data?.items ?? [];

  return (
    <div className="container space-y-6 py-6">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link to="/subjects" className="transition-colors hover:text-hust">
          Môn học
        </Link>
        {subject?.major && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>{subject.major.name}</span>
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate font-medium text-foreground">
          {subject?.name ?? '...'}
        </span>
      </nav>

      <section className="overflow-hidden rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 to-lime-50/60 p-6 md:p-8">
        {subjectLoading || !subject ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-40" />
          </div>
        ) : (
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm">
                <Folder className="h-7 w-7" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  {subject.name}{' '}
                  <span className="font-semibold text-muted-foreground">({subject.code})</span>
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  {subject.major && (
                    <Badge variant="secondary" className="font-normal">
                      {subject.major.name}
                    </Badge>
                  )}
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" /> {subject.documentCount} tài liệu
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <Download className="h-4 w-4" /> {subject.downloadCount} lượt tải
                  </span>
                </div>
              </div>
            </div>
            <Button asChild className="gap-1.5 self-start md:self-auto">
              <Link to="/upload">
                <Upload className="h-4 w-4" /> Đăng tải tài liệu
              </Link>
            </Button>
          </div>
        )}
      </section>

      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Tìm tài liệu trong ${subject?.name ?? 'môn này'}...`}
          className="pl-9"
        />
      </div>

      {searching ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            Kết quả cho "{query}"
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {browse.data?.total ?? 0} tài liệu
            </span>
          </h2>
          {browse.isLoading ? (
            <DocumentGridSkeleton />
          ) : browseDocs.length === 0 ? (
            <EmptyDocuments />
          ) : (
            <div
              className={cn(
                'grid grid-cols-[repeat(auto-fill,minmax(13rem,14rem))] gap-4 transition-opacity',
                browse.isFetching && 'opacity-70',
              )}
            >
              {browseDocs.map((d) => (
                <DocumentCard key={d.id} document={d} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          <DocumentCarousel
            title="Trending"
            icon={Flame}
            documents={trending.data?.items ?? []}
            isLoading={trending.isLoading}
            emptyHint="Chưa có tài liệu nào được xem trong môn này."
          />
          <DocumentCarousel
            title="Highest rated"
            icon={Star}
            documents={topRated.data?.items ?? []}
            isLoading={topRated.isLoading}
            emptyHint="Chưa có tài liệu nào được đánh giá trong môn này."
          />

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">
              Tất cả tài liệu
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {browse.data?.total ?? 0} tài liệu
              </span>
            </h2>
            {browse.isLoading ? (
              <DocumentGridSkeleton />
            ) : browseDocs.length === 0 ? (
              <EmptyDocuments />
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(13rem,14rem))] gap-4">
                {browseDocs.map((d) => (
                  <DocumentCard key={d.id} document={d} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function EmptyDocuments() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
        <FileText className="h-10 w-10 text-muted-foreground/50" />
        <p className="text-lg font-medium">Chưa có tài liệu nào</p>
        <p className="max-w-md text-sm text-muted-foreground">
          Hãy là người đầu tiên đóng góp tài liệu cho môn học này.
        </p>
        <Button asChild className="mt-1">
          <Link to="/upload">Đăng tải tài liệu</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function DocumentGridSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(13rem,14rem))] gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden border-border/60">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <CardContent className="space-y-2 p-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

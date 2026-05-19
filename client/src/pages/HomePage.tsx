import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Sparkles, GraduationCap, FileText, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentCard } from '@/components/document/DocumentCard';
import { CATEGORY_OPTIONS } from '@/lib/categories';
import { useDocumentsQuery, useMajorsQuery, useSubjectsQuery } from '@/hooks/queries';
import { cn } from '@/lib/utils';

const SORT_OPTIONS = [
  { value: 'latest', label: 'Mới nhất' },
  { value: 'mostDownloaded', label: 'Tải nhiều nhất' },
  { value: 'mostUpvoted', label: 'Nhiều upvote nhất' },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]['value'];

const ALL = 'all';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const majorId = searchParams.get('majorId') ?? ALL;
  const subjectId = searchParams.get('subjectId') ?? ALL;
  const category = searchParams.get('category') ?? ALL;
  const sort = (searchParams.get('sort') as SortValue) ?? 'latest';

  const { data: majors = [] } = useMajorsQuery();
  const { data: subjects = [] } = useSubjectsQuery(majorId !== ALL ? majorId : undefined);

  const documentsQuery = useDocumentsQuery({
    q: q || undefined,
    majorId: majorId !== ALL ? majorId : undefined,
    subjectId: subjectId !== ALL ? subjectId : undefined,
    category: category !== ALL ? category : undefined,
    sort,
    limit: 24,
  });

  const docs = documentsQuery.data?.items ?? [];
  const total = documentsQuery.data?.total ?? 0;
  const isInitialLoading = documentsQuery.isLoading;
  const isFetching = documentsQuery.isFetching;

  function update(patch: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams);
    for (const [k, v] of Object.entries(patch)) {
      if (!v || v === ALL) next.delete(k);
      else next.set(k, v);
    }
    setSearchParams(next, { replace: true });
  }

  const activeFilters = useMemo(() => {
    const items: { key: string; label: string }[] = [];
    if (q) items.push({ key: 'q', label: `"${q}"` });
    if (majorId !== ALL) {
      const m = majors.find((x) => x.id === majorId);
      if (m) items.push({ key: 'majorId', label: m.name });
    }
    if (subjectId !== ALL) {
      const s = subjects.find((x) => x.id === subjectId);
      if (s) items.push({ key: 'subjectId', label: s.name });
    }
    if (category !== ALL) {
      const c = CATEGORY_OPTIONS.find((x) => x.value === category);
      if (c) items.push({ key: 'category', label: c.label });
    }
    return items;
  }, [q, majorId, subjectId, category, majors, subjects]);

  return (
    <div className="container py-6 space-y-6">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-hust-700 via-hust to-hust-800 px-6 py-10 md:px-10 md:py-14 text-white shadow-xl ring-1 ring-white/10">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.6) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
            maskImage: 'radial-gradient(ellipse at top left, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at top left, black 30%, transparent 75%)',
          }}
        />
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-gradient-to-br from-white/25 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-pink-400/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-8 right-12 h-32 w-32 rounded-full bg-amber-300/20 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-4">
            <Badge variant="outline" className="gap-1.5 border-white/40 bg-white/10 px-3 py-1 text-white backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Cộng đồng sinh viên HUST
            </Badge>
            <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              Mọi tài liệu Bách khoa,{' '}
              <span className="bg-gradient-to-r from-amber-200 via-pink-100 to-white bg-clip-text text-transparent">
                chỉ trong một cú click.
              </span>
            </h1>
            <p className="max-w-xl text-base text-white/85 md:text-lg">
              Slide bài giảng, đề thi cũ, lời giải, note ôn thi — chia sẻ và khám phá tài liệu được sinh viên HUST đóng góp.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {[
              { icon: FileText, label: 'Tài liệu', value: `${total}+` },
              { icon: GraduationCap, label: 'Môn học', value: `${subjects.length || '—'}` },
              { icon: Users, label: 'Cộng đồng', value: 'HUST' },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur md:p-4"
              >
                <s.icon className="mx-auto h-5 w-5 text-white/90" />
                <div className="mt-1.5 text-lg font-semibold md:text-xl">{s.value}</div>
                <div className="text-[11px] uppercase tracking-wider text-white/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Card className="border-border/60">
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
          <div className="flex items-center gap-2 text-sm font-medium">
            <SlidersHorizontal className="h-4 w-4" /> Lọc:
          </div>
          <div className="grid flex-1 grid-cols-2 gap-2 md:grid-cols-4">
            <Select value={majorId} onValueChange={(v) => update({ majorId: v, subjectId: null })}>
              <SelectTrigger><SelectValue placeholder="Chuyên ngành" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tất cả chuyên ngành</SelectItem>
                {majors.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={subjectId} onValueChange={(v) => update({ subjectId: v })} disabled={majorId === ALL}>
              <SelectTrigger><SelectValue placeholder="Môn học" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tất cả môn học</SelectItem>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.code} — {s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={category} onValueChange={(v) => update({ category: v })}>
              <SelectTrigger><SelectValue placeholder="Loại tài liệu" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Mọi loại tài liệu</SelectItem>
                {CATEGORY_OPTIONS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={(v) => update({ sort: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => update({ [f.key]: null })}
              className="inline-flex items-center gap-1 rounded-full border border-hust/30 bg-hust-50 px-3 py-1 text-xs font-medium text-hust hover:bg-hust-100"
            >
              {f.label} <X className="h-3 w-3" />
            </button>
          ))}
          <button
            onClick={() => setSearchParams(new URLSearchParams())}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Xóa toàn bộ
          </button>
        </div>
      )}

      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">
          {q ? `Kết quả cho "${q}"` : 'Tài liệu mới nhất'}
          <span className="ml-2 text-sm font-normal text-muted-foreground">{total} kết quả</span>
        </h2>
      </div>

      {isInitialLoading ? (
        <DocumentGridSkeleton />
      ) : docs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <p className="text-lg font-medium">Chưa có tài liệu nào phù hợp</p>
            <p className="text-sm text-muted-foreground max-w-md">
              Thử thay đổi bộ lọc, hoặc trở thành người đầu tiên đóng góp tài liệu cho mục này.
            </p>
            <Button asChild className="mt-2"><a href="/upload">Đăng tải tài liệu</a></Button>
          </CardContent>
        </Card>
      ) : (
        <div
          className={cn(
            'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-opacity',
            isFetching && 'opacity-70'
          )}
        >
          {docs.map((d) => (
            <DocumentCard key={d.id} document={d} />
          ))}
        </div>
      )}
    </div>
  );
}

function DocumentGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden border-border/60">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-10" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

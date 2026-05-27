import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Folder, FileText, Download, GraduationCap, Library, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Combobox } from '@/components/ui/combobox';
import { useMajorsQuery, useSubjectCatalogQuery } from '@/hooks/queries';
import type { SubjectListItem } from '@/types';
import { cn } from '@/lib/utils';

const ALL = 'all';
const POPULAR = 'Popular';
const LETTERS = [POPULAR, ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), '#'];

function firstLetter(name: string): string {
  const c = name
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')[0]
    ?.toUpperCase();
  return c && /[A-Z]/.test(c) ? c : '#';
}

export default function SubjectsPage() {
  const [majorId, setMajorId] = useState(ALL);
  const [letter, setLetter] = useState(POPULAR);
  const [search, setSearch] = useState('');

  const { data: majors = [] } = useMajorsQuery();
  const { data: subjects = [], isLoading } = useSubjectCatalogQuery();

  const query = search.trim().toLowerCase();
  const searching = query.length > 0;

  const filtered = useMemo(() => {
    let list = subjects;
    if (majorId !== ALL) list = list.filter((s) => s.majorId === majorId);
    if (searching) {
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.code.toLowerCase().includes(query) ||
          (s.major?.name.toLowerCase().includes(query) ?? false),
      );
    } else if (letter !== POPULAR) {
      list = list.filter((s) => firstLetter(s.name) === letter);
    }
    return [...list].sort((a, b) =>
      !searching && letter === POPULAR
        ? b.documentCount - a.documentCount || a.name.localeCompare(b.name)
        : a.name.localeCompare(b.name),
    );
  }, [subjects, majorId, letter, searching, query]);

  const totals = useMemo(
    () =>
      subjects.reduce(
        (acc, s) => {
          acc.docs += s.documentCount;
          acc.downloads += s.downloadCount;
          return acc;
        },
        { docs: 0, downloads: 0 },
      ),
    [subjects],
  );

  return (
    <div className="container space-y-6 py-6">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-hust-700 via-hust to-hust-800 px-6 py-10 text-white shadow-xl ring-1 ring-white/10 md:px-10 md:py-14">
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
              <Sparkles className="h-3.5 w-3.5" /> Thư viện môn học
            </Badge>
            <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              Khám phá{' '}
              <span className="bg-gradient-to-r from-amber-200 via-pink-100 to-white bg-clip-text text-transparent">
                môn học Bách khoa.
              </span>
            </h1>
            <p className="max-w-xl text-base text-white/85 md:text-lg">
              Duyệt tài liệu theo từng ngành và môn học — chọn một môn để xem ngay những tài liệu nổi bật nhất.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <HeroStat icon={GraduationCap} value={majors.length || '—'} label="Ngành" />
            <HeroStat icon={Library} value={subjects.length || '—'} label="Môn học" />
            <HeroStat icon={FileText} value={totals.docs || '—'} label="Tài liệu" />
            <HeroStat icon={Download} value={totals.downloads || '—'} label="Lượt tải" />
          </div>
        </div>
      </section>

      <Card className="border-border/60">
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
          <div className="md:w-64">
            <Combobox
              value={majorId}
              onChange={setMajorId}
              options={[
                { value: ALL, label: 'Tất cả ngành học' },
                ...majors.map((m) => ({ value: m.id, label: m.name })),
              ]}
              placeholder="Ngành học"
              searchPlaceholder="Tìm ngành học..."
            />
          </div>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên hoặc mã môn học..."
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {!searching && (
        <div className="flex flex-wrap gap-1.5">
          {LETTERS.map((l) => (
            <button
              key={l}
              onClick={() => setLetter(l)}
              className={cn(
                'rounded-md px-2.5 py-1 text-sm font-medium transition-colors',
                letter === l
                  ? 'bg-hust text-white'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              {l}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">
          {searching ? `Kết quả cho "${search.trim()}"` : 'Môn học'}
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            {filtered.length} môn
          </span>
        </h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-[92px] w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
            <Folder className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-lg font-medium">Không tìm thấy môn học nào</p>
            <p className="max-w-md text-sm text-muted-foreground">
              Thử chọn ngành khác, đổi từ khóa tìm kiếm hoặc chữ cái đầu.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <SubjectFolderCard key={s.id} subject={s} />
          ))}
        </div>
      )}
    </div>
  );
}

function HeroStat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof FileText;
  value: string | number;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur md:p-4">
      <Icon className="mx-auto h-5 w-5 text-white/90" />
      <div className="mt-1.5 text-lg font-semibold md:text-xl">{value}</div>
      <div className="text-[11px] uppercase tracking-wider text-white/70">{label}</div>
    </div>
  );
}

function SubjectFolderCard({ subject }: { subject: SubjectListItem }) {
  return (
    <Link to={`/subjects/${subject.id}`} className="block">
      <Card className="group h-full border-border/60 transition-all hover:-translate-y-0.5 hover:border-hust/40 hover:shadow-md">
        <CardContent className="flex items-start gap-3 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
            <Folder className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 font-semibold leading-snug transition-colors group-hover:text-hust">
              {subject.name}
            </h3>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {subject.code}
              {subject.major ? ` · ${subject.major.name}` : ''}
            </p>
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" /> {subject.documentCount} tài liệu
              </span>
              <span className="inline-flex items-center gap-1">
                <Download className="h-3.5 w-3.5" /> {subject.downloadCount} lượt tải
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

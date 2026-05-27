import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Upload,
  BookOpen,
  LogOut,
  User as UserIcon,
  Award,
  Gift,
  Library,
  SlidersHorizontal,
  CornerDownLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combobox';
import { AvatarFrame } from '@/components/rewards/AvatarFrame';
import { BadgeChip } from '@/components/rewards/BadgeChip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/store/auth';
import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useDocumentsQuery, useSubjectCatalogQuery } from '@/hooks/queries';
import { CATEGORY_LABEL, CATEGORY_OPTIONS } from '@/lib/categories';
import { fileTypeStyle } from '@/lib/fileType';
import type { DocumentItem } from '@/types';
import { cn, cleanFullName, shortDisplayName } from '@/lib/utils';

const SUGGEST_LIMIT = 7;

const ALL = 'all';

export function Header() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [category, setCategory] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [activeSuggest, setActiveSuggest] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: subjects = [] } = useSubjectCatalogQuery();

  // Đồng bộ ô tìm kiếm với tham số URL (khi lọc đổi ở trang chủ hoặc điều hướng).
  useEffect(() => {
    setQ(searchParams.get('q') ?? '');
    setCategory(searchParams.get('category') ?? '');
    setSubjectId(searchParams.get('subjectId') ?? '');
  }, [searchParams]);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQ(q.trim()), 200);
    return () => window.clearTimeout(t);
  }, [q]);

  const suggestEnabled = suggestOpen && debouncedQ.length >= 1;
  const { data: suggestData, isFetching: suggestFetching } = useDocumentsQuery(
    { q: debouncedQ || undefined, sort: 'mostViewed', limit: SUGGEST_LIMIT },
    suggestEnabled,
  );
  const suggestions: DocumentItem[] = suggestEnabled ? suggestData?.items ?? [] : [];
  const hasQueryRow = debouncedQ.length > 0;
  const totalSuggestRows = suggestions.length + (hasQueryRow ? 1 : 0);

  useEffect(() => {
    setActiveSuggest(-1);
  }, [debouncedQ, suggestOpen]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
        setSuggestOpen(false);
      }
    }
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape') {
        setFilterOpen(false);
        setSuggestOpen(false);
      }
    }
    if (!filterOpen && !suggestOpen) return;
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [filterOpen, suggestOpen]);

  const subjectOptions = useMemo(
    () => [
      { value: ALL, label: 'Tất cả môn học' },
      ...subjects.map((s) => ({ value: s.id, label: `${s.code} — ${s.name}` })),
    ],
    [subjects],
  );

  const filterCount = (category ? 1 : 0) + (subjectId ? 1 : 0);

  function applyFilters(close: boolean) {
    const params = new URLSearchParams();
    const trimmed = q.trim();
    if (trimmed) params.set('q', trimmed);
    if (category) params.set('category', category);
    if (subjectId) params.set('subjectId', subjectId);
    const query = params.toString();
    navigate(query ? `/?${query}` : '/', { state: { fromApp: true } });
    if (close) {
      setFilterOpen(false);
      setSuggestOpen(false);
    }
    inputRef.current?.blur();
  }

  function onSearch(e: FormEvent) {
    e.preventDefault();
    applyFilters(true);
  }

  function clearFilters() {
    setCategory('');
    setSubjectId('');
  }

  function pickSuggestion(doc: DocumentItem) {
    setSuggestOpen(false);
    inputRef.current?.blur();
    navigate(`/documents/${doc.id}`);
  }

  function onSearchKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!suggestOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setSuggestOpen(true);
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggest((a) => (totalSuggestRows === 0 ? -1 : (a + 1) % totalSuggestRows));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggest((a) =>
        totalSuggestRows === 0 ? -1 : (a - 1 + totalSuggestRows) % totalSuggestRows,
      );
    } else if (e.key === 'Enter') {
      if (activeSuggest >= 0 && activeSuggest < suggestions.length) {
        e.preventDefault();
        pickSuggestion(suggestions[activeSuggest]);
      }
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container flex h-16 items-center gap-3 md:gap-6">
        <Link to="/" className="flex h-10 items-center gap-2 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-hust text-white font-bold shadow-sm">
            H
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-base font-bold tracking-tight text-hust">HUST Docs</span>
            <span className="text-[10px] uppercase text-muted-foreground tracking-wider">
              Kho tài liệu Bách khoa
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center shrink-0">
          <NavLink
            to="/"
            end
            state={{ fromApp: true }}
            className={({ isActive }) =>
              cn(
                'inline-flex h-10 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors',
                isActive ? 'text-hust' : 'text-muted-foreground hover:text-foreground',
              )
            }
          >
            <BookOpen className="h-4 w-4" /> Tài liệu
          </NavLink>
          <NavLink
            to="/subjects"
            className={({ isActive }) =>
              cn(
                'inline-flex h-10 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors',
                isActive ? 'text-hust' : 'text-muted-foreground hover:text-foreground',
              )
            }
          >
            <Library className="h-4 w-4" /> Môn học
          </NavLink>
          <NavLink
            to="/rewards"
            className={({ isActive }) =>
              cn(
                'inline-flex h-10 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors',
                isActive ? 'text-hust' : 'text-muted-foreground hover:text-foreground',
              )
            }
          >
            <Gift className="h-4 w-4" /> Đổi quà
          </NavLink>
        </nav>

        <div ref={searchRef} className="relative flex-1 min-w-0 max-w-xl">
          <form onSubmit={onSearch} className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setSuggestOpen(true);
                if (filterOpen) setFilterOpen(false);
              }}
              onFocus={() => {
                if (q.trim()) setSuggestOpen(true);
              }}
              onKeyDown={onSearchKeyDown}
              placeholder="Tìm môn học, đề thi, slide, note..."
              aria-autocomplete="list"
              aria-expanded={suggestOpen}
              className="h-10 pl-9 pr-11 bg-secondary/50 border-transparent focus-visible:bg-background"
            />
            <button
              type="button"
              onClick={() => {
                setFilterOpen((o) => !o);
                setSuggestOpen(false);
              }}
              aria-label="Bộ lọc tìm kiếm"
              className={cn(
                'absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md transition-colors hover:bg-secondary',
                filterOpen && 'bg-secondary',
              )}
            >
              <SlidersHorizontal
                className={cn('h-4 w-4', filterCount > 0 ? 'text-hust' : 'text-muted-foreground')}
              />
              {filterCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-hust px-1 text-[10px] font-semibold text-white">
                  {filterCount}
                </span>
              )}
            </button>
          </form>

          {suggestOpen && !filterOpen && (suggestions.length > 0 || hasQueryRow) && (
            <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-xl">
              <ul className="max-h-[26rem] overflow-y-auto py-1" role="listbox">
                {suggestions.map((doc, i) => {
                  const style = fileTypeStyle(doc.extension);
                  const Icon = style.Icon;
                  return (
                    <li key={doc.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={activeSuggest === i}
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseEnter={() => setActiveSuggest(i)}
                        onClick={() => pickSuggestion(doc)}
                        className={cn(
                          'flex w-full items-center gap-3 px-3 py-2 text-left transition-colors',
                          activeSuggest === i ? 'bg-secondary' : 'hover:bg-secondary/60',
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br',
                            style.gradient,
                          )}
                        >
                          <Icon className={cn('h-4 w-4', style.iconColor)} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 text-sm font-medium">
                            <HighlightMatch text={doc.title} query={debouncedQ} />
                          </p>
                          <p className="line-clamp-1 text-xs text-muted-foreground">
                            <span className="text-hust">{CATEGORY_LABEL[doc.category]}</span>
                            {doc.subject?.name ? ` · ${doc.subject.name}` : ''}
                          </p>
                        </div>
                        <span className="hidden shrink-0 text-[10px] font-semibold uppercase text-muted-foreground sm:inline">
                          {doc.extension.toUpperCase()}
                        </span>
                      </button>
                    </li>
                  );
                })}
                {hasQueryRow && (
                  <li>
                    <button
                      type="button"
                      role="option"
                      aria-selected={activeSuggest === suggestions.length}
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseEnter={() => setActiveSuggest(suggestions.length)}
                      onClick={() => applyFilters(true)}
                      className={cn(
                        'flex w-full items-center gap-3 border-t px-3 py-2 text-left text-sm transition-colors',
                        activeSuggest === suggestions.length
                          ? 'bg-secondary'
                          : 'hover:bg-secondary/60',
                      )}
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-hust-50 text-hust">
                        <Search className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1">
                          Xem tất cả kết quả cho{' '}
                          <span className="font-semibold">"{debouncedQ}"</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {suggestFetching
                            ? 'Đang tải gợi ý...'
                            : suggestions.length === 0
                              ? 'Không có gợi ý — nhấn để tìm đầy đủ'
                              : 'Mở trang kết quả tìm kiếm'}
                        </p>
                      </div>
                      <CornerDownLeft className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}

          {filterOpen && (
            <div className="absolute left-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] space-y-3 rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg">
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Loại tài liệu
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORY_OPTIONS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setCategory((cur) => (cur === c.value ? '' : c.value))}
                      className={cn(
                        'rounded-full border px-2.5 py-1 text-xs transition-colors',
                        category === c.value
                          ? 'border-hust bg-hust text-white'
                          : 'border-border text-muted-foreground hover:bg-secondary',
                      )}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Môn học
                </p>
                <Combobox
                  value={subjectId || ALL}
                  onChange={(v) => setSubjectId(v === ALL ? '' : v)}
                  options={subjectOptions}
                  placeholder="Tất cả môn học"
                  searchPlaceholder="Tìm môn học..."
                />
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <button
                  type="button"
                  onClick={clearFilters}
                  disabled={filterCount === 0}
                  className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-40"
                >
                  Xóa bộ lọc
                </button>
                <Button type="button" className="h-8" onClick={() => applyFilters(true)}>
                  Áp dụng
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <>
              <Button asChild className="h-10 gap-1.5">
                <Link to="/upload">
                  <Upload className="h-4 w-4" />
                  <span className="hidden sm:inline">Đăng tải</span>
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-10 items-center gap-2 rounded-full border bg-secondary/50 px-1 pr-3 text-sm transition-colors hover:bg-secondary">
                    <AvatarFrame frameGradient={user.equippedAvatarFrame?.frameGradient}>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-hust text-xs font-semibold text-white">
                          {(cleanFullName(user.fullName) || user.username).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </AvatarFrame>
                    <span className="hidden md:inline">
                      {shortDisplayName(user.fullName) || user.username}
                    </span>
                    {user.equippedBadge && (
                      <BadgeChip
                        name={user.equippedBadge.name}
                        icon={user.equippedBadge.icon}
                        accentColor={user.equippedBadge.accentColor}
                        size="sm"
                        iconOnly
                        className="hidden md:inline-flex"
                      />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex flex-col">
                    <span>{cleanFullName(user.fullName) || user.username}</span>
                    <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                    <Link to="/me/points">
                      <Award className="h-4 w-4 text-hust" />
                      <span>{user.contributionPoints} điểm đóng góp</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                    <Link to="/me/points">
                      <Gift className="h-4 w-4 text-hust" />
                      <span>Quà của tôi</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2" disabled>
                    <UserIcon className="h-4 w-4" /> Trang cá nhân
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 text-destructive" onSelect={logout}>
                    <LogOut className="h-4 w-4" /> Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild className="h-10">
              <Link to="/login">Đăng nhập</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-transparent font-semibold text-hust">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Upload, BookOpen, LogOut, User as UserIcon, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useState, type FormEvent } from 'react';
import { cn } from '@/lib/utils';

export function Header() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    navigate(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : '/');
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
        </nav>

        <form onSubmit={onSearch} className="relative flex-1 min-w-0 max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm môn học, đề thi, slide, note..."
            className="h-10 pl-9 bg-secondary/50 border-transparent focus-visible:bg-background"
          />
        </form>

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
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-hust text-xs font-semibold text-white">
                        {user.fullName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">{user.username}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex flex-col">
                    <span>{user.fullName}</span>
                    <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2">
                    <Award className="h-4 w-4 text-hust" />
                    <span>{user.contributionPoints} điểm đóng góp</span>
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
            <>
              <Button asChild variant="ghost" className="h-10">
                <Link to="/login">Đăng nhập</Link>
              </Button>
              <Button asChild className="h-10">
                <Link to="/register">Đăng ký</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

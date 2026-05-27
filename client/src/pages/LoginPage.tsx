import { ShieldCheck, BookOpen, Sparkles, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/store/auth';
import { toast } from '@/components/ui/toast';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';

// Logo Microsoft 4 ô vuông — không phụ thuộc thêm asset.
function MicrosoftLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 23 23" className={className} aria-hidden="true">
      <path fill="#f25022" d="M0 0h11v11H0z" />
      <path fill="#7fba00" d="M12 0h11v11H12z" />
      <path fill="#00a4ef" d="M0 12h11v11H0z" />
      <path fill="#ffb900" d="M12 12h11v11H12z" />
    </svg>
  );
}

const HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: 'Chỉ dành cho sinh viên HUST',
    desc: 'Xác thực qua Microsoft @sis.hust.edu.vn — đảm bảo cộng đồng đúng người, đúng trường.',
  },
  {
    icon: BookOpen,
    title: 'Kho tài liệu được kiểm duyệt',
    desc: 'Slide, đề thi, lời giải, note... phân loại theo chuyên ngành & môn học cụ thể.',
  },
  {
    icon: Sparkles,
    title: 'Đóng góp & nhận quà',
    desc: 'Tài liệu được upvote sẽ giúp bạn tích điểm để đổi badge, avatar frame và quà thực tế.',
  },
];

export default function LoginPage() {
  useRevealOnScroll({ replay: true });
  const loginWithMicrosoft = useAuth((s) => s.loginWithMicrosoft);
  const loading = useAuth((s) => s.loading);

  async function onClick() {
    try {
      // loginRedirect navigate đi cả page — promise sau đây không bao giờ resolve thành công ở SPA hiện tại.
      await loginWithMicrosoft();
    } catch (err: any) {
      toast({
        title: 'Đăng nhập thất bại',
        description:
          err?.response?.data?.message ??
          err?.message ??
          'Vui lòng thử lại bằng tài khoản @sis.hust.edu.vn',
        variant: 'error',
      });
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-8rem)] overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-br from-hust-50 via-white to-white"
      />
      <div
        aria-hidden
        className="absolute -top-32 -right-32 -z-10 h-96 w-96 rounded-full bg-hust/10 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-20 -z-10 h-80 w-80 rounded-full bg-hust/5 blur-3xl"
      />

      <div className="container grid min-h-[calc(100vh-8rem)] items-center gap-12 py-12 lg:grid-cols-2 lg:py-16">
        {/* Cột trái: giới thiệu */}
        <div className="space-y-8">
          <div
            className="animate-reveal-up inline-flex items-center gap-2 rounded-full border border-hust/20 bg-white/70 px-3 py-1 text-xs font-medium text-hust shadow-sm backdrop-blur"
            style={{ animationDelay: '0ms' }}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            HUST Docs · Cộng đồng tài liệu Bách khoa
          </div>
          <div className="space-y-4">
            <h1
              className="animate-reveal-up text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
              style={{ animationDelay: '120ms' }}
            >
              Đăng nhập để vào{' '}
              <span className="text-hust">kho tài liệu</span> của sinh viên HUST
            </h1>
            <p
              className="animate-reveal-up max-w-lg text-base text-muted-foreground sm:text-lg"
              style={{ animationDelay: '240ms' }}
            >
              Dùng tài khoản Microsoft sinh viên (
              <span className="font-semibold text-foreground">@sis.hust.edu.vn</span>) để tải tài
              liệu, upvote bài hay, đăng đóng góp và nhận thưởng từ cộng đồng.
            </p>
          </div>

          <ul className="space-y-4">
            {HIGHLIGHTS.map((h, i) => {
              const Icon = h.icon;
              return (
                <li
                  key={h.title}
                  className="animate-reveal-up flex gap-3"
                  style={{ animationDelay: `${360 + i * 110}ms` }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-hust/10 text-hust">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{h.title}</p>
                    <p className="text-sm text-muted-foreground">{h.desc}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Cột phải: form đăng nhập */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md">
            <div
              aria-hidden
              className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-hust/30 via-hust/10 to-transparent blur-lg"
            />
            <div className="relative rounded-2xl border bg-white/90 p-8 shadow-xl backdrop-blur-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-hust text-white shadow-md">
                  <span className="text-lg font-bold">H</span>
                </div>
                <div>
                  <p className="text-base font-bold tracking-tight text-foreground">HUST Docs</p>
                  <p className="text-xs text-muted-foreground">Đăng nhập sinh viên</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold tracking-tight">Chào mừng trở lại 👋</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Chỉ tài khoản <span className="font-medium text-foreground">@sis.hust.edu.vn</span>{' '}
                mới truy cập được hệ thống.
              </p>

              <Button
                type="button"
                onClick={onClick}
                disabled={loading}
                variant="outline"
                className="mt-6 h-12 w-full justify-center gap-3 border-2 border-foreground/10 bg-white text-base font-medium hover:border-foreground/20 hover:bg-secondary/40"
              >
                <MicrosoftLogo className="h-5 w-5" />
                {loading ? 'Đang chuyển hướng…' : 'Đăng nhập với Microsoft'}
              </Button>

              <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                <span>Bảo mật bởi Microsoft Entra ID</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <p className="text-center text-xs leading-relaxed text-muted-foreground">
                Bằng việc đăng nhập, bạn đồng ý chia sẻ tài liệu một cách trung thực và tôn trọng
                quyền tác giả. Email khác @sis.hust.edu.vn sẽ bị từ chối.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

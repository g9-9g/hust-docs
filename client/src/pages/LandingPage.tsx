import { useRef, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  FileText,
  GraduationCap,
  Users,
  Filter,
  Upload,
  ThumbsUp,
  MessageSquare,
  Eye,
  Award,
  ShieldCheck,
  BookOpen,
  Zap,
  ChevronRight,
  Gift,
  Crown,
  Coffee,
  Ticket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const FEATURES = [
  {
    icon: Filter,
    title: 'Tìm đúng tài liệu HUST',
    desc: 'Lọc theo chuyên ngành, môn học, loại tài liệu, học kỳ — không còn lạc vào tài liệu lệch chương trình.',
  },
  {
    icon: Eye,
    title: 'Preview trước khi tải',
    desc: 'Xem trước slide, đề thi, note ngay trên web. Biết chắc đúng thứ mình cần rồi mới tải về.',
  },
  {
    icon: ThumbsUp,
    title: 'Tín hiệu tin cậy từ cộng đồng',
    desc: 'Upvote / downvote, bình luận, số lượt tải và lượt xem — đánh giá độ hữu ích trước khi mất thời gian đọc.',
  },
  {
    icon: Award,
    title: 'Điểm thưởng & quà tặng',
    desc: 'Tài liệu được cộng đồng upvote hay đạt mốc lượt tải sẽ tích điểm thưởng cho bạn — điểm dùng để đổi quà tặng dành cho người đóng góp tích cực.',
    to: '/rewards',
  },
] as { icon: typeof Award; title: string; desc: string; to?: string }[];

const DOC_TYPES = [
  'Slide bài giảng',
  'Đề thi cũ',
  'Lời giải',
  'Note ôn thi',
  'Bài tập lớn',
  'Project mẫu',
  'Tài liệu tham khảo',
];

const STEPS = [
  {
    num: '01',
    title: 'Tạo tài khoản & chọn chuyên ngành',
    desc: 'Đăng ký trong 30 giây, chọn chuyên ngành và môn học bạn quan tâm để trang chủ gợi ý đúng nhu cầu.',
  },
  {
    num: '02',
    title: 'Tìm — Preview — Tải',
    desc: 'Lọc theo môn / loại tài liệu, xem preview, đọc bình luận và upvote rồi mới quyết định tải.',
  },
  {
    num: '03',
    title: 'Chia sẻ & nhận điểm thưởng',
    desc: 'Upload tài liệu giúp khóa sau; khi được cộng đồng upvote và tải về, bạn tích điểm thưởng để đổi quà tặng.',
  },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement | null>(null);

  function handleHeroMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--mx', `${x}%`);
    el.style.setProperty('--my', `${y}%`);
  }

  return (
    <div className="bg-secondary/20">
      {/* Hero */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        className="group relative overflow-hidden"
        style={{ ['--mx' as string]: '50%', ['--my' as string]: '30%' }}
      >
        {/* Animated grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18] animate-grid-pan"
          style={{
            backgroundImage:
              'linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 80%)',
          }}
        />

        {/* Floating gradient blobs */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-hust/30 via-hust-300/25 to-transparent blur-3xl animate-blob" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-amber-200/50 blur-3xl animate-blob-slow" />
        <div className="pointer-events-none absolute top-1/3 -left-24 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl animate-blob" style={{ animationDelay: '-6s' }} />

        {/* Mouse-tracked spotlight */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(420px circle at var(--mx) var(--my), hsl(var(--primary) / 0.18), transparent 65%)',
          }}
        />

        <div className="container relative py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <Badge variant="outline" className="gap-1.5 border-hust/30 bg-white/80 px-3 py-1 text-hust backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Dành riêng cho sinh viên Bách khoa Hà Nội
            </Badge>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
              Tài liệu Bách khoa, sát chương trình{' '}
              <span className="bg-gradient-to-br from-hust via-hust-500 to-hust-700 bg-clip-text text-transparent">
                — gom về một chỗ.
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
              Hết cảnh lùng tài liệu khắp Facebook, Drive anh chị khóa trên hay Google. HUST Docs gom slide, đề thi cũ, lời giải, note ôn thi do chính sinh viên HUST chia sẻ — phân loại theo môn, đánh giá bởi cộng đồng.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
              <Button asChild size="lg" className="h-12 gap-2 px-6 text-base shadow-lg shadow-hust/20">
                <Link to="/register">
                  Bắt đầu miễn phí <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6 text-base">
                <Link to="/login">Tôi đã có tài khoản</Link>
              </Button>
            </div>
            <div className="flex items-center justify-center gap-2 pt-3 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Dự án sinh viên · Phi lợi nhuận · Không quảng cáo
            </div>

            {/* Doc-type chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
              {DOC_TYPES.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border/60 bg-white/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-4">
            {[
              { icon: FileText, label: 'Loại tài liệu', value: '7+' },
              { icon: GraduationCap, label: 'Chuyên ngành & môn', value: 'HUST' },
              { icon: Users, label: 'Do sinh viên đóng góp', value: '100%' },
            ].map((s) => (
              <Card key={s.label} className="border-border/60 bg-white/70 backdrop-blur">
                <CardContent className="flex flex-col items-center gap-1.5 p-4 md:p-5">
                  <s.icon className="h-5 w-5 text-hust" />
                  <div className="text-2xl font-bold tracking-tight md:text-3xl">{s.value}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20 md:py-24">
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <Badge variant="secondary" className="gap-1.5">
            <Zap className="h-3.5 w-3.5" /> Vì sao chọn HUST Docs?
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Tìm nhanh hơn, tin tưởng hơn, đỡ lo ôn sai trọng tâm
          </h2>
          <p className="text-muted-foreground">
            HUST Docs giải đúng ba nỗi đau: tài liệu phân tán, khó kiểm chứng, và thiếu động lực chia sẻ giữa các khóa.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => {
            const card = (
              <Card className="group relative h-full overflow-hidden border-border/60 transition-all hover:-translate-y-1 hover:border-hust/30 hover:shadow-lg">
                <div className="pointer-events-none absolute inset-x-0 -top-1 h-px bg-gradient-to-r from-transparent via-hust/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <CardContent className="space-y-3 p-6">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-hust-50 to-hust-100 text-hust">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold leading-tight">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  {f.to && (
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-hust">
                      Khám phá kho quà <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  )}
                </CardContent>
              </Card>
            );
            return f.to ? (
              <Link key={f.title} to={f.to} className="block">
                {card}
              </Link>
            ) : (
              <div key={f.title}>{card}</div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y bg-white">
        <div className="container py-20 md:py-24">
          <div className="mx-auto max-w-2xl text-center space-y-3">
            <Badge variant="secondary" className="gap-1.5">
              <BookOpen className="h-3.5 w-3.5" /> Bắt đầu trong 3 bước
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Đơn giản như mở vở học</h2>
          </div>

          <div className="relative mt-12 grid items-stretch gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.num} className="relative flex">
                <div className="flex w-full flex-col rounded-2xl border border-border/60 bg-secondary/40 p-6 transition-colors hover:border-hust/30">
                  <div className="text-sm font-bold text-hust">{s.num}</div>
                  <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-white text-hust shadow-sm md:flex"
                    style={{ right: '-30px' }}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Đổi điểm lấy quà */}
      <section className="border-y bg-gradient-to-br from-hust-50 via-amber-50 to-secondary/40">
        <div className="container grid items-center gap-10 py-20 md:grid-cols-2 md:py-24">
          <div className="space-y-4">
            <Badge variant="secondary" className="gap-1.5">
              <Gift className="h-3.5 w-3.5" /> Phần thưởng cho người đóng góp
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Đổi điểm lấy quà</h2>
            <p className="text-muted-foreground">
              Mỗi lần upload tài liệu, được upvote hay đạt mốc lượt tải, bạn tích thêm điểm. Dùng
              điểm để đổi huy hiệu, khung avatar nổi bật và voucher, quà tặng hấp dẫn.
            </p>
            <Button asChild size="lg" className="h-12 gap-2 px-6 text-base shadow-lg shadow-hust/20">
              <Link to="/rewards">
                Khám phá kho quà <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Crown, label: 'Huy hiệu', sub: 'Huyền thoại HUST', accent: '#d97706' },
              { icon: Sparkles, label: 'Khung avatar', sub: 'Khung Hoàng kim', accent: '#0ea5e9' },
              { icon: Coffee, label: 'Voucher đồ uống', sub: 'Highlands, Phúc Long', accent: '#9f1239' },
              { icon: Ticket, label: 'Quà tặng', sub: 'Thẻ nạp, sổ tay, áo', accent: '#16a34a' },
            ].map((r) => (
              <div
                key={r.label}
                className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-white/80 p-5 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow"
                  style={{ background: r.accent }}
                >
                  <r.icon className="h-5 w-5" />
                </div>
                <p className="font-semibold leading-tight">{r.label}</p>
                <p className="text-xs text-muted-foreground">{r.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust signals strip */}
      <section className="container py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: MessageSquare,
              title: 'Bình luận để bổ sung & cảnh báo',
              desc: 'Sinh viên xác nhận tài liệu sát đề, hoặc cảnh báo phần đã lỗi thời, sai sót.',
            },
            {
              icon: ShieldCheck,
              title: 'Báo cáo & duyệt nội dung',
              desc: 'Tài liệu vi phạm có thể bị báo cáo; tài khoản mới được duyệt trước khi công khai.',
            },
            {
              icon: Upload,
              title: 'Upload nhẹ nhàng',
              desc: 'Chọn file, điền môn / loại / học kỳ — xong là tài liệu của bạn nằm gọn trong kho HUST.',
            },
          ].map((b) => (
            <div key={b.title} className="flex gap-3 rounded-xl border border-border/60 bg-white/60 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-hust-50 text-hust">
                <b.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold leading-tight">{b.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-hust-700 via-hust to-hust-800 p-10 text-white shadow-2xl md:p-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12] animate-grid-pan"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.6) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
              maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
            }}
          />
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-3xl animate-blob" />
          <div className="pointer-events-none absolute -bottom-24 -left-12 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl animate-blob-slow" />

          <div className="relative z-10 mx-auto max-w-2xl text-center space-y-5">
            <h2 className="text-3xl font-bold leading-tight md:text-4xl">
              Đừng để mỗi mùa thi lại đi tìm lại từ đầu
            </h2>
            <p className="text-white/85">
              Tham gia HUST Docs — kho tài liệu của sinh viên, vì sinh viên. Đăng ký miễn phí, mất chưa tới 30 giây.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
              <Button asChild size="lg" variant="secondary" className="h-12 gap-2 px-6 text-base">
                <Link to="/register">
                  Đăng ký miễn phí <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-white/40 bg-white/10 px-6 text-base text-white hover:bg-white/20 hover:text-white"
              >
                <Link to="/login">Đăng nhập</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

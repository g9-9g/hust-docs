import { Award, Check, Gem, Lock, Medal, Sparkles, Sprout, Trophy, type LucideIcon } from 'lucide-react';

export interface RewardTier {
  name: string;
  threshold: number;
  icon: LucideIcon;
  gradient: string;
  /** Màu chủ đạo dùng cho BadgeChip (matching icon/gradient). */
  accentColor: string;
}

export const REWARD_TIERS: readonly RewardTier[] = [
  { name: 'Kim cương', threshold: 5000, icon: Gem, gradient: 'from-cyan-200 to-sky-500', accentColor: '#0284c7' },
  { name: 'Vàng', threshold: 1500, icon: Trophy, gradient: 'from-amber-200 to-yellow-500', accentColor: '#ca8a04' },
  { name: 'Bạc', threshold: 500, icon: Award, gradient: 'from-slate-100 to-slate-400', accentColor: '#64748b' },
  { name: 'Đồng', threshold: 100, icon: Medal, gradient: 'from-orange-300 to-amber-700', accentColor: '#b45309' },
  { name: 'Tân binh', threshold: 0, icon: Sprout, gradient: 'from-emerald-300 to-emerald-600', accentColor: '#059669' },
] as const;

export function getTier(achievedPoints: number): RewardTier | null {
  const t = REWARD_TIERS.find((t) => achievedPoints >= t.threshold);
  return t ?? null;
}

interface RewardLadderProps {
  /** Tổng điểm đã đạt được (cộng dồn, không trừ khi đổi quà). */
  achievedPoints: number;
}

/** Vertical stacked levels — thang/bậc tiến độ tới mốc đổi quà tiếp theo. */
export function RewardLadder({ achievedPoints }: RewardLadderProps) {
  const currentIdx = REWARD_TIERS.findIndex((t) => achievedPoints >= t.threshold);
  const nextTier = currentIdx > 0 ? REWARD_TIERS[currentIdx - 1] : null;
  const pointsToNext = nextTier ? nextTier.threshold - achievedPoints : 0;

  return (
    <div className="relative">
      <ol className="relative space-y-2">
        <span
          aria-hidden
          className="pointer-events-none absolute left-[27px] top-5 bottom-5 w-px bg-gradient-to-b from-white/10 via-white/30 to-white/10"
        />
        {REWARD_TIERS.map((tier, i) => {
          const reached = achievedPoints >= tier.threshold;
          const isCurrent = i === currentIdx;
          const distanceAbove = currentIdx >= 0 ? currentIdx - i : 0;
          const opacity = reached ? 1 : Math.max(0.4, 1 - distanceAbove * 0.22);
          const delay = `${(REWARD_TIERS.length - 1 - i) * 110}ms`;
          const Icon = tier.icon;

          return (
            <li
              key={tier.name}
              className={`animate-reward-pop-in relative flex items-center gap-3 rounded-xl border px-3 py-2 backdrop-blur transition-transform ${
                isCurrent
                  ? 'scale-[1.04] border-amber-300/70 bg-white/15 shadow-[0_0_30px_rgba(252,211,77,0.35)]'
                  : reached
                    ? 'border-white/20 bg-white/10'
                    : 'border-white/10 bg-white/5'
              }`}
              style={{ animationDelay: delay, opacity }}
            >
              <div
                className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${tier.gradient} text-white shadow-md ring-2 ${
                  isCurrent ? 'ring-amber-300/80' : 'ring-white/20'
                } ${!reached ? 'saturate-[0.55]' : ''}`}
              >
                <Icon className="h-5 w-5 drop-shadow" />
                {isCurrent && (
                  <Sparkles className="animate-reward-sparkle absolute -right-1.5 -top-1.5 h-4 w-4 text-amber-200" />
                )}
              </div>

              <div className="min-w-0 flex-1 text-left">
                <p className="text-sm font-semibold leading-tight text-white">{tier.name}</p>
                <p className="text-[11px] uppercase tracking-wider text-white/60">
                  {tier.threshold.toLocaleString('vi-VN')} điểm
                </p>
              </div>

              {isCurrent ? (
                <span className="rounded-full bg-amber-300 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-hust-800">
                  Hiện tại
                </span>
              ) : reached ? (
                <Check className="h-4 w-4 text-emerald-300" />
              ) : (
                <Lock className="h-3.5 w-3.5 text-white/40" />
              )}
            </li>
          );
        })}
      </ol>

      {nextTier && (
        <p
          className="animate-reward-pop-in mt-3 text-center text-[11px] text-white/75"
          style={{ animationDelay: `${REWARD_TIERS.length * 110}ms` }}
        >
          Còn{' '}
          <span className="font-bold text-amber-200">
            {pointsToNext.toLocaleString('vi-VN')} điểm
          </span>{' '}
          để lên <span className="font-semibold text-white">{nextTier.name}</span>
        </p>
      )}
    </div>
  );
}

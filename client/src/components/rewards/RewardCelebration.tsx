import { useEffect } from 'react';
import { PartyPopper, Sparkles } from 'lucide-react';
import type { Gift } from '@/types';
import { cn } from '@/lib/utils';

interface RewardCelebrationProps {
  /** Quà vừa đổi; null → ẩn overlay. */
  gift: Gift | null;
  onDone: () => void;
}

const SPARKLE_POSITIONS = [
  { top: '12%', left: '18%', delay: '0s' },
  { top: '20%', left: '78%', delay: '0.15s' },
  { top: '68%', left: '12%', delay: '0.3s' },
  { top: '74%', left: '82%', delay: '0.45s' },
  { top: '40%', left: '6%', delay: '0.6s' },
  { top: '46%', left: '90%', delay: '0.2s' },
];

/** Hiệu ứng chúc mừng thuần CSS khi đổi quà thành công. Tôn trọng prefers-reduced-motion. */
export function RewardCelebration({ gift, onDone }: RewardCelebrationProps) {
  useEffect(() => {
    if (!gift) return;
    const timer = setTimeout(onDone, 2800);
    return () => clearTimeout(timer);
  }, [gift, onDone]);

  if (!gift) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-foreground/50 backdrop-blur-sm"
      onClick={onDone}
      role="dialog"
      aria-label="Đổi quà thành công"
    >
      <div className="relative">
        {SPARKLE_POSITIONS.map((s, i) => (
          <Sparkles
            key={i}
            className="absolute h-6 w-6 text-amber-300 animate-reward-sparkle"
            style={{ top: s.top, left: s.left, animationDelay: s.delay }}
          />
        ))}
        <div
          className={cn(
            'animate-reward-pop-in flex w-[20rem] flex-col items-center gap-3 rounded-2xl',
            'border border-hust/20 bg-card p-8 text-center shadow-2xl',
          )}
        >
          <div className="animate-reward-coin-bounce flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-hust text-white">
            <PartyPopper className="h-8 w-8" />
          </div>
          <p className="text-lg font-bold text-hust">Đổi quà thành công!</p>
          <p className="text-sm text-muted-foreground">
            Bạn đã đổi <span className="font-semibold text-foreground">{gift.name}</span>.
          </p>
          <p className="text-xs text-muted-foreground">Chạm để đóng</p>
        </div>
      </div>
    </div>
  );
}

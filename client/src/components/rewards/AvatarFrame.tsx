import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AvatarFrameProps {
  /** CSS gradient cho khung; null/undefined → render thẳng avatar, không khung. */
  frameGradient?: string | null;
  children: ReactNode;
  className?: string;
}

/** Bọc một vòng gradient quanh avatar khi người dùng đã trang bị khung. */
export function AvatarFrame({ frameGradient, children, className }: AvatarFrameProps) {
  if (!frameGradient) return <>{children}</>;
  return (
    <span
      className={cn('inline-flex rounded-full p-[2.5px]', className)}
      style={{ background: frameGradient }}
    >
      <span className="inline-flex rounded-full bg-background p-[1.5px]">{children}</span>
    </span>
  );
}

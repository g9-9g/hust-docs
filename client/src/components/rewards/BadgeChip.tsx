import { cn } from '@/lib/utils';
import { resolveGiftIcon } from './giftIcons';

interface BadgeChipProps {
  name: string;
  icon?: string | null;
  accentColor?: string | null;
  size?: 'sm' | 'md';
  /** Chỉ hiện icon, ẩn tên — dùng cạnh username trên Header. */
  iconOnly?: boolean;
  className?: string;
}

/** Chip huy hiệu cosmetic — render hoàn toàn bằng CSS, không cần ảnh. */
export function BadgeChip({
  name,
  icon,
  accentColor,
  size = 'md',
  iconOnly = false,
  className,
}: BadgeChipProps) {
  const Icon = resolveGiftIcon(icon);
  const accent = accentColor || '#9f1239';
  const sm = size === 'sm';
  return (
    <span
      title={name}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        sm ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        iconOnly && (sm ? 'px-1' : 'px-1.5'),
        className,
      )}
      style={{
        color: accent,
        borderColor: `${accent}40`,
        background: `${accent}14`,
      }}
    >
      <Icon className={cn(sm ? 'h-3 w-3' : 'h-3.5 w-3.5')} style={{ color: accent }} />
      {!iconOnly && <span className="whitespace-nowrap">{name}</span>}
    </span>
  );
}

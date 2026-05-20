import {
  Award,
  Crown,
  Gift,
  PenTool,
  Sparkles,
  Star,
  Trophy,
  type LucideIcon,
} from 'lucide-react';

/** Bảng icon lucide dùng cho huy hiệu — khớp với `icon` được seed vào DB. */
const ICONS: Record<string, LucideIcon> = {
  Award,
  Crown,
  Gift,
  PenTool,
  Sparkles,
  Star,
  Trophy,
};

/** Trả về component icon theo tên; mặc định `Award` nếu tên không hợp lệ. */
export function resolveGiftIcon(name: string | null | undefined): LucideIcon {
  return (name && ICONS[name]) || Award;
}

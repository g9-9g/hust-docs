import { useState } from 'react';
import { Gift as GiftIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GiftImageProps {
  src?: string | null;
  name: string;
  className?: string;
}

/**
 * Ảnh quà cho VOUCHER/OFFLINE_GIFT/OTHER. Khi `src` rỗng hoặc file chưa tồn tại
 * (`onError`) sẽ hiển thị placeholder gradient màu HUST — giao diện không vỡ.
 */
export function GiftImage({ src, name, className }: GiftImageProps) {
  const [errored, setErrored] = useState(false);
  const showPlaceholder = !src || errored;

  return (
    <div className={cn('relative overflow-hidden bg-secondary', className)}>
      {showPlaceholder ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-hust-100 via-hust-50 to-amber-50 p-4 text-center">
          <GiftIcon className="h-8 w-8 text-hust/60" />
          <span className="line-clamp-2 text-xs font-medium text-hust/80">{name}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={name}
          loading="lazy"
          onError={() => setErrored(true)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}

import { useEffect } from 'react';

/**
 * Quan sát mọi `.animate-reveal-up, .animate-reveal-left` và gắn class `in-view` khi phần tử lọt
 * vào viewport để animation chạy. Khi `replay` = true, gỡ class lúc card rời
 * hẳn viewport để lần cuộn quay lại animation sẽ chạy lại.
 */
export function useRevealOnScroll(options: { replay?: boolean } = {}) {
  const { replay = false } = options;
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.animate-reveal-up, .animate-reveal-left'));
    if (els.length === 0) return;
    if (typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('in-view'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) {
            if (!el.classList.contains('in-view')) {
              // Reflow + rAF để animation chạy lại sau khi class bị gỡ trước đó.
              void el.offsetWidth;
              requestAnimationFrame(() => el.classList.add('in-view'));
            }
            if (!replay) io.unobserve(el);
          } else if (replay) {
            // Chỉ gỡ khi card đã rời hẳn viewport (intersectionRatio = 0),
            // tránh giật khi cuộn nhẹ.
            if (e.intersectionRatio === 0) el.classList.remove('in-view');
          }
        }
      },
      { threshold: replay ? [0, 0.3] : 0.3, rootMargin: '0px 0px -8% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [replay]);
}

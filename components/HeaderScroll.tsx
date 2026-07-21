'use client';
import { useEffect } from 'react';

// 스크롤 방향을 <html data-scroll="down|up">로 노출.
// 설치 앱(standalone)에서 헤더 자동 숨김/표시에 사용 — CSS가 실제 동작을 게이트.
export function HeaderScroll() {
  useEffect(() => {
    let last = 0;
    let ticking = false;
    const root = document.documentElement;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < 8) {
          root.removeAttribute('data-scroll');
        } else if (y > last + 4) {
          root.setAttribute('data-scroll', 'down');
        } else if (y < last - 4) {
          root.setAttribute('data-scroll', 'up');
        }
        last = y;
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}

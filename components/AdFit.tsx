'use client';
import { useEffect, useRef } from 'react';

interface Props {
  unit: string;
  width: number;
  height: number;
  className?: string;
}

// 카카오 애드핏 — SPA(클라 전환)에서도 매 마운트마다 ins+스크립트를 새로 주입해 광고를 채움.
export function AdFit({ unit, width, height, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.innerHTML = '';

    const ins = document.createElement('ins');
    ins.className = 'kakao_ad_area';
    ins.style.display = 'none';
    ins.setAttribute('data-ad-unit', unit);
    ins.setAttribute('data-ad-width', String(width));
    ins.setAttribute('data-ad-height', String(height));

    const script = document.createElement('script');
    script.async = true;
    script.type = 'text/javascript';
    script.src = '//t1.kakaocdn.net/kas/static/ba.min.js';

    container.appendChild(ins);
    container.appendChild(script);
  }, [unit, width, height]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ minHeight: height, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}
      aria-label="광고"
    />
  );
}

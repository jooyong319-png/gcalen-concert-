'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './BlogHero.module.css';

// 블로그·뉴스 상세 히어로 — 자르지 않고(contain) 남는 여백은 같은 이미지 블러로 채움.
// 게임 image_url이 죽으면 컨테이너째 숨김(onError + 하이드레이션 전 실패도 마운트 시 확인).
export function BlogHero({ src, alt }: { src: string; alt: string }) {
  const [err, setErr] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setErr(true);
  }, []);
  if (err) return null;
  return (
    <div className={styles.hero}>
      <img src={src} alt="" aria-hidden="true" className={styles.bg} loading="eager" />
      <img ref={ref} src={src} alt={alt} className={styles.fg} loading="eager" onError={() => setErr(true)} />
    </div>
  );
}

'use client';
import { useEffect, useRef, useState } from 'react';

// 블로그·뉴스 대표 이미지 — 게임 image_url이 죽은 경우(404 등) 깨진 아이콘 대신 컨테이너째 숨김.
// 서버 컴포넌트 페이지에서 onError 폴백을 쓰려고 분리한 클라 래퍼.
interface Props {
  src: string;
  containerClassName: string;
  alt?: string;
  eager?: boolean;
}

export function BlogImg({ src, containerClassName, alt = '', eager }: Props) {
  const [err, setErr] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  // 하이드레이션 전에 이미 로드 실패한 이미지는 onError가 안 잡히므로 마운트 시 직접 확인.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setErr(true);
  }, []);
  if (err) return null;
  return (
    <div className={containerClassName}>
      <img
        ref={ref}
        src={src}
        alt={alt}
        aria-hidden={alt ? undefined : true}
        loading={eager ? 'eager' : 'lazy'}
        onError={() => setErr(true)}
      />
    </div>
  );
}

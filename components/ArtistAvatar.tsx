'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './ArtistAvatar.module.css';

// 아티스트 상세 페이지 헤더용 프로필 이미지 — 로드 실패 시 이니셜 플레이스홀더로 대체.
export function ArtistAvatar({ src, name }: { src: string | null; name: string }) {
  const [imgError, setImgError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setImgError(true);
  }, [src]);
  const showImg = !!src && !imgError;

  return (
    <div className={styles.avatar}>
      {showImg ? (
        <img
          ref={imgRef}
          src={src!}
          alt={name}
          className={styles.img}
          loading="eager"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={styles.placeholder} aria-hidden="true">{name.slice(0, 1)}</div>
      )}
    </div>
  );
}

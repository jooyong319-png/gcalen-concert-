'use client';
import { useState } from 'react';
import type { Category } from '@/lib/types';

interface Props {
  imageUrl: string | null;
  alt: string;
  category: Category;
}

// 상세 페이지 커버 — 이미지 없거나 로드 실패 시 '이미지 없음' 플레이스홀더.
export function DetailCover({ imageUrl, alt, category }: Props) {
  const [imgError, setImgError] = useState(false);
  const showImg = !!imageUrl && !imgError;

  return (
    <div className={`detail-thumb cat-bg-${category}`}>
      {showImg ? (
        <>
          <img src={imageUrl!} alt="" aria-hidden="true" className="cover-bg" loading="lazy" />
          <img
            src={imageUrl!}
            alt={alt}
            className="cover-fg"
            loading="eager"
            fetchPriority="high"
            onError={() => setImgError(true)}
          />
        </>
      ) : (
        <div className="thumb-ph">
          <svg className="ph-icon" aria-hidden="true"><use href="#ic-image" /></svg>
          <span className="ph-text">이미지 없음</span>
        </div>
      )}
    </div>
  );
}

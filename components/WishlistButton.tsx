'use client';
import { useWishlist } from '@/hooks/useWishlist';

// 정적(SSG) 상세 페이지에서 쓰는 즐겨찾기 토글 — 모듈 싱글톤 store 공유.
export function WishlistButton({ id, className }: { id: string; className?: string }) {
  const wishlist = useWishlist();
  const on = wishlist.has(id);
  return (
    <button
      type="button"
      className={`${className ?? ''} ${on ? 'is-wished' : ''}`}
      onClick={() => wishlist.toggle(id)}
      aria-pressed={on}
    >
      <svg className={`ic ${on ? 'ic-fill' : ''}`} aria-hidden="true"><use href="#ic-star" /></svg>
      {on ? '즐겨찾기됨' : '즐겨찾기'}
    </button>
  );
}

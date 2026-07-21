'use client';
import { useEffect, useRef } from 'react';
import { useWishlist } from '@/hooks/useWishlist';
import { syncGameIds } from '@/lib/push';

// 찜 목록이 바뀌면(어느 화면에서든) 푸시 구독자의 game_ids를 디바운스 동기화.
// 구독이 없으면 syncGameIds가 즉시 무시하므로 비구독자에겐 비용 없음.
export function PushSync() {
  const wishlist = useWishlist();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; } // 초기 마운트는 스킵
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      syncGameIds([...wishlist.ids]).catch(() => {});
    }, 1500);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [wishlist.ids]);

  return null;
}

'use client';
import { useCallback, useSyncExternalStore } from 'react';

// '위시만 보기' 토글 — 헤더(layout 트리)와 Home(page 트리)는 분리된 React 트리라
// props로 공유 불가 → 모듈 레벨 싱글톤 store로 동기화(useWishlist 패턴과 동일).
// 세션 한정(비영속): SSR/첫 렌더는 false 고정 → 하이드레이션 일치(#418/#423 가드).
let on = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): boolean {
  return on;
}

function getServerSnapshot(): boolean {
  return false;
}

function setOn(next: boolean): void {
  on = next;
  listeners.forEach(l => l());
}

export interface WishlistFilterApi {
  on: boolean;
  toggle: () => void;
}

export function useWishlistFilter(): WishlistFilterApi {
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const toggle = useCallback(() => setOn(!on), []);
  return { on: value, toggle };
}

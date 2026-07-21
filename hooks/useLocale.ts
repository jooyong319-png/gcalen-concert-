'use client';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/i18nLabels';

// 클라 컴포넌트에서 현재 언어를 URL 경로로 판단(레이아웃이 서버 params를 못 받는 라우트 구조라 이 방식으로 통일).
export function useLocale(): Locale {
  const pathname = usePathname();
  const m = pathname.match(/^\/(ko|en|ja)(\/|$)/);
  return m ? (m[1] as Locale) : 'ko';
}

// 알림 세분화 설정 — 클라이언트(lib/push.ts, UI)와 서버(크론)에서 공용으로 쓰는 순수 모듈.
// fs/브라우저 의존 없음.
import type { Category } from './types';

export interface NotifyPrefs {
  offsets: number[];     // 사전 알림 시점(공연/발매일 기준): 0=당일, 1=D-1, 3=D-3, 7=D-7
  ticketing: boolean;    // 선예매/일반예매 "오픈일" 알림
  categories: Category[]; // 알림 받을 카테고리(선택된 것만)
  hour: number;          // 발송 시각(KST, 0~23) — 매시간 크론(CRON_HOURLY)일 때만 유효
}

export const ALL_CATEGORIES: Category[] = ['concert_tour', 'music_release', 'festival', 'fanmeeting'];
export const OFFSET_CHOICES = [0, 1, 3, 7] as const;

export const DEFAULT_NOTIFY_PREFS: NotifyPrefs = {
  offsets: [0, 1],
  ticketing: true,
  categories: [...ALL_CATEGORIES],
  hour: 9,
};

// DB/localStorage에서 읽은 임의 값을 안전한 NotifyPrefs로 — 필드가 아예 없으면(undefined) 기본값,
// 빈 배열은 "사용자가 모두 해제한" 의도로 존중(그 축의 알림은 안 감).
export function normalizePrefs(raw: unknown): NotifyPrefs {
  const p = (raw && typeof raw === 'object') ? (raw as Record<string, unknown>) : {};
  const offsets = Array.isArray(p.offsets)
    ? p.offsets.map(Number).filter(n => (OFFSET_CHOICES as readonly number[]).includes(n))
    : DEFAULT_NOTIFY_PREFS.offsets;
  const categories = Array.isArray(p.categories)
    ? (p.categories.filter(c => (ALL_CATEGORIES as string[]).includes(c as string)) as Category[])
    : DEFAULT_NOTIFY_PREFS.categories;
  const ticketing = typeof p.ticketing === 'boolean' ? p.ticketing : DEFAULT_NOTIFY_PREFS.ticketing;
  const hour = Number.isInteger(p.hour) && (p.hour as number) >= 0 && (p.hour as number) <= 23
    ? (p.hour as number)
    : DEFAULT_NOTIFY_PREFS.hour;
  return { offsets, categories, ticketing, hour };
}

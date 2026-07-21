// 클라/서버 공용(순수 상수) — 서버 전용 로직(DeepL 호출 등)은 lib/translate.ts에.
export type TranslateLang = 'en' | 'ja';

// 테스트 단계: DeepL 사용량 절약을 위해 번역 지원 글을 화이트리스트로 제한.
// API 라우트·UI(NewsTranslatable) 양쪽이 이 상수를 공유 — 범위를 넓히려면 여기 슬러그만 추가.
export const TRANSLATABLE_NEWS_SLUGS = new Set(['2026-07-18-히브-호-2-정식-출시']);

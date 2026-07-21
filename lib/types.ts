// 콘서트/음원 발매 캘린더 데이터 타입 정의 (data/concerts.{ko,en,ja}.json의 스키마)
// ※ ko/en/ja는 서로 번역 관계가 아니라 완전히 독립된 콘텐츠(국가/지역별 실제 공연).
//   그래서 name_en/name_ja 같은 번역 필드 없이 언어별 파일 각각이 자체 완결형.

export type Category =
  | 'concert_tour'   // 콘서트·내한 공연
  | 'music_release'  // 음원 발매(컴백)
  | 'festival'       // 페스티벌
  | 'fanmeeting';     // 팬미팅

export interface Game {
  id: string;
  name: string;
  release_date: string;             // 'YYYY-MM-DD' — 공연일/발매일
  release_date_approx: boolean;
  category: Category;
  platforms: string[];              // 공연장/지역 등
  developer: string | null;         // 아티스트 / 기획사
  publisher: string | null;         // 주최/유통사
  description: string | null;
  genres: string[];                 // 장르/태그
  image_url: string | null;
  source_url: string | null;
  pre_registration?: boolean;       // 티켓팅/사전예약 진행 중이면 true (선택 필드)
  pre_registration_date?: string | null;     // 'YYYY-MM-DD' 티켓팅/사전예약 시작일 (선택 필드)
  pre_registration_end_date?: string | null; // 'YYYY-MM-DD' 티켓팅/사전예약 마감일 (선택 필드)
  pre_registration_url?: string | null;       // 공식 티켓팅/예약 페이지 URL (선택 필드)
}

export interface GamesData {
  schema_version: number;
  last_updated: string;             // ISO 8601
  last_researched_by: string;
  categories: Record<Category, string>;
  games: Game[];
}

export type EventType = 'game_show' | 'sale' | 'season' | 'free_game';

export const EVENT_TYPE_META: Record<EventType, { label: string; color: string; icon: string }> = {
  game_show: { label: '게임쇼',   color: '#9a7bb0', icon: 'ic-star' },
  sale:      { label: '할인',     color: '#c47a00', icon: 'ic-tag' },
  season:    { label: '새 시즌',  color: '#5f86b8', icon: 'ic-refresh' },
  free_game: { label: '무료',     color: '#6f9c7a', icon: 'ic-gift' },
};

// 캘린더/리스트에 얹는 이벤트 마커 — 클라이언트 공유용 (현재 데이터 소스 없음, 추후 필요 시 사용)
export interface CalEvent {
  date: string;   // 'YYYY-MM-DD'
  label: string;
  color: string;
  type: EventType;
  url?: string | null;
  image?: string | null;
}

// 필터 단일 키 — 카테고리 또는 이벤트 타입
export type FilterKey = Category | EventType;

export interface FilterState {
  category: FilterKey | null;
  platform: string | null;
  days: number;
  search: string;
  wishlistOnly: boolean;
}

// 카테고리별 표기/색/아이콘(SVG 스프라이트 id) 단일 출처
export const CATEGORY_META: Record<Category, {
  label: string;
  short: string;
  icon: string;
  color: string;
}> = {
  concert_tour:  { label: '콘서트·내한 공연', short: '콘서트',  icon: 'ic-star',    color: '#5f86b8' },
  music_release: { label: '음원 발매(컴백)',   short: '음원발매', icon: 'ic-flame',   color: '#9a7bb0' },
  festival:      { label: '페스티벌',         short: '페스티벌', icon: 'ic-globe',   color: '#6f9c7a' },
  fanmeeting:    { label: '팬미팅',           short: '팬미팅',  icon: 'ic-comment', color: '#c08560' },
};

// server-only: 이 파일은 fs를 쓰므로 서버 컴포넌트에서만 import 가능
import path from 'path';
import { promises as fs } from 'fs';
import type { Game, GamesData, Category } from './types';
import { kstDateOnly } from './utils';

// 서버 전용 데이터 로더 (file I/O)
async function readGamesFile(): Promise<GamesData> {
  const filePath = path.join(process.cwd(), 'data', 'games.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as GamesData;
}

let cachedPromise: Promise<GamesData> | null = null;
function getGamesData(): Promise<GamesData> {
  if (!cachedPromise) cachedPromise = readGamesFile();
  return cachedPromise;
}

// 전체 게임 (출시일 오름차순)
export async function getAllGames(): Promise<Game[]> {
  const data = await getGamesData();
  return data.games.slice().sort(
    (a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
  );
}

// ID로 한 게임 조회
export async function getGameById(id: string): Promise<Game | null> {
  const all = await getAllGames();
  return all.find(g => g.id === id) ?? null;
}

// 카테고리별
export async function getGamesByCategory(category: Category): Promise<Game[]> {
  const all = await getAllGames();
  return all.filter(g => g.category === category);
}

// 오늘(KST) 기준 날짜 문자열 'YYYY-MM-DD'
function todayKstStr(): string {
  const t = kstDateOnly(new Date().toISOString());
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
}

// 이미 지난 출시 제외 (오늘 이후 + 출시일 미정만) — '출시 예정' 표면용.
// 정적 생성이라 빌드 시각 기준(데이터 일일 갱신 시 재배포로 신선도 유지).
export async function getUpcomingGames(): Promise<Game[]> {
  const today = todayKstStr();
  return (await getAllGames()).filter(g => g.release_date_approx || g.release_date >= today);
}

export async function getUpcomingGamesByCategory(category: Category): Promise<Game[]> {
  const today = todayKstStr();
  return (await getGamesByCategory(category)).filter(g => g.release_date_approx || g.release_date >= today);
}

// 사전예약 표면용: pre_registration=true인 출시예정 게임(전 카테고리 — 모바일·PC·콘솔·글로벌).
// 리서처가 플래그를 아직 안 채웠으면(0건) 출시예정 전체로 폴백(빈 페이지 방지, 모바일 한정 아님).
export async function getPreRegistrationGames(): Promise<Game[]> {
  const upcoming = await getUpcomingGames();
  const flagged = upcoming.filter(g => g.pre_registration === true);
  const list = flagged.length > 0 ? flagged : upcoming;
  return list.sort((a, b) => a.release_date.localeCompare(b.release_date));
}

// 메타
export async function getCategoriesMap(): Promise<Record<Category, string>> {
  const data = await getGamesData();
  return data.categories;
}

// 데이터 갱신 시각
export async function getLastUpdated(): Promise<string> {
  const data = await getGamesData();
  return data.last_updated;
}

// 영/일 번역 조회 — games.json의 description_en/description_ja 필드(리서처가 신규 등록 시 채움).
// 없으면 null(그 언어 /[lang]/game/[id] 페이지 미생성 — data/games.json 자체가 소스, 별도 파일 없음).
export async function getGameTranslation(
  id: string,
  lang: 'en' | 'ja'
): Promise<{ name: string; description: string } | null> {
  const game = await getGameById(id);
  if (!game) return null;
  const description = lang === 'en' ? game.description_en : game.description_ja;
  if (!description) return null;
  const name = (lang === 'en' ? game.name_en : game.name_ja) ?? game.name_en ?? game.name_ko;
  return { name, description };
}

// 특정 언어로 번역된 게임들의 id 목록(generateStaticParams용).
export async function getTranslatedGameIds(lang: 'en' | 'ja'): Promise<string[]> {
  const all = await getAllGames();
  return all.filter(g => (lang === 'en' ? g.description_en : g.description_ja)).map(g => g.id);
}

// 순수 헬퍼는 lib/utils.ts로 분리됨. 기존 import 호환용 re-export.
export { calcDayDiff, formatKoreanDate, formatShortDate, getKoreanWeekday } from './utils';

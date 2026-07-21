'use client';
import { useMemo, useState, type CSSProperties } from 'react';
import type { Game, CalEvent, FilterKey } from '@/lib/types';
import { CATEGORY_META, EVENT_TYPE_META } from '@/lib/types';
import { calcDayDiff, getKoreanWeekday } from '@/lib/utils';
import { CategoryFilterBar } from './CategoryFilterBar';
import { GameRow } from './GameRow';
import { EventRow } from './EventRow';
import { useLocale } from '@/hooks/useLocale';
import { CAL } from '@/lib/i18nLabels';
import styles from './ListView.module.css';

interface Props {
  games: Game[];
  events?: CalEvent[];
  wishlist: { has: (id: string) => boolean; toggle: (id: string) => void; ids: Set<string> };
  onPick: (id: string) => void;
  now: Date;
  category: FilterKey | null;             // 전역 필터(캘린더 아이콘 줄과 공유)
  onCategory: (c: FilterKey | null) => void;
}

type MonthSel = number | 'approx'; // 1~12 또는 '미정'
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function pad(n: number): string { return String(n).padStart(2, '0'); }

export function ListView({ games, events = [], wishlist, onPick, now, category, onCategory }: Props) {
  const lang = useLocale();
  const t = lang ? CAL[lang] : null;
  // 사용자가 탭/연도를 고르기 전엔 null → now(현재 연·월)를 따름(빌드 정적이라도 mount 후 정확)
  const [picked, setPicked] = useState<{ year: number; month: MonthSel } | null>(null);

  const curYear = now.getFullYear();
  const curMonth = now.getMonth() + 1;
  const activeYear = picked?.year ?? curYear;
  const activeMonth: MonthSel = picked?.month ?? curMonth;

  const isCurrentMonth = activeMonth !== 'approx' && activeYear === curYear && activeMonth === curMonth;

  // 선택한 달 게임 + 정렬
  const monthGames = useMemo(() => {
    const inMonth = games.filter(g => {
      if (activeMonth === 'approx') return g.release_date_approx;
      if (g.release_date_approx) return false;
      const y = Number(g.release_date.slice(0, 4));
      const m = Number(g.release_date.slice(5, 7));
      return y === activeYear && m === activeMonth;
    });

    if (isCurrentMonth) {
      // 현재 달: 오늘 이후(가까운 순) 먼저, 그 다음 지난 것(최근 순)
      const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
      const upcoming = inMonth.filter(g => g.release_date >= todayStr)
        .sort((a, b) => a.release_date.localeCompare(b.release_date));
      const past = inMonth.filter(g => g.release_date < todayStr)
        .sort((a, b) => b.release_date.localeCompare(a.release_date));
      return [...upcoming, ...past];
    }
    return inMonth.slice().sort((a, b) => a.release_date.localeCompare(b.release_date));
  }, [games, activeYear, activeMonth, isCurrentMonth, now]);

  // 선택한 달의 이벤트(게임쇼/할인/시즌/무료) — 날짜순
  const monthEvents = useMemo(() => {
    if (activeMonth === 'approx') return [];
    return events
      .filter(e => Number(e.date.slice(0, 4)) === activeYear && Number(e.date.slice(5, 7)) === activeMonth)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [events, activeYear, activeMonth]);

  // 게임 + 이벤트를 병합. 현재 달은 '오늘 이후 먼저(가까운 순) → 지난 건 아래(최근 순)', 그 외엔 날짜순.
  const monthItems = useMemo(() => {
    const items = [
      ...monthGames.map(g => ({ kind: 'game' as const, date: g.release_date, game: g })),
      ...monthEvents.map((e, i) => ({ kind: 'event' as const, date: e.date, key: `${e.date}-${i}`, event: e })),
    ];
    if (isCurrentMonth) {
      const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
      const upcoming = items.filter(it => it.date >= todayStr).sort((a, b) => a.date.localeCompare(b.date));
      const past = items.filter(it => it.date < todayStr).sort((a, b) => b.date.localeCompare(a.date));
      return [...upcoming, ...past];
    }
    return items.sort((a, b) => a.date.localeCompare(b.date));
  }, [monthGames, monthEvents, isCurrentMonth, now]);

  // 탭별 개수(해당 연도 기준)
  const monthCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const g of games) {
      if (g.release_date_approx) { counts['approx'] = (counts['approx'] ?? 0) + 1; continue; }
      const y = Number(g.release_date.slice(0, 4));
      if (y !== activeYear) continue;
      const m = Number(g.release_date.slice(5, 7));
      counts[m] = (counts[m] ?? 0) + 1;
    }
    return counts;
  }, [games, activeYear]);

  const pick = (month: MonthSel) => setPicked({ year: activeYear, month });
  const shiftYear = (delta: number) => setPicked({ year: activeYear + delta, month: activeMonth });

  return (
    <div className={styles.listView}>
      <div className={styles.monthNav}>
        <div className={styles.yearRow}>
          <button type="button" className={styles.yearBtn} onClick={() => shiftYear(-1)} aria-label={t ? t.prevYear : '이전 해'}>‹</button>
          <span className={styles.yearLabel}>{activeYear}{lang ? '' : '년'}</span>
          <button type="button" className={styles.yearBtn} onClick={() => shiftYear(1)} aria-label={t ? t.nextYear : '다음 해'}>›</button>
        </div>
        <div className={styles.tabs} role="tablist" aria-label={t ? t.monthSelect : '월 선택'}>
          {MONTHS.map(m => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={activeMonth === m}
              className={`${styles.tab} ${activeMonth === m ? styles.tabActive : ''} ${(monthCounts[m] ?? 0) === 0 ? styles.tabEmpty : ''}`}
              onClick={() => pick(m)}
            >
              {t ? t.months[m - 1] : `${m}월`}
            </button>
          ))}
          <button
            type="button"
            role="tab"
            aria-selected={activeMonth === 'approx'}
            className={`${styles.tab} ${activeMonth === 'approx' ? styles.tabActive : ''} ${(monthCounts['approx'] ?? 0) === 0 ? styles.tabEmpty : ''}`}
            onClick={() => pick('approx')}
          >
            {t ? t.noDateSet : '미정'}
          </button>
        </div>

        <CategoryFilterBar category={category} onCategory={onCategory} className={styles.catRow} />
      </div>

      {monthGames.length === 0 && monthEvents.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon} aria-hidden="true"><svg className="ic"><use href="#ic-gamepad" /></svg></div>
          <p className={styles.emptyText}>
            {activeMonth === 'approx'
              ? (t ? t.noApproxGames : '출시일 미정 게임이 없어요.')
              : (t
                  ? t.noReleaseThisMonthYear(
                      new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'ja-JP', { year: 'numeric', month: 'long' }).format(new Date(activeYear, (activeMonth as number) - 1))
                    )
                  : `${activeYear}년 ${activeMonth}월 일정이 없어요.`)}
          </p>
          <p className={styles.emptyHint}>{t ? t.pickOtherMonth : '위 탭에서 다른 달을 골라보세요.'}</p>
        </div>
      ) : (
        <ul className={styles.rows}>
          {monthItems.map(it => it.kind === 'game'
            ? <GameRow key={`g-${it.game.id}`} game={it.game} now={now} wishlist={wishlist} onPick={onPick} />
            : <EventRow key={`e-${it.key}`} event={it.event} />
          )}
        </ul>
      )}
    </div>
  );
}

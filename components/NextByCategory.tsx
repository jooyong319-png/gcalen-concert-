import Link from 'next/link';
import type { Game, Category } from '@/lib/types';
import { CATEGORY_META } from '@/lib/types';
import { calcDayDiff } from '@/lib/utils';
import styles from './NextByCategory.module.css';

interface Props {
  games: Game[];
  now: Date;
}

const ORDER: Category[] = ['concert_tour', 'music_release', 'festival', 'fanmeeting'];

// 우측 레일 위젯 — 카테고리별로 '오늘 이후 가장 가까운 출시' 1건씩. 링크 기반(상세로 이동).
export function NextByCategory({ games, now }: Props) {
  // 카테고리별 '오늘 이후 가장 가까운 출시' 1건. 미래 예정이 없는 카테고리(예: 신서버)는 제외.
  const picks = ORDER.map(c => {
    const next = games
      .filter(g => g.category === c && calcDayDiff(g.release_date, now) >= 0)
      .sort((a, b) => a.release_date.localeCompare(b.release_date))[0];
    return next ? { c, g: next, diff: calcDayDiff(next.release_date, now) } : null;
  }).filter((x): x is { c: Category; g: Game; diff: number } => x !== null);

  if (picks.length === 0) return null;

  return (
    <section className={styles.widget} aria-label="카테고리별 다음 출시">
      <h3 className={styles.title}>
        <svg className="ic" aria-hidden="true"><use href="#ic-calendar" /></svg>
        카테고리별 다음 출시
      </h3>
      <div className={styles.list}>
        {picks.map(({ c, g, diff }) => {
          const dd = diff === 0 ? 'D-DAY' : `D-${diff}`;
          return (
            <Link key={c} href={`/game/${g.id}`} className={styles.row}>
              <span className={styles.dot} style={{ background: CATEGORY_META[c].color }} aria-hidden="true" />
              <span className={styles.cat}>{CATEGORY_META[c].short}</span>
              <span className={styles.name}>{g.name}</span>
              <span className={styles.dday}>{dd}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { CAL } from '@/lib/i18nLabels';
import styles from './FreeGames.module.css';

interface FreeGame {
  title: string;
  status: 'current' | 'upcoming';
  start: string | null;
  end: string | null;
  image: string | null;
  url: string | null;
}

function daysLeft(end: string | null): number | null {
  if (!end) return null;
  const ms = new Date(end).getTime() - Date.now();
  return ms <= 0 ? 0 : Math.ceil(ms / 86400000);
}
function mmdd(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function FreeGames({ compact = false }: { compact?: boolean }) {
  const lang = useLocale();
  const t = lang ? CAL[lang] : null;
  const [games, setGames] = useState<FreeGame[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/free-games')
      .then(r => r.json())
      .then(d => { if (!cancelled) setGames(d.games ?? []); })
      .catch(() => { if (!cancelled) setGames([]); });
    return () => { cancelled = true; };
  }, []);

  if (!games || games.length === 0) return null;

  const current = games.filter(g => g.status === 'current');
  const upcoming = games.filter(g => g.status === 'upcoming');
  const list = compact ? current.slice(0, 4) : [...current, ...upcoming];

  return (
    <aside className={`${styles.box} ${compact ? styles.compact : ''}`} aria-label={t ? t.freeGamesAria : '무료 게임 배포'}>
      <div className={styles.head}>
        <h2 className={styles.h}>{t ? t.freeGamesTitle : '지금 무료 게임'}</h2>
        <span className={styles.epic}>{t ? t.freeGamesTag : '에픽게임즈'}</span>
      </div>
      <ul className={styles.list}>
        {list.map((g, i) => {
          const left = daysLeft(g.end);
          return (
            <li key={`${g.title}-${i}`} className={styles.row}>
              <a className={styles.link} href={g.url ?? '#'} target="_blank" rel="noopener">
                {g.image && !compact && <img className={styles.thumb} src={g.image} alt="" loading="lazy" />}
                <span className={styles.info}>
                  <span className={styles.title}>{g.title}</span>
                  {g.status === 'current' ? (
                    <span className={`${styles.badge} ${left !== null && left <= 2 ? styles.urgent : ''}`}>
                      {left !== null
                        ? (t ? t.freeDaysLeft(left) : `무료 · ${left}일 남음`)
                        : (t ? `${t.free} · ${t.ongoing}` : '무료 · 진행 중')}
                    </span>
                  ) : (
                    <span className={styles.badgeSoon}>{t ? t.freeFromDate(mmdd(g.start)) : `${mmdd(g.start)}부터 무료`}</span>
                  )}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

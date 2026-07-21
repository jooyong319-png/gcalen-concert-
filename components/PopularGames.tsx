'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseReady } from '@/lib/supabase';
import { CATEGORY_META, type Category } from '@/lib/types';
import styles from './PopularGames.module.css';

interface Meta { name: string; category: Category; }

// 최근 14일 조회수로 '지금 인기' TOP을 집계해 보여줌(추가 데이터 불필요).
export function PopularGames({ meta, lang = 'ko' }: { meta: Record<string, Meta>; lang?: string }) {
  const [rows, setRows] = useState<{ game_id: string }[] | null>(null);

  useEffect(() => {
    if (!isSupabaseReady() || !supabase) return;
    const since = new Date(Date.now() - 14 * 86400000).toISOString();
    let cancelled = false;
    supabase
      .from('page_views')
      .select('game_id')
      .gte('created_at', since)
      .limit(5000)
      .then(({ data }) => { if (!cancelled) setRows((data as { game_id: string }[]) ?? []); });
    return () => { cancelled = true; };
  }, []);

  const top = useMemo(() => {
    if (!rows) return [];
    const c = new Map<string, number>();
    for (const r of rows) {
      if (r.game_id.startsWith('blog:') || !meta[r.game_id]) continue;
      c.set(r.game_id, (c.get(r.game_id) ?? 0) + 1);
    }
    return [...c.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [rows, meta]);

  if (!isSupabaseReady() || top.length === 0) return null;

  return (
    <aside className={styles.box} aria-label="지금 인기">
      <h2 className={styles.h}>지금 인기</h2>
      <ol className={styles.list}>
        {top.map(([id, n], i) => {
          const m = meta[id];
          return (
            <li key={id} className={styles.row}>
              <span className={styles.rank}>{i + 1}</span>
              <span className={styles.dot} style={{ background: CATEGORY_META[m.category]?.color }} aria-hidden="true" />
              <a className={styles.name} href={`/${lang}/concert/${id}`}>{m.name}</a>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

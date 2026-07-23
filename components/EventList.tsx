'use client';
import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import type { Game } from '@/lib/types';
import { isTicketingLiveNow } from '@/lib/types';
import { GameRow } from './GameRow';
import { GameModal } from './GameModal';
import { useWishlist } from '@/hooks/useWishlist';
import { useLocale } from '@/hooks/useLocale';
import { CAL } from '@/lib/i18nLabels';
import styles from './ListView.module.css';

interface Props { events: Game[]; }

// 아티스트/공연장 상세 — 일정 목록(클릭 시 사이트 공통 모달로 상세 확인). 새 페이지로 이동하지 않음.
export function EventList({ events }: Props) {
  const lang = useLocale();
  const t = lang ? CAL[lang] : null;
  const wishlist = useWishlist();
  const [openId, setOpenId] = useState<string | null>(null);
  const [now] = useState(() => new Date());
  const openGame = events.find(g => g.id === openId) ?? null;

  return (
    <>
      <ul className={styles.rows}>
        {events.map(g => (
          <GameRow
            key={g.id}
            game={g}
            now={now}
            wishlist={wishlist}
            onPick={setOpenId}
            preBadge={isTicketingLiveNow(g, now) ? (t ? t.onSaleNowBadge : '예매중') : undefined}
          />
        ))}
      </ul>
      <AnimatePresence>
        {openGame && <GameModal game={openGame} onClose={() => setOpenId(null)} wishlist={wishlist} />}
      </AnimatePresence>
    </>
  );
}

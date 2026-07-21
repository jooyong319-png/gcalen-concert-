'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { CalEvent } from '@/lib/types';
import { EVENT_TYPE_META } from '@/lib/types';
import { useLocale } from '@/hooks/useLocale';
import { CAL, EVENT_TYPE_LABELS } from '@/lib/i18nLabels';
import styles from './GameRow.module.css'; // 게임 행과 동일 디자인 공유

// 이벤트(게임쇼/할인/시즌/무료) 1행 — GameRow와 같은 폼 + 이미지. url 있으면 전체 클릭.
export function EventRow({ event: e }: { event: CalEvent }) {
  const lang = useLocale();
  const t = lang ? CAL[lang] : null;
  const [imgError, setImgError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  // 하이드레이션 전에 이미 로드 실패한 이미지는 onError가 안 잡히므로 마운트 시 직접 확인.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setImgError(true);
  }, [e.image]);
  const showImg = !!e.image && !imgError;
  const mmdd = e.date.slice(5).replace('-', '/');
  const meta = EVENT_TYPE_META[e.type];
  const typeLabel = lang ? EVENT_TYPE_LABELS[lang][e.type] : meta.label;
  const open = e.url ? () => window.open(e.url!, '_blank', 'noopener') : undefined;

  return (
    <li
      className={styles.row}
      style={{ '--cat': e.color } as CSSProperties}
      role={e.url ? 'button' : undefined}
      tabIndex={e.url ? 0 : undefined}
      onClick={open}
      onKeyDown={open ? (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); open(); } } : undefined}
    >
      <div className={styles.dateCol}>
        <span className={styles.dMmdd}>{mmdd}</span>
      </div>

      <div className={styles.thumb}>
        {showImg ? (
          <>
            <img src={e.image!} alt="" aria-hidden="true" className={styles.thumbBg} loading="lazy" />
            <img ref={imgRef} src={e.image!} alt={e.label} className={styles.thumbFg} loading="lazy" onError={() => setImgError(true)} />
          </>
        ) : (
          <div className={styles.thumbPh}>
            <svg className={styles.thumbPhIcon} aria-hidden="true"><use href="#ic-image" /></svg>
            <span className={styles.thumbPhText}>{t ? t.noImage : '이미지 없음'}</span>
          </div>
        )}
      </div>

      <div className={styles.main}>
        <div className={styles.titleRow}>
          <span className={styles.badge} style={{ color: e.color }}>{typeLabel}</span>
          <span className={styles.title}>{e.label}</span>
        </div>
      </div>

      <div className={styles.actions}>
        {e.url && (
          <span className={styles.actBtn}>
            <svg className="ic" aria-hidden="true"><use href="#ic-arrow-ur" /></svg>
            <span className={styles.actLabel}>{t ? t.goTo : '바로가기'}</span>
          </span>
        )}
      </div>
    </li>
  );
}

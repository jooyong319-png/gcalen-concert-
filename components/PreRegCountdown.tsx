'use client';
import { Fragment, useEffect, useState } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { CAL, type Locale } from '@/lib/i18nLabels';
import styles from './PreRegCountdown.module.css';

interface Props {
  startDate?: string | null; // 'YYYY-MM-DD' 사전예약 시작
  endDate?: string | null;   // 'YYYY-MM-DD' 사전예약 마감
}

interface Parts { Days: number; Hours: number; Min: number; Sec: number; }

function pad(n: number): string { return String(n).padStart(2, '0'); }

function startLabel(startDate: string | null | undefined, lang: Locale | null): string | null {
  if (!startDate) return null;
  if (lang) {
    const label = new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'ja-JP', { month: 'long', day: 'numeric' }).format(new Date(startDate));
    return CAL[lang].startsOn(label);
  }
  const [, mo, da] = startDate.split('-');
  return `${Number(mo)}월 ${Number(da)}일 시작`;
}

// 사전예약 안내 — 마감일 있으면 라이브 카운트다운, 없으면 '마감 미정'.
// SSG 페이지라 날짜 의존 값은 mount 후 클라에서 계산(하이드레이션 불일치 회피).
export function PreRegCountdown({ startDate, endDate }: Props) {
  const lang = useLocale();
  const t = lang ? CAL[lang] : null;
  const [mounted, setMounted] = useState(false);
  const [parts, setParts] = useState<Parts | null>(null);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!endDate) return;
    const target = new Date(`${endDate}T23:59:59+09:00`).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setEnded(true); setParts(null); return; }
      setParts({
        Days: Math.floor(diff / 86400000),
        Hours: Math.floor((diff % 86400000) / 3600000),
        Min: Math.floor((diff % 3600000) / 60000),
        Sec: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  const start = startLabel(startDate, lang);
  const showTimer = endDate && mounted && parts && !ended;

  return (
    <section className={styles.box} aria-label={t ? t.preRegInfo : '사전예약 안내'}>
      <div className={styles.head}>
        <span className={styles.live}><span className={styles.dot} aria-hidden="true" /> {t ? t.preRegLive : '지금 사전예약'}</span>
        {start && <span className={styles.start}>{start}</span>}
      </div>

      {showTimer ? (
        <>
          <div className={styles.grid}>
            {(Object.keys(parts) as (keyof Parts)[]).map((label, i) => (
              <Fragment key={label}>
                {i > 0 && <span className={styles.sep} aria-hidden="true">:</span>}
                <div className={styles.unit}>
                  <span className={styles.num}>{pad(parts[label])}</span>
                  <span className={styles.label}>{label}</span>
                </div>
              </Fragment>
            ))}
          </div>
          <p className={styles.caption}>{t ? t.preRegTimeLeft : '사전예약 마감까지 남은 시간'}</p>
        </>
      ) : (
        <p className={styles.deadline}>{ended ? (t ? t.preRegClosedText : '사전예약 마감됨') : (t ? t.preRegDeadlineTba : '사전예약 마감일 미정')}</p>
      )}
    </section>
  );
}

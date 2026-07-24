'use client';
import { useEffect, useState } from 'react';
import { CATEGORY_META } from '@/lib/types';
import { useLocale } from '@/hooks/useLocale';
import { CATEGORY_LABELS } from '@/lib/i18nLabels';
import {
  type NotifyPrefs,
  DEFAULT_NOTIFY_PREFS,
  ALL_CATEGORIES,
  OFFSET_CHOICES,
} from '@/lib/notifyPrefs';
import { getNotifyPrefs, setNotifyPrefs } from '@/lib/push';
import styles from './NotifyPrefs.module.css';

// 알림 세분화 패널 — 알림이 켜진 상태에서만 노출. 사전 타이밍/예매 오픈/카테고리/발송 시각을
// 유저가 직접 고른다. 변경 즉시 localStorage + (구독 중이면) DB(prefs)에 저장.
export function NotifyPrefs() {
  const lang = useLocale() ?? 'ko';
  const [prefs, setPrefs] = useState<NotifyPrefs>(DEFAULT_NOTIFY_PREFS);

  useEffect(() => { setPrefs(getNotifyPrefs()); }, []);

  const update = (next: NotifyPrefs) => {
    setPrefs(next);
    void setNotifyPrefs(next);
  };
  const toggleOffset = (o: number) =>
    update({ ...prefs, offsets: prefs.offsets.includes(o) ? prefs.offsets.filter(x => x !== o) : [...prefs.offsets, o].sort((a, b) => a - b) });
  const toggleCat = (c: typeof ALL_CATEGORIES[number]) =>
    update({ ...prefs, categories: prefs.categories.includes(c) ? prefs.categories.filter(x => x !== c) : [...prefs.categories, c] });

  const L = LABELS[lang] ?? LABELS.ko;
  const offsetLabel = (o: number) => (o === 0 ? L.dday : L.dbefore(o));

  return (
    <div className={styles.panel}>
      <section className={styles.group}>
        <p className={styles.groupLabel}>{L.timing}</p>
        <div className={styles.chips}>
          {OFFSET_CHOICES.map(o => {
            const on = prefs.offsets.includes(o);
            return (
              <button key={o} type="button" className={`${styles.chip} ${on ? styles.chipOn : ''}`} onClick={() => toggleOffset(o)} aria-pressed={on}>
                {offsetLabel(o)}
              </button>
            );
          })}
        </div>
      </section>

      <section className={styles.groupRow}>
        <div>
          <p className={styles.groupLabel}>{L.ticketing}</p>
          <p className={styles.hint}>{L.ticketingHint}</p>
        </div>
        <button
          type="button"
          className={`${styles.switch} ${prefs.ticketing ? styles.switchOn : ''}`}
          onClick={() => update({ ...prefs, ticketing: !prefs.ticketing })}
          aria-pressed={prefs.ticketing}
          aria-label={L.ticketing}
        >
          <span className={styles.knob} />
        </button>
      </section>

      <section className={styles.group}>
        <p className={styles.groupLabel}>{L.categories}</p>
        <div className={styles.chips}>
          {ALL_CATEGORIES.map(c => {
            const on = prefs.categories.includes(c);
            return (
              <button
                key={c}
                type="button"
                className={`${styles.chip} ${on ? styles.chipOn : ''}`}
                style={on ? { background: CATEGORY_META[c].color, borderColor: CATEGORY_META[c].color, color: '#fff' } : undefined}
                onClick={() => toggleCat(c)}
                aria-pressed={on}
              >
                {CATEGORY_LABELS[lang][c]}
              </button>
            );
          })}
        </div>
      </section>

      <section className={styles.groupRow}>
        <div>
          <p className={styles.groupLabel}>{L.sendTime}</p>
          <p className={styles.hint}>{L.sendTimeHint}</p>
        </div>
        <select
          className={styles.select}
          value={prefs.hour}
          onChange={e => update({ ...prefs, hour: Number(e.target.value) })}
          aria-label={L.sendTime}
        >
          {Array.from({ length: 24 }, (_, h) => (
            <option key={h} value={h}>{formatHour(h, lang)}</option>
          ))}
        </select>
      </section>
    </div>
  );
}

function formatHour(h: number, lang: string): string {
  if (lang === 'ja') return `${h}時`;
  if (lang === 'en') {
    const ampm = h < 12 ? 'AM' : 'PM';
    const hr = h % 12 === 0 ? 12 : h % 12;
    return `${hr} ${ampm}`;
  }
  // ko
  const ampm = h < 12 ? '오전' : '오후';
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${ampm} ${hr}시`;
}

const LABELS: Record<string, {
  timing: string; dday: string; dbefore: (n: number) => string;
  ticketing: string; ticketingHint: string;
  categories: string; sendTime: string; sendTimeHint: string;
}> = {
  ko: {
    timing: '사전 알림',
    dday: '당일',
    dbefore: n => `${n}일 전`,
    ticketing: '예매 오픈 알림',
    ticketingHint: '선예매·일반예매 시작일에 알려드려요.',
    categories: '알림 받을 카테고리',
    sendTime: '발송 시각',
    sendTimeHint: '이 시각(KST) 무렵에 보내요.',
  },
  en: {
    timing: 'Advance reminder',
    dday: 'Same day',
    dbefore: n => `${n} day${n > 1 ? 's' : ''} before`,
    ticketing: 'Ticket-open alerts',
    ticketingHint: 'Get notified when presale / general sale opens.',
    categories: 'Categories to notify',
    sendTime: 'Send time',
    sendTimeHint: 'Sent around this time (KST).',
  },
  ja: {
    timing: '事前通知',
    dday: '当日',
    dbefore: n => `${n}日前`,
    ticketing: 'チケット販売開始通知',
    ticketingHint: '先行・一般販売の開始日にお知らせします。',
    categories: '通知するカテゴリ',
    sendTime: '送信時刻',
    sendTimeHint: 'この時刻(KST)前後に送信します。',
  },
};

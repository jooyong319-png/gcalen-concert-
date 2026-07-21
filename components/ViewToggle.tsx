'use client';
import { useLocale } from '@/hooks/useLocale';
import { CAL } from '@/lib/i18nLabels';
import styles from './ViewToggle.module.css';

interface Props {
  value: 'calendar' | 'list';
  onChange: (v: 'calendar' | 'list') => void;
}

export function ViewToggle({ value, onChange }: Props) {
  const lang = useLocale();
  const t = lang ? CAL[lang] : null;
  return (
    <section className={styles.toggle}>
      <button
        type="button"
        className={`${styles.btn} ${value === 'calendar' ? styles.active : ''}`}
        onClick={() => onChange('calendar')}
        aria-pressed={value === 'calendar'}
      >
        <svg className="ic" aria-hidden="true"><use href="#ic-calendar" /></svg> {t ? t.viewCalendar : '캘린더'}
      </button>
      <button
        type="button"
        className={`${styles.btn} ${value === 'list' ? styles.active : ''}`}
        onClick={() => onChange('list')}
        aria-pressed={value === 'list'}
      >
        <svg className="ic" aria-hidden="true"><use href="#ic-list" /></svg> {t ? t.viewList : '리스트'}
      </button>
    </section>
  );
}

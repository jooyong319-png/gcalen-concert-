'use client';
import { useEffect, useState } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { CAL } from '@/lib/i18nLabels';
import styles from './ThemeToggle.module.css';

type Theme = 'light' | 'dark';

export function ThemeToggle() {
  const lang = useLocale();
  const t = lang ? CAL[lang] : null;
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const cur = document.documentElement.getAttribute('data-theme');
    setTheme(cur === 'light' ? 'light' : 'dark');
  }, []);

  const toggle = (): void => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* localStorage 차단 환경 무시 */
    }
  };

  // mount 전엔 고정 렌더(해 아이콘, 기본 다크 테마 가정)로 SSR/CSR 일치 → 하이드레이션 #418/#423/#425 가드
  const isDark = mounted ? theme === 'dark' : true;

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={t ? (isDark ? t.switchToLight : t.switchToDark) : (isDark ? '라이트 모드로 전환' : '다크 모드로 전환')}
      title={t ? (isDark ? t.switchToLight : t.switchToDark) : (isDark ? '라이트 모드' : '다크 모드')}
    >
      <svg className="ic" aria-hidden="true"><use href={isDark ? '#ic-sun' : '#ic-moon'} /></svg>
    </button>
  );
}

'use client';
import { usePathname } from 'next/navigation';
import { UI, type Locale } from '@/lib/i18nLabels';

function detectLang(pathname: string): Locale | null {
  const m = pathname.match(/^\/(en|ja)(\/|$)/);
  return m ? (m[1] as Locale) : null;
}

// 헤더 워드마크 — usePathname으로 언어 자체 감지(레이아웃이 서버 params를 못 받는 라우트 구조라 클라에서 판단).
export function SiteWordmark() {
  const pathname = usePathname();
  const lang = detectLang(pathname);
  const home = lang ? `/${lang}` : '/';
  const label = lang ? UI[lang].siteNameShort : '콘서트 캘린더';

  return (
    <h1 className="site-wordmark">
      <a href={home}>
        <svg className="ic ic-gamepad" aria-hidden="true"><use href="#ic-star" /></svg> {label}
      </a>
    </h1>
  );
}

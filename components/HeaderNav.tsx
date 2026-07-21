'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { UI, type Locale } from '@/lib/i18nLabels';

interface NavItem {
  href: string;
  label: string;
}

function detectLang(pathname: string): Locale | null {
  const m = pathname.match(/^\/(en|ja)(\/|$)/);
  return m ? (m[1] as Locale) : null;
}

// 상단 accent 링크(캘린더/뉴스/블로그). 앱(standalone)에선 상단바에서 숨기고 ☰ 메뉴 안에 노출.
function buildPrimary(lang: Locale | null): NavItem[] {
  if (!lang) {
    return [
      { href: '/', label: '캘린더' },
      { href: '/news', label: '뉴스' },
      { href: '/blog', label: '모아보기' },
    ];
  }
  const ui = UI[lang];
  const p = `/${lang}`;
  return [
    { href: p, label: ui.calendar },
    { href: `${p}/news`, label: ui.news },
    { href: `${p}/blog`, label: ui.blog },
  ];
}

export function HeaderNav() {
  const pathname = usePathname();
  const lang = detectLang(pathname);
  // 헤더의 드롭다운 2개(언어 스위처 / ☰ 메뉴)가 동시에 열리지 않도록 단일 상태로 관리
  const [openMenu, setOpenMenu] = useState<'lang' | 'nav' | null>(null);
  const open = openMenu === 'nav';
  const ref = useRef<HTMLDivElement>(null);
  const ui = lang ? UI[lang] : null;
  const home = lang ? `/${lang}` : '/';

  // 바깥 클릭·Esc로 닫기
  useEffect(() => {
    if (!openMenu) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpenMenu(null);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenMenu(null); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [openMenu]);

  const primary = buildPrimary(lang);

  return (
    <div className="header-utils" ref={ref}>
      {/* 좌측: 상시 노출 accent 링크(캘린더·뉴스·모아보기) */}
      <nav className="header-primary-nav" aria-label={lang ? 'Main menu' : '주요 메뉴'}>
      <a
        href={home}
        className={`header-cal-link ${pathname === home ? 'header-cal-active' : ''}`}
        aria-current={pathname === home ? 'page' : undefined}
      >
        <svg className="ic" aria-hidden="true"><use href="#ic-calendar" /></svg>
        <span className="header-cal-label">{ui ? ui.calendar : '캘린더'}</span>
      </a>
      <a
        href={primary[1].href}
        className={`header-news-link ${pathname.startsWith(primary[1].href) ? 'header-news-active' : ''}`}
        aria-current={pathname.startsWith(primary[1].href) ? 'page' : undefined}
      >
        <svg className="ic" aria-hidden="true"><use href="#ic-flame" /></svg>
        <span className="header-news-label">{ui ? ui.news : '뉴스'}</span>
      </a>
      <a
        href={primary[2].href}
        className={`header-guide-link ${pathname.startsWith(primary[2].href) ? 'header-guide-active' : ''}`}
        aria-current={pathname.startsWith(primary[2].href) ? 'page' : undefined}
      >
        <svg className="ic" aria-hidden="true"><use href="#ic-file" /></svg>
        <span className="header-guide-label">{ui ? ui.blog : '모아보기'}</span>
      </a>
      </nav>

      {/* 우측: 언어 스위처 + 테마 토글 + ☰ 메뉴 */}
      <div className="header-right">
      <LanguageSwitcher
        open={openMenu === 'lang'}
        onOpenChange={(v) => setOpenMenu(v ? 'lang' : null)}
      />
      <ThemeToggle />
      <button
        type="button"
        className="menu-btn"
        onClick={() => setOpenMenu(m => m === 'nav' ? null : 'nav')}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={open ? (lang ? 'Close menu' : '메뉴 닫기') : (lang ? 'Open menu' : '메뉴 열기')}
      >
        <svg className="ic" aria-hidden="true"><use href="#ic-menu" /></svg>
      </button>

      {/* 링크는 항상 DOM에 유지(크롤 가능) — 열림 상태만 CSS로 토글 */}
      <nav className={`site-menu ${open ? 'site-menu-open' : ''}`} aria-label={lang ? 'Main menu' : '주요 메뉴'}>
        {/* 앱(standalone) 전용: 상단 accent 링크를 메뉴 안에 노출(웹에선 CSS로 숨김) */}
        <div className="menu-primary">
          {primary.map(item => {
            const active = item.href === home ? pathname === home : pathname.startsWith(item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                className="menu-link menu-link-primary"
                aria-current={active ? 'page' : undefined}
                onClick={() => setOpenMenu(null)}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </nav>
      </div>
    </div>
  );
}
